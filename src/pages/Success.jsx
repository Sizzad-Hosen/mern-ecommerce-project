"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Success = () => {
  const [text, setText] = useState("Payment");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get("text");
    if (value) setText(value);
  }, []);

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center'>{text} Successfully</p>
      <Link href="/" className="border border-green-900 btn-primary hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link>
    </div>
  );
};

export default Success;
