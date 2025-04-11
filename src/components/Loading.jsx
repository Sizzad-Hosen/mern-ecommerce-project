// components/LoadingSpinner.jsx

"use client"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <img
          src="https://i.postimg.cc/vB5R0Fxj/eshop-logo.png"
          alt="Loading Logo"
          className="w-34 h-30 animate-bounce transition-all duration-300"
        />
        <p className="text-blue-600 font-medium text-lg animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
