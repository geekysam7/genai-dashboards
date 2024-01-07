const { Client } = require("@elastic/elasticsearch");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const INSTANCE_DATA = {
  CloudID:
    "9c241a81aa4442f38ac0401a9483b705:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDU0NWQ4YjEwNjE1MTRmMmViYzZiNTU0Yjc0ZWVmN2I5JDZjZjYzY2ZlYWRmMDRiM2Y5NjJjYzE1MmQ0MWVlOWM4",
  Url: "https://545d8b1061514f2ebc6b554b74eef7b9.us-central1.gcp.cloud.es.io:443",
};

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
  node: "https://545d8b1061514f2ebc6b554b74eef7b9.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: "TTUtNjRZd0Jxam91REZCMExrUnU6VHFFendtSE5UNWFDNklzV1hTbGlBUQ==", // Free tier
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
