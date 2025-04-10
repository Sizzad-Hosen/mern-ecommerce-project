import { useState } from "react";

const SubcategoryPage = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Change as needed

    // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedData = data.slice(indexOfFirstItem, indexOfLastItem);


    
    return (
        <div className="min-h-screen pb-20 flex flex-col">
            {/* Page Content */}
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
                                    <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="border p-2">{subcategory.name}</td>
                                    <td className="border p-2">
                                        <img
                                            src={subcategory.image}
                                            alt={subcategory.name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        {subcategory.category?.map((cat) => cat.name).join(", ") || "No Category"}
                                    </td>
                                    <td className="border p-2 flex gap-2">
                                        <button className="btn-primary text-white px-2 py-1 rounded">Edit</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center gap-4 mt-4">
                    <button
                        className={`px-4 py-2  btn-primary rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}</span>
                    <button
                        className={`px-4 btn-primary py-2 rounded ${indexOfLastItem >= data.length ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                        onClick={() => setCurrentPage((prev) => (indexOfLastItem < data.length ? prev + 1 : prev))}
                        disabled={indexOfLastItem >= data.length}
                    >
                        Next
                    </button>
                </div>
            </div>

          
        </div>
    );
};

export default SubcategoryPage;
