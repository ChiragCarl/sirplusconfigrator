const request=require('request');
const express=require('express');
const cors=require('cors');

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const axios = require('axios');
const mysql=require('mysql');
const app=express();
app.use(express.json());
app.use(cors());



//https://89ddc5a0f041b4ce30d407b90fab38ed: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@sirplus-food.myshopify.com/admin/api/2023-04/locations.json

 //let nextLink=`https://ae56632494967a1f0e1736c8f47de10f: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@demoappsirplus.myshopify.com/admin/api/2022-10/products/8209960370469.json`;
 
 //let nextLink=`https://89ddc5a0f041b4ce30d407b90fab38ed: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@demoappsirplus.myshopify.com/admin/api/2022-10/products/8209960370469.json`;

 //?customer_id=7054280556811
// //demo site creds 
// let Apikey="ae56632494967a1f0e1736c8f47de10f";
// let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
// let Password="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";
// const shopName = 'demoappsirplus';
// //store front api key demo site 
// let apiKey="cc729bf5fbb7a8633dfa2b2f93f1121a";
// let rechargeApi='sk_test_1x1_c0d5681c1dcd49870eeabd90c1e9068ab05b7612166f821df874b76334c8a249';


//console.log(process.env.shopName);
//client site creds
let Apikey="89ddc5a0f041b4ce30d407b90fab38ed";
let APIsecretkey="a7219f0fb3b02e7a4a33ebf52ad2125b";
let Password="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";
const shopName="sirplus-food";
//store front api key of client side 
let apiKey="8b161343b3325242e1abf4be1b9538a7";
let rechargeApi='sk_1x1_3dba0a68f8c201453d73ae5228a595dd754772f247d88cbb5ea27194ef3ff43f';

let nextLink=`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json`;

let nextPageCursor=null, nextCursor=null;

app.get("/getProductByGraphQl",async (req,resp)=>{  
    let record=await productGetByQuery(nextPageCursor);
    console.log(nextPageCursor);
    resp.send(record);
});


//global sorting format to get the sorted products 
const productGetByQuery = async (afterCursor = null) => {
    try {
     const response = await axios.post(`https://${shopName}.myshopify.com/api/2021-10/graphql.json`, {
      query: `query($cursor: String) {
           products(first: 250 ,query: "published_status:published AND status:active",after: $cursor) {
             pageInfo {
               hasNextPage
               endCursor
              }
            edges {
             node {
              id
              title
              description
              tags
              availableForSale
              createdAt
              totalInventory
              variants(first: 1) {
               edges {
                node {
                 id
                 price
                 compareAtPrice
                }
               }
              }
              images(first: 1) {
               edges {
                node {
                 originalSrc
                }
               }
              }
              metafields(first: 5) {
               edges {
                node {
                 key
                 value
                }
               }
              }
             }
            }
           }
          }
      `, variables: {
       cursor: afterCursor
      }
     }, {
      headers: {
       'X-Shopify-Storefront-Access-Token': apiKey
      }
     });
     const products = response.data.data.products;
     let productData=[];
     products.edges.forEach((product) => {
     let imgurl="";
     let { id, title, description,tags, availableForSale,totalInventory,createdAt} = product.node;
   
     const img=product.node.images.edges;
     imgurl=img.length>0?product.node.images.edges[0].node.originalSrc:null;
     
     const price = product.node.variants.edges[0].node.price;
     const compareAtPrice = product.node.variants.edges[0].node.compareAtPrice;
     let varient_Id = product.node.variants.edges[0].node.id;
    // const inventoryItemId= product.node.variants.edges[0].node.inventoryItem.id;
           let idx=id.lastIndexOf('/');
           id=id.slice(idx+1,id.length);
           let vIds=varient_Id.lastIndexOf('/');
           varient_Id =varient_Id .slice(vIds+1,vIds.length);
           let data={
               "id":id,
               "Title":title,
               "Description":description,
               "Tags":tags,
               "Price":price,
               "Inventory_Quantity":totalInventory,
               "varient_Id":varient_Id,
               "compare_At_Price":compareAtPrice,
               "Image":img
           }
           if(totalInventory>0 && price>0 && compareAtPrice>0){
                productData.push(data);
                console.log('available for sale: ',availableForSale,'--',totalInventory,'---',price);
           }
     });
       if (products.pageInfo.hasNextPage) {
        nextPageCursor = products.pageInfo.endCursor;
       }
      return productData;
    } catch (error) {
     console.log('An error occurred:', error);
     return error;
    }
};


