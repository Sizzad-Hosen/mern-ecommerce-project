import React from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";
import Axios from '@/utilis/Axios';
import SummaryApi from '@/common/SummaryApi';
import AxiosToastError from '@/utilis/AxiosToastError';
import { useSelector } from 'react-redux';

const AddAddress = ({ close, fetchAddress }) => {
  const { register, handleSubmit, reset } = useForm();

  const user = useSelector((state) => state?.user.user);

  const onSubmit = async (data) => {
    if (!user?._id) {
      toast.error("User not logged in!");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          userId: user._id,
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });

      const { data: responseData } = response;
      console.log('responsedat', responseData);
      

      if (responseData.success) {
        toast.success(responseData.message);
        reset();
        close?.();
        fetchAddress?.(); // Only call if it's passed from parent
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto">
      <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
        <div className="flex justify-between items-center gap-4">
          <h2 className="font-semibold">Add Address</h2>
          <button onClick={close} className="hover:text-red-500">
            <IoClose size={25} />
          </button>
        </div>
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          {[
            { id: 'addressline', label: 'Address Line' },
            { id: 'city', label: 'City' },
            { id: 'state', label: 'State' },
            { id: 'pincode', label: 'Pincode' },
            { id: 'country', label: 'Country' },
            { id: 'mobile', label: 'Mobile No.' },
          ].map(({ id, label }) => (
            <div className="grid gap-1" key={id}>
              <label htmlFor={id}>{label}:</label>
              <input
                type="text"
                id={id}
                className="border bg-blue-50 p-2 rounded"
                {...register(id, { required: true })}
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 font-semibold mt-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
