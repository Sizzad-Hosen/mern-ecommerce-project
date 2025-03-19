"use client"

import SummaryApi from '@/common/SummaryApi'
import CardProduct from '@/components/CardProduct'
import Loading from '@/components/Loading'
import Axios from '@/utilis/Axios'
import AxiosToastError from '@/utilis/AxiosToastError'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const { slug } = params;

  const [allSubCategory, setAllSubCategory] = useState([])
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  function valideURLConvert(str) {
    return str?.toLowerCase().replace(/\s+/g, "-");
  }

  // ✅ Parse slug safely
  function parseSlug(slugPart) {
    const segments = slugPart?.split("-") || []
    const id = segments.pop() || ""
    const name = segments.join(" ")
    return { id, name }
  }

  const category = slug && slug[0] ? parseSlug(slug[0]) : {}
  const subCategory = slug && slug[1] ? parseSlug(slug[1]) : {}
  const categoryId = category?.id
  const subCategoryId = subCategory?.id
  const subCategoryName = subCategory?.name

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios(SummaryApi.getSubCategory)
      if (response.data.success) {
        setAllSubCategory(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }


  // ✅ Fetch product data
  const fetchProductData = async () => {
    if (!categoryId) return; // Wait till categoryId is ready
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Load subcategories on mount
  useEffect(() => {
    fetchSubCategory()
  }, [])

  // ✅ Load products when category, subcategory, or page changes
  useEffect(() => {
    if (categoryId) {
      fetchProductData()
    }
  }, [categoryId, subCategoryId, page])

  // ✅ Filter relevant subcategories when subcategory data is ready
  useEffect(() => {
    if (allSubCategory.length && categoryId) {
      const filteredSubCategories = allSubCategory.filter(sub => {
        return sub.category.some(cat => cat._id === categoryId)
      })
      setDisplaySubCategory(filteredSubCategories)
    }
  }, [allSubCategory, categoryId])


  
  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2'>

        {/* Subcategories Sidebar */}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {displaySubCategory.map((s) => {
            const link = `/products/${valideURLConvert(category.name)}-${category.id}/${valideURLConvert(s.name)}-${s._id}`

            return (
              <Link
                key={s._id}
                href={link}
                className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 cursor-pointer
                  ${subCategoryId === s._id ? "bg-green-100" : ""}
                `}
              >
                <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded'>
                  <img
                    src={s.image}
                    alt='subCategory'
                    className='w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                  />
                </div>
                <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
              </Link>
            )
          })}
        </div>

        {/* Product Section */}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName || "Products"}</h3>
          </div>

          <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4'>
              {data.map((product, index) => (
                <CardProduct
                  data={product}
                  key={product._id + "_product_" + index}
                />
              ))}
            </div>

            {loading && (
              <div className='absolute inset-0 flex items-center justify-center bg-white/70'>
                <Loading />
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}

export default ProductListPage
