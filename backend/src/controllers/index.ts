// backend/src/controllers/index.ts
import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversationContext: [string, string][] = [];

interface ChatCompletionMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

const currentMessages: ChatCompletionMessageParam[] = [];

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const modelId = "gpt-4";
    const promptText = `${prompt}\n\nResponse:`;

    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", content: inputText });
      currentMessages.push({ role: "assistant", content: responseText });
    }

    currentMessages.push({ role: "user", content: promptText });

    const result = await openai.chat.completions.create({
      model: modelId,
      messages: currentMessages,
    });

    const responseText = result.choices[0].message?.content || '';
    conversationContext.push([promptText, responseText]);
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
