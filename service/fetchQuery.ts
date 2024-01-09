"use server";

import { Client as ElasticClient } from "@elastic/elasticsearch";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { IDasbhboard } from "@/types/app";
import { getIsValidQuery } from "@/helpers/general";

// init generativeAI instance.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_PRO_KEY as string);

const geminiProModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// init elastic instance
const elasticCLient = new ElasticClient({
  node: process.env.ELASTIC_CONNECT_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY as string, // Free tier
  },
});

const ELASTIC_INDEX = "search-category";

// sanitization steps can be added for user query.
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
    Now please resolve the following query with only code in single top level object containing only query payload inside 
    and no other extra text 
    and no info on code block type 
    for an elasticsearch search query payload:
    "${userQuery}"
  `;
};

const fetchQuery = async (
  userQuery: string
): Promise<{ response?: object; error?: string }> => {
  const prompt = generatePrompt(userQuery);
  try {
    // due to deployment region issues it can fail
    // hitting api for data flow.
    let elasticQuery: string;
    try {
      const result = await geminiProModel.generateContent(prompt);
      elasticQuery = result.response.text();
    } catch (error) {
      console.log(error);
      throw error;
    }
    console.log(elasticQuery);
    const { isValid, query } = getIsValidQuery(elasticQuery);
    if (!isValid) throw Error("Could not execute query");
    const searchResult = await elasticCLient.search({
      index: ELASTIC_INDEX,
      ...query,
      size: 0,
    });
    return { response: searchResult };
  } catch (error: any) {
    return { error: error?.message || "Failed to execute query", response: {} };
  }
};

const search = async (searchString: string) => {
  try {
    const searchResult = await elasticCLient.search({
      index: ELASTIC_INDEX,
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
