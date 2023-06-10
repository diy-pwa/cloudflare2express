import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from '../src/ExpressApp';

describe("tests for sample express app", ()=>{
    it("handles a redirect", async ()=>{
        const app = createApp();
        const res = await request(app).get("/corsproxy/github.com/rhildred/cors-proxy2/archive/refs/heads/main.zip");
        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe("*");
    });
})