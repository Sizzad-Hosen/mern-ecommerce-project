'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { FaCaretRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Axios from '@/utilis/Axios';
import SummaryApi from '@/common/SummaryApi';
import AxiosToastError from '@/utilis/AxiosToastError';
import { DisplayPriceInRupees } from '@/utilis/DisplayPriceInRupees';
import { pricewithDiscount } from '@/utilis/PriceWithDiscount';

import AddToCartButton from './AddToCart';
import imageEmpty from '../assets/empty_cart.webp';

const DisplayCartItem = ({ close }) => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [cartItem, setCartItem] = useState([]);

  // Fetch cart data
  const fetchCartData = useCallback(async () => {
    if (!user?._id) return;

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

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

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

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      router.push('/checkout');
    } else {
      toast.error('Please login first!');
    }
  };

  return (
    <section className=" max-w-7xl mx-auto ">
      <div className="bg-white w-full min-h-2.5 max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
          {cartItem.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings</p>
                <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
              </div>

              <div className="bg-white rounded-lg p-4 grid gap-11 overflow-auto">
                {cartItem.map((item) => (
                  <div key={item?._id} className="flex w-full gap-4">
                    <div className="w-16 h-16 min-h-16 min-w-16 border rounded">
                      <Image
                        src={item?.productId?.image?.[0] || '/fallback.png'}
                        width={64}
                        height={64}
                        className="object-scale-down"
                        alt="Product"
                      />
                    </div>
                    <div className="w-full max-w-sm text-xs">
                      <p className="text-xs text-ellipsis line-clamp-2">
                        {item?.productId?.name}
                      </p>
                      <p className="text-neutral-400">{item?.productId?.unit}</p>
                      <p className="font-semibold">
                        {DisplayPriceInRupees(
                          pricewithDiscount(
                            item?.productId?.price,
                            item?.productId?.discount
                          )
                        )}
                      </p>
                    </div>
                    <div>
                      <AddToCartButton data={item?.productId} />
                    </div>
                  </div>
                ))}
              </div>

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
                  <p>{totalQty} items</p>
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
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center">
              <Image
                src={imageEmpty}
                width={200}
                height={200}
                className="object-scale-down"
                alt="Empty Cart"
              />
              <Link
                href="/"
                onClick={close}
                className="block btn-primary px-4 py-2 text-white rounded mt-4"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem.length > 0 && (
          <div className="p-2">
            <div className="bg-[#0059b3]  text-neutral-100 px-4 font-bold text-base py-4 rounded flex items-center gap-4 justify-between">
              <div>{DisplayPriceInRupees(totalPrice)}</div>
              <button onClick={redirectToCheckoutPage} className="flex items-center gap-1">
                Proceed <FaCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
