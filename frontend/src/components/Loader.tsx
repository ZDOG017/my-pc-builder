import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

const LottieLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const animation = lottie.loadAnimation({
        container: containerRef.current as Element, // Type assertion to avoid TypeScript error
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Animation - 1720628885119.json', // replace with the correct path to your JSON file
      });

      return () => animation.destroy();
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div ref={containerRef} className="w-1/2 h-1/2"></div>
    </div>
  );
};

export default LottieLoader;
