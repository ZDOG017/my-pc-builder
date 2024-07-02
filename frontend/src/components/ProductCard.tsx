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
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">Цена: {product.price} тг</p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Перейти к продукту
        </a>
      </div>
    );
  };
  
  export default ProductCard;
  