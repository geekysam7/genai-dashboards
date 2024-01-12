const { Client } = require("@elastic/elasticsearch");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const INDEXING_KEY = {
  APP: "app",
  CATEGORY: "category",
  RATING: "rating",
  REVIEWS: "reviews",
  SIZE: "size",
  INSTALLS: "installs",
  TYPE: "type",
  PRICE: "price",
  GENRES: "genres",
  LAST_UPDATED: "lastUpdated",
  CURRENT_VER: "currentVersion",
  ANDROID_VER: "androidVersion",
  CONTENT_RATING: "contentRating",
};

const client = new Client({
  node: process.env.ELASTIC_CONNECT_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY, // Free tier
  },
});

const testConnection = async () => {
  // API Key should have cluster monitor rights.
  const resp = await client.info();
  console.log(resp);
};

const ingestData = async () => {
  const data = fs.readFileSync("../public/values.json", "utf8");
  const { values } = JSON.parse(data);
  const result = await client.helpers.bulk({
    datasource: values,
    pipeline: "ent-search-generic-ingestion",
    onDocument: (doc) => ({ index: { _index: "search-category" } }),
  });
  console.log(result);

  const searchResult = await client.search({
    index: "search-category",
    q: "This",
  });
  console.log(searchResult.hits.hits);
};

const fetchQueryData = async () => {
  const searchResult = await client.search({
    index: "search-category",
    query: {
      range: {
        reviews: {
          gt: 11150000,
        },
      },
    },
    size: 0,
  });
  console.log(searchResult);
};

// testConnection();
// ingestData(); // already ingested

fetchQueryData();
