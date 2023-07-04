import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import createApp from '../src/ExpressApp.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

beforeEach(async () => {
  await fs.promises.rm('test2', { recursive: true, force: true });
});

describe('tests for sample express app', () => {
  it('gets an example worker', async () => {
    const app = createApp();
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
  it('handles an isomorphic git clone', async () => {
    const app = createApp();
    const server = await app.listen(8080);
    await git.clone({
      corsProxy: 'http://127.0.0.1:8080/thecorsproxy2',
      url: 'https://github.com/diy-pwa/cloudflare2express',
      ref: 'main',
      singleBranch: true,
      depth: 10,
      dir: 'test2',
      fs: fs,
      http,
    });
    await server.close();
    expect(true).toBe(true);
  });
});
