'use client'
import { useState } from 'react';

export default function Description() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { title: "Укажите предпочтения", icon: "📝" },
    { title: "ИИ анализирует", icon: "🧠" },
    { title: "Получите сборку", icon: "💻" },
    { title: "Выберите лучшие цены", icon: "💰" },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-400">Как это работает</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 cursor-pointer transition-all duration-300 bg-gray-800 rounded-lg ${
                  activeStep === index ? 'border-b-4 border-green-500' : ''
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gray-800 rounded-lg min-h-[100px]">
            <p className="text-gray-300 text-center">
              {getStepDescription(activeStep)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function getStepDescription(step: number) {
  switch (step) {
    case 0:
      return "Расскажите нам о своих потребностях и бюджете для идеального ПК.";
    case 1:
      return "Наш ИИ обрабатывает тысячи вариантов, чтобы найти лучшее решение для вас.";
    case 2:
      return "Получите оптимизированную конфигурацию ПК, соответствующую вашим требованиям.";
    case 3:
      return "Сравните цены на AliExpress и выберите наиболее выгодные предложения.";
    default:
      return "";
  }
}
