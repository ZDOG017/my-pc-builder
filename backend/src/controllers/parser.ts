import puppeteer from 'puppeteer';
import stringSimilarity from 'string-similarity';

interface Product {
  name: string;
  price: number;
  url: string;
  image: string;
  rating: string;
  reviewCount: number;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseComponentFromKaspiKz(searchTerm: string): Promise<Product[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await delay(Math.floor(Math.random() * 3000) + 1000); // Delay from 1 to 4 seconds

    const encodedName = encodeURIComponent(searchTerm);
    const url = `https://kaspi.kz/shop/search/?text=${encodedName}&hint_chips_click=false`;
    console.log(`Fetching Kaspi.kz search URL: ${url}`);

    await page.goto(url, { waitUntil: ['networkidle2','domcontentloaded','load','networkidle0'] });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.item-card');
      const products: Product[] = [];

      productElements.forEach((element, index) => {
        if (index >= 3) return; // Limit to 3 matching products
        

        const nameElement = element.querySelector('.item-card__name-link');
        const priceElement = element.querySelector('.item-card__prices-price');
        const imageElement = element.querySelector('.item-card__image') as HTMLImageElement;
        const ratingElement = element.querySelector('.rating');
        const reviewCountElement = element.querySelector('.item-card__rating a');

        if (nameElement && priceElement && imageElement) {
          const name = nameElement.textContent?.trim() || '';
          const priceText = priceElement.textContent?.trim().replace(/[^\d]/g, '') || '0';
          const price = parseFloat(priceText) || 0;
          const url = 'https://kaspi.kz' + (nameElement.getAttribute('href') || '');
          const image = imageElement.src || '';

          const ratingClass = ratingElement?.getAttribute('class') || '';
          const ratingMatch = ratingClass.match(/\*(\d+)/);
          const rating = ratingMatch ? (parseInt(ratingMatch[1]) / 10).toFixed(1) : '0.0';

          const reviewCountText = reviewCountElement?.textContent?.trim() || '';
          const reviewCountMatch = reviewCountText.match(/\d+/);
          const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[0]) : 0;

          products.push({
            name,
            price,
            url,
            image,
            rating,
            reviewCount
          });
        }
      });

      return products;
    });

    return products;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching URL for ${searchTerm} from Kaspi.kz. Error: ${error.message}`);
    }
    return [];
  } finally {
    await browser.close();
  }
}

function findBestMatch(searchTerm: string, products: Product[]): Product | null {
  if (products.length === 0) return null;

  const productNames = products.map(product => product.name);
  const { bestMatch } = stringSimilarity.findBestMatch(searchTerm, productNames);

  const bestMatchIndex = productNames.indexOf(bestMatch.target);
  return products[bestMatchIndex] || null;
}

// Export the fetchProduct function and ensure no redeclaration of parseComponentFromKaspiKz
export async function fetchProduct(searchTerm: string) {
  const products = await parseComponentFromKaspiKz(searchTerm);
  const bestMatch = findBestMatch(searchTerm, products);
  return bestMatch;
}

export { parseComponentFromKaspiKz };
