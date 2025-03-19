import AdminPermission from '@/components/AdminPermission'
import ProductAdmin from '@/pages/ProductAdmin'
import React from 'react'

const page = () => {
  return (
    <AdminPermission>


   <ProductAdmin></ProductAdmin>

</AdminPermission>
  )
}

export default page