'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showFooter = !pathname.includes('/uploadProduct');

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
