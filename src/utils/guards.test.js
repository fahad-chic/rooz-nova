import { describe, it, expect } from 'vitest';
import { buildChatId, hasAuthenticatedUser } from './guards';

describe('guards helpers', () => {
  it('builds a chat id only when all required values exist', () => {
    expect(buildChatId(null, 'partner', 'ad')).toBeNull();
    expect(buildChatId({ uid: 'u1' }, 'partner', 'ad')).toBe('ad_partner_u1');
  });

  it('detects authenticated users reliably', () => {
    expect(hasAuthenticatedUser(null)).toBe(false);
    expect(hasAuthenticatedUser({ uid: 'u1' })).toBe(true);
  });
});
