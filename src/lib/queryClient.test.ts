import { describe, it, expect } from 'vitest';
import { shouldRetry } from './queryClient';
import { ApiError } from './axios';

describe('shouldRetry', () => {
  it('retries a network error once', () => {
    expect(shouldRetry(0, new Error('Network Error'))).toBe(true);
    expect(shouldRetry(1, new Error('Network Error'))).toBe(false);
  });

  it('retries a server error once', () => {
    expect(shouldRetry(0, new ApiError('Server error', 500))).toBe(true);
    expect(shouldRetry(1, new ApiError('Server error', 500))).toBe(false);
  });

  it('never retries a client error', () => {
    expect(shouldRetry(0, new ApiError('Data not found.', 404))).toBe(false);
    expect(shouldRetry(0, new ApiError('Invalid API key.', 401))).toBe(false);
    expect(shouldRetry(0, new ApiError('Too many requests.', 429))).toBe(false);
  });
});
