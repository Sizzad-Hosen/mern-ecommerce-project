"use client";
import React, { useEffect, useState } from "react";
import { IoClose, IoPencil, IoTrash } from "react-icons/io5";
import toast from "react-hot-toast";
import SummaryApi from "@/common/SummaryApi";
import AxiosToastError from "@/utilis/AxiosToastError";
import Axios from "@/utilis/Axios";
import uploadImage from "@/utilis/uploadImage";
import Swal from 'sweetalert2';

const UploadCategoryModel = ({ close }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [data, setData] = useState({ _id: "", name: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const fetchCategoryData = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCategory });
      setCategoryData(response.data.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.image) return toast.error("Please fill in all fields!");
    try {
      setLoading(true);
      const response = await Axios({
        ...(isUpdate ? SummaryApi.updateCategory : SummaryApi.addCategory),
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        setOpenModal(false);
        fetchCategoryData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected");
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      if (ImageResponse?.data?.url) {
        setData((prev) => ({ ...prev, image: ImageResponse.data.url }));
      } else {
        toast.error("Failed to upload image. No URL found.");
      }
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Image upload error:", error);
    }
  };

  const handleUpdate = (category) => {
    setData({
      _id: category._id,
      name: category.name,
      image: category.image,
    });
    setIsUpdate(true);
    setOpenModal(true);
  };

  const handleDelete = async (categoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await Axios({
            ...SummaryApi.deleteCategory,
            data: { _id: categoryId },
          });
          const { data: responseData } = response;
          if (responseData.success) {
            toast.success(responseData.message);
            fetchCategoryData();
          } else {
            toast.error("Something went wrong, try again.");
          }
        } catch (error) {
          AxiosToastError(error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Category Management</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            setOpenModal(true);
            setIsUpdate(false);
            setData({ _id: "", name: "", image: "" });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Add Category
        </button>
      </div>

      {/* Category Grid */}
      <div className="my-4 mx-auto max-w-[1400px]">
        <h2 className="text-xl font-semibold mb-4 text-center">All Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-2 sm:px-4">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <div
                key={category._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-4"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-24 object-contain mb-2 rounded"
                />
                <h3 className="text-base font-medium text-center">{category.name}</h3>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdate(category)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  >
                    <IoPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <IoTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-full">No categories available</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <section className="fixed inset-0 p-4 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isUpdate ? "Update Category" : "Add Category"}
              </h2>
              <button onClick={() => setOpenModal(false)}>
                <IoClose size={24} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={data?.name}
                  onChange={handleOnChange}
                  placeholder="Enter category name"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="border bg-gray-100 w-full sm:w-36 h-36 flex items-center justify-center rounded">
                    {data.image ? (
                      <img
                        src={data.image}
                        alt="Category"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No Image</span>
                    )}
                  </div>
                  <label htmlFor="uploadCategoryImage">
                    <div className="bg-blue-100 border border-blue-300 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-200 transition">
                      Upload Image
                    </div>
                    <input
                      disabled={!data?.name}
                      onChange={handleUploadCategoryImage}
                      type="file"
                      id="uploadCategoryImage"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={loading || !data?.name || !data?.image}
                type="submit"
                className={`w-full py-2 text-white font-semibold rounded-md ${
                  data?.name && data?.image
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Saving..." : isUpdate ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default UploadCategoryModel;
