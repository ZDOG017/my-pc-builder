// Change the file name from ChatComponent.tsx to ProductListComponent.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import LottieLoader from '../components/Loader'; // make sure the path is correct

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
  <div className="mt-6">
    <h3 className="text-xl font-bold text-green-400">Список доступных компонентов:</h3>
    {products.length > 0 ? (
      products.map((product, index) => (
        <div key={index} className="p-4 my-4 border rounded-lg shadow-lg bg-gray-800 text-white">
          <h4 className="text-lg font-bold">{product.name}</h4>
          <p>Цена: {product.price > 0 ? `${product.price} тг` : 'Нет данных'}</p>
          {product.url ? (
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              Перейти к продукту
            </a>
          ) : (
            <p>Ссылка недоступна</p>
          )}
          <img src={product.image} alt={product.name} className="mt-2 max-w-xs rounded-lg shadow-md" />
        </div>
      ))
    ) : (
      <p>К сожалению, не удалось найти доступные компоненты. Попробуйте изменить запрос.</p>
    )}
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
      const response = await axios.post('http://localhost:5000/api/generate', { budget }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Received response:', response.data);

      // Transform products object into an array
      const productsArray = Object.values(response.data.products) as Product[];

      // Update products list
      if (productsArray.length > 0) {
        setProducts(productsArray);
        console.log('Updated products:', productsArray);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price of all products
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
      {loading && <LottieLoader />}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4">
        <h2 className="text-2xl font-bold">Список продуктов</h2>
      </div>
      <div className="p-6 bg-gray-900">
        <ProductList products={products} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <h3 className="text-xl font-bold text-green-400">Итоговая стоимость: {totalPrice} тг</h3>
      </div>
    </div>
  );
}
