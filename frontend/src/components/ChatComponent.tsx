'use client'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LottieLoader from '../components/Loader'; // make sure the path is correct

interface Message {
  text: string;
  isUser: boolean;
}

interface Product {
  image: string | undefined;
  name: string;
  price: number;
  url: string;
}

interface ChatComponentProps {
  initialPrompt: string;
}

const MessageContent = ({ content }: { content: string }) => {
  const formattedContent = content.split('\n').map((line, index) => {
    if (line.match(/^\d+\./)) {
      return <p key={index} className="mb-2">{line}</p>;
    }
    return <span key={index}>{line}<br/></span>;
  });

  return <div className="whitespace-pre-wrap">{formattedContent}</div>;
};

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

export default function ChatComponent({ initialPrompt }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isInitialPromptSent = useRef(false);

  useEffect(() => {
    if (!isInitialPromptSent.current) {
      handleSendMessage(null, initialPrompt);
      isInitialPromptSent.current = true;
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent | null, message: string = inputMessage) => {
    if (e) e.preventDefault();
    if (message.trim() === '') return;

    const userMessage = { text: message, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');

    try {
      setLoading(true);
      console.log('Sending message:', message);
      const response = await axios.post('https://my-pc-builder-production.up.railway.app/api/generate', { prompt: message }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Received response:', response.data);
      const botMessage = { text: response.data.response, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Update products list
      if (response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error sending message to API:', error);
      const errorMessage = { text: 'Error generating response from server.', isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
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
        <h2 className="text-2xl font-bold">Чат с ИИ-ассистентом</h2>
      </div>
      <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 bg-gray-900">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-4 rounded-lg ${message.isUser ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>
              <MessageContent content={message.text} />
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={(e) => handleSendMessage(e)} className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex flex-col md:flex-row">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mb-4 md:mb-0 md:mr-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white"
            placeholder="Введите ваше сообщение..."
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Отправить
          </button>
        </div>
      </form>
      <ProductList products={products} />
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <h3 className="text-xl font-bold text-green-400">Итоговая стоимость: {totalPrice} тг</h3>
      </div>
    </div>
  );
}
