import AdminPermission from '@/components/AdminPermission'
import UploadSubCategoryModel from '@/pages/SubCategory'

import React from 'react'

const page = () => {
  return (

    <AdminPermission>


      <UploadSubCategoryModel></UploadSubCategoryModel>

  </AdminPermission>
  )
}

export default page