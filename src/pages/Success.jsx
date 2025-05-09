"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Success = () => {
  const [text, setText] = useState("Processing Payment...");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      fetch("/api/clear-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setText("Payment Successfully");
          } else {
            setText("Payment Done, but cart not cleared.");
          }
        })
        .catch((err) => {
          console.error("❌ Error clearing cart:", err);
          setText("Payment Done, but error clearing cart.");
        });
    } else {
      setText("No session ID found.");
    }
  }, []);

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center'>{text}</p>
      <Link href="/" className="border border-green-900 btn-primary hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link>
    </div>
  );
};

export default Success;
