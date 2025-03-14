"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import SummaryApi from "@/common/SummaryApi";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = Object.values(data).every((el) => el.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({ ...SummaryApi.login, data });

      if (response.data.success) {
        toast.success(response.data.message);

        
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)


        setData({ email: "", password: "" });
        router.push("/"); // Redirect after successful login
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
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-4">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="text-sm font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered"
              required
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="form-control mt-2 relative">
            <label className="label">
              <span className="text-sm font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </span>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <Link href={"/forgotPassword"} className="text-sm text-primary hover:underline cursor-pointer">Forgot Password?</Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={!isValid}
          >
            Login
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

export default Login;
