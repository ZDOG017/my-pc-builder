'use client'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatComponentProps {
  initialPrompt: string;
}

export default function ChatComponent({ initialPrompt }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialResponse = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/generate', { prompt: initialPrompt });
        setMessages([{ text: response.data.response, isUser: false }]);
      } catch (error) {
        console.error('Error fetching initial response:', error);
        setMessages([{ text: 'Error generating response from server.', isUser: false }]);
      }
    };

    fetchInitialResponse();
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate', { prompt: inputMessage });
      const botMessage = { text: response.data.response, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to API:', error);
      const errorMessage = { text: 'Error generating response from server.', isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-2xl font-bold">Чат с ИИ-ассистентом</h2>
      </div>
      <div className="h-[calc(100vh-300px)] overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${message.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex flex-col md:flex-row">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mb-4 md:mb-0 md:mr-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите ваше сообщение..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}
