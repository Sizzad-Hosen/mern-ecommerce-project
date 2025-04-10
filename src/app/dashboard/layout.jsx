"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle, FaProductHunt, FaThList, FaUpload, FaShoppingCart, FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector(state => state.user.user);

  const isAdmin = user?.role === "ADMIN";

  // Sidebar Menu Items
  const menuItems = [
    { name: "Profile", icon: <FaUserCircle />, path: "/dashboard/profile" },
    { name: "My Orders", icon: <FaShoppingCart />, path: "/dashboard/myOrders" },
    { name: "Save Address", icon: <FaShoppingCart />, path: "/dashboard/address" },
    { name: "More", icon: <FaCog />, path: "/dashboard/more" },
  ];

  if (isAdmin) {
    menuItems.splice(1, 0, // Insert admin-specific items after "Profile"
      { name: "Category", icon: <FaThList />, path: "/dashboard/category" },
      { name: "Subcategory", icon: <FaThList />, path: "/dashboard/subCategory" },
      { name: "Product", icon: <FaProductHunt />, path: "/dashboard/product" },
      { name: "Upload Product", icon: <FaUpload />, path: "/dashboard/uploadProduct" }
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar - Always Visible */}
      <div className="w-1/3 bg-gray-200 p-4">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`flex items-center primary cursor-pointer p-2 rounded-lg transition-colors ${
                pathname === item.path ? "primary text-black" : " hover:text-black"
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.icon} <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Main Content */}
      <div className="w-2/3 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
