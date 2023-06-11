# cloudflare2express
## an adapter for running a worker in a cloudflare pages function and for running either in express

This is so that you can run a cloudflare pages function or worker in the vscode debugger. There seem to be a lot more workers than pages functions so I thought it would also be helpful to run a worker as a pages function.

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
This is a cloudflare worker to pass mail through the sendgrid api. My intention is to use it for my own project as a pages function for sending mail from a progressive web app.

```javascript
import { readRequestBody } from 'cloudflare2express';
export default {
  async fetch(request, env) {
    if (request.method != "POST") {
      throw new Error("email must be post request");
    }
    const dynamic_template_data = await readRequestBody(request);
    const oBody = {
      'from': {
        'email': env.FROM,
      },
      'personalizations': [
        {
          'to': [
            {
              'email': env.TO,
            },
          ],
          'dynamic_template_data': dynamic_template_data,
        },
      ],
      'template_id': env.TEMPLATE,
    };
    const oHeaders = new Headers();
    oHeaders.append('Authorization', `Bearer ${env.ACCESS_TOKEN}`);
    oHeaders.append('Content-Type', 'application/json');

    const email = await fetch('https://api.sendgrid.com/v3/mail/send', {
      body: JSON.stringify(oBody),
      headers: oHeaders,
      method: 'POST',
    });
    return email;

  }
};

```
Unfortunately I didn't get multipart form data working with the express adapter. The anticipated use for the express adapter is for running the debugger and supertest so I satisfied myself with this.
