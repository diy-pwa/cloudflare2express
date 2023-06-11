import prepareRequest from "./prepareRequest.js";
import sendResponse from "./sendResponse.js";
export default async function(delegate, req, res, env){
    sendResponse(await delegate.fetch(prepareRequest(req), env), res);
}
