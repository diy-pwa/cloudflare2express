import prepareRequest from "./prepareRequest.js";
import sendResponse from "./sendResponse.js";
export default async function(delegate, req, res){
    sendResponse(await delegate.fetch(prepareRequest(req)), res);
}
