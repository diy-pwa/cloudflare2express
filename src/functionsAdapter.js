import prepareRequest from "./prepareRequest.js";
import sendResponse from "./sendResponse.js";
export default async function(delegate, req, res, env){
    const context = {request:prepareRequest(req), env}
    sendResponse(await delegate(context), res);
}