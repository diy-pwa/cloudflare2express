# cloudflare2express
an adapter for running a worker in a cloudflare pages function and for running either in express

```javascript
import express from 'express';
import { onRequest as corsproxy } from '../functions/corsproxy/[[corsproxy]].js';
import { onRequest as hello2 } from '../functions/hello/[[hello]].js';
import hello from '../workers/hello.js';
import email from '../workers/sendgrid.js';
import functionsAdapter from 'cloudflare2express ';
import workersAdapter from 'cloudflare2express ';
import dotenv from 'dotenv';

dotenv.config();

export const createApp = () => {
    const app = express();
    app.all(/^\/.*corsproxy/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        functionsAdapter(corsproxy, req, res);
    });
    app.get(/\/hello.*/, async (req, res) => {
        functionsAdapter(hello2, req, res, env);
    })
    app.get("/", async (req, res) => {
        workersAdapter(hello, req, res, env);
    });
    app.post(/\/email.*/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        workersAdapter(email, req, res, { FROM: process.env["FROM"], TO: process.env["TO"], TEMPLATE: process.env["TEMPLATE"], ACCESS_TOKEN: process.env["ACCESS_TOKEN"] });
    });
    return app;
}

```
to adapt a worker to a function:
```javascript
import worker from '../../workers/hello.js';
import { worker2functionAdapter} from 'cloudflare2express';

export async function onRequest(context){
    return worker2functionAdapter(worker, context);
}
```
