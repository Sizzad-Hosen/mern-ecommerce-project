"use client";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import fetchUserDetails from "@/utilis/fetchUserDetails";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { TypeAnimation } from "react-type-animation";
import { useRouter } from "next/navigation";
import { calculateTotalPrice } from "@/utilis/CalculatePrice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [cartData, setCartData] = useState([]);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      router.push(`/search?query=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm, router]);

  // Fetch User Details
  const fetchUser = useCallback(async () => {
    try {
      const userData = await fetchUserDetails();
      if (userData?.data) {
        dispatch(setUser(userData.data));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle Logout
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
        const response = await Axios(SummaryApi.getToCart, {
          data: { userId: user._id },
        });
        console.log(response.data);

        setCartData(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Fetch Cart Data
  useEffect(() => {
  
    fetchCartData();

  }, [user]);

  const totalPrice = calculateTotalPrice(cartData);
  console.log("Total Price:", totalPrice);

  return (
    <div className="navbar max-auto max-h-screen bg-green-400 shadow-sm px-4 md:px-8">
      {/* Left Section - Logo */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost bg-amber-800 text-xl">
          E-commerce
        </Link>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="hidden md:flex flex-1">
        <div className="relative w-100 h-10">
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full pl-4 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-24 p-5 top-1/2 transform -translate-y-1/2 text-gray-200">
            <TypeAnimation
              sequence={[
                "Search 'milk'", 1000,
                "Search 'bread'", 1000,
                "Search 'sugar'", 1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </span>
        </div>
      </div>

      {/* Right Section - Cart & Profile */}
      <div className="flex-none gap-6 mr-12">
        <Link href="/login">
          <button className="button bg-green-600 text-white rounded-xl p-2 mr-3">
            Login
          </button>
        </Link>
        
{/* Cart Dropdown */}
<div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn btn-circle">
    <div className="indicator">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <span className="badge badge-sm bg-red-500 text-white w-auto px-4 indicator-item">
        {cartData?.length || 0} Items
      </span>
    </div>
  </div>

  <div tabIndex={0} className="dropdown-content z-10 bg-white shadow-lg rounded-md w-60 p-3 mt-3">
    <p className="text-gray-700 text-sm">
      Total Price: 
      <span className="font-bold text-lg">
        ${totalPrice}
      </span>
    </p>
    <Link href="/cart">
      <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
        Go to Cart
      </button>
    </Link>
  </div>
</div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end mr-3">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src={user?.profilePicture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/settings">Settings</Link></li>
            <li><Link href="/orders">My Orders</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
