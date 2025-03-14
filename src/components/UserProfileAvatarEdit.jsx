import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "@/common/SummaryApi";
import { updatedAvatar } from "@/redux/slices/userSlice";
import AxiosToastError from "@/utilis/AxiosToastError";
import Axios from "@/utilis/Axios";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUploadAvatarImage = async (e) => {
    
    const file = e.target.files[0];

    // Check if file exists
    if (!file) {
      console.warn("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });

      console.log("Upload Response:", response); // Debugging API response

      // Ensure API returns valid data before dispatching
      if (response?.data?.data?.avatar) {
        dispatch(updatedAvatar(response.data.data.avatar));
      } else {
        console.error("Avatar upload failed. Invalid API response.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      if (error.response) {
        AxiosToastError(error);
      } else {
        console.error("Network or unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button onClick={close} className="text-neutral-800 w-fit block ml-auto">
          <IoClose size={20} />
        </button>

        {/* Avatar Display Section */}
        <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden shadow-sm">
          {user?.avatar ? (
            <img alt={user?.name || "User Avatar"} src={user.avatar} className="w-full h-full object-cover" />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>

        {/* File Upload Form */}
        <form>
          <label htmlFor="uploadProfile">
            <div className="border border-gray-300 cursor-pointer hover:bg-gray-200 px-4 py-1 rounded text-sm my-3">
              {loading ? "Uploading..." : "Upload"}
            </div>
            <input
              onChange={handleUploadAvatarImage}
              type="file"
              id="uploadProfile"
              className="hidden"
              accept="image/*"
            />
          </label>
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
