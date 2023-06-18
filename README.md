# cloudflare2express
## an adapter for running a worker or cloudflare pages function in express

The original reason for this was to help @namdevel debug my `@rhildred/cors-proxy2`. By the time I was done I had a test that worked like this with isomorphic-git, the original target for my cors proxy.

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import createApp from '../src/ExpressApp.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

describe("cloudflare cors-proxy for isomorphic git" ()=>{
    it("handles an isomorphic git clone", async ()=>{
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
            http
        });  
        await server.close();
        expect(true).toBe(true);
    });
});

```

I was so excited that I decided to share this so that you can run a cloudflare pages function or worker in the vscode debugger or with supertest tests yourself. There seem to be a lot more workers than pages functions so I also included an example of running a worker as a pages function. You will need to make a test fixture like below (`src/ExpressApp.js`)

```javascript
import express from 'express';
import { onRequest as corsproxy } from '../functions/corsproxy/[[corsproxy]].js';
import hello from '../workers/hello.js';
import corsproxy2 from '../workers/corsproxy.js';
import functionsAdapter from './functionsAdapter.js';
import workersAdapter from './workersAdapter.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export default () => {
    const app = express();
    app.all(/\/corsproxy.*/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        functionsAdapter(corsproxy, req, res, {url: req.url.replace(/^.*corsproxy/, "https:/"), fetch:fetch});
    });
    app.get("/", async (req, res) => {
        workersAdapter(hello, req, res, {});
    });
    app.all(/\/thecorsproxy2.*/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        workersAdapter(corsproxy2, req, res, {url: req.url.replace(/^.*thecorsproxy2/, "https:/"), fetch:fetch});
    });
    return app;
}

```
to adapt a worker to a function:
```javascript
import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    return await CorsProxyResponse.fetch(context.request, context.env);
}
```
Unfortunately I didn't get multipart form data working with the express adapter. The anticipated use for the express adapter is for running the debugger and supertest so I satisfied myself with this.

I hope that you also discover the joy of being able to write tests with your cloudflare workers and pages functions and debug them in vscode on your local machine. 
