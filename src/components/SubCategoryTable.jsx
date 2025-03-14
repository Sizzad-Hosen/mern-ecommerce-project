import React, { useState, useEffect } from "react";
import EditSubCategory from "./EditSubCategory";
import SummaryApi from "@/common/SummaryApi";
import toast from "react-hot-toast";
import Axios from "@/utilis/Axios";
import Swal from "sweetalert2";

const SubcategoryTable = ({ data }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [subCategoryData, setSubCategoryData] = useState(data);

    const fetchData = async () => {
        try {
            const response = await Axios(SummaryApi.getSubCategory);
            setSubCategoryData(response?.data?.data || []);
        } catch (error) {
            toast.error("Error fetching subcategories");
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data initially

    const handleEditClick = (subcategory) => {
        setEditData(subcategory); // Set the data to be edited
        setIsEditing(true); // Show the modal
    };

    const handleCloseModal = () => {
        setIsEditing(false); // Hide the modal
        setEditData(null); // Reset the data
    };

    const handleDeleted = async (subcategoryId) => {
        console.log("idsubcategory", subcategoryId);

        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const response = await Axios({
                    ...SummaryApi.deleteSubCategory,
                    data: { _id: subcategoryId },
                });
                console.log("res data", response);

                const { data: responseData } = response;

                if (responseData.success) {
                    toast.success(responseData.message);
                    setSubCategoryData((prevData) =>
                        prevData.filter((subcategory) => subcategory._id !== subcategoryId)
                    );
                }
            }
        } catch (error) {
            toast.error("Failed to delete subcategory");
        }
    };

    return (
        <div className="overflow-x-auto">
            {/* 🔍 Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center z-100">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                            onClick={() => setSelectedImage(null)}
                        >
                            ❌
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full View"
                            className="max-w-full max-h-screen rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* 🔢 Table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 text-left">#</th>
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Image</th>
                        <th className="border p-2 text-left">Category</th>
                        <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subCategoryData && subCategoryData.length > 0 ? (
                        subCategoryData.map((subcategory, index) => (
                            <tr key={subcategory._id} className="border-b">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{subcategory.name}</td>
                                <td className="border p-2">
                                    <img
                                        src={subcategory.image}
                                        alt={subcategory.name}
                                        className="h-12 w-12 object-cover rounded cursor-pointer transition-transform duration-300 hover:scale-110"
                                        onClick={() => setSelectedImage(subcategory.image)}
                                    />
                                </td>
                                <td className="border p-2">
                                    {subcategory.category?.map((cat) => cat.name).join(", ") || "No Category"}
                                </td>
                                <td className="border p-2 flex gap-2 justify-start sm:justify-center">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleEditClick(subcategory)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleted(subcategory._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center p-4">No subcategories found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isEditing && (
                <EditSubCategory
                    close={handleCloseModal}
                    data={editData}
                    fetchData={fetchData} // Fetch the updated data after submission
                />
            )}
        </div>
    );
};

export default SubcategoryTable;
