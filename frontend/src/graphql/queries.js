/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAllProducts = /* GraphQL */ `
  query GetAllProducts {
    getAllProducts {
      barcode
      briefDescription
      category
      currentPrice {
        date
        discountAmount
        discountEndDate
        discountPrice
        discountStartDate
        regularPrice
      }
      description {
        additionalInformation
        alcohol
        allergens
        countryOfOrigin
        expiryDate
        imports
        ingredients
        maintenance
        producer
      }
      id
      images
      name
      nutriScore
      nutritionalValues {
        carbs
        energy
        fats
        fibers
        proteins
        salt
        saturatedFats
        sugar
      }
      productStoreID
      status
      store
      storeID
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      barcode
      briefDescription
      category
      currentPrice {
        date
        discountAmount
        discountEndDate
        discountPrice
        discountStartDate
        regularPrice
      }
      description {
        additionalInformation
        alcohol
        allergens
        countryOfOrigin
        expiryDate
        imports
        ingredients
        maintenance
        producer
      }
      id
      images
      name
      nutriScore
      nutritionalValues {
        carbs
        energy
        fats
        fibers
        proteins
        salt
        saturatedFats
        sugar
      }
      productStoreID
      status
      store
      storeID
    }
  }
`;
export const search = /* GraphQL */ `
  query Search($limit: Int!, $nextToken: String, $query: String!) {
    search(limit: $limit, nextToken: $nextToken, query: $query) {
      nextToken
      results {
        barcode
        briefDescription
        category
        currentPrice {
          date
          discountAmount
          discountEndDate
          discountPrice
          discountStartDate
          regularPrice
        }
        description {
          additionalInformation
          alcohol
          allergens
          countryOfOrigin
          expiryDate
          imports
          ingredients
          maintenance
          producer
        }
        id
        images
        name
        nutriScore
        nutritionalValues {
          carbs
          energy
          fats
          fibers
          proteins
          salt
          saturatedFats
          sugar
        }
        productStoreID
        status
        store
        storeID
      }
    }
  }
`;
