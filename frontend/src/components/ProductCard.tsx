// ProductCard.tsx
import React from 'react';

interface Product {
  image: string | undefined;
  title: string;
  price: number;
  url: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col h-full">
      <div className="h-64 bg-gray-700 flex items-center justify-center p-4">
        {product.image ? (
          <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
        ) : (
          <span className="text-gray-500">Изображение недоступно</span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-gray-300 mb-4">Цена: {product.price} тг</p>
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ease-in-out mt-auto"
        >
          Подробнее
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
 