import Link from 'next/link';
import { useEffect, useRef } from 'react';
import '../app/globals.css'; // Подключите CSS-файл с анимацией

export default function MainContent() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fadeIn');
    }
  }, []);

  return (
    <section id="main-content" className="relative bg-gray-900 text-white h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/pc.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      <div className="container relative mx-auto px-4 text-center">
        <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold mb-6 text-green-400 drop-shadow-lg animate-fadeIn">Создайте идеальный ПК с помощью ИИ</h1>
        <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto text-gray-300 drop-shadow-lg">Наш умный помощник подберет оптимальную конфигурацию, учитывая ваши потребности и бюджет</p>
        <Link className="bg-green-500 text-white font-bold py-3 px-6 md:px-8 rounded-full text-base md:text-lg hover:bg-green-600 transition duration-300 shadow-lg" href="/service">
            Собрать свой ПК сейчас
        </Link>
      </div>
    </section>
  );
}
