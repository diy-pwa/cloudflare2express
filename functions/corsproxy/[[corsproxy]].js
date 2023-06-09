import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    const apiUrl = context.request.url.replace(/^.*corsproxy/, "https://codeload.github.com");

    const oResponseFactory = new CorsProxyResponse({url:apiUrl});
    return await oResponseFactory.getResponse(context.request);
}