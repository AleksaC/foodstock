// import {useState , useEffect } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
// import { getProduct } from "./graphql/queries";

// const useData = (id) => {
//     const [products , setProducts] = useState([]);
//     const [loading , setLoading] = useState(true);

//     async function fetchProduct() {
//         try {
//             setLoading(true);
//             const productsData = await API.graphql(graphqlOperation(getProduct,{id:id}));
//             const produ = productsData.data.getProduct;
//             setProducts(produ);
//             setLoading(false);
//         }

//         catch (err) {
//             alert(err.status);
//         }

//     useEffect( () => {
//         fetchProduct();
//     } , [id])

//     return {products , loading};
// }

// //export default useData;
