import AdminPermission from '@/components/AdminPermission'
import Address from '@/pages/Address'
import React from 'react'

const AddressPage = () => {
  return (
    <AdminPermission>
   <Address></Address>
    </AdminPermission>
 
  )
}

export default AddressPage