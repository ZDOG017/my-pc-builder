'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatComponent from '../../components/ChatComponent';

export default function ServicePage() {
  const [formData, setFormData] = useState({
    purpose: '',
    budget: '',
    performance: '',
    storage: '',
    additionalNeeds: '',
  });
  const [showChat, setShowChat] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = generatePrompt(formData);
    setInitialPrompt(prompt);
    setShowChat(true);
  };

  function generatePrompt(data: typeof formData) {
    return `Подбери оптимальную конфигурацию компьютера со следующими параметрами:
  - Цель использования: ${data.purpose}
  - Бюджет: ${data.budget} тенге
  - Требуемый уровень производительности: ${data.performance}
  - Необходимый объем хранилища: ${data.storage} ГБ
  - Дополнительные требования: ${data.additionalNeeds}
  
  Пожалуйста, предоставь список компонентов с примерными ценами, учитывая совместимость всех частей и оптимальное соотношение цена/качество.`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!showChat ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Подбор оптимальной конфигурации ПК</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-4 md:px-8 pt-6 pb-8 mb-4">
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="purpose">
                  Для каких целей вам нужен компьютер?
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Выберите цель</option>
                  <option value="gaming">Игры</option>
                  <option value="work">Работа</option>
                  <option value="multimedia">Мультимедиа</option>
                  <option value="programming">Программирование</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="budget">
                  Какой у вас бюджет? (в тенге)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="performance">
                  Какой уровень производительности вам нужен?
                </label>
                <select
                  id="performance"
                  name="performance"
                  value={formData.performance}
                  onChange={handleInputChange}
                  className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Выберите уровень</option>
                  <option value="basic">Базовый</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="ultra">Ультра</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="storage">
                  Сколько места для хранения данных вам нужно? (в ГБ)
                </label>
                <input
                  type="number"
                  id="storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleInputChange}
                  className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="additionalNeeds">
                  Есть ли у вас дополнительные требования?
                </label>
                <textarea
                  id="additionalNeeds"
                  name="additionalNeeds"
                  value={formData.additionalNeeds}
                  onChange={handleInputChange}
                  className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Подобрать конфигурацию
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="px-4 md:px-8">
            <ChatComponent initialPrompt={initialPrompt} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