//productGetByQuery(nextPageCursor);



app.get("/getSortingProduct",async (req,resp)=>{
    let sortBy=req.query.sortBy;
    let orderBy=req.query.orderBy;
    let record=await prodcutSortByQuery(nextCursor,sortBy,orderBy);
    console.log(nextCursor);
    resp.send(record);
});

//global sorting format to get the sorted products 
const prodcutSortByQuery = async (afterCursor = null,sortBy,orderBy) => {
    try {
    let tags="Snowboard";
     const response = await axios.post(`https://${shopName}.myshopify.com/api/2021-04/graphql.json`, {
      query: `query($cursor: String) {
           products(first: 250, after: $cursor, sortKey:${sortBy}, reverse:${orderBy}) {
             pageInfo {
               hasNextPage
               endCursor
              }
            edges {
             node {
              id
              title
              description
              tags
              availableForSale
              createdAt
              totalInventory
              variants(first: 1) {
               edges {
                node {
                 id
                 price
                 compareAtPrice
                }
               }
              }
              images(first: 1) {
               edges {
                node {
                 originalSrc
                }
               }
              }
              metafields(first: 5) {
               edges {
                node {
                 key
                 value
                }
               }
              }
             }
            }
           }
          }
      `, variables: {
       cursor: afterCursor
      }
     }, {
      headers: {
       'X-Shopify-Storefront-Access-Token': apiKey
      }
     });
     const products = response.data.data.products;
     let productData=[];
     products.edges.forEach((product) => {
     let imgurl="";
     let { id, title, description,tags, availableForSale,totalInventory,createdAt} = product.node;
   
     const img=product.node.images.edges;
     imgurl=img.length>0?product.node.images.edges[0].node.originalSrc:null;
     
     const price = product.node.variants.edges[0].node.price;
     const compareAtPrice = product.node.variants.edges[0].node.compareAtPrice;
     let varient_Id = product.node.variants.edges[0].node.id;
      // const inventoryItemId= product.node.variants.edges[0].node.inventoryItem.id;
           let idx=id.lastIndexOf('/');
           id=id.slice(idx+1,id.length);
           let vIds=varient_Id.lastIndexOf('/');
           varient_Id =varient_Id .slice(vIds+1,vIds.length);
           let data={
               "id":id,
               "Title":title,
               "Description":description,
               "Tags":tags,
               "Price":price,
               "Inventory_Quantity":totalInventory,
               "varient_Id":varient_Id,
               "compare_At_Price":compareAtPrice,
               "Image":img
           }
           if(totalInventory>0 && price>0 && compareAtPrice>0){
                productData.push(data);
                console.log('available for sale: ',availableForSale,'--',totalInventory,'---',price);
           }
     });
       if (products.pageInfo.hasNextPage) {
          nextCursor = products.pageInfo.endCursor;
       }
      return productData;
    } catch (error) {
     console.log('An error occurred:', error);
     return error;
    }
};

//prodcutSortByQuery(nextCursor,'PRICE','true');


// //database connection to connect  
// const connection =mysql.createConnection({
//     host:'localhost',
//     port:3306,
//     database:'sirplus',
//     user:'root',
//     password:'root' 
// });

// //method to connect with local host and store the data into the mysql 
// connection.connect(function (err){
//     if(err){
//         console.log('Error ',err.message);
//     }else{
//         console.log('connected');
//        // var sql = "INSERT INTO tbltest (sName,sPassword) VALUES ('Ajeet Kumar', 'Allahabad')";  
//         // connection.query(sql, function (err, result) {  
//         // if (err) throw err;  
//         // console.log("1 record inserted");  
//         // });  
//     // Print auto-generated id
//     }
// });



