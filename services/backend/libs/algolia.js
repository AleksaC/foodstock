const algoliasearch = require('algoliasearch');

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