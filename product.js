
const request=require('request');
const express=require('express');
const cors=require('cors');

const app=express();
app.use(cors());

let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";


const options={
    'method': 'GET',
    'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products.json`,
    'headers':{
        'content-type':'Application/json'
    }
}

app.get("/getProductData",(req,resp)=>{
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});





app.listen(750);
