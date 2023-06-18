import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    return await CorsProxyResponse.fetch(context.request, context.env);
}