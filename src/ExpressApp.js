import express from 'express';
import {onRequest as corsproxy} from '../functions/corsproxy/[[corsproxy]].js';
import {onRequest as hello2} from '../functions/hello/[[hello]].js';
import hello from '../workers/hello.js';
import functionsAdapter from './functionsAdapter.js';
import workersAdapter from './workersAdapter.js';
export default () => {
    const app = express();
    app.all(/^\/.*corsproxy/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        functionsAdapter(corsproxy, req, res);
    });
    app.get(/\/hello.*/, async (req, res)=>{
        functionsAdapter(hello2, req, res);
    })
    app.get("/", async (req, res) => {
        workersAdapter(hello.fetch, req, res);
    });
    return app;
}