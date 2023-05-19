
const axios = require('axios');
const request=require('request');
const express=require('express');
const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors());


//store front of demo site 
//const shopName = 'demoappsirplus';
//let apiKey="cc729bf5fbb7a8633dfa2b2f93f1121a";



//store front API and Details of client side 
const shopName = 'sirplus-food';
let apiKey="8b161343b3325242e1abf4be1b9538a7";

let sortBy="TITLE", orderBy="true";
let nextCursor=null;


app.get("/getSortingProduct",async (req,resp)=>{
    sortBy=req.query.sortBy;
    orderBy=req.query.orderBy;
   let record=await prodcutSortByQuery(nextCursor,sortBy,orderBy);
    console.log(record);
    console.log('XXXXXXXXXXXX');
    resp.send(record);
});


const prodcutSortByQuery = async (afterCursor = null) => {
 try {
  const response = await axios.post(`https://${shopName}.myshopify.com/api/2021-04/graphql.json`, {
   query: `query($cursor: String) {
        products(first: 10, after: $cursor, sortKey:${sortBy}, reverse:${orderBy}) {
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
           images(first: 5) {
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
  let { id, title, description,tags, availableForSale,totalInventory} = product.node;

  const img=product.node.images.edges;
  imgurl=img.length>0?product.node.images.edges[0].node.originalSrc:null;
  
  const price = product.node.variants.edges[0].node.price;
  const compareAtPrice = product.node.variants.edges[0].node.compareAtPrice;
  const varient_Id = product.node.variants.edges[0].node.id;
   
   // const inventoryItemId= product.node.variants.edges[0].node.inventoryItem.id;

        let idx=id.lastIndexOf('/');
        id=id.slice(idx+1,id.length);
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
        productData.push(data); 
        console.log(id, '-----',title);
        console.log('------');
  });
    if (products.pageInfo.hasNextPage) {
       nextCursor = products.pageInfo.endCursor;
    }
   return productData;
 } catch (error) {
  console.log('An error occurred:', error);
 }
};

//app.listen(3000);

//app.listen(750);