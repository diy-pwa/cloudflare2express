import CorsProxyResponse from "../../src/CorsProxyResponse.js";

export async function onRequest(context) {
    const apiUrl = context.request.url.replace(/^.*corsproxy/, "https://codeload.github.com");

    const oResponseFactory = new CorsProxyResponse({url:apiUrl});
    return await oResponseFactory.getResponse(context.request);
}