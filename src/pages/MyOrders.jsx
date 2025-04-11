"use client";

import React, { useEffect, useState } from 'react';
import Axios from '@/utilis/Axios';
import SummaryApi from '@/common/SummaryApi';
import { useSelector } from 'react-redux';
import AxiosToastError from '@/utilis/AxiosToastError';
import Loading from '@/components/Loading';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = useSelector((state) => state.user.user);

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItem,
        data: { userId: user._id },
      });

      const { data: responseData } = response;

      setOrders(responseData?.data || []);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>

      {loading ? (
        <p className="p-4"><Loading></Loading></p>
      ) : orders.length === 0 ? (
        <p className="p-4">No orders found.</p>
      ) : (
        <>
          {selectedOrders.map((order, index) => (
            <div key={order._id + index} className="order rounded p-4 text-sm border mb-4">
              <p className="mb-2 font-medium">Order No: {order?.orderId}</p>
              <div className="flex items-center gap-3">
                <img
                  src={order?.product_details?.image?.[0]}
                  alt={order?.product_details?.name}
                  className="w-14 h-14 object-cover border"
                />
                <p className="font-medium">{order?.product_details?.name}</p>
              </div>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 btn-primary rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 btn-primary rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
