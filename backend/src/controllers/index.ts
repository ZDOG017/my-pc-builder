// index.ts

import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import { parseComponentByName } from './parser';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatCompletionMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

// Add this interface to match the Product type from parser.ts
interface Product {
  name: string;
  price: number;
  url: string;
  image: string;
}

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const modelId = "gpt-4o";
    const systemPrompt = `You are an assistant helping to build PCs with a focus on speed, affordability, and reliability. 
    Suggest components that are commonly available and offer good value for money. Also use components that are most popular in June 2024.
    Prefer newer, widely available models over older or niche products. 
    IMPORTANT: STRICTLY list only the component names, each on a separate line, without additional descriptions. DO NOT WRITE ANYTHING EXCEPT COMPONENT NAMES
    Example of the response:
    AMD Ryzen 5 3600
    Asus PRIME B450M-K
    Gigabyte GeForce GTX 1660 SUPER OC`;

    const currentMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ];

    console.log('Sending messages to OpenAI:', currentMessages);

    const result = await openai.chat.completions.create({
      model: modelId,
      messages: currentMessages,
    });

    const responseText = result.choices[0].message?.content || '';
    console.log('Received response from OpenAI: \n', responseText);

    // Split the response into individual component names
    const components = responseText.split('\n').map(line => line.trim()).filter(line => line);

    // Use Promise.all to parse all components concurrently
    const fetchedProducts = await Promise.all(
      components.map(async (component) => {
        try {
          return await parseComponentByName(component);
        } catch (err) {
          console.error('Error fetching product:', component, err);
          return null;
        }
      })
    );

    // Filter out any null results (components that weren't found)
    const availableProducts = fetchedProducts.filter((product): product is Product => product !== null);

    // Send both the original response and the available products to the frontend
    res.send({ response: responseText, products: availableProducts });

  } catch (err) {
    console.error('Error in generateResponse:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};