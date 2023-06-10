import worker from '../../workers/hello.js';
import worker2functionAdapter from '../../src/worker2functionAdapter.js';

export async function onRequest(context){
    return worker2functionAdapter(worker, context);
}
