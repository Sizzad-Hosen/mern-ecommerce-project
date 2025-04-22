

import AdminPermission from '@/components/AdminPermission';
import Address from '@/pages/Address';


const AddressPage = () => {
  return (
    <AdminPermission>
      <Address />
    </AdminPermission>
  );
};

export default AddressPage;
