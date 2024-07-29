import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LottieLoader from '../components/Loader';
import ProductCard from './ProductCard';

interface Product {
  image: string;
  title: string;
  price: number;
  url: string;
}

interface ProductListComponentProps {
  budget: number;
}

const ProductList = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
);

export default function ProductListComponent({ budget }: ProductListComponentProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const prevBudgetRef = useRef<number>();

  useEffect(() => {
    if (prevBudgetRef.current !== budget) {
      fetchProducts();
      prevBudgetRef.current = budget;
    }
  }, [budget]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products with budget:', budget);
      const response = await axios.post('https://quryltai-backend-675bed208f50.herokuapp.com/api/generate', { prompt: 'Build a PC', budget }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Received response:', response.data);
      
      if (response.data.products && typeof response.data.products === 'object') {
        const productsArray = Object.values(response.data.products) as Product[];
        console.log('Parsed products:', productsArray);
        setProducts(productsArray);
        setTotalPrice(response.data.totalPrice);
      } else {
        console.error('Invalid products data in response:', response.data);
        setProducts([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 shadow-2xl rounded-lg overflow-hidden">
      {loading && <LottieLoader />}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6">
        <h2 className="text-3xl font-bold text-white">Каталог компонентов</h2>
        <p className="text-gray-200 mt-2">Выберите компоненты для вашего ПК</p>
      </div>
      <div className="p-6">
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-center text-gray-400">Нет доступных компонентов. Попробуйте изменить параметры поиска.</p>
        )}
      </div>
      <div className="bg-gray-800 p-6 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-green-400">Итоговая стоимость:</h3>
          <p className="text-2xl font-bold text-white">{totalPrice} тг</p>
        </div>
      </div>
    </div>
  );
}