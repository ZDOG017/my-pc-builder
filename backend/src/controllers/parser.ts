import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

interface Product {
  name: string;
  price: number;
  url: string;
  image: string;
}

const generateSearchTerm = (name: string): string => {
  const words = name.split(' ');
  const searchWords = words.slice(0, 3);
  return searchWords.join(' ');
};

function isPartialMatch(searchTerm: string, productName: string): boolean {
  const cleanSearchTerm = searchTerm.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const cleanProductName = productName.toLowerCase().replace(/[^a-z0-9\s]/g, '');

  const searchWords = cleanSearchTerm.split(/\s+/);
  const productWords = cleanProductName.split(/\s+/);

  const ignoreWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'gb', 'tb', 'мб', 'гб', 'тб'];

  const isImportantWord = (word: string) => !ignoreWords.includes(word) && word.length > 1;

  const importantSearchWords = searchWords.filter(isImportantWord);

  const matchCount = importantSearchWords.filter(searchWord => 
    productWords.some(productWord => 
      productWord.includes(searchWord) || searchWord.includes(productWord)
    )
  ).length;

  const matchPercentage = (matchCount / importantSearchWords.length) * 100;

  return matchPercentage > 30;
}

const placeholderImage = 'https://via.placeholder.com/150?text=No+Image+Available';

export const parseComponentByName = async (name: string): Promise<Product[]> => {
  try {
    const encodedName = encodeURIComponent(name);
    const url = `https://alfa.kz/q/${encodedName}`;
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url, { timeout: 60000 }); // Increased timeout to 30 seconds
    const $ = cheerio.load(response.data);

    const productElements = $('.col-12.col-sm-3.image-holder');
    let product: Product | null = null;
    
    for (let i = 0; i < productElements.length; i++) {
      const element = productElements[i];
      const productElement = $(element).next('.col-12.col-sm-9.body-holder');
      
      const productName = productElement.find('h2 a span[itemprop="name"]').text().trim();
      const priceText = productElement.find('.price-container meta[itemprop="price"]').attr('content');
      const price = parseFloat(priceText || '0');
      const productUrl = productElement.find('h2 a').attr('href');
      const image = $(element).find('img').attr('src') || placeholderImage;

      if (productName && price && productUrl && image && isPartialMatch(name, productName)) {
        console.log(`Found item: ${productName}, Price: ${price}, URL: ${productUrl}, Image: ${image}`);
        product = {
          name: productName,
          price,
          url: productUrl,
          image: image.startsWith('http') ? image : `https://alfa.kz${image}`
        };
        break; // Exit the loop after finding the first matching product
      }
    }
    
    return product ? [product] : [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching URL for ${name}. Error: ${error.message}`);
    }
    return [];
  }
};

export const parseComponentFromShopKz = async (name: string): Promise<Product[]> => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    const searchTerm = generateSearchTerm(name);
    const encodedName = encodeURIComponent(searchTerm);
    const url = `https://shop.kz/search/?q=${encodedName}`;
    console.log(`Fetching Shop.kz search URL: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }); // Increased Puppeteer timeout

    await page.waitForSelector('.multisearch-page__product', { timeout: 60000 }); // Increased timeout for selector

    const product: Product | null = await page.evaluate((searchTerm, placeholderImage) => {
      const element = document.querySelector('.multisearch-page__product');
      if (element) {
        const productData = element.getAttribute('data-product');
        if (productData) {
          try {
            const parsedData = JSON.parse(productData);
            const productName = parsedData.name;
            const price = parseFloat(parsedData.price);
            const productUrl = `https://shop.kz${element.querySelector('.product-item-title a')?.getAttribute('href')}`;
            const image = element.querySelector('.img-centered img')?.getAttribute('src') || placeholderImage;

            return { name: productName, price, url: productUrl, image };
          } catch (parseError) {
            console.error('Error parsing product data:', parseError);
          }
        }
      }
      return null;
    }, searchTerm, placeholderImage);

    if (product && isPartialMatch(name, product.name)) {
      console.log(`Found product from Shop.kz search for ${name}:`, product);
      return [product];
    }

    console.log(`No matching products found from Shop.kz search for ${name}`);
    return [];
  } catch (error) {
    console.error(`Error fetching Shop.kz search results for ${name}:`, error);
    return [];
  } finally {
    await browser.close();
  }
};
