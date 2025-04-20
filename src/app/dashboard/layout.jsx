"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaProductHunt,
  FaThList,
  FaUpload,
  FaShoppingCart,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === "ADMIN";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar Menu Items
  const menuItems = [
    { name: "Profile", icon: <FaUserCircle />, path: "/dashboard/profile" },
    { name: "My Orders", icon: <FaShoppingCart />, path: "/dashboard/myOrders" },
    { name: "Save Address", icon: <FaShoppingCart />, path: "/dashboard/address" },
    { name: "More", icon: <FaCog />, path: "/" },
  ];

  if (isAdmin) {
    menuItems.splice(1, 0,
      { name: "Category", icon: <FaThList />, path: "/dashboard/category" },
      { name: "Subcategory", icon: <FaThList />, path: "/dashboard/subCategory" },
      { name: "Product", icon: <FaProductHunt />, path: "/dashboard/product" },
      { name: "Upload Product", icon: <FaUpload />, path: "/dashboard/uploadProduct" }
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Topbar - only on small screens */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-200">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-200 w-full md:w-1/4 p-4 absolute md:static z-20 transition-all duration-300
        ${sidebarOpen ? "left-0 top-14" : "left-[-100%]"} md:left-0 md:top-0`}
      >
        <h2 className="hidden md:block text-2xl font-semibold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${
                pathname === item.path ? "bg-[#0059b3] text-white" : "hover:bg-[#0059b3] hover:text-white"
              }`}
              onClick={() => {
                router.push(item.path);
                setSidebarOpen(false); // Close sidebar on mobile after navigation
              }}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
