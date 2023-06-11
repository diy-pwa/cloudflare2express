import prepareRequest from "./prepareRequest.js";
import sendResponse from "./sendResponse.js";
export default async function(delegate, req, res, env){
    const context = {request:prepareRequest(req)}
    sendResponse(await delegate(context, env), res);
}