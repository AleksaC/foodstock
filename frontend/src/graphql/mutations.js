/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct($input: createProductInput!) {
    createProduct(input: $input) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct($input: deleteProductInput!) {
    deleteProduct(input: $input) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct($input: updateProductInput!) {
    updateProduct(input: $input) {
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
