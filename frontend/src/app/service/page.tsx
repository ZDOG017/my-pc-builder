'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatComponent from '../../components/ChatComponent';

export default function ServicePage() {
  const [formData, setFormData] = useState({
    purpose: '',
    budget: 300000, // начальное значение бюджета
  });
  const [showChat, setShowChat] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'budget' ? parseInt(value) : value // конвертация бюджета в число
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && formData.purpose) {
      setCurrentStep(prevStep => prevStep + 1);
    } else if (currentStep === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const prompt = generatePrompt(formData);
    setInitialPrompt(prompt);
    setShowChat(true);
  };

  function generatePrompt(data: typeof formData) {
    return `Подбери оптимальную конфигурацию компьютера со следующими параметрами:
  - Цель использования: ${data.purpose}
  - Бюджет: ${data.budget} тенге
  
  Пожалуйста, предоставь список компонентов с примерными ценами, учитывая совместимость всех частей и оптимальное соотношение цена/качество.`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!showChat ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center text-green-400">Подбор оптимальной конфигурации ПК</h1>
            <div className="mb-8 text-center">
              <span className="text-lg font-semibold text-green-400">Шаг {currentStep} из {totalSteps}</span>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div style={{ width: `${(currentStep / totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
              </div>
            </div>
            <form onSubmit={handleNextStep} className="bg-gray-800 shadow-lg rounded-lg px-4 md:px-8 pt-6 pb-8 mb-4">
              {currentStep === 1 && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-lg font-bold mb-2" htmlFor="purpose">
                    Для каких целей вам нужен компьютер?
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-700"
                    required
                  >
                    <option value="">Выберите цель</option>
                    <option value="gaming">Игры</option>
                    <option value="work">Работа</option>
                    <option value="multimedia">Мультимедиа</option>
                    <option value="programming">Программирование</option>
                  </select>
                </div>
              )}
              {currentStep === 2 && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-lg font-bold mb-2" htmlFor="budget">
                    Какой у вас бюджет? (в тенге)
                  </label>
                  <input
                    type="range"
                    id="budget"
                    name="budget"
                    min="300000"
                    max="1000000"
                    step="100000"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center mt-2 text-lg font-semibold text-green-400">{formData.budget} тг</div>
                </div>
              )}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {currentStep < totalSteps ? 'Далее' : 'Подобрать конфигурацию'}
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
