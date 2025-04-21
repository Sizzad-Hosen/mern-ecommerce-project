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

  const [userId, setUserId] = useState(null);

  // ✅ Only set userId on client after mount to prevent hydration mismatch
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser?.user?._id);
    }
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItem,
        data: { userId },
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
    if (userId) {
      fetchOrder();
    }
  }, [userId]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>

      {loading ? (
        <p className="p-4"><Loading /></p>
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

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 btn-primary rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
