"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TypeAnimation } from "react-type-animation";

import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import fetchUserDetails from "@/utilis/fetchUserDetails";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { calculateTotalPrice } from "@/utilis/CalculatePrice";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user?.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [cartData, setCartData] = useState([]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      router.push(`/search?query=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm, router]);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await fetchUserDetails();
      if (userData?.data) dispatch(setUser(userData.data));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      const res = await Axios(SummaryApi.logout);
      if (res.data.success) {
        dispatch(clearUser());
        localStorage.clear();
        toast.success(res.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchCartData = async () => {
    try {
      if (user?._id) {
        const res = await Axios(SummaryApi.getToCart, {
          data: { userId: user._id },
        });
        setCartData(res.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user]);

  const totalPrice = calculateTotalPrice(cartData);

  return (
    <nav className="bg-gray-900 text-white shadow-md py-2 px-4 md:px-8 w-full">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left: Logo */}
<div className="flex items-center">
  <Link href="/">
    <Image
      width={150}
      height={50}
      alt="Eshop logo"
      src="https://i.postimg.cc/vB5R0Fxj/eshop-logo.png"
      className="cursor-pointer"
    />
  </Link>
</div>


       {/* Middle: Search Bar */}
<div className="hidden md:flex flex-1 justify-center px-4">
  <div className="relative bg-white w-full max-w-md rounded-md shadow-sm">
    <input
      type="text"
      placeholder="Search..."
      className="w-full py-2 pl-4 pr-10 text-black bg-white rounded-md"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <span className="absolute inset-y-0 right-50 flex items-center text-sm text-gray-600">
      <TypeAnimation
        sequence={["milk", 1000, "bread", 1000, "sugar", 1000]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </span>
  </div>
</div>


        {/* Right: Cart & Avatar/Login */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm bg-red-500 text-white w-auto px-2 indicator-item">
                  {cartData?.length || 0}
                </span>
              </div>
            </div>
            <div tabIndex={0} className="dropdown-content z-[1] mt-3 p-4 shadow bg-white text-black rounded-md w-60">
              <p className="text-gray-700 mb-2">
                Total: <span className="font-bold">${totalPrice}</span>
              </p>
              <Link href="/cart">
                <button className="w-full btn-primary text-white py-2 rounded-md">
                  Go to Cart
                </button>
              </Link>
            </div>
          </div>

          {/* Avatar or Login */}
         
            <Link href="/login">
              <button className="btn-primary text-white border-[#0059b3]  px-4 py-2 rounded-md">
                Login
              </button>
            </Link>
           <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={user?.profilePicture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white text-black border border-primary rounded-box z-10 mt-3 w-52 p-2 shadow">
                    
                    <li className="primary rounded-md">
                      <Link href="/dashboard" className="block p-2">Dashboard</Link>
                    </li>
                    <li className="primary rounded-md">
                      <Link href="/dashboard/myOrders" className="block p-2">My Orders</Link>
                    </li>
                    <li className="primary rounded-md">
                      <Link href="/settings" className="block p-2">Settings</Link>
                    </li>
                    <li className="primary rounded-md">
                      <button onClick={handleLogout} className="block p-2">Logout</button>
                    </li>
                  </ul>

            </div>
        
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 md:hidden">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
              className="w-full py-2 pl-4 pr-10 text-black bg-white rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
