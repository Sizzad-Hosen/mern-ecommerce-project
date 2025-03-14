import AdminPermission from '@/components/AdminPermission'
import UploadProduct from '@/pages/UploadProduct'
import React from 'react'

const page = () => {
  return (
    <AdminPermission>


   <UploadProduct/>

</AdminPermission>
  )
}

export default page