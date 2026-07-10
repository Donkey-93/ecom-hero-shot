import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { dbGet, dbSet, dbDel, dbClear } from '@/lib/db';

describe('db', () => {
  beforeEach(async () => { await dbClear(); });

  it('round-trips a value', async () => {
    await dbSet('foo', { a: 1 });
    expect(await dbGet('foo')).toEqual({ a: 1 });
  });

  it('returns null for missing key', async () => {
    expect(await dbGet('missing')).toBeNull();
  });

  it('deletes a key', async () => {
    await dbSet('foo', 1);
    await dbDel('foo');
    expect(await dbGet('foo')).toBeNull();
  });
});