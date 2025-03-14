"use client"; // ✅ Ensure this is at the top

import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import fetchUserDetails from "@/utilis/fetchUserDetails";
import { useEffect } from "react";

export default function Home() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserDetails();
        console.log(userData)

        dispatch(setUser(userData.data));

      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(setUser());
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="bg-blue-600 text-white p-5">
      <h1 className="text-2xl font-bold">Redux in Next.js</h1>

      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 mt-2">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="bg-green-500 px-4 py-2 mt-2">
          Login
        </button>
      )}
    </div>
  );
}
