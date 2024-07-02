import axios from 'axios';
import cheerio from 'cheerio';

interface Product {
  name: string;
  price: number;
  url: string;
  image: string;
}

export const parseComponentByName = async (name: string): Promise<Product | null> => {
  try {
    const encodedName = encodeURIComponent(name);
    const url = `https://alfa.kz/q/${encodedName}`;
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url, { timeout: 5000 }); // Add timeout
    const $ = cheerio.load(response.data);

    const productElements = $('.col-12.col-sm-3.image-holder');
    
    for (let i = 0; i < productElements.length; i++) {
      const productElement = $(productElements[i]).next('.col-12.col-sm-9.body-holder');
      
      const productName = productElement.find('h2 a span[itemprop="name"]').text().trim();
      const priceText = productElement.find('.price-container meta[itemprop="price"]').attr('content');
      const price = parseFloat(priceText || '0');
      const productUrl = productElement.find('h2 a').attr('href');
      const image = $(productElements[i]).find('img').attr('src');

      if (productName && price && productUrl && image) {
        console.log(`Found item: ${productName}, Price: ${price}, URL: ${productUrl}, Image: ${image}`);
        return {
          name: productName,
          price,
          url: `https://alfa.kz${productUrl}`,
          image: image.startsWith('http') ? image : `https://alfa.kz${image}`
        };
      }
    }
    
    console.log(`No matching product found for: ${name}`);
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching URL for ${name}. Error: ${error.message}`);
    }
    return null;
  }
};