"use client";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">The page you are looking for does not exist.</p>
      <button
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={() => window.location.href = "/"}
      >
        Go Home
      </button>
    </div>
  );
}
