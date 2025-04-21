"use client"

import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import Swal from 'sweetalert2'
import SummaryApi from '@/common/SummaryApi'
import Axios from '@/utilis/Axios'
import AxiosToastError from '@/utilis/AxiosToastError'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await Axios({
          ...SummaryApi.deleteProduct,
          data: {
            _id: data._id
          }
        });

        const { data: responseData } = response;

        if (responseData.success) {
          Swal.fire({
            title: 'Deleted!',
            text: responseData.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          if (fetchProductData) {
            fetchProductData();
          }
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message || 'Something went wrong!',
        icon: 'error'
      });
      AxiosToastError(error);
    }
  };

  return (
    <div className='w-36 p-4 bg-white rounded'>
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
      <p className='text-slate-400'>{data?.unit}</p>
      <div className='grid grid-cols-2 gap-3 py-3'>
        <button
          onClick={() => setEditOpen(true)}
          className='border px-2 py-1 p-2 text-sm btn-primary bg-green-100   rounded'
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-sm hover:bg-red-900 btn  text-white px-2 py-1 p-2 rounded"
        >
          Delete
        </button>
      </div>

      {editOpen && (
        <EditProductAdmin
          key={data._id}
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}
    </div>
  )
}

export default ProductCardAdmin
