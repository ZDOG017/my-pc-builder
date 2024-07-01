import Link from 'next/link';

export default function CallToAction() {
  return (
    <Link href="/service" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full inline-block transition duration-300">
      Собрать свой ПК
    </Link>
  );
}