import { pipeline } from 'stream/promises';
export default function(oResponse, res){
    const headersHash = {};
    for (let [key, value] of oResponse.headers) {
      headersHash[key] = value;
    }
    res.set(headersHash);
    res.status(oResponse.statusCode);
    if (oResponse.body) {
        pipeline(oResponse.body, res);
    } else {
        // options doesn't have body
        res.end();
    }


}