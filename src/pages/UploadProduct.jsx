"use client";
import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";

import { IoClose } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import AxiosToastError from '@/utilis/AxiosToastError';
import Axios from '@/utilis/Axios';
import SummaryApi from '@/common/SummaryApi';
import uploadImage from '@/utilis/uploadImage';
import Loading from '@/components/Loading';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
 

  const [allCategory, setAllCategory] = useState([]);
  const [allSubCategory, setSubAllCategory] = useState([]);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");

  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories from the backend
  const fetchCategoryData = async () => {
    try {
      const response = await Axios(SummaryApi.getCategory);
      setAllCategory(response.data.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // Fetch subcategories
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getSubCategory);
      if (response.data.success) {
        setSubAllCategory(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
    fetchSubCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((prev) => ({
      ...prev,
      image: [...prev.image, imageUrl],
    }));
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData({ ...data });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData({ ...data });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData({ ...data });
  };

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <section className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-12 py-4 bg-gray-50">
    <div className="p-4 bg-white shadow-md flex items-center justify-between rounded">
      <h2 className="text-lg font-semibold">Upload Product</h2>
    </div>
  
    <div className="p-4 max-w-screen-xl mx-auto w-full">
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="grid gap-1">
          <label htmlFor="name" className="font-medium">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter product name"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded"
          />
        </div>
  
        {/* Description */}
        <div className="grid gap-1">
          <label htmlFor="description" className="font-medium">Description</label>
          <textarea
            id="description"
            placeholder="Enter product description"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
            rows={3}
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded resize-none"
          />
        </div>
  
        {/* Image Upload */}
        <div>
          <p className="font-medium">Image</p>
          <label
            htmlFor="productImage"
            className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
          >
            <div className="text-center flex justify-center items-center flex-col">
              {imageLoading ? (
                <Loading />
              ) : (
                <>
                  <FaCloudUploadAlt size={35} />
                  <p className="text-sm">Upload Image</p>
                </>
              )}
            </div>
            <input
              type="file"
              id="productImage"
              className="hidden"
              accept="image/*"
              onChange={handleUploadImage}
            />
          </label>
  
          {/* Uploaded Images */}
          <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
            {data.image.map((img, index) => (
              <div
                key={img + index}
                className="h-20 w-20 bg-blue-50 border relative group rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt={img}
                  className="w-full h-full object-scale-down cursor-pointer"
                  onClick={() => setViewImageURL(img)}
                />
                <div
                  onClick={() => handleDeleteImage(index)}
                  className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded text-white hidden group-hover:block cursor-pointer"
                >
                  <MdOutlineDeleteOutline />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Category */}
        <div className="grid gap-1">
          <label className="font-medium">Category</label>
          <select
            className="bg-blue-50 border w-full p-2 rounded"
            value={selectCategory}
            onChange={(e) => {
              const value = e.target.value;
              const category = allCategory.find((el) => el._id === value);
              setData((prev) => ({
                ...prev,
                category: [...prev.category, category],
              }));
              setSelectCategory("");
            }}
          >
            <option value="">Select Category</option>
            {allCategory.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {data.category.map((c, index) => (
              <div
                key={c._id + index}
                className="text-sm flex items-center gap-1 bg-blue-100 px-2 py-1 rounded"
              >
                <p>{c.name}</p>
                <div
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <IoClose size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Sub Category */}
        <div className="grid gap-1">
          <label className="font-medium">Sub Category</label>
          <select
            className="bg-blue-50 border w-full p-2 rounded"
            value={selectSubCategory}
            onChange={(e) => {
              const value = e.target.value;
              const subCategory = allSubCategory.find((el) => el._id === value);
              setData((prev) => ({
                ...prev,
                subCategory: [...prev.subCategory, subCategory],
              }));
              setSelectSubCategory("");
            }}
          >
            <option value="">Select Sub Category</option>
            {allSubCategory.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {data.subCategory.map((c, index) => (
              <div
                key={c._id + index}
                className="text-sm flex items-center gap-1 bg-blue-100 px-2 py-1 rounded"
              >
                <p>{c.name}</p>
                <div
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => handleRemoveSubCategory(index)}
                >
                  <IoClose size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Unit */}
        <div className="grid gap-1">
          <label htmlFor="unit" className="font-medium">Unit</label>
          <input
            id="unit"
            type="text"
            name="unit"
            value={data.unit}
            onChange={handleChange}
            required
            placeholder="e.g. kg, piece"
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded"
          />
        </div>
  
        {/* Stock */}
        <div className="grid gap-1">
          <label htmlFor="stock" className="font-medium">Stock</label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={data.stock}
            onChange={handleChange}
            required
            placeholder="Enter product stock"
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded"
          />
        </div>
  
        {/* Price */}
        <div className="grid gap-1">
          <label htmlFor="price" className="font-medium">Price</label>
          <input
            id="price"
            type="text"
            name="price"
            value={data.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded"
          />
        </div>
  
        {/* Discount */}
        <div className="grid gap-1">
          <label htmlFor="discount" className="font-medium">Discount</label>
          <input
            id="discount"
            type="text"
            name="discount"
            value={data.discount}
            onChange={handleChange}
            required
            placeholder="Enter discount (optional)"
            className="bg-blue-50 p-2 outline-none border focus:border-blue-400 rounded"
          />
        </div>
  {/* Submit Button */}
<div className="col-span-1 md:col-span-2 lg:col-span-3">
  <button
    type="submit"
    className="btn btn-primary w-full text-white px-6 py-2 rounded transition"
  >
    Submit
  </button>
</div>

      </form>
    </div>
  </section>
  
  );
};

export default UploadProduct;
