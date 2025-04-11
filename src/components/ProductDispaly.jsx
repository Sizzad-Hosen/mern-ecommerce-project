"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6"
import SummaryApi from '@/common/SummaryApi'
import Axios from '@/utilis/Axios'
import { DisplayPriceInRupees } from '@/utilis/DisplayPriceInRupees.js'
import { pricewithDiscount } from '@/utilis/PriceWithDiscount.js'
import AxiosToastError from '@/utilis/AxiosToastError'
import Loading from './Loading'

const ProductDisplayPage = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]

  const [data, setData] = useState(null)
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      })
      const { data: responseData } = response
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

  const images = data?.image || []

  if (loading) {
    return (
      <section className='w-full h-[80vh] flex items-center justify-center'>
        <Loading />
      </section>
    )
  }

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      <div>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          {
            images.length > 0 ? (
              <img
                src={images[image]}
                className='w-full h-full object-scale-down'
                alt="product-image"
              />
            ) : (
              <img
                src="/placeholder.jpg"
                className='w-full h-full object-scale-down'
                alt="placeholder"
              />
            )
          }
        </div>

        <div className='flex items-center justify-center gap-3 my-2'>
          {
            images.map((img, index) => (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image ? "bg-slate-300" : ""}`}
              />
            ))
          }
        </div>

        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              images.map((img, index) => (
                <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md' key={img + index}>
                  <img
                    src={img}
                    alt='min-product'
                    onClick={() => setImage(index)}
                    className='w-full h-full object-scale-down'
                  />
                </div>
              ))
            }
          </div>

          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
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
            data?.more_details && Object.entries(data.more_details).map(([key, value], index) => (
              <div key={index}>
                <p className='font-semibold'>{key}</p>
                <p className='text-base'>{value}</p>
              </div>
            ))
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
              <p className='font-semibold text-lg lg:text-xl'>
                {DisplayPriceInRupees(pricewithDiscount(data?.price, data?.discount))}
              </p>
            </div>
            {
              data?.discount && (
                <>
                  <p className='line-through'>{DisplayPriceInRupees(data?.price)}</p>
                  <p className="font-bold text-green-600 lg:text-2xl">{data?.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
                </>
              )
            }
          </div>
        </div>

        {
          data?.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ) : (
            <div className='my-4'>
              {/* <AddToCartButton data={data} /> */}
            </div>
          )
        }

        <h2 className='font-semibold'>Why shop from binkeyit?</h2>
        <div>
          {[{
            img: "https://i.postimg.cc/BbW5sQpT/minute-delivery.png",
            title: "Superfast Delivery",
            desc: "Get your order delivered to your doorstep at the earliest from dark stores near you."
          }, {
            img: "https://i.postimg.cc/jjFQghJk/Best-Prices-Offers.png",
            title: "Best Prices & Offers",
            desc: "Best price destination with offers directly from the manufacturers."
          }, {
            img: "https://i.postimg.cc/W3qmQJGp/Wide-Assortment.png",
            title: "Wide Assortment",
            desc: "Choose from 5000+ products across food, personal care, household & other categories."
          }].map((item, i) => (
            <div key={i} className='flex items-center gap-4 my-4'>
              <img src={item.img} alt={item.title} className='w-20 h-20' />
              <div className='text-sm'>
                <div className='font-semibold'>{item.title}</div>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Description */}
        <div className='my-4 grid gap-3 lg:hidden'>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data?.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data?.unit}</p>
          </div>
          {
            data?.more_details && Object.entries(data.more_details).map(([key, value], index) => (
              <div key={index}>
                <p className='font-semibold'>{key}</p>
                <p className='text-base'>{value}</p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
