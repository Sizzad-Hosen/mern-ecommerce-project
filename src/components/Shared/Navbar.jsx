"use client";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import fetchUserDetails from "@/utilis/fetchUserDetails";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { TypeAnimation } from "react-type-animation";


const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserDetails();
        if (userData?.data) {
          dispatch(setUser(userData.data));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

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
          />
          <span className="absolute left-24 p-5 top-1/2 transform -translate-y-1/2 text-gray-200">
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "paneer"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
                1000,
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow">
                <div className="card-body">
                  <span className="text-lg font-bold">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">
                      View cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end mr-3">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                <li>

                  <Link href={"/profile"}

                 className="justify-between">Profile

                 </Link>
                </li>
                <li>

                  <Link href={"/dashboard"}

                 className="justify-between">Dashboard

                 </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>My Orders</a>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
         
      </div>
    </div>
  );
};

export default Navbar;
