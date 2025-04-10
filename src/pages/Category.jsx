"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import SummaryApi from "@/common/SummaryApi";
import AxiosToastError from "@/utilis/AxiosToastError";
import Axios from "@/utilis/Axios";
import uploadImage from "@/utilis/uploadImage";
import { IoPencil, IoTrash } from "react-icons/io5"; // Import the icons
import Swal from 'sweetalert2';



const UploadCategoryModel = ({ close }) => {
  const [categoryData, setCategoryData] = useState([]);
  
  const [data, setData] = useState({
    _id: "",
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // To track whether we're updating or adding a new category

  // Fetch categories from the backend
  const fetchCategoryData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
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
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.image) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      let response;
      if (isUpdate) {
        response = await Axios({
          ...SummaryApi.updateCategory, // API for updating category
          data: data,
        });
      } else {
        response = await Axios({
          ...SummaryApi.addCategory, // API for adding new category
          data: data,
        });
      }

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close(); // Close modal after success
        setOpenModal(false); // Close modal after success
        fetchCategoryData(); // Refresh category list after adding/updating
      }
    } catch (error) {
      AxiosToastError(error); // Handle error with custom function
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      if (ImageResponse && ImageResponse.data && ImageResponse.data.url) {
        setData((prev) => ({
          ...prev,
          image: ImageResponse.data.url,
        }));
      } else {
        toast.error("Failed to upload image. No URL found.");
      }
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Image upload error:", error);
    }
  };

  // Handle category update
  const handleUpdate = (category) => {
    setData({
      _id: category._id, // Set _id for updating
      name: category.name,
      image: category.image,
    });
    setIsUpdate(true); // Flag as update mode
    setOpenModal(true); // Open modal for updating
  };

  // Handle category delete
 
  const handleDelete = async (categoryId) => {
    // Show confirmation alert using SweetAlert
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
  
          console.log("data", responseData); // Log the response data to console for debugging
  
          if (responseData.success) {
            toast.success(responseData.message);
            fetchCategoryData(); // Refresh the list after deletion
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <button
        onClick={() => {
          setOpenModal(true);
          setIsUpdate(false); // Switch to add mode
          setData({ _id: "", name: "", image: "" }); // Reset form for adding new category
        }}
        className="btn-primary text-white px-4 py-2 rounded"
      >
        Add Category
      </button>

      {/* Render categories */}
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <div
                key={category._id}
                className="bg-white w-36 h-44 shadow-lg rounded-lg overflow-hidden flex flex-col items-center p-4"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="rounded-md mr-2 w-full object-scale-down"
                />
                <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(category)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                  >
                    <IoPencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <IoTrash size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-3">No categories available</div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {openModal && (
        <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white max-w-4xl w-full p-4 rounded">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">{isUpdate ? "Update Category" : "Add Category"}</h1>
              <button
                onClick={() => setOpenModal(false)}
                className="w-fit block ml-auto"
              >
                <IoClose size={25} />
              </button>
            </div>
            <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="categoryName">Name</label>
                <input
                  type="text"
                  id="categoryName"
                  placeholder="Enter category name"
                  value={data?.name}
                  name="name"
                  onChange={handleOnChange}
                  className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
                />
              </div>
              <div className="grid gap-1">
                <p>Image</p>
                <div className="flex gap-4 flex-col lg:flex-row items-center">
                  <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                    {data.image ? (
                      <img
                        alt="category"
                        src={data?.image}
                        className="w-full h-full object-scale-down"
                      />
                    ) : (
                      <p className="text-sm text-neutral-500">No Image</p>
                    )}
                  </div>
                  <label htmlFor="uploadCategoryImage">
                    <div
                      className={`${
                        !data?.name
                          ? "bg-gray-300"
                          : "border-primary-200 hover:bg-primary-100"
                      } px-4 py-2 rounded cursor-pointer border font-medium`}
                    >
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
                className={`${
                  data?.name && data?.image
                    ? "bg-yellow-300 hover:bg-primary-100"
                    : "bg-blue-200 cursor-not-allowed"
                } py-2 font-semibold transition-all duration-300 ease-in-out`}
                disabled={loading || !data?.name || !data?.image}
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
