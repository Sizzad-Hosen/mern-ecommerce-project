"use client";

import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Axios from "@/utilis/Axios";
import SummaryApi from "@/common/SummaryApi";
import AxiosToastError from "@/utilis/AxiosToastError";

const OtpVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from query parameters
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  if (!email) {
    toast.error("Invalid request. No email found.");
    return null; // Prevent rendering the form
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if a number is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.verificationOtp,
        data: {
          otp: enteredOtp,
          email,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        router.push(`/resetPassword?email=${email}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center">OTP Verification</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter the 6-digit OTP sent to your email: {email}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-2xl mt-4"
            disabled={otp.includes("")}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
