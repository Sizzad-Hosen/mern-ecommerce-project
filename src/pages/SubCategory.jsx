"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import Axios from "@/utilis/Axios";
import SummaryApi from "@/common/SummaryApi";
import AxiosToastError from "@/utilis/AxiosToastError";
import uploadImage from "@/utilis/uploadImage";
import SubcategoryTable from "@/components/SubCategoryTable";
import Loading from "@/components/Loading";

const UploadSubCategoryModel = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });
  const [allCategory, setAllCategory] = useState([]);
  const [data, setData] = useState([]);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getSubCategory);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Axios(SummaryApi.getCategory);
      setAllCategory(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadImage(file);
      if (response?.data?.data?.url) {
        setSubCategoryData((prev) => ({
          ...prev,
          image: response.data.data.url,
        }));
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelection = (e) => {
    const selectedId = e.target.value;
    if (!selectedId || subCategoryData.category.includes(selectedId)) return;

    setSubCategoryData((prev) => ({
      ...prev,
      category: [...prev.category, selectedId],
    }));
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((id) => id !== categoryId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        name: subCategoryData.name,
        image: subCategoryData.image,
        category: subCategoryData.category,
      };

      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: formattedData,
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        setIsOpen(false);
        setSubCategoryData({ name: "", image: "", category: [] });
        fetchSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-4">
        <h3 className="text-2xl font-bold">SubCategory</h3>
        <button
          className="btn-primary text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
          onClick={() => setIsOpen(true)}
        >
          Add Subcategory
        </button>
      </div>

      <SubcategoryTable fetchSubCategory={fetchSubCategory} data={data} />

      {isOpen && (
        <section className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white p-5 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold text-lg">Add Sub Category</h1>
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={25} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={subCategoryData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-blue-50 border rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="border h-36 w-full sm:w-36 bg-blue-50 flex items-center justify-center">
                    {subCategoryData.image ? (
                      <img
                        src={subCategoryData.image}
                        className="w-full h-full object-contain"
                        alt="Uploaded"
                      />
                    ) : (
                      <p className="text-sm text-neutral-400">No Image</p>
                    )}
                  </div>
                  <label className="px-4 py-2 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
                    Upload Image
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUploadSubCategoryImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Select Category</label>
                <div className="border rounded">
                  <div className="flex flex-wrap gap-2 p-2">
                    {subCategoryData.category.map((catId) => {
                      const category = allCategory.find((c) => c._id === catId);
                      return (
                        category && (
                          <span
                            key={catId}
                            className="bg-white shadow px-2 py-1 flex items-center gap-1 rounded"
                          >
                            {category.name}
                            <IoClose
                              size={18}
                              className="cursor-pointer hover:text-red-600"
                              onClick={() => handleRemoveCategorySelected(catId)}
                            />
                          </span>
                        )
                      );
                    })}
                  </div>
                  <select
                    className="w-full p-2 border-t"
                    onChange={handleCategorySelection}
                  >
                    <option value="">Select Category</option>
                    {allCategory.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                disabled={
                  !subCategoryData.name ||
                  !subCategoryData.image ||
                  !subCategoryData.category.length
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default UploadSubCategoryModel;
