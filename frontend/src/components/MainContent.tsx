import Link from 'next/link';

export default function MainContent() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Создайте идеальный ПК с помощью ИИ</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Наш умный помощник подберет оптимальную конфигурацию, учитывая ваши потребности и бюджет</p>
        <Link href="/service" className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300">
          Собрать свой ПК сейчас
        </Link>
      </div>
    </section>
  );
}