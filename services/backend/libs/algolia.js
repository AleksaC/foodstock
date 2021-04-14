const algoliasearch = require('algoliasearch');
// https://github.com/theburningmonk/appsyncmasterclass-backend/blob/8600caf96d570fe7d1d5e543cf415d1b76412385/lib/algolia.js
let productsIndex;
const initProductsIndex = async (appID, key, stage) => {
    if (!productsIndex) {
        // only if we have not yet initialized the productsIndex,
        // perform the initialization
        const client = algoliasearch(appID, key);
        productsIndex = client.initIndex(`products-${stage}`);
        await productsIndex.setSettings({
            searchableAttributes: [
                'name', 'category', 'nutriScore'
            ]
        });
    }
    return productsIndex;
};

export default initProductsIndex;