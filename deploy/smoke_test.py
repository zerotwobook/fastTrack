"""fastTrack public deployment and smoke checks. Credentials/tokens are never printed.

WHAT THIS SCRIPT DOES
    Called by .github/workflows/deploy.yml after a deployment:
        python3 deploy/smoke_test.py SERVICE_URL
    Checks the live service and exits non-zero if any check fails.
    Public checks retry up to 5 times (3s apart) for Cloud Run cold starts.

    Checks:
      1. GET /api/health  -> {"status": "ok", "version": "<sha>"}
      2. GET /api/ready   -> {"status": "ready", "database": "connected", "version": "<sha>"}
      3. GET /            -> HTML page (built frontend served)
      4. OPTIONAL login   -> login, /api/auth/me, logout with cookiejar & CSRF.
         Runs only if BOTH SMOKE_EMAIL and SMOKE_PASSWORD are set.
         Always logs out in a finally block even if checks fail.
"""
import http.cookiejar
import json
import os
import sys
import time
import urllib.error
import urllib.request


# Cookie jar to hold fasttrack_session across requests
cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))


def request(base, path, data=None, headers=None):
    req_headers = {
        'User-Agent': 'fastTrack-SmokeTest/1.0',
    }
    if data is not None:
        req_headers['Content-Type'] = 'application/json'
    if headers:
        req_headers.update(headers)

    body = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(base + path, headers=req_headers, data=body)
    with opener.open(req, timeout=30) as response:
        return response.read()


def check(base):
    base = base.rstrip('/')

    # 1. Public checks
    public_checks = [
        ('/api/health', lambda b: json.loads(b).get('status') == 'ok' and bool(json.loads(b).get('version'))),
        ('/api/ready', lambda b: json.loads(b).get('status') == 'ready' and json.loads(b).get('database') == 'connected'),
        ('/', lambda b: b'<html' in b.lower() or b'<!doctype html' in b.lower()),
    ]

    for path, predicate in public_checks:
        for attempt in range(5):
            try:
                res = request(base, path)
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
            }
        )
        login_data = json.loads(login_res).get('data', {})
        csrf_token = login_data.get('csrfToken')
        if not csrf_token:
            raise ValueError('Missing csrfToken in login response')

        # Verify /api/auth/me
        me_res = request(
            base,
            '/api/auth/me',
            headers={
                'X-fastTrack-Request': '1',
                'Origin': base,
            }
        )
        me_data = json.loads(me_res).get('data', {})
        if not me_data.get('user', {}).get('id'):
            raise ValueError('Missing user in /api/auth/me response')

        print('PASS login and authenticated /api/auth/me')
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError):
        raise RuntimeError('Login smoke check failed') from None
    finally:
        # Always end the session if logged in
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
                    }
                )
                print('PASS logout')
            except Exception as e:
                print(f'WARNING: Logout encountered: {e}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Usage: python3 deploy/smoke_test.py SERVICE_URL')
    check(sys.argv[1])
