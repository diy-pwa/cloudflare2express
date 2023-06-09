export default function(worker, context){
    return worker(context.request);
}