import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import axios from "axios";
import "dotenv/config";
import { middyfy } from "@libs/lambda";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

import schema from "./schema";

const formatPrompt = async ({
  productName,
  productType,
  description,
  storeName,
  productLink,
}) => {
  return `Generate a new social media post, keeping character limits and effective SEO in mind,
  promoting ${storeName} new product for sale using these details: type:${productType} 
  name: ${productName} description: ${description} link: ${productLink}.`;
};

const requestPromo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    if (!openai) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "openAi not available" }),
      };
    }

    const requestBody = event.body;
    const prompt = await formatPrompt(requestBody);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt not provided" }),
      };
    }

    try {
      const response = openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        n: 3,
      });

      const choices = (await response).choices;

      return {
        statusCode: 200,
        body: JSON.stringify(choices),
      };
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export const main = middyfy(requestPromo);
