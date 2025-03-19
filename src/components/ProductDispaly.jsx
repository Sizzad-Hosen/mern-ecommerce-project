"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import SummaryApi from '@/common/SummaryApi';
import Axios from '@/utilis/Axios';
import { DisplayPriceInRupees } from '@/utilis/DisplayPriceInRupees.js';
import { pricewithDiscount } from '@/utilis/PriceWithDiscount.js';
import AxiosToastError from '@/utilis/AxiosToastError';

const ProductDisplayPage = () => {
  const params = useParams()

  let productId = params?.product?.split("-")?.slice(-1)[0]
  
console.log("prod ID", productId);

  const [data, setData] = useState(null) // Initialize with null
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response
console.log("product details", responseData)
      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  // Check if 'data' and 'data.image' are not null or undefined before accessing them
  const images = data?.image || []

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
      <div className=''>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          {images.length > 0 ? (
            <img
              src={images[image]}
              className='w-full h-full object-scale-down'
              alt="product-image"
            />
          ) : (
            <img
              src='data:image/jpeg;base64,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' // Use a placeholder image if no valid image URL is present
              className='w-full h-full object-scale-down'
              alt="placeholder-image"
            />
          )}
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            images.map((img, index) => {
              return (
                <div key={img + index + "point"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              images.map((img, index) => {
                return (
                  <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img + index}>
                    <img
                      src={img}
                      alt='min-product'
                      onClick={() => setImage(index)}
                      className='w-full h-full object-scale-down'
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleRight />
            </button>
          </div>
        </div>

        <div className='my-4 hidden lg:grid gap-3'>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data?.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data?.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={index}>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data?.name}</h2>
        <p>{data?.unit}</p>
        <div className='p-[0.5px] bg-slate-200 my-2'></div>
        <div>
          <p className=''>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data?.price, data?.discount))}</p>
            </div>
            {
              data?.discount && (
                <p className='line-through'>{DisplayPriceInRupees(data?.price)}</p>
              )
            }
            {
              data?.discount && (
                <p className="font-bold text-green-600 lg:text-2xl">{data?.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
              )
            }
          </div>
        </div>

        {
          data?.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          )
            : (
              <div className='my-4'>
                {/* <AddToCartButton data={data}/> */}
              </div>
            )
        }

        <h2 className='font-semibold'>Why shop from binkeyit? </h2>
        <div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={"https://i.postimg.cc/BbW5sQpT/minute-delivery.png"}
              alt='superfast delivery'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={"https://i.postimg.cc/jjFQghJk/Best-Prices-Offers.png"}
              alt='Best prices offers'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={"https://i.postimg.cc/W3qmQJGp/Wide-Assortment.png"}
              alt='Wide Assortment'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>

        {/****only mobile */}
        <div className='my-4 grid gap-3'>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data?.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data?.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={index}>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
