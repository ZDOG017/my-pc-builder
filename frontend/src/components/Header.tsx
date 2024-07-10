'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const mainContentHeight = document.getElementById('main-content')?.clientHeight || 0;
    console.log('Scroll Top:', scrollTop, 'Main Content Height:', mainContentHeight);

    if (scrollTop > mainContentHeight / 2) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    console.log('Event listener added');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      console.log('Event listener removed');
    };
  }, []);

  return (
    <header className={`fixed w-full bg-gray-900 text-white shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-400">PC Builder AI</Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-gray-400 hover:text-green-500">Главная</Link></li>
              <li><Link href="/service" className="text-gray-400 hover:text-green-500">Собрать ПК</Link></li>
              <li><Link href="#faq" className="text-gray-400 hover:text-green-500">FAQ</Link></li>
            </ul>
          </nav>
          <button 
            className="block md:hidden text-gray-400 hover:text-green-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="space-y-2">
              <li><Link href="/" className="block text-gray-400 hover:text-green-500">Главная</Link></li>
              <li><Link href="/service" className="block text-gray-400 hover:text-green-500">Собрать ПК</Link></li>
              <li><Link href="#faq" className="block text-gray-400 hover:text-green-500">FAQ</Link></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
