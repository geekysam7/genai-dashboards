"use server";

import OpenAI from "openai";
import { Client } from "@elastic/elasticsearch";
import { IDasbhboard } from "@/types/app";

const openai = new OpenAI({
  apiKey: "sk-3EpwvEK", // fake
  dangerouslyAllowBrowser: true, // can be handled on server side where we'll not be exposing api key
});

const client = new Client({
  node: "https://545d8b1061514f2ebc6b554b74eef7b9.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: "TTUtNjRZd0Jxam91REZCMExrUnU6VHFFendtSE5UNWFDNklzV1hTbGlBUQ==", // Free tier
  },
});

const generatePrompt = (userQuery: string) => {
  return `
    consider my types are defined as:
    TAppInfo = {
      app: string;
      category: string;
      rating: number;
      reviews: number;
      size: string;
      installs: string;
      type: "FREE" | "PAID";
      price: number;
      genres: string[];
      lastUpdated: string;
      currentVersion: string;
      androidVersion: string;
      contentRating: {
        category: "EVERYONE" | "MATURE" | "TEEN" | "ADULTS" | "UNRATED";
        lowerLimit: number;
        assertion: string;
      };
      translatedReviews: {
        sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
        review: string;
      }[];
      appSentiment: {
        [K in TSentiments]: number;
      };
    } 
    based on this types, we've indexed the data in elasticsearch. 
    Now please resolve the following query with only code and no other extra text for an elasticsearch search query payload:
    "${userQuery}"
  `;
};

const fetchQuery = async (userQuery: string) => {
  const prompt = generatePrompt(userQuery);
  try {
    let query = {
      query: {
        range: {
          reviews: {
            gt: 100000,
          },
        },
      },
      size: 0,
    };
    // it will fail, so putting in try catch
    // hitting api for data flow.
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      const content = completion.choices[0].message.content;
      if (content === null) return;
      query = JSON.parse(content);
    } catch (error) {
      console.log(error);
    }
    const searchResult = await client.search({
      index: "search-category",
      query: {
        range: {
          reviews: {
            gt: 100000,
          },
        },
      },
      size: 0,
    });
    return searchResult;
  } catch (error) {
    return {};
  }
};

const search = async (searchString: string) => {
  try {
    const searchResult = await client.search({
      index: "search-category",
      ...(searchString
        ? {
            query: {
              query_string: {
                default_field: "app",
                query: searchString,
              },
            },
          }
        : {}),
      size: 50,
    });
    return searchResult.hits.hits.map((data) => data._source) as IDasbhboard[];
  } catch (error) {
    return [];
  }
};

export { search };
export default fetchQuery;
