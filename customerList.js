//sk_test_1x1_c0d5681c1dcd49870eeabd90c1e9068ab05b7612166f821df874b76334c8a249

const request=require('request');
const express=require('express');
const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors());

let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";



//get the list of customers 
const getAllCustomer={
    'method': 'GET',
    'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2023-04/customers.json`,
    'headers':{
        'content-type':'Application/json'
    }
}

//api to get the list of data 
app.get("/getCustomerData",(req,resp)=>{   
    request(getAllCustomer, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



//regsiter new customers 
app.post("/addCustomer",(req,resp)=>{
    const options={
        'method': 'POST',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/customers.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});

//Login Registered customers 
app.get("/loginCustomer",(req,resp)=>{
    console.log('from back end ',req.query.email);    
    const getSingleCustomer={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/customers/search.json?query=email:${req.query.email}`,
        'headers':{
            'content-type':'Application/json'
        }
    }

    request(getSingleCustomer, function(error,response){
        if(error)throw new Error(error);
        resp.send(JSON.stringify(response.body));
    });
   
});



//update new customers 
app.put("/updateCustomer",(req,resp)=>{
    console.log(req.body.customer.id);
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/customers/${req.body.customer.id}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});




app.get("/getProductTagbased",(req,resp)=>{

    console.log('from back end ',req.query.Tags);    
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products.json`,
        'headers':{
            'content-type':'Application/json'
        }
    }
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});


app.put("/deleteCustomer",(req,resp)=>{
    console.log(req.body.customer.id);
    const options={
        'method': 'DELETE',
        'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/customers/${req.body.customer.id}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});





app.listen(750);