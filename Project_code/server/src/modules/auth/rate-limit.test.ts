import { describe, expect, it } from 'vitest';
import { loginKey } from './rate-limit.js';

describe('canonical server-selected login identity', () => {
  it('equates IPv4, dotted mapped IPv6 and hexadecimal mapped IPv6', () => {
    expect(loginKey('127.0.0.1')).toBe(loginKey('::ffff:127.0.0.1'));
    expect(loginKey('127.0.0.1')).toBe(loginKey('::ffff:7f00:1'));
    expect(loginKey('127.0.0.1')).toMatch(/^ip-v1:[a-f0-9]{64}$/);
  });
  it('normalizes IPv6 spelling without merging different client addresses', () => {
    expect(loginKey('2001:0db8:0:0:0:0:0:1')).toBe(loginKey('2001:db8::1'));
    expect(loginKey('2001:db8::1')).not.toBe(loginKey('2001:db8::2'));
  });
  it.each([undefined, '', 'untrusted', '127.0.0.1, 1.2.3.4', '127.000.0.1'])('fails closed on invalid selected address %s', value => {
    expect(() => loginKey(value)).toThrow('temporarily unavailable');
  });
});
