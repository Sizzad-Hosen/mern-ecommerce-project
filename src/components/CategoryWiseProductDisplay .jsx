"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";


const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const router = useRouter();
  const [subCategoryData, setSubCategoryData] = useState([]);

// Fetch subcategories

const fetchSubCategory = async () => {
  try {
    const response = await Axios(SummaryApi.getSubCategory);
    if (response.data.success) {
      setSubCategoryData(response.data.data);
    }
  } catch (error) {
    console.log("Error fetching subcategories:", error);
  }
};

useEffect(() => {

  fetchSubCategory();
}, []);


  const loadingCardNumber = new Array(6).fill(null);

  // Fetch Products by Category
  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id },
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [id]);



  // Scroll Functions
  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };


  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const subcategory = subCategoryData.find((sub) =>
    sub.category.some((c) => c._id === id)
  );
  
  // 2. Safely extract subName and subId if subcategory exists
  const subName = subcategory ? subcategory.name : "";
  const subId = subcategory ? subcategory._id : "";

  
  return (
    <div>
      {/* Category Title and See All Link */}
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
       <Link 
  href={`/products/${name.replace(/\s+/g, "-")}-${id}/${subName.replace(/\s+/g, "-")}-${subId}`} 
  className="text-green-600 hover:text-green-400"
>
  See All
</Link>

      </div>

      {/* Product Display */}
      <div className="relative flex items-center">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading
            ? loadingCardNumber.map((_, index) => <CardLoading key={index} />)
            : data.map((p, index) => (
                <CardProduct key={p._id} data={p} />
              ))}
        </div>

        {/* Scroll Buttons (Only on Large Screens) */}
        <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
