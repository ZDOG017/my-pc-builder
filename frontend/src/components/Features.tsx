import { LightningBoltIcon, ClockIcon, CurrencyDollarIcon, AdjustmentsIcon } from '@heroicons/react/outline';

export default function Features() {
  const features = [
    { 
      title: "ИИ-подбор", 
      description: "Используем передовые алгоритмы для оптимальной сборки", 
      icon: <LightningBoltIcon className="w-8 h-8 text-green-400" />
    },
    { 
      title: "Экономия времени", 
      description: "Мгновенный подбор компонентов без долгих поисков", 
      icon: <ClockIcon className="w-8 h-8 text-green-400" /> 
    },
    { 
      title: "Лучшие цены", 
      description: "Анализируем предложения на Kaspi.kz для вашей выгоды", 
      icon: <CurrencyDollarIcon className="w-8 h-8 text-green-400" /> 
    },
    { 
      title: "Персонализация", 
      description: "Учитываем ваши индивидуальные потребности и бюджет", 
      icon: <AdjustmentsIcon className="w-8 h-8 text-green-400" /> 
    },
  ];

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-400">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
