export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 text-green-400">PC Builder AI</h3>
            <p className="text-sm text-gray-300">Создавайте идеальные ПК с помощью искусственного интеллекта</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 text-green-400">Контакты</h3>
            <p className="text-sm text-gray-300">Email: support@pcbuilderai.com</p>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2 text-green-400">Следите за нами</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-300">Facebook</a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-300">Twitter</a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-300">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 PC Builder AI. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
