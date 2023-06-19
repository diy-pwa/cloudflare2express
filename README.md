# cloudflare2express
## an adapter for running a worker or cloudflare pages function in express

The original reason for this was to help @namdevel debug my `@rhildred/cors-proxy2`. By the time I was done I had a test that worked like this with isomorphic-git, the original target for my cors proxy.

```javascript
import { describe, it, expect } from 'vitest';
import createApp from '../src/ExpressApp.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

describe("cloudflare cors-proxy for isomorphic git", ()=>{
    it("handles an isomorphic git clone", async ()=>{
        const app = createApp();
        const server = await app.listen(8080);
        await git.clone({
            corsProxy: 'http://127.0.0.1:8080/corsproxy',
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

I was so excited that I decided to share this so that you can run a cloudflare pages function or worker in the vscode debugger or with supertest tests yourself. There seem to be a lot more workers than pages functions so I also included an example of running a worker as a pages function.

To reproduce this test in your own environment:

```bash
nvm use 18
npm install --save-dev vitest express isomorphic-git cloudflare2express @rhildred/cors-proxy2
```

Edit the `package.json` file to include:
```json
{
  "type":"module",
  "scripts": {
    "test": "rm -rf test2 && vitest run __tests__"
  }
}
```

You will need to make a test fixture like below (`src/ExpressApp.js`)

```javascript
import express from 'express';
import { onRequest as corsproxy } from '../functions/corsproxy/[[corsproxy]].js';
import {functionsAdapter} from 'cloudflare2express';

export default () => {
    const app = express();
    app.all(/\/corsproxy.*/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        functionsAdapter(corsproxy, req, res, {url: req.url.replace(/^.*corsproxy/, "https:/")});
    });
    return app;
}
```
to adapt the cors-proxy2 worker to a function `functions/corsproxy/[[corsproxy]].js`:

```javascript
import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    return await CorsProxyResponse.fetch(context.request, context.env);
}
```

For completeness, I made an `index.js` and start script:

```javascript
import createApp from './src/ExpressApp.js';
const app = createApp();
const server = await app.listen(8080, ()=>console.log(`listening on port ${server.address().port}`));
```
When we were testing we came across a problem with the inbuilt fetch of node 18. Even though just proxying, node would try to uncompress the response and fail. There is a solution to that problem, using node-fetch, in [https://github.com/rhildred/cors-proxy2](https://github.com/rhildred/cors-proxy2).


Unfortunately I didn't get multipart form data working with the express adapter. The anticipated use for the express adapter is for running the debugger and supertest so I satisfied myself with this.

I hope that you also discover the joy of being able to write tests with your cloudflare workers and pages functions and debug them in vscode on your local machine. 
