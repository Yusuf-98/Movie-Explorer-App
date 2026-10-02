import { describe, it, expect } from 'vitest';
import { searchSchema } from './schemas';

describe('searchSchema', () => {
  it('accepts an empty query', () => {
    expect(searchSchema.safeParse({ query: '' }).success).toBe(true);
  });

  it('rejects a single character', () => {
    expect(searchSchema.safeParse({ query: 'a' }).success).toBe(false);
  });

  it('accepts two or more characters', () => {
    expect(searchSchema.safeParse({ query: 'ab' }).success).toBe(true);
  });

  it('rejects a query over 100 characters', () => {
    expect(searchSchema.safeParse({ query: 'a'.repeat(101) }).success).toBe(false);
  });
});
