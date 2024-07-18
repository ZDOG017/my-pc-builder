'use client'
import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "Как работает ваш сервис?",
      answer: "Наш сервис использует искусственный интеллект для анализа ваших потребностей и бюджета, а затем подбирает оптимальную конфигурацию ПК, сравнивая цены на Kaspi.kz"
    },
    {
      question: "Могу ли я доверять рекомендациям ИИ?",
      answer: "Да, наш ИИ обучен на основе огромного количества данных о комплектующих и их совместимости. Мы постоянно обновляем его для обеспечения актуальности рекомендаций."
    },
    {
      question: "Как вы гарантируете лучшие цены?",
      answer: "Мы анализируем предложения на Kaspi.kz в режиме реального времени, чтобы найти наиболее выгодные предложения для каждого компонента."
    },
    {
      question: "Что делать, если я не согласен с рекомендацией?",
      answer: "Вы всегда можете внести изменения в предложенную конфигурацию. Наш сервис предоставляет рекомендации, но окончательное решение всегда за вами."
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-400">Часто задаваемые вопросы</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <button
                className="flex justify-between items-center w-full text-left p-4 bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <span className={`transform transition-transform duration-300 text-green-400 ${activeIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {activeIndex === index && (
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
