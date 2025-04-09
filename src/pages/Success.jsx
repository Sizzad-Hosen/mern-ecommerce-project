"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Success = () => {
  const router = useRouter();

  // Read query or state using the router
  // In Next.js, you can pass data via URL search params or cookies, etc.
  // Example: /success?text=Payment
  const searchParams = new URLSearchParams(window.location.search);
  const text = searchParams.get("text") || "Payment";

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center'>{text} Successfully</p>
      <Link href="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link>
    </div>
  );
};

export default Success;
