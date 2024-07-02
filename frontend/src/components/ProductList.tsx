import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  name: string;
  price: number;
  url: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: { products: Product[] }) => (
    <div className="mt-6">
      <h3 className="text-xl font-bold">Список предложенных компонентов:</h3>
      {products.map((product, index) => (
        <div key={index} className="p-4 my-4 border rounded-lg shadow-sm bg-gray-100 text-gray-900">
          <h4 className="text-lg font-bold">{product.name}</h4>
          <p>Цена: {product.price} тг</p>
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Перейти к продукту
          </a>
        </div>
      ))}
    </div>
  );  

export default ProductList;
