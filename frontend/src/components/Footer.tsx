export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">PC Builder AI</h3>
              <p className="text-sm">Создавайте идеальные ПК с помощью искусственного интеллекта</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Контакты</h3>
              <p className="text-sm">Email: support@pcbuilderai.com</p>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-2">Следите за нами</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-300">Facebook</a>
                <a href="#" className="text-white hover:text-gray-300">Twitter</a>
                <a href="#" className="text-white hover:text-gray-300">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2024 PC Builder AI. Все права защищены.</p>
          </div>
        </div>
      </footer>
    );
  }