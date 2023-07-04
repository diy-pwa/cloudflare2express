import express from 'express';
import functionsAdapter from './functionsAdapter.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { onRequest as corsproxy } from '../functions/corsproxy/[[corsproxy]].js';

dotenv.config();

export default (glob, modules) => {
    const app = express();
    console.log(modules);
    const aGlob = glob.split("/");
    for(let key of Object.keys(modules)){
        let aKeys = key.split("/");
        for(let n = 0; n < aKeys.length; n++){
            if(aKeys[n] != aGlob[n]){
                aKeys = aKeys.slice(n);
                break;
            }
        }
        let sRoute = aKeys[0].replace(".js", "");
        let route = new RegExp(`/${sRoute}.*`);
        app.all(route, express.raw({
            inflate: true,
            limit: '50mb',
            type: () => true, // this matches all content types for this route
        }), async (req, res) => {
            let sFunc = modules[key];
            functionsAdapter(sFunc, req, res, {fetch:fetch});
        });
            
    }
    return app;
}