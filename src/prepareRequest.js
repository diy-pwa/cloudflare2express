export default function(req){
    req.headers = new Headers(req.headers);
    req.json = ()=>{
        return JSON.parse(req.body);
    };
    return req;
}