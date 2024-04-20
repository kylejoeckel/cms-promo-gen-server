import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import axios from "axios";
import { middyfy } from "@libs/lambda";
import "dotenv/config";
import schema from "./schema";

const FACEBOOK_URL = "https://graph.facebook.com/v18.0/me/";

const postToFacebook: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!pageAccessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Page access token not provided" }),
      };
    }

    const requestBody = event.body;
    const message = requestBody.promoText;
    const imageUrl = requestBody.promoImage;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message not provided" }),
      };
    }

    if (imageUrl) {
      // Upload the image to Facebook
      await axios.post(
        `${FACEBOOK_URL}photos`,
        { url: imageUrl, message },
        {
          headers: {
            Authorization: `Bearer ${pageAccessToken}`,
          },
        }
      );
    } else {
      // Create a simple Facebook post
      await axios.post(
        `${FACEBOOK_URL}feed`,
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${pageAccessToken}`,
          },
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Post successfully created",
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error ${error}` }),
    };
  }
};

export const main = middyfy(postToFacebook);
