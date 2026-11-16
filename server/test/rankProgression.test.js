import { describe, it, expect } from 'vitest';

function getRankInfo(wins = 0) {
  if (wins >= 20) return { title: 'Grandmaster', badge: '👑', color: 'text-amber-500', nextAt: null };
  if (wins >= 10) return { title: 'Champion', badge: '🏆', color: 'text-yellow-600', nextAt: 20 };
  if (wins >= 6) return { title: 'Bingo Star', badge: '⭐', color: 'text-sky-500', nextAt: 10 };
  if (wins >= 3) return { title: 'Bingo Scout', badge: '🎯', color: 'text-emerald-600', nextAt: 6 };
  if (wins >= 1) return { title: 'Apprentice', badge: '🎖️', color: 'text-indigo-600', nextAt: 3 };
  return { title: 'Rookie', badge: '🥉', color: 'text-slate-600', nextAt: 1 };
}

describe('Player Career Rank Progression', () => {
  it('returns Rookie for 0 wins with target of 1 win for next rank', () => {
    const rank = getRankInfo(0);
    expect(rank.title).toBe('Rookie');
    expect(rank.badge).toBe('🥉');
    expect(rank.nextAt).toBe(1);
  });

  it('promotes to Apprentice on 1 win and maintains until 2 wins', () => {
    expect(getRankInfo(1).title).toBe('Apprentice');
    expect(getRankInfo(2).title).toBe('Apprentice');
    expect(getRankInfo(1).nextAt).toBe(3);
  });

  it('promotes to Bingo Scout on 3 wins', () => {
    const rank = getRankInfo(3);
    expect(rank.title).toBe('Bingo Scout');
    expect(rank.badge).toBe('🎯');
    expect(rank.nextAt).toBe(6);
  });

  it('promotes to Bingo Star on 6 wins and Champion on 10 wins', () => {
    expect(getRankInfo(6).title).toBe('Bingo Star');
    expect(getRankInfo(9).title).toBe('Bingo Star');
    expect(getRankInfo(10).title).toBe('Champion');
    expect(getRankInfo(19).title).toBe('Champion');
  });

  it('awards Grandmaster rank on 20+ wins with no higher rank', () => {
    const rank = getRankInfo(20);
    expect(rank.title).toBe('Grandmaster');
    expect(rank.badge).toBe('👑');
    expect(rank.nextAt).toBeNull();

    expect(getRankInfo(100).title).toBe('Grandmaster');
  });
});