//https://ae56632494967a1f0e1736c8f47de10f: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@demoappsirplus.myshopify.com/admin/api/2023-04/webhooks.json


//database connection to connect  
// const connection =mysql.createConnection({
//     host:'localhost',
//     port:3306,
//     database:'sirplus',
//     user:'root',
//     password:'root' 
// });
 
 
//method to connect with local host and store the data into the mysql 
// connection.connect(function (err){
//     if(err){ 
//         console.log('local storage -- ',localStorage.getItem('status'));
//         localStorage.setItem('status',err);
//         console.log('Error ',err.message, '--');
//     }else{
//         console.log('connected',bhoot);
//        // var sql = "INSERT INTO tbltest (sName,sPassword) VALUES ('Ajeet Kumar', 'Allahabad')";  
//         // connection.query(sql, function (err, result) {  
//         // if (err) throw err;  
//         // console.log("1 record inserted");  
//         // });  
//     // Print auto-generated id
//     }
// });

const options={
    'method': 'GET',
    'url':nextLink,
    'headers':{
        'content-type':'Application/json'
    }
}


//this API is used to update, delete or create the recommended Product ID from the table  
app.post("/updateRecomendedProduct",(req,resp) => {
    connection.query("SELECT * FROM tblrecommendation WHERE CustomerID = '"+req.body.product.customerID+"'", function (err, result) {
        if(result.length==0){
            var sql = "INSERT INTO tblrecommendation (CustomerID,productRecommendID) VALUES ('"+req.body.product.customerID+"', '"+req.body.product.recommendedID+"')"; 
            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                    console.log("1 record inserted");  
                });  
        }else{
            var sql = "update tblrecommendation set productRecommendID='"+req.body.product.recommendedID+"' where CustomerID'"+req.body.product.customerID+"'"; 
            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                    console.log("1 record updated");  
                });
        }
    });
    resp.send('ok');
});


//this code can be used to get the recommended product next time when the subscription move in the action 
app.get("/getRecommendedProduct",(req,resp)=>{
    //get the customer ID from the URL      
    //select query in nodejs to get the Customer ID and recommened product ID
    //get the recommended Product ID 
        let recommendedProductID="";
        connection.query("SELECT * FROM tblrecommendation WHERE CustomerID = '"+req.query.customerID+"'", function (err, result) {
            if (err) throw err;
            recommendedProductID=result[0].productRecommendID;
        const options2={
            'method': 'GET',
            'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json?ids=${recommendedProductID}`,
            'headers':{
                'content-type':'Application/json'
            }
        }    
        request(options2, function(error,response){
            if(error)throw new Error(error);
            resp.send(response.body);
            console.log(response.body);
        });    
    });
   // console.log('inside -',recommendedProductID);
});

