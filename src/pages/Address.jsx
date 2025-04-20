"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import { MdDelete, MdEdit } from 'react-icons/md';

import SummaryApi from '@/common/SummaryApi';
import Axios from '@/utilis/Axios';
import AxiosToastError from '@/utilis/AxiosToastError';
import AddAddress from '@/components/AddAdress';
import EditAddressDetails from '@/components/EditAddressDetails';


// import EditAddressDetails from './EditAddressDetails';

const Address = () => {
  const [isClient, setIsClient] = useState(false); // Track if it's on client-side

  // Only access the store on the client side
  useEffect(() => {
    setIsClient(true); // set to true after the component mounts
  }, []);

  if (!isClient) {
    return null; // or loading state, if you want to display a loading spinner while waiting for the client-side render
  }

  const [addressList, setAddressList] = useState([]);
  const user = useSelector((state) => state?.user?.user); // Safe access
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchAddress = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
        data: { userId: user?._id },
      });

      console.log('Fetched address:', response.data);
      setAddressList(response.data.data || []);
    } catch (error) {
      AxiosToastError(error);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchAddress();
    }
  }, [fetchAddress, user?._id]);

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });

      if (response.data.success) {
        toast.success("Address Removed");
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div>
      <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center'>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'
        >
          Add Address
        </button>
      </div>

      <div className='bg-blue-50 p-2 grid gap-4'>
        {addressList.map((address, index) => (
          address.status && (
            <div
              key={address._id || index}
              className='border rounded p-3 flex gap-3 bg-white'
            >
              <div className='w-full'>
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>{address.country} - {address.pincode}</p>
                <p>{address.mobile}</p>
              </div>

              <div className='grid gap-10'>
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className='bg-green-200 p-1 rounded hover:text-white hover:bg-green-600'
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDisableAddress(address._id)}
                  className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          )
        ))}

        <div
          onClick={() => setOpenAddress(true)}
          className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'
        >
          Add address
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails fetchAddress={fetchAddress} data={editData} close={() => setOpenEdit(false)} />}

    </div>
  );
};

export default Address;
