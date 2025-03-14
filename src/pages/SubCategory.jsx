"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import Axios from "@/utilis/Axios";
import SummaryApi from "@/common/SummaryApi";
import AxiosToastError from "@/utilis/AxiosToastError";
import uploadImage from "@/utilis/uploadImage";
import SubcategoryTable from "@/components/SubCategoryTable";

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

    // Fetch subcategories
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
        fetchSubCategory();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    // Upload Image
    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
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
        }
    };

    // Select Category
    const handleCategorySelection = (e) => {
        const selectedId = e.target.value;
        if (!selectedId || subCategoryData.category.includes(selectedId)) return;

        setSubCategoryData((prev) => ({
            ...prev,
            category: [...prev.category, selectedId],
        }));
    };

    // Remove Selected Category
    const handleRemoveCategorySelected = (categoryId) => {
        setSubCategoryData((prev) => ({
            ...prev,
            category: prev.category.filter((id) => id !== categoryId),
        }));
    };

    // Submit Data
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
            <div className="flex justify-between p-4">
                <h3 className="text-2xl font-bold">SubCategory</h3>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setIsOpen(true)}
                >
                    Add Subcategory
                </button>
            </div>

            {/* Render Subcategories */}
            <SubcategoryTable data={data} />


            {/* Add Subcategory Modal */}
            {isOpen && (
                <section className="fixed inset-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-5xl bg-white p-4 rounded">
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold">Add Sub Category</h1>
                            <button onClick={() => setIsOpen(false)}>
                                <IoClose size={25} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="my-3 grid gap-3">
                            <div className="grid gap-1">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={subCategoryData.name}
                                    onChange={handleChange}
                                    className="p-3 bg-blue-50 border rounded"
                                    required
                                />
                            </div>

                            <div className="grid gap-1">
                                <p>Image</p>
                                <div className="flex flex-col lg:flex-row items-center gap-3">
                                    <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                                        {subCategoryData.image ? (
                                            <img
                                                src={subCategoryData.image}
                                                className="w-full h-full object-scale-down"
                                            />
                                        ) : (
                                            <p className="text-sm text-neutral-400">No Image</p>
                                        )}
                                    </div>
                                    <label className="px-4 py-1 border rounded cursor-pointer">
                                        Upload Image
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleUploadSubCategoryImage}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <label>Select Category</label>
                                <div className="border rounded">
                                    <div className="flex flex-wrap gap-2 p-2">
                                        {subCategoryData.category.map((catId) => {
                                            const category = allCategory.find((c) => c._id === catId);
                                            return (
                                                category && (
                                                    <p
                                                        key={catId}
                                                        className="bg-white shadow-md px-2 py-1 flex items-center gap-2"
                                                    >
                                                        {category.name}
                                                        <IoClose
                                                            size={20}
                                                            className="cursor-pointer hover:text-red-600"
                                                            onClick={() => handleRemoveCategorySelected(catId)}
                                                        />
                                                    </p>
                                                )
                                            );
                                        })}
                                    </div>
                                    <select className="w-full p-2 border" onChange={handleCategorySelection}>
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
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                disabled={!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length}
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
