// ProductListComponent.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import LottieLoader from '../components/Loader';
import ProductCard from './ProductCard';

interface Product {
  image: string | undefined;
  name: string;
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

  useEffect(() => {
    fetchProducts();
  }, [budget]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://https://my-pc-builder-production.up.railway.app/api/generate', { budget }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const productsArray = Object.values(response.data.products) as Product[];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

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
        {/* <button className="mt-4 w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out">
          Оформить заказ
        </button> */}
      </div>
    </div>
  );
}