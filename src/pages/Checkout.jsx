"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Axios from "@/utilis/Axios";
import SummaryApi from "@/common/SummaryApi";
import AddAddress from "@/components/AddAdress";
import { DisplayPriceInRupees } from "@/utilis/DisplayPriceInRupees";
import AxiosToastError from "@/utilis/AxiosToastError";
import { pricewithDiscount } from "@/utilis/PriceWithDiscount";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "@/components/Loading";

const CheckoutPage = () => {

  const [isClient, setIsClient] = useState(false); // Track if it's on client-side

  // Only access the store on the client side
  useEffect(() => {
    setIsClient(true); // set to true after the component mounts
  }, []);

  if (!isClient) {
    return null; // or loading state, if you want to display a loading spinner while waiting for the client-side render
  }

  const user = useSelector((state) => state?.user.user);
  const router = useRouter();

  const [cartItem, setCartItem] = useState([]);
  const [openAddress, setOpenAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(0);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart data
  const fetchCartData = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getToCart,
        data: { userId: user._id },
      });
      setCartItem(response.data.data || []);
    } catch (error) {
      AxiosToastError(error);
    }
  }, [user?._id]);

  // Fetch address data
  const fetchAddress = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
        data: { userId: user._id },
      });
      setAddressList(response.data.data || []);
    } catch (error) {
      AxiosToastError(error);
    }
  }, [user?._id]);

  // Combined fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCartData();
      await fetchAddress();
      setLoading(false);
    };
    fetchData();
  }, [fetchCartData, fetchAddress]);

  const notDiscountTotalPrice = cartItem.reduce(
    (acc, item) => acc + item?.productId?.price * item.quantity,
    0
  );

  const totalPrice = cartItem.reduce(
    (acc, item) =>
      acc +
      pricewithDiscount(item?.productId?.price, item?.productId?.discount) *
        item.quantity,
    0
  );

  const totalQty = cartItem.reduce((acc, item) => acc + item.quantity, 0);

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItem,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        router.push("/success");
       
      } else {
        router.push("/cancle");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Redirecting to payment...");
  
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  
      if (!stripePublicKey) {
        toast.dismiss();
        toast.error("Stripe public key not found");
        return;
      }
  
      const stripe = await loadStripe(stripePublicKey);
  
      if (!stripe) {
        toast.dismiss();
        toast.error("Failed to load Stripe");
        return;
      }
  
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItem,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });
  
      console.log('res', response);
      console.log('data', response.data); // ✅ fixed
  
      const sessionId = response?.data?.id;
      console.log('sessionId', sessionId);
  
      if (!sessionId) {
        toast.dismiss();
        toast.error("Stripe session ID not found");
        return;
      }
  
      const result = await stripe.redirectToCheckout({ sessionId });
  
      console.log('result', result);
  
      if (result?.error) {
        toast.dismiss();
        toast.error(result.error.message);
        return;
      }
  
      if (fetchCartData) {
        fetchCartData();
      }
  
      toast.dismiss();
    } catch (error) {
      console.error("[Stripe Payment Error]", error);
      toast.dismiss();
      toast.error("Payment failed. Please try again.");
    }
  };
  

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        {/* Address Selection */}
        <div className="w-full">
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {loading ? (
              <Loading />
            ) : (
              addressList.map((address, index) => (
                <label
                  htmlFor={"address" + index}
                  className={!address.status ? "hidden" : ""}
                  key={index}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        onChange={(e) =>
                          setSelectAddress(Number(e.target.value))
                        }
                        name="address"
                        checked={selectAddress === index}
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              ))
            )}

            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md bg-white py-4 px-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quantity total</p>
              <p>{totalQty} item(s)</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p>Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mt-4">
            <button
              className="py-2 px-4 btn-primary rounded text-white font-semibold"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              className="py-2 px-4 border-2 border-[#0059b3] font-semibold text-[#0059b3] hover:bg-[#0059b3] hover:text-white"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
