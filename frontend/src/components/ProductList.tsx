interface Product {
  name: string;
  price: number;
  url: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="p-4 bg-gray-800 shadow-lg rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-400">{product.name}</h3>
      <p className="text-gray-300">Цена: {product.price} тг</p>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:underline transition duration-300 ease-in-out"
      >
        Перейти к продукту
      </a>
    </div>
  );
};

export default ProductCard;
