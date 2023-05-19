const axios = require('axios');
// let apiKey="ae56632494967a1f0e1736c8f47de10f";
// let apiKey="ae56632494967a1f0e1736c8f47de10f";
let apiKey="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";
const shopName = 'demoappsirplus';

const fetchProducts = async () => {
 try {
  const response = await axios.post(`https://${shopName}.myshopify.com/admin/api/2023-04/graphql.json`, {
   query: `
    query {
     products(first: 10, sortKey: PRODUCT_TYPE, reverse: false) {
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
      edges {
       node {
        id
        title
        description
        createdAt
        variants(first: 1) {
         edges {
          node {
           price
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
       }
      }
     }
    }
   `
  }, {
   headers: {
    'X-Shopify-Access-Token': apiKey,
   },
  });

  const products = response.data.data.products.edges;
  console.log(response.data.data.products);
   products.forEach((product) => {
    
   const { id, title, description,createdAt } = product.node;
  
   const price = product.node.variants.edges[0].node.price;
   
   //console.log(product.node);
   //const img= product.node.images.edges[0].node.originalSrc;

   console.log(`Product ID: ${id}`);

   console.log(`Title: ${title}`);
   
   console.log(`Description: ${description}`);

   console.log(`Price: ${price}`);

   console.log(`created At: ${createdAt}`);

   //console.log(`created At: ${img}`);

   console.log('---');

  });

 } catch (error) {
     console.log('An error occurred:', error);
 }
};




fetchProducts();





