import AdminPermission from '@/components/AdminPermission'
import UploadCategoryModel from '@/pages/Category'
import React from 'react'

const page = () => {
  return (
    <AdminPermission>


      <UploadCategoryModel></UploadCategoryModel>

    </AdminPermission>
  )
}

export default page