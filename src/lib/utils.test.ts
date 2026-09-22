import { describe, it, expect } from 'vitest';
import { getImageUrl, formatDate, formatRuntime, formatCurrency } from './utils';

describe('getImageUrl', () => {
  it('builds a full TMDB image URL from a relative path', () => {
    expect(getImageUrl('/poster.jpg', 'w500')).toBe(
      `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/w500/poster.jpg`
    );
  });

  it('falls back to a placeholder when there is no path', () => {
    expect(getImageUrl(null)).toBe('/placeholder.jpg');
    expect(getImageUrl(undefined)).toBe('/placeholder.jpg');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    expect(formatDate('2024-03-15')).toBe('March 15, 2024');
  });

  it('returns N/A when there is no date', () => {
    expect(formatDate(undefined)).toBe('N/A');
  });
});

describe('formatRuntime', () => {
  it('converts minutes into hours and minutes', () => {
    expect(formatRuntime(125)).toBe('2h 5m');
  });

  it('omits the hour part when under 60 minutes', () => {
    expect(formatRuntime(45)).toBe('45m');
  });

  it('returns N/A when there is no runtime', () => {
    expect(formatRuntime(null)).toBe('N/A');
    expect(formatRuntime(0)).toBe('N/A');
  });
});

describe('formatCurrency', () => {
  it('formats large amounts as compact USD', () => {
    // --- ICU formatting varies by Node version ---
    expect(formatCurrency(150_000_000)).toMatch(/^\$150(\.0)?M$/);
  });

  it('returns N/A for a falsy amount', () => {
    expect(formatCurrency(0)).toBe('N/A');
  });
});
