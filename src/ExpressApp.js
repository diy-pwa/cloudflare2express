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
