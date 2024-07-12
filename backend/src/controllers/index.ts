import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import { parseComponentByName, parseComponentFromShopKz } from './parser';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatCompletionMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

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

    const modelId = "gpt-4";
    const systemPrompt = `You are an assistant helping to build PCs with a focus on speed, affordability, and reliability.
    Make a research on the prices of the components and components themselves in Kazakhstan.
    Look up the prices strictly in KZT.
    Suggest components that are commonly available and offer good value for money.
    Prefer newer, widely available models over older or niche products.
    IMPORTANT: Make a build that accurately or closely matches the desired budget of the user and DON'T comment on this. IMPORTANT: take the real-time prices of the components from shop.kz, alfa.kz, and forcecom.kz. 
    IMPORTANT: STRICTLY list only the component names in JSON format, with each component type as a key and the component name as the value. DO NOT WRITE ANYTHING EXCEPT THE JSON. The response must include exactly these components: CPU, GPU, Motherboard, RAM, PSU, CPU Cooler, FAN, PC case. Use components that are most popular in Kazakhstan's stores in June 2024. Before answering, check the prices today in Kazakhstan.
    Example of the response:
    {
      "CPU": "AMD Ryzen 5 3600",
      "GPU": "Gigabyte GeForce GTX 1660 SUPER OC",
      "Motherboard": "Asus PRIME B450M-K",
      "RAM": "Corsair Vengeance LPX 16GB",
      "PSU": "EVGA 600 W1",
      "CPU Cooler": "Cooler Master Hyper 212",
      "FAN": "Noctua NF-P12",
      "PC case": "NZXT H510"
    }`;

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

    let components;
    try {
      components = JSON.parse(responseText);
    } catch (error) {
      throw new Error('Failed to parse JSON response from OpenAI');
    }

    const requiredComponents = ["CPU", "GPU", "Motherboard", "RAM", "PSU", "CPU Cooler", "FAN", "PC case"];
    const componentKeys = Object.keys(components);

    if (!requiredComponents.every(comp => componentKeys.includes(comp))) {
      throw new Error('OpenAI response is missing one or more required components');
    }

    const fetchedProducts = await Promise.all(
      requiredComponents.map(async (key) => {
        const component = components[key];
        try {
          console.log(`Fetching products for component: ${component}`);
          const [alfaProducts, shopKzProducts] = await Promise.all([
            parseComponentByName(component),
            parseComponentFromShopKz(component)
          ]);
          console.log(`Alfa products for ${component}:`, alfaProducts.length);
          console.log(`Shop.kz products for ${component}:`, shopKzProducts.length);
          const allProducts = [...alfaProducts, ...shopKzProducts];
          console.log(`Total products found for ${component}:`, allProducts.length);
          const cheapestProduct = allProducts.sort((a, b) => a.price - b.price)[0] || null;
          console.log(`Cheapest product for ${component}:`, cheapestProduct);
          return { key, product: cheapestProduct };
        } catch (err) {
          console.error('Error fetching product:', component, err);
          return { key, product: null };
        }
      })
    );

    const availableProducts = fetchedProducts.filter(({ product }) => product !== null);
    console.log('Available products after filtering:', availableProducts.length);

    const productResponse = availableProducts.reduce((acc, { key, product }) => {
      if (product) {
        acc[key] = product;
      }
      return acc;
    }, {} as Record<string, Product>);

    res.send({ response: responseText, products: productResponse });

  } catch (err) {
    console.error('Error in generateResponse:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};
