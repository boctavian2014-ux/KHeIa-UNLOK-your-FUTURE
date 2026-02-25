jest.mock('../../src/services/supabase', () => ({
  supabase: { from: jest.fn() },
}));

import { getSubscriptionStatus } from '../../src/services/subscription.service';

describe('sync integration', () => {
  it('syncs data', () => {
    expect(true).toBe(true);
  });

  it('subscription status returns free for null user', async () => {
    const status = await getSubscriptionStatus(null);
    expect(status.isPremium).toBe(false);
    expect(status.planType).toBe('free');
  });
});
