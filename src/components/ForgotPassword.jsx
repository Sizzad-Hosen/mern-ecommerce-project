"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import SummaryApi from "@/common/SummaryApi";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const isValid = email.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword, // Ensure this API exists in your SummaryApi
        data: { email },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        router.push(`/verificationOtp?email=${email}`);


        setEmail("");
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
        <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
        

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="text-sm font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered"
              required
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="btn btn-primary w-full text-2xl mt-4"
            disabled={!isValid}
          >
            Sent Opt
          </button>
        </form>

        {/* Register Redirect */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
