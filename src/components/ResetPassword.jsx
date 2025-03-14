"use client";  

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";  
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";

const ResetPassword = () => {
  const searchParams = useSearchParams(); // ✅ Get query params
  const router = useRouter();  

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validValue = Object.values(data).every((el) => el);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email"); // ✅ Get email from query
    if (emailFromQuery) {
      setData((prev) => ({ ...prev, email: emailFromQuery })); // ✅ Set email in state
    }
  }, [searchParams]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be the same.");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data, // ✅ Send email along with password
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
        setData({ email: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Enter Your Password</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          
          {/* Email Display (Read-Only) */}
          <div className="grid gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 bg-gray-200 rounded outline-none"
              name="email"
              value={data.email}
              readOnly
            />
          </div>

          {/* New Password Input */}
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <div onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer">
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
              />
              <div onClick={() => setShowConfirmPassword((prev) => !prev)} className="cursor-pointer">
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValue}
            className={`${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
