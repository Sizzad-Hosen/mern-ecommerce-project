"use client";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import Loading from "./Loading";

const AddToCartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState(null);
  const [cartData, setCartData] = useState([]);

  const user = useSelector((state) => state.user?.user);

  // Fetch Cart Data
  const fetchCartData = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await Axios({
        ...SummaryApi.getToCart,
        data: { userId: user._id },
      });
      setCartData(response.data.data || []);
    } catch (error) {
      AxiosToastError(error);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Check if the product is already in the cart
  useEffect(() => {
    if (!data?._id || !cartData.length) return;

    const product = cartData.find((item) => item?.productId?._id === data._id);
    setIsAvailableCart(!!product);
    setQty(product?.quantity || 0);
    setCartItemDetails(product || null);
  }, [data, cartData]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: { productId: data?._id },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (newQty) => {
    if (!cartItemDetails?._id || newQty < 1) return;

    // Optimistically update UI before API call
    const prevQty = qty;
    setQty(newQty);

    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { cartItemId: cartItemDetails._id, quantity: newQty },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
      fetchCartData();
    } catch (error) {
      AxiosToastError(error);
      setQty(prevQty); // Revert if error occurs
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartItemDetails?._id) return;


  // Optimistically remove item before API call
    const prevQty = qty;
    setQty(0);
    setIsAvailableCart(false);

    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,

        data: { cartItemId: cartItemDetails?._id },

      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);
      fetchCartData();
    } catch (error) {
      AxiosToastError(error);
      setQty(prevQty); // Revert if error occurs
      setIsAvailableCart(true);
    }
  };

  return (
    <div className="w-full max-w-[150px] h-[38px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              qty > 1 ? updateCartQuantity(qty - 1) : handleRemoveFromCart();
            }}
            className="bg-green-600 hover:bg-green-700 text-white w-full p-1 rounded flex items-center justify-center"
          >
            <FaMinus />
          </button>
          <div className="flex items-center justify-center font-semibold w-full px-1">
            {qty}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateCartQuantity(qty + 1);
            }}
            className="bg-green-600 hover:bg-green-700 text-white w-full p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-[#0059b3]  hover:bg-[#005ab3f5]  text-white w-full h-full px-2 py-1 rounded flex items-center justify-center"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
  
};

export default AddToCartButton;
