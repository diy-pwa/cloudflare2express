import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import createApp from '../src/FunctionsApp.js';
import fs from 'fs';

beforeEach(async () => {
  await fs.promises.rm('test3', { recursive: true, force: true });
});

describe('tests for sample express functions app', () => {
  it('handles a redirect', async () => {
    const modules = import.meta.glob('../functions/*/*.js', {
      import: 'onRequest',
      eager: true,
    });
    const app = createApp('../functions/*/*.js', modules);
    const res = await request(app).get(
      '/corsproxy/github.com/rhildred/DASH-to-HLS-Playback/archive/refs/heads/master.zip'
    );
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});
