import handler from "../libs/handler";
import { scrapeIdea } from "../scrapers/idea-scraper";

export const main = handler(async (event, context) => {
    await scrapeIdea();
});