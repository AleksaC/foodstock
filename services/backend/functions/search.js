import initProductsIndex from "../libs/algolia";
import * as uuid from "uuid";
const middy = require("@middy/core");
const ssm = require("@middy/ssm");

const stage = process.env.stage;

export const handler = middy(async (event, context) => {
    const { query, limit, nextToken } = event.arguments; // get the arguments of the query
    return await search(context, query, limit, nextToken);
}).use(
    ssm({
        cacheExpiry: 5 * 60 * 1000, // 5 minutes
        fetchData: {
            ALGOLIA_APP_ID: `/foodstock/${stage}/algoliaAppID`,
            ALGOLIA_ADMIN_KEY: `/foodstock/${stage}/algoliaAdminKey`,
        },
        setToContext: true,
        awsSdkOptions: { region: "eu-central-1" },
    })
);

async function search(context, query, limit, nextToken) {
    const index = await initProductsIndex(
        context.ALGOLIA_APP_ID,
        context.ALGOLIA_ADMIN_KEY,
        stage
    );
    const searchParams = parseNextToken(nextToken) || {
        hitsPerPage: limit,
        page: 0, // the retrieved page is zero-indexed
    };
    // how many hits we got, what page we are on, how many pages of results are there in total
    // there are other pieces of information algolia returns, such as nbHits, hitsPerPage,
    // every product return has _highlightResult appended to it, and we can get many more
    // pieces of info if we further configure the index settings
    const { hits, page, nbPages } = await index.search(query, searchParams);

    let nextSearchParams;
    if (page + 1 >= nbPages) {
        // if we are on the last page
        nextSearchParams = null;
    }
    else {
        // retrieve the next page
        nextSearchParams = {
            hitsPerPage: searchParams.hitsPerPage,
            page: page + 1,
        };
    }

    // need to return the things below since that is what the graphql type SearchResultsPage requires
    // nextToken = null on the last page (there are no more results), otherwise it's a base64 token
    return {
        results: hits,
        nextToken: generateNextToken(nextSearchParams),
    };
}

function parseNextToken(nextToken) {
    /* Do the reverse of generateNextToken - i.e. extract the search params
    based on the nextToken the graphql operation provided */
    if (!nextToken) {
        return undefined;
    }
    // otherwise do the reverse of generateNextToken function
    const token = Buffer.from(nextToken, 'base64').toString(); // gets the JSON of the payload
    const searchParams = JSON.parse(token); // gets the searchParams but with the random property
    delete searchParams.random; // remove the random property

    return searchParams; // these are the search params
}

function generateNextToken(nextSearchParams) {
    /* Generate a base64 string that encodes the next search parameters.
    This encoding is primarly (and pretty much only) used for pagination */
    if (!nextSearchParams) { // if it is null
        return null;
    }
    const payload = {
        ...nextSearchParams,
        random: uuid.v4(), // append a random string, just so that
        // the token is not the same for every user
    };
    const token = JSON.stringify(payload);
    return Buffer.from(token).toString('base64');
}