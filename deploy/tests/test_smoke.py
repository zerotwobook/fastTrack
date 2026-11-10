"""Offline unit tests for deploy/smoke_test.py (network is mocked).

Run (repo root): python3 -m unittest discover -s deploy/tests -p 'test_smoke.py'
"""
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('smoke', Path(__file__).parents[1] / 'smoke_test.py')
smoke = importlib.util.module_from_spec(spec)
spec.loader.exec_module(smoke)


class SmokeTests(unittest.TestCase):
    def response(self, base, path, data=None, headers=None, expected_status=200):
        responses = {
            ('/api/health', 200): b'{"status":"ok","version":"1111111111111111111111111111111111111111"}',
            ('/api/ready', 200): b'{"status":"ready","database":"connected","version":"1111111111111111111111111111111111111111"}',
            ('/', 200): b'<!doctype html><html><head><title>fastTrack</title></head><body></body></html>',
            ('/api/nonexistent', 404): b'{"error":{"code":"NOT_FOUND","message":"Resource not found.","fields":{}}}',
            ('/api/auth/login', 200): b'{"data":{"user":{"id":"usr_01","displayName":"Tester","role":"student"},"csrfToken":"csrf_test_token"}}',
            ('/api/auth/me', 200): b'{"data":{"user":{"id":"usr_01","displayName":"Tester","role":"student"},"csrfToken":"csrf_test_token"}}',
            ('/api/teams', 200): b'{"data":[{"id":"team_01","name":"Team Alpha"}],"meta":{"serverTime":"2026-11-10T00:00:00.000Z"}}',
            ('/api/auth/logout', 204): b'',
        }
        return responses[(path, expected_status)]

    @patch.dict('os.environ', {'EXPECTED_RELEASE_SHA': '1111111111111111111111111111111111111111'}, clear=True)
    def test_public_checks_pass_and_skip_optional_login(self):
        with patch.object(smoke, 'request', side_effect=self.response) as req:
            smoke.check('https://demo.example.test')
            self.assertEqual(req.call_count, 4)

    @patch.dict('os.environ', {'EXPECTED_RELEASE_SHA': '2222222222222222222222222222222222222222'}, clear=True)
    def test_version_mismatch_fails(self):
        with patch.object(smoke, 'request', side_effect=self.response), patch.object(smoke.time, 'sleep'):
            with self.assertRaisesRegex(RuntimeError, '/api/health'):
                smoke.check('https://demo.example.test')

    @patch.dict('os.environ', {}, clear=True)
    def test_db_not_ready_fails_even_when_http_responds(self):
        def disconnected(base, path, **kwargs):
            if path == '/api/ready':
                return b'{"status":"unavailable","database":"disconnected","version":"1111111111111111111111111111111111111111"}'
            return self.response(base, path, **kwargs)

        with patch.object(smoke, 'request', side_effect=disconnected), patch.object(smoke.time, 'sleep'):
            with self.assertRaisesRegex(RuntimeError, '/api/ready'):
                smoke.check('https://demo.example.test')

    @patch.dict('os.environ', {'SMOKE_EMAIL': 'tester@example.test', 'SMOKE_PASSWORD': 'test-password'}, clear=True)
    def test_authenticated_flow_queries_teams_and_logouts(self):
        with patch.object(smoke, 'request', side_effect=self.response) as req:
            smoke.check('https://demo.example.test')
            called_paths = [call.args[1] for call in req.call_args_list]
            self.assertEqual(called_paths[-4:], ['/api/auth/login', '/api/auth/me', '/api/teams', '/api/auth/logout'])
            logout_call = req.call_args_list[-1]
            self.assertEqual(logout_call.kwargs['headers'].get('X-CSRF-Token'), 'csrf_test_token')
            self.assertEqual(logout_call.kwargs['headers'].get('X-fastTrack-Request'), '1')
            self.assertEqual(logout_call.kwargs['headers'].get('Origin'), 'https://demo.example.test')

    @patch.dict('os.environ', {'SMOKE_EMAIL': 'tester@example.test', 'SMOKE_PASSWORD': 'test-password'}, clear=True)
    def test_session_is_logged_out_even_if_teams_fails(self):
        def broken_teams(base, path, data=None, headers=None, expected_status=200):
            if path == '/api/teams':
                raise ValueError('Simulated scoped read failure')
            return self.response(base, path, data, headers, expected_status)

        with patch.object(smoke, 'request', side_effect=broken_teams) as req:
            with self.assertRaisesRegex(RuntimeError, 'Login smoke check failed'):
                smoke.check('https://demo.example.test')
            last_call = req.call_args_list[-1]
            self.assertEqual(last_call.args[1], '/api/auth/logout')

    @patch.dict('os.environ', {'SMOKE_EMAIL': 'tester@example.test'}, clear=True)
    def test_mismatched_credentials_raises(self):
        with patch.object(smoke, 'request', side_effect=self.response):
            with self.assertRaisesRegex(RuntimeError, 'Set both SMOKE_EMAIL and SMOKE_PASSWORD'):
                smoke.check('https://demo.example.test')


if __name__ == '__main__':
    unittest.main()