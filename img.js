const { gql } = require('apollo-server-express');
const Shopify = require('shopify-api-node');

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    description: String!
    images: [Image]
  }

  type Image {
    src: String!
    alt: String!
  }

  type Query {
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      const shopify = new Shopify({
        shopName: 'sirplus-food',
        apiKey: '89ddc5a0f041b4ce30d407b90fab38ed',
        password: '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',
      });

      const query = gql`
        query Products {
          products(first: 10) {
            edges {
              node {
                id
                title
                descriptionHtml
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = await shopify.graphql(query);

      return result.products.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        description: node.descriptionHtml,
        images: node.images?.edges?.[0]?.node
          ? [
              {
                src: node.images.edges[0].node.originalSrc,
                alt: node.images.edges[0].node.altText,
              },
            ]
          : null,
      }));
    },
  },
};

module.exports = { typeDefs, resolvers };
