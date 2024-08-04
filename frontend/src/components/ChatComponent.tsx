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
  selectedGames: string[];
}

const ProductList = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
);

export default function ProductListComponent({ budget, selectedGames }: ProductListComponentProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fpsResults, setFpsResults] = useState<Record<string, { fps: number; image: string }>>({});
  const prevBudgetRef = useRef<number>();

  const games = [
    { name: 'Apex Legends', image: '/01_Apex_Legends_140x175@2x.avif' },
    { name: 'Cyberpunk 2077', image: '/cover_cyberpunk_140x175@2x.avif' },
    { name: 'Valorant', image: '/v_140x175@2x.jpg' },
    { name: 'The Finals', image: '/tf_140x175@2x.jpg' },
    { name: 'Red Dead Redemption 2', image: '/RDR2_140x175@2x.avif' },
    { name: 'GTA V', image: '/11_GTA_V_140x175@2x.avif' },
    { name: 'Fortnite', image: '/09_Fortnite_140x175@2x.avif' },
    { name: 'Counter Strike 2', image: '/BR_CS2_Icon_2_140x175@2x.avif' },
    { name: 'COD Warzone', image: '/cover_cod_warzone_140x175@2x.avif' },
    { name: 'League of Legends', image: '/14_League_Of_Legends_140x175@2x.avif' },
    { name: 'Forza Horizon 5', image: '/fh5_140x175@2x.jpg' },
    { name: 'Программирование / 3D дизайн', image: '/programming_3d_design.jpg' },
  ];
  
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
      const response = await axios.post('http://localhost:5000/api/generate', { prompt: 'Build a PC', budget }, {
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

  const checkFPS = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/checkFPS', {
        games: selectedGames,
        components: products.map(product => product.title)
      });
      const fpsData = response.data;
      const fpsResultsWithImages = Object.keys(fpsData).reduce((acc, game) => {
        const gameData = games.find(g => g.name === game);
        if (gameData) {
          acc[game] = { fps: fpsData[game], image: gameData.image };
        }
        return acc;
      }, {} as Record<string, { fps: number; image: string }>);

      setFpsResults(fpsResultsWithImages);
    } catch (error) {
      console.error('Error checking FPS:', error);
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
      <button
        className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        onClick={checkFPS}
      >
        Чекнуть фыпысы в игорах
      </button>
      {Object.keys(fpsResults).length > 0 && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Результаты FPS:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(fpsResults).map(([game, { fps, image }]) => (
              <div key={game} className="flex items-center bg-gray-700 p-4 rounded-lg">
                <img src={image} alt={game} className="w-16 h-16 rounded-lg mr-4" />
                <div>
                  <p className="text-xl font-bold text-white">{game}</p>
                  <p className="text-gray-200">{fps} FPS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
