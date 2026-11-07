import { describe, expect, it } from 'vitest';
import { requireTestDatabase } from './test-database.js';

const environment = {
  NODE_ENV: 'test', DATABASE_URL: 'postgresql://dev:private@localhost/fasttrack_dev',
  TEST_DATABASE_URL: 'postgresql://tester:private@127.0.0.1:5432/fasttrack_test',
};

describe('test database safety boundary', () => {
  it('allows a separately named test database only in the explicit test environment', () => {
    expect(requireTestDatabase(environment)).toBe(environment.TEST_DATABASE_URL);
  });

  it.each(['development', 'production', undefined])('rejects resets in %j', mode => {
    expect(() => requireTestDatabase({ ...environment, NODE_ENV: mode })).toThrow('NODE_ENV');
  });

  it.each(['fasttrack_dev', 'postgres', '_test', 'fasttrack_testing'])('rejects the nonreserved database name %j', name => {
    expect(() => requireTestDatabase({ ...environment, TEST_DATABASE_URL: `postgresql://localhost/${name}` })).toThrow('reserved test');
  });

  it('rejects the protected DB even when credentials, schema and host spelling differ', () => {
    expect(() => requireTestDatabase({ ...environment, DATABASE_URL: 'postgresql://other:secret@localhost/fasttrack_test?schema=other' })).toThrow('protected database overlap');
    expect(() => requireTestDatabase({ ...environment, DATABASE_URL: 'postgresql://other:secret@[::1]:5432/fasttrack_test' })).toThrow('protected database overlap');
  });

  it('rejects a protected production name regardless of hostname', () => {
    expect(() => requireTestDatabase(environment, ['postgresql://prod:secret@production/FASTTRACK_TEST'])).toThrow('protected database overlap');
  });

  it.each(['host=production', 'database=fasttrack_dev', 'dbname=fasttrack_dev', 'schema=other', 'options=-csearch_path%3Dother'])('rejects connection overrides %j', query => {
    expect(() => requireTestDatabase({ ...environment, TEST_DATABASE_URL: `${environment.TEST_DATABASE_URL}?${query}` })).toThrow('connection parameter override');
  });

  it('requires the protected runtime DB and explicit test URL instead of falling back', () => {
    expect(() => requireTestDatabase({ ...environment, DATABASE_URL: undefined })).toThrow('DATABASE_URL');
    expect(() => requireTestDatabase({ ...environment, TEST_DATABASE_URL: undefined })).toThrow('TEST_DATABASE_URL');
    expect(() => requireTestDatabase(environment, ['not-a-database-url'])).toThrow('protected database URL');
  });
});
