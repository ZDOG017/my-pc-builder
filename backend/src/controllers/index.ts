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

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const modelId = "gpt-4";
    const systemPrompt = `Вы - ассистент, который помогает выбрать компоненты для сборки ПК на основе данных из базы данных. 
    Пожалуйста, указывайте компоненты только с их названиями, без типа, цены и дополнительных описаний. Пишите только названия компонентов, каждое на отдельной строке. 
    Пример формата ответа:
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

    // После получения ответа, запускаем парсинг выбранных компонентов
    const components = responseText.split('\n').map(line => line.trim()).filter(line => line);

    const fetchedProducts = [];
    for (const component of components) {
      try {
        const product = await parseComponentByName(component);
        if (product) {
          fetchedProducts.push(product);
        }
      } catch (err) {
        console.error('Error fetching product:', component, err);
      }
    }

    res.send({ response: responseText, products: fetchedProducts });

  } catch (err) {
    console.error('Error in generateResponse:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};
