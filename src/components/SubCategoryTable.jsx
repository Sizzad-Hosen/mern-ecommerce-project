import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import { useState } from "react";
import toast from "react-hot-toast";
import EditSubCategory from "./EditSubCategory";
import Swal from "sweetalert2";

const SubcategoryPage = ({ data = [], fetchSubCategory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editData, setEditData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteSubCategory = async (_id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await Axios({
          ...SummaryApi.deleteSubCategory,
          data: { _id },
        });

        const { data: responseData } = response;

        if (responseData.success) {
          Swal.fire({
            title: "Deleted!",
            text: responseData.message,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          if (fetchSubCategory) {
            fetchSubCategory(); // <- Corrected: calling the function
          }
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
      AxiosToastError(error);
    }
  };

  const handleEdit = (subcategory) => {
    setEditData(subcategory);
    setOpenEdit(true);
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <div className="flex-grow">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border border-gray-300">
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
              {paginatedData.map((subcategory, index) => (
                <tr key={subcategory._id} className="border-b">
                  <td className="border p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{subcategory.name}</td>
                  <td className="border p-2">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="border p-2">
                    {subcategory.category?.map((cat) => cat.name).join(", ") ||
                      "No Category"}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(subcategory)}
                      className="btn-primary text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubCategory(subcategory._id)}
                      className="bg-red-500 btn text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </span>
          <button
            className={`px-4 py-2 rounded ${
              indexOfLastItem >= data.length
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLastItem < data.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLastItem >= data.length}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {openEdit && editData && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}
    </div>
  );
};

export default SubcategoryPage;
