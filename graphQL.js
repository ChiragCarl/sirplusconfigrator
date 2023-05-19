const request=require('request');
const express=require('express');
const cors=require('cors');
const fetch = require('node-fetch');
const app=express();
app.use(express.json());
app.use(cors());


const axios = require('axios');
const { GraphQLClient } = require('graphql-request');


let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";


const shopName = 'demoappsirplus';

const accessToken = '1504b4bd5115633af2e09350daf6dc1b';

const endpoint = ``;

const client = new GraphQLClient(`https://${shopName}.myshopify.com/admin/api/2021-07/graphql.json`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': `${access_token}`
  }
});

const query = `
  {
    products(first: 10) {
      edges {
        node {
          id
          title
          vendor
        }
      }
    }
  }
`;

client.request(query)
  .then(data => console.log(data))
  .catch(error => console.error(error));

app.listen(750);

