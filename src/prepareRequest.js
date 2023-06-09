export default function(req){
    req.headers = new Headers(req.headers);
    return req;
}