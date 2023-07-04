import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    context.env.url = context.request.url.replace(/^.*corsproxy/, "https:/");
    return await CorsProxyResponse.fetch(context.request, context.env);
}