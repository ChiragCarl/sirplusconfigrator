const request=require('request');
const url=require('url');

const express=require('express');
const cors=require('cors');

const app=express();
//app.use(express.json());
app.use(cors());

let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";

let _url=`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products`;

const crProduct={
    'method': 'POST',
    'headers':{
        'uri':_url,
        'content-type':'Application/json'
    },body:JSON.stringify({
        "product":{
            "title":"testing Demo ",
            "body_html":"<p>Lays Blue Chips</p>",
            "vendor":"Parker",
            "product_type":" diet food",
            "variants": [
                {
                    "price": "25.00",
                    "sku": "Lays123",
                    "inventory_quantity": 5,
                }
            ]
        }
    })
}

app.post("/AddProductData",(req,resp)=>{  
    request(crProduct, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log("ok");
   });
});



app.listen(750);