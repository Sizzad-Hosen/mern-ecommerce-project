"use client"
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import uploadImage from "@/utilis/uploadImage";
import Axios from "@/utilis/Axios";
import SummaryApi from "@/common/SummaryApi";


const EditSubCategory = ({ close, data,fetchData}) => {

    const [allCategory, setAllCategory] = useState([]);

    const [loading, setLoading] = useState(false);


    // Fetch categories
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
      
    }, []);


    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSubCategoryData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const response = await uploadImage(file);
        const { data: ImageResponse } = response;

        setSubCategoryData((prev) => ({
            ...prev,
            image: ImageResponse.data.url,
        }));
    };

    const handleRemoveCategorySelected = (categoryId) => {
        const updatedCategories = subCategoryData.category.filter(
            (cat) => cat._id !== categoryId
        );
        setSubCategoryData((prev) => ({
            ...prev,
            category: updatedCategories,
        }));
    };

    const handleSelectCategory = (e) => {
        const categoryId = e.target.value;
        const selectedCategory = allCategory.find((cat) => cat._id === categoryId);

        if (selectedCategory && !subCategoryData.category.some((cat) => cat._id === categoryId)) {
            setSubCategoryData((prev) => ({
                ...prev,
                category: [...prev.category, selectedCategory],
            }));
        }
    };

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
   

        try {
            const response = await Axios({
                ...SummaryApi.updateSubCategory,
                data: subCategoryData,
            });
            const { data: responseData } = response;
          

            if (responseData.success) {
                toast.success(responseData.message);
                await fetchData()
                close();
          
            }
        } catch (error) {
            toast.error("Failed to update subcategory");
        }
    finally {
        setLoading(false);
    }
    };

    {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <p className="text-lg font-semibold text-primary-200 animate-pulse">Updating...</p>
        </div>
    )}
    

    return (
        <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white p-4 rounded">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="font-semibold">Edit Sub Category</h1>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className="my-3 grid gap-3" onSubmit={handleSubmitSubCategory}>
                    <div className="grid gap-1">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className="p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded"
                        />
                    </div>

                    <div className="grid gap-1">
                        <p>Image</p>
                        <div className="flex flex-col lg:flex-row items-center gap-3">
                            <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                                {!subCategoryData.image ? (
                                    <p className="text-sm text-neutral-400">No Image</p>
                                ) : (
                                    <img
                                        alt="subCategory"
                                        src={subCategoryData.image}
                                        className="w-full h-full object-scale-down"
                                    />
                                )}
                            </div>
                            <label htmlFor="uploadSubCategoryImage">
                                <div className="px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer">
                                    Upload Image
                                </div>
                                <input
                                    type="file"
                                    id="uploadSubCategoryImage"
                                    className="hidden"
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <label>Select Category</label>
                        <div className="border focus-within:border-primary-200 rounded">
                            {/* Display selected categories */}
                            <div className="flex flex-wrap gap-2">
                                {subCategoryData.category.map((cat) => (
                                    <p key={cat._id} className="bg-white shadow-md px-1 m-1 flex items-center gap-2">
                                        {cat.name}
                                        <div
                                            className="cursor-pointer hover:text-red-600"
                                            onClick={() => handleRemoveCategorySelected(cat._id)}
                                        >
                                            <IoClose size={20} />
                                        </div>
                                    </p>
                                ))}
                            </div>

                            {/* Select a new category */}
                            <select
                                className="w-full p-2 bg-transparent outline-none border"
                                onChange={handleSelectCategory}
                            >
                                <option value="">Select Category</option>
                                {allCategory.map((category) => (
                                    <option value={category._id} key={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        className={`px-4 py-2 border ${
                            subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length
                                ? "btn-primary"
                                : "btn-primary"
                        } font-semibold`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditSubCategory;
