import request from 'supertest';
import app from './index';

describe('templates api', () => {
  it('returns default templates', async () => {
    const res = await request(app).get('/templates');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
