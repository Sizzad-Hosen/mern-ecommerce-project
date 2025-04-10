"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'  

// import { valideURLConvert } from '../utils/valideURLConvert'

import CategoryWiseProductDisplay from './CategoryWiseProductDisplay '
import Axios from '@/utilis/Axios'
import SummaryApi from '@/common/SummaryApi'


const Home = () => {

  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const router = useRouter();  

  // Fetch categories
  const fetchCategoryData = async () => {
    try {
      const response = await Axios(SummaryApi.getCategory);
      setCategoryData(response.data.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

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
    fetchCategoryData();
    fetchSubCategory();
  }, []);

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);
    const subcategory = subCategoryData.find(sub => 
      sub.category.some(c => c._id === id)
    );

    if (subcategory) {
      const url = `/products/${cat.replace(/\s+/g, "-")}-${id}/${subcategory.name.replace(/\s+/g, "-")}-${subcategory._id}`;
      router.push(url); 
      console.log(url);
    }
  };

  return (
    <section className='bg-white  max-w-7xl mx-auto'>
      <div className=''>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded  && "animate-pulse my-2"`}>
          <img src={"https://i.postimg.cc/5N8bzYRt/banner.jpg"} className='w-full h-full hidden lg:block' alt='#' />
          <img src={"https://i.postimg.cc/5211S4hS/banner-mobile.jpg"} className='w-full h-full lg:hidden' alt='#' />
        </div>
      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {categoryData.length === 0 ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
              <div className='bg-blue-100 min-h-24 rounded'></div>
              <div className='bg-blue-100 h-8 rounded'></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div key={cat._id} className='w-full h-full cursor-pointer' onClick={() => handleRedirectProductListpage(cat._id, cat.name)}>
              <img src={cat.image} className='w-full h-full object-scale-down' alt={cat.name} />
            </div>
          ))
        )}
      </div>

      {/* Display category products */}
      {categoryData.map((c) => (
        <CategoryWiseProductDisplay key={c._id} id={c._id} name={c.name} />
      ))}
    </section>
  );
};

export default Home;
