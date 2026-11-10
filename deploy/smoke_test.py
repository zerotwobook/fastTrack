"""fastTrack public deployment and smoke checks. Credentials/tokens are never printed.

WHAT THIS SCRIPT DOES
    Called by .github/workflows/deploy.yml after a deployment:
        python3 deploy/smoke_test.py SERVICE_URL
    Checks the live service and exits non-zero if any check fails.
    Public checks retry up to 5 times (3s apart) for Cloud Run cold starts.

    Checks:
      1. GET /api/health      -> 200 {"status": "ok", "version": "<sha>"} (matches EXPECTED_RELEASE_SHA if set)
      2. GET /api/ready       -> 200 {"status": "ready", "database": "connected", "version": "<sha>"}
      3. GET /                -> 200 HTML page containing fastTrack title
      4. GET /api/nonexistent -> 404 sanitized JSON error envelope {"error": {"code": "NOT_FOUND", ...}}
      5. OPTIONAL login       -> POST /api/auth/login, GET /api/auth/me, GET /api/teams (read-only scoped),
         POST /api/auth/logout using cookie jar, Origin, X-fastTrack-Request: 1 and X-CSRF-Token.
         Runs only if BOTH SMOKE_EMAIL and SMOKE_PASSWORD are set.
         Always logs out in a finally block even if an authenticated check fails.
"""
import http.cookiejar
import json
import os
import sys
import time
import urllib.error
import urllib.request


cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))


def request(base, path, data=None, headers=None, expected_status=200):
    req_headers = {
        'User-Agent': 'fastTrack-SmokeTest/1.0',
    }
    if data is not None:
        req_headers['Content-Type'] = 'application/json'
    if headers:
        req_headers.update(headers)

    body = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(base + path, headers=req_headers, data=body)
    try:
        with opener.open(req, timeout=30) as response:
            status = getattr(response, 'status', 200)
            payload = response.read()
    except urllib.error.HTTPError as err:
        status = err.code
        payload = err.read()
    if status != expected_status:
        raise ValueError(f'Expected HTTP {expected_status} for {path}, got {status}')
    return payload


def _version_matches(payload_json, expected_sha):
    version = payload_json.get('version')
    if not version or not isinstance(version, str):
        return False
    if expected_sha and version != expected_sha:
        return False
    return True


def _is_sanitized_not_found(raw_bytes):
    parsed = json.loads(raw_bytes)
    error = parsed.get('error')
    if not isinstance(error, dict) or not error.get('code') or not error.get('message'):
        return False
    if 'stack' in error or 'postgresql://' in raw_bytes.decode('utf-8', errors='ignore'):
        return False
    return True


def check(base):
    base = base.rstrip('/')
    expected_sha = os.getenv('EXPECTED_RELEASE_SHA')

    # 1. Public checks
    public_checks = [
        (
            '/api/health',
            200,
            lambda b: json.loads(b).get('status') == 'ok' and _version_matches(json.loads(b), expected_sha),
        ),
        (
            '/api/ready',
            200,
            lambda b: (
                json.loads(b).get('status') == 'ready'
                and json.loads(b).get('database') == 'connected'
                and _version_matches(json.loads(b), expected_sha)
            ),
        ),
        (
            '/',
            200,
            lambda b: b'<html' in b.lower() and b'fasttrack' in b.lower(),
        ),
        (
            '/api/nonexistent',
            404,
            _is_sanitized_not_found,
        ),
    ]

    for path, expected_status, predicate in public_checks:
        for attempt in range(5):
            try:
                res = request(base, path, expected_status=expected_status)
                if not predicate(res):
                    raise ValueError(f'Unexpected response for {path}: {res[:200]!r}')
                break
            except (urllib.error.URLError, TimeoutError, ValueError):
                if attempt == 4:
                    raise RuntimeError(f'Smoke check failed: {path}') from None
                time.sleep(3)
        print(f'PASS {path}')

    # 2. Optional authenticated check
    email = os.getenv('SMOKE_EMAIL')
    password = os.getenv('SMOKE_PASSWORD')

    if bool(email) != bool(password):
        raise RuntimeError('Set both SMOKE_EMAIL and SMOKE_PASSWORD, or neither.')

    if not email:
        print('SKIP login: optional smoke credentials not configured')
        return

    csrf_token = None
    try:
        login_res = request(
            base,
            '/api/auth/login',
            data={'email': email, 'password': password},
            headers={
                'X-fastTrack-Request': '1',
                'Origin': base,
            },
            expected_status=200,
        )
        login_data = json.loads(login_res).get('data', {})
        csrf_token = login_data.get('csrfToken')
        if not csrf_token:
            raise ValueError('Missing csrfToken in login response')

        me_res = request(
            base,
            '/api/auth/me',
            headers={
                'X-fastTrack-Request': '1',
                'Origin': base,
            },
            expected_status=200,
        )
        me_data = json.loads(me_res).get('data', {})
        if not me_data.get('user', {}).get('id'):
            raise ValueError('Missing user in /api/auth/me response')

        teams_res = request(
            base,
            '/api/teams',
            headers={
                'X-fastTrack-Request': '1',
                'Origin': base,
            },
            expected_status=200,
        )
        teams_data = json.loads(teams_res)
        if not isinstance(teams_data.get('data'), list):
            raise ValueError('Expected scoped teams list in /api/teams response')

        print('PASS login, /api/auth/me, and read-only scoped /api/teams')
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError):
        raise RuntimeError('Login smoke check failed') from None
    finally:
        if csrf_token:
            try:
                request(
                    base,
                    '/api/auth/logout',
                    data={},
                    headers={
                        'X-fastTrack-Request': '1',
                        'Origin': base,
                        'X-CSRF-Token': csrf_token,
                    },
                    expected_status=204,
                )
                print('PASS logout')
            except Exception as err:
                print(f'WARNING: Logout encountered: {err}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Usage: python3 deploy/smoke_test.py SERVICE_URL')
    check(sys.argv[1])