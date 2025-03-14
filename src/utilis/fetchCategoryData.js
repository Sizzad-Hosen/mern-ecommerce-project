"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux"; // useDispatch is a client-side hook
import toast from "react-hot-toast"; // assuming you're using react-hot-toast for error messages
import SummaryApi from "@/common/SummaryApi"; // Your API file
import Axios from "../utilis/Axios"; // Axios instance
import { setAllCategory, setLoadingCategory } from "@/redux/slices/productSlice"; // Your redux actions

const CategoryFetcher = () => {
  const dispatch = useDispatch(); // Get dispatch function from redux

  // This function fetches categories and dispatches actions
  const fetchCategories = async () => {
    dispatch(setLoadingCategory(true)); // Set loading to true

    try {
      const response = await Axios(SummaryApi.getCategory); // Make API call
      const data = response?.data; // Get data from response

      console.log("Fetched data:", data);

      // Check if the data is an array
      if (data && Array.isArray(data)) {
        console.log("Valid data:", data);
        dispatch(setAllCategory(data)); // Dispatch categories to Redux store
      } else {
        toast.error("No categories found or invalid response");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories"); // Handle error
    } finally {
      dispatch(setLoadingCategory(false)); // Set loading to false after API call
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when component mounts
  }, [dispatch]); // Make sure to re-fetch if dispatch changes

  return null; // No UI is needed in this component
};

export default CategoryFetcher;
