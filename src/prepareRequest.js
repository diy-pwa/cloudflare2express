export default function(req){
    req.headers = new Headers(req.headers);
    req.json = ()=>{
        return JSON.parse(req.body.toString());
    };
    req.arrayBuffer = ()=> {
        return req.body;
    }
    req.text = ()=>{
        return req.body.toString();
    }
    req.formData = ()=>{
        return new URLSearchParams(req.body.toString());
    }
    return req;
}