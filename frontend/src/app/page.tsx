'use client'
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainContent from '../components/MainContent';
import Features from '../components/Features';
import Description from '../components/Description';
import FAQ from '../components/FAQ';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <MainContent />
        <div className="animate-on-scroll">
          <Features />
        </div>
        <div className="animate-on-scroll">
          <Description />
        </div>
        <div className="animate-on-scroll">
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}