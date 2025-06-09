import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 text-center px-4">
      <h1 className="text-6xl font-bold text-indigo-700 mb-4">500</h1>
      <p className="text-xl text-indigo-600 mb-6">
        Oops! Something went wrong on our end.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2 bg-gray-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