app.get("/getSingleProductData",(req,resp)=>{  
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products/${req.query.id}.json`,
        'headers':{
            'content-type':'Application/json'
        }
    }
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
       // console.log(response.body);
    });
});


app.get("/getRecommendation",(req,resp)=>{
    const options={
        'method': 'GET',
        //url':`https://${Apikey}:${Password}@sirplus-food.myshopify.com/admin/api/2022-10/products/${req.query.product_Id}/metafields.json`,
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/recommendations/products.json?product_id=8211611910437`,
       // 'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products/8211611910437/metafields.json`,
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



//8211611910437
app.get("/getMetaFieldId",(req,resp)=>{
    //console.log(req.query.product_Id);
    const options={
        'method': 'GET',
        //url':`https://${Apikey}:${Password}@sirplus-food.myshopify.com/admin/api/2022-10/products/${req.query.product_Id}/metafields.json`,
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products/${req.query.product_Id}/metafields.json`,
       // 'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/products/8211611910437/metafields.json`,
        'headers':{
            'content-type':'Application/json'
        }
    }

    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


//81046798629 
app.get("/getLocationId",(req,resp)=>{
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/locations.json`,
        //'url':`https://${Apikey}:${Password}@demoappsirplus.myshopify.com/admin/api/2022-10/locations.json`,
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


//post the data with the help to manage the Inventory 
app.post("/updateInventory",(req,resp)=>{
    console.log(req.body);
    const options={
        'method': 'POST',
        'url':`https://${Apikey}:${Password}@${shopName}s.myshopify.com/admin/api/2022-10/inventory_levels/adjust.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });

});


app.get("/getNextProductData",(req,resp)=>{
    request(options, function(error,response){
        if(error)throw new Error(error);
        let url=response.headers.link;
        let idF=url.lastIndexOf('<');
        let idL=url.lastIndexOf('>');
        url=url.slice(idF+1,idL);
        nxtLink=url;
        resp.send(response.body);
        console.log(nxtLink);
    });
});

app.get("/loadMoreProductData",(req,resp)=>{
    nxtLink=nxtLink.replace('//','//89ddc5a0f041b4ce30d407b90fab38ed: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@');
    const options1={
        'method': 'GET',
        'url':nxtLink,
        'headers':{
            'content-type':'Application/json'
        }
    };
    request(options1, async function(error,response){
        if(error)throw new Error(error);
        let url=response.headers.link;
        let idF=url.lastIndexOf('<');
        let idL=url.lastIndexOf('>');
        url=url.slice(idF+1,idL);
        nxtLink=url;
        resp.send(response.body);
    });
});


//post the data with the help of the api and get the record from the front end
app.post("/add",(req,resp)=>{
    const options={
        'method': 'POST',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});

//api to get the tags of the single customer to update with the recommended Products
app.get("/removeCustomerRecommendedProductTag",async (req,resp)=>{   
    //get the list of customers 
    const {data}=await axios.get(`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2023-04/customers/${req.query.custId}.json`);
    
    let custTags=data.customer.tags;
    let updatedTags="";
    if(req.query.productId.includes(',')){
        let tagsData=req.query.productId.split(',');
        for(let y=0;y<tagsData.length;y++){
            let removeTag="R-"+tagsData[y];
            const index = custTags.indexOf(removeTag);
            const x = custTags.splice(index, 1);
        }
        updatedTags=custTags;
    }else{
       //when a single product id comes from query and need to remove from the array 
       let removeTag="R-"+req.query.productId;
       const index = custTags.indexOf(removeTag);
       const x = custTags.splice(index, 1);
       updatedTags=custTags;
    }
    console.log(updatedTags);
    let new_customer = {
        customer: {
            id:req.query.custId,
            tags: updatedTags
        }
    };
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/${req.query.custId}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(new_customer)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


//api to get the tags of the single customer to update with the recommended Products
app.get("/addCustomerRecommendedProductTag",async (req,resp)=>{   
    //get the list of customers 
    const {data}=await axios.get(`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2023-04/customers/${req.query.custId}.json`);
    let custTags=data.customer.tags;
    let updatedTags="";
    let count=0;
    if(req.query.productId.includes(',')){
        let tagsData=req.query.productId.split(',');
        for(let y=0;y<tagsData.length;y++){
            count=0;
           if(count==0){
             custTags+=",R-"+tagsData[y];
           }
        }
        updatedTags=custTags;
    }else{
        //when a single product id comes from query 
       let spltCust=custTags.split(',');
       let rec="R-"+req.query.productId;
       for(let x=0;x<spltCust;x++){
            if(spltCust[x]==rec){
                count++;
            }
       }
       if(count==0){
            updatedTags=custTags+",R-"+req.query.productId;
       }
    }
    let new_customer = {
        customer: {
            id:req.query.custId,
            tags: updatedTags
        }
    };
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/${req.query.custId}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(new_customer)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



//regsiter new customers and save all preferences tags
app.put("/addCustomerTags",(req,resp)=>{
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/${req.body.customer.id}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


//this api can be used to get the particular tags of the individual customer
app.get("/getCustomerTag",(req,resp)=>{   
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2023-04/customers/${req.query.custId}.json`,
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


//Login Registered customers 
app.get("/loginCustomer",(req,resp)=>{  
    const getSingleCustomer={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/search.json?query=email:${req.query.email}`,
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
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/${req.body.customer.id}.json`,
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
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json`,
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
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/customers/${req.body.customer.id}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});

//post the data with the help of the api and get the record from the front end
app.delete("/deleteProduct",(req,resp)=>{
    console.log(req.body.product.id);
    const options={
        'method': 'DELETE',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products/${req.body.product.id}.json`,
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


//post the data with the help of the api and get the record from the front end
app.put("/updateProduct",(req,resp)=>{
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products/${req.query.product_Id}.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});
// /admin/api/2023-04/variants/808950810.json


//get variant data
app.get("/getVariantFieldData",(req,resp)=>{
    //console.log(req.query.product_Id);
    const options={
        'method': 'GET',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/variants/44844759777573.json`,
        'headers':{
            'content-type':'Application/json'
        }
    }
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


//post the data with the help of the api and get the record from the front end
app.put("/updateProductPrice",(req,resp)=>{
    const options={
        'method': 'PUT',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/variants/44844759777573.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});



//this code is used to store the subscripted product along with quantity to manage 
app.post("/addSubscriptionProductId", (req,resp)=>{
    const options={
        'method': 'POST',
        'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2021-07/products.json`,
        'headers':{
            'content-type':'Application/json'
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
        console.log(response.body);
    });
});


//add Product into   the Subscription plan  
app.post("/addProductRechargeApp",async(req,resp)=>{
    console.log(req.body);
  try {
    let apiUrl=`https://api.rechargeapps.com/products`;
    const response = await axios.post(apiUrl,req.body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Recharge-Access-Token': rechargeApi, // Replace with your Recharge app access token
        'X-Recharge-Version':'2021-01',
        'accept':'application/json',
      }
    });
    console.log('Product creation response:', response.data);
    resp.send(response.data);
  } catch (error) {
    console.log('Product creation error:', error);
    resp.send(error);
  }
});


//44844759875877,44844759744805
//try to create the bundle into the recharge APP dynamically 
const createSubscriptionProduct = async (productTitle, price, variantIds) => {
    const url = 'https://api.rechargeapps.com/subscription_products';
  
    const headers = {
      'X-Recharge-Access-Token': rechargeApi,
      'Content-Type': 'application/json',
      'X-Recharge-Version':'2021-01',
      'accept':'application/json'
    };
  
    const data = {
      subscription_product: {
        title: productTitle,
        price: price,
        variant_ids: variantIds,
      },
    };
  
    try {
      const response = await axios.post(url, data, { headers });
      console.log('created Bundle ',response.data);
    } catch (error) {
      console.error('while creating the bundle error ',error);
    }
  };

 // createSubscriptionProduct('Dynamic Bundle', 19.99, ['44844759875877', '44844759744805']);

//create a New cusotmer inside the Recharge Customer Section when ever customer select the subscription then 
//it will create only once for customer 
app.post("/createCustomerInRecharge",(req,resp)=>{
    // let custData={
    //     email:"carl.m@appwrk.co",
    //     first_name:"carl",
    //     last_name:"M",
    //     external_customer_id: {
    //         ecommerce: "6961608524069"
    //       },
    //     has_valid_payment_method: "true",
    // }
    const options={
        'method': 'POST',
        'url':`https://api.rechargeapps.com/customers`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'content-type':'Application/json',
            'X-Recharge-Access-Token':rechargeApi
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



//skip the order which means the next order will be skipped
app.post("/skipCustomerNextSubscriptedOrder",(req,resp)=>{
    let custId=req.query.custId;
    let chargeId="";
    let allOrder='';
    let productId=[];
    let status="";
    const options={
        'method': 'GET',
        'url':`https://api.rechargeapps.com/orders`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token':rechargeApi
        }
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
       // resp.send(response.body);
        allOrder=JSON.parse(response.body);
        //console.log(allOrder.orders);
        
        for(let x=0;x<allOrder.orders.length;x++){
            if(allOrder.orders[x].customer.external_customer_id.ecommerce==custId){
                chargeId=allOrder.orders[x].charge.id;
                status=allOrder.orders[x].status;
                for(let y=0;y<allOrder.orders[x].line_items.length;y++){
                    productId.push(allOrder.orders[x].line_items[y].external_product_id.ecommerce)
                }
            }
        }
    });

    if(status=='queued'){
        let data={
            "purchase_item_ids":productId
        };
        const options2={
            'method': 'POST',
            'url':`https://api.rechargeapps.com/charges/820725937/skip`,
            'headers':{
                'X-Recharge-Version': '2021-11',
                'content-type':'Application/json',
                'X-Recharge-Access-Token':rechargeApi
            },body:JSON.stringify(data)
        };
        request(options2, function(error,response){
            if(error)throw new Error(error);
            resp.send(["yes"]);
        });
    }else{
        resp.send(["no"]);
        console.log("can't skip the order");
    }
});

//get the next subscription date of the customer given customer id
app.get("/getCustomerSubscriptionDate",async (req,resp)=>{
    let custId=req.query.custId;
    let allCustomer=[];
    let rechargeCustomerId="";
    let getSubscriptionData="";

    let {data}=await axios.get('https://api.rechargeapps.com/customers',
    {headers:{ 'X-Recharge-Version': '2021-11','X-Recharge-Access-Token':rechargeApi}})
    //console.log(data.customers);
    if(data){
        allCustomer=data.customers;
        for(let x=0;x<allCustomer.length;x++){
            if(allCustomer[x].external_customer_id.ecommerce==custId){
                rechargeCustomerId=allCustomer[x].id;
                console.log('Recharge Customer ID---',rechargeCustomerId);
            }   
        }
       rechargeCustomerId=parseInt(rechargeCustomerId);
       console.log(typeof(rechargeCustomerId));
    }

    data=await axios.get(`https://api.rechargeapps.com/subscriptions?customer_id=${rechargeCustomerId}`,
    {headers:{ 'X-Recharge-Version': '2021-11','X-Recharge-Access-Token':rechargeApi}})

    if(data.data){
        getSubscriptionData=data.data.subscriptions;
        console.log('subscription ',getSubscriptionData);
        resp.send(getSubscriptionData);
        //   console.log(subscriptionData);
    }
});


//cancel the subscription of the customer
app.get("/cancelCustomerSubscription",async (req,resp)=>{
    let custId=req.query.custId;
    let allCustomer=[];
    let rechargeCustomerId="";
    let getSubscriptionId="";

    let {data}=await axios.get('https://api.rechargeapps.com/customers',
    {headers:{ 'X-Recharge-Version': '2021-11','X-Recharge-Access-Token':rechargeApi}})
    //console.log(data.customers);
    if(data){
        allCustomer=data.customers;
        for(let x=0;x<allCustomer.length;x++){
            if(allCustomer[x].external_customer_id.ecommerce==custId){
                rechargeCustomerId=allCustomer[x].id;
                console.log('Recharge Customer ID---',rechargeCustomerId);
            }   
        }
       
       rechargeCustomerId=parseInt(rechargeCustomerId);
       console.log(typeof(rechargeCustomerId));

    }

    data=await axios.get(`https://api.rechargeapps.com/subscriptions?customer_id=${rechargeCustomerId}`,
    {headers:{ 'X-Recharge-Version': '2021-11','X-Recharge-Access-Token':rechargeApi}})

    if(data.data){
        getSubscriptionId=data.data.subscriptions[0].id;
        console.log('subscription ',getSubscriptionId);
        resp.send(data.data);
        //   console.log(subscriptionData);
    }

    if(rechargeCustomerId && getSubscriptionId){
        getSubscriptionId=parseInt(getSubscriptionId);
        console.log(getSubscriptionId);
        const cancellationReason = 'no more interested';
       // Replace with the actual subscription ID you want to cancel
        const apiUrl = `https://api.rechargeapps.com/subscriptions/${getSubscriptionId}/cancel`;
        try {
            const response = await axios.post(apiUrl, {
              cancellation_reason: cancellationReason
            }, {
              headers: {
                'X-Recharge-Access-Token': 'sk_test_1x1_df6e99733636a80870340d76e4ef631e906d47d28b721b4c993a81ce1d2cd253', // Replace with your Recharge app access token
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            console.log('Cancellation response:', response.data);
            resp.send(["yes"]);
          } catch (error) {
            console.log('Cancellation error:', error.message);
            resp.send(["no"]);
          }
          
       
    }
});     


//update the Subscription plan  
app.put("/updateSubscriptionPlan",(req,resp)=>{
    console.log(req.query.Id);
    const options={
        'method': 'PUT',
        'url':`https://api.rechargeapps.com/subscriptions/${req.query.Id}`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'content-type':'Application/json',
            'X-Recharge-Access-Token':rechargeApi
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});

//update the Subscription plan  
app.put("/updateSubscriptionInterval",(req,resp)=>{
    console.log(req.query.Id);
    const options={
        'method': 'PUT',
        'url':`https://api.rechargeapps.com/subscriptions/${req.query.Id}`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'content-type':'Application/json',
            'X-Recharge-Access-Token':rechargeApi
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


app.get("/allSubscriptions",(req,resp)=>{
    const options={
        'method': 'GET',
        'url':`https://api.rechargeapps.com/subscriptions`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token':rechargeApi
        }
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



app.get("/allCustomerRecharge",(req,resp)=>{
    const options={
        'method': 'GET',
        'url':`https://api.rechargeapps.com/customers`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token':rechargeApi
        }
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});


app.get("/allOrders", async(req,resp)=>{
    console.log(req.query.Id);
    let custId=req.query.Id;
    let allCustomer=[];
    let rechargeCustomerId="";
    let {data}=await axios.get('https://api.rechargeapps.com/customers',
    {headers:{ 'X-Recharge-Version': '2021-11','X-Recharge-Access-Token':rechargeApi}})
    if(data){
        allCustomer=data.customers;
        console.log(allCustomer);
        for(let x=0;x<allCustomer.length;x++){
            if(allCustomer[x].external_customer_id.ecommerce==custId){
                rechargeCustomerId=allCustomer[x].id;
                console.log('Recharge Customer ID---',rechargeCustomerId);
            }   
        }      
        rechargeCustomerId=parseInt(rechargeCustomerId);
        const options={
            'method': 'GET',
            'url':`https://api.rechargeapps.com/orders?customer_id=${rechargeCustomerId}`,
            'headers':{
                'X-Recharge-Version': '2021-01',
                'X-Recharge-Access-Token':rechargeApi,
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        };
        request(options, function(error,response){
            if(error)throw new Error(error);
            resp.send(response.body);
            console.log(response.body);
        });
    }
});



//delete the Subscription plan  
app.delete("/deleteSubscriptionPlan",(req,resp)=>{
    console.log(req.query.Id);
    const options={
        'method': 'DELETE',
        'url':`https://api.rechargeapps.com/subscriptions/${req.query.Id}`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'content-type':'Application/json',
            'X-Recharge-Access-Token':rechargeApi
        }};
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



//here we need to pass the subscription id of the products to cancel the subscription of the product
app.get("/cancelSubscription",async (req,resp)=>{
    let getSubscriptionId=req.query.Id;
    const cancellationReason = 'no more interested';
    // Replace with the actual subscription ID you want to cancel
     const apiUrl = `https://api.rechargeapps.com/subscriptions/${getSubscriptionId}/cancel`;
     try {
         const response = await axios.post(apiUrl, {
           cancellation_reason: cancellationReason
         }, {
           headers: {
             'X-Recharge-Access-Token':rechargeApi, // Replace with your Recharge app access token
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           }
         });
         console.log('Cancellation response:', response.data);
         resp.send(["yes"]);
       } catch (error) {
         console.log('Cancellation error:', error.message);
         resp.send(["no"]);
       }    
});


//update the Subscription plan  
app.post("/skipNextDelivery",(req,resp)=>{
    console.log(req.query.Id);
    const options={
        'method': 'POST',
        'url':`https://api.rechargeapps.com/subscriptions/${req.query.Id}/set_next_charge_date`,
        'headers':{
            'X-Recharge-Version': '2021-11',
            'content-type':'Application/json',
            'X-Recharge-Access-Token':rechargeApi
        },body:JSON.stringify(req.body)
    };
    request(options, function(error,response){
        if(error)throw new Error(error);
        resp.send(response.body);
    });
});



app.listen(3000);

//app.listen(750);
