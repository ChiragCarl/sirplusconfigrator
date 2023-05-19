const request=require('request');
const express=require('express');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());

let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";
let productId='8215155507493';

//post the data with the help of the api and get the record from the front end
app.delete("/deleteProduct",(req,resp)=>{
    console.log(req.body.product.id);
    const options={
        'method': 'DELETE',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products/${req.body.product.id}.json`,
        'headers':{
            'content-type':'Application/json'
        }
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});


app.listen(750);
