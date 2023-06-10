export default function(worker, context){
    return worker.fetch(context.request);
}
