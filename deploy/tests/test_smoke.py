"""Offline unit tests for deploy/smoke_test.py (network is mocked).

Run (repo root): python3 -m unittest discover -s deploy/tests -p 'test_smoke.py'
"""
import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('smoke', Path(__file__).parents[1] / 'smoke_test.py')
smoke = importlib.util.module_from_spec(spec)
spec.loader.exec_module(smoke)


class SmokeTests(unittest.TestCase):
    def response(self, base, path, data=None, headers=None):
        return {
            '/api/health': b'{"status":"ok","version":"1111111111111111111111111111111111111111"}',
            '/api/ready': b'{"status":"ready","database":"connected","version":"1111111111111111111111111111111111111111"}',
            '/': b'<!doctype html><html><body>fastTrack</body></html>',
            '/api/auth/login': b'{"data":{"user":{"id":"usr_01","displayName":"Tester","role":"STUDENT"},"csrfToken":"csrf_test_token"}}',
            '/api/auth/me': b'{"data":{"user":{"id":"usr_01","displayName":"Tester","role":"STUDENT"},"csrfToken":"csrf_test_token"}}',
            '/api/auth/logout': b'',
        }[path]

    @patch.dict('os.environ', {}, clear=True)
    def test_public_checks_pass_and_skip_optional_login(self):
        with patch.object(smoke, 'request', side_effect=self.response) as req:
            smoke.check('https://demo.example.test')
            self.assertEqual(req.call_count, 3)

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
    def test_session_is_logged_out_even_if_me_fails(self):
        def broken_me(base, path, data=None, headers=None):
            if path == '/api/auth/me':
                raise ValueError('Simulated me endpoint failure')
            return self.response(base, path, data, headers)

        with patch.object(smoke, 'request', side_effect=broken_me) as req:
            with self.assertRaisesRegex(RuntimeError, 'Login smoke check failed'):
                smoke.check('https://demo.example.test')
            # Check that the last call was logout
            last_call = req.call_args_list[-1]
            self.assertEqual(last_call.args[1], '/api/auth/logout')

    @patch.dict('os.environ', {'SMOKE_EMAIL': 'tester@example.test'}, clear=True)
    def test_mismatched_credentials_raises(self):
        with patch.object(smoke, 'request', side_effect=self.response):
            with self.assertRaisesRegex(RuntimeError, 'Set both SMOKE_EMAIL and SMOKE_PASSWORD'):
                smoke.check('https://demo.example.test')


if __name__ == '__main__':
    unittest.main()
