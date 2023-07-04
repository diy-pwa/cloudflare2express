import fetch, { Headers, Response } from 'node-fetch';

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Response = Response;
}

export default function (req) {
  req.headers = new Headers(req.headers);
  req.json = () => {
    return JSON.parse(req.body.toString());
  };
  req.arrayBuffer = () => {
    return req.body;
  };
  req.text = () => {
    return req.body.toString();
  };
  req.formData = () => {
    return new URLSearchParams(req.body.toString());
  };
  return req;
}
