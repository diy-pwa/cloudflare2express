export default function(req){
    req.headers = new Headers(req.headers);
    req.json = ()=>{
        const oBody = JSON.parse(req.body.toString());
        return oBody;
    };
    return req;
}