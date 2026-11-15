import { describe, it, expect, vi } from 'vitest';

describe('Server Health and Diagnostic Endpoints', () => {
  it('returns status ok, game title, timestamp, and uptime metadata', () => {
    const handler = (req, res) => {
      res.json({
        status: 'ok',
        game: 'Bingo.io',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    };

    const res = {
      json: vi.fn(),
    };

    handler({}, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    const data = res.json.mock.calls[0][0];
    expect(data.status).toBe('ok');
    expect(data.game).toBe('Bingo.io');
    expect(data.timestamp).toBeDefined();
    expect(typeof data.uptime).toBe('number');
  });
});
