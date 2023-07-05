import express from 'express';
import functionsAdapter from './functionsAdapter.js';
import dotenv from 'dotenv';

dotenv.config();

export default (modules) => {
  const app = express();
  for (let key of Object.keys(modules)) {
    let aKeys = key.split('/');
    let sRoute = "";
    for (let n = aKeys.length - 1; n >= 0; n--) {
      if (!aKeys[n].match(/\[{2}.*\]{2}/) ) {
        sRoute = aKeys[n];
        break;
      }
    }
    sRoute = sRoute.replace('.js', '');
    let route = new RegExp(`/${sRoute}.*`);
    app.all(
      route,
      express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
      }),
      async (req, res) => {
        let sFunc = modules[key];
        functionsAdapter(sFunc, req, res, {});
      }
    );
  }
  return app;
};
