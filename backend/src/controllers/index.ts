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

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const modelId = "gpt-4o";
    const systemPrompt = `Вы - ассистент, который дает краткие и структурированные ответы. 
    Всегда отвечайте в формате списка, где каждый пункт начинается с номера и двоеточия. 
    Не используйте вводные фразы или дополнительные объяснения. 
    Пример формата ответа:
    1. Пункт: значение
    2. Пункт: значение`;

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

    res.send({ response: responseText });
  } catch (err) {
    console.error('Error in generateResponse:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};