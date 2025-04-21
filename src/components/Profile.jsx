"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { setUserDetails} from "@/redux/slices/userSlice";
import UserProfileAvatarEdit from "./UserProfileAvatarEdit";
import SummaryApi from "@/common/SummaryApi";
import Axios from "@/utilis/Axios";
import AxiosToastError from "@/utilis/AxiosToastError";
import fetchUserDetails from "@/utilis/fetchUserDetails";
import toast from "react-hot-toast";
import Image from "next/image";

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        mobile: "",
        avatar: "", // Ensure avatar is part of userData
    });
    const [loading, setLoading] = useState(false);

    // Fetch user details on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                setUserData({
                    name: userDetails.data?.name || "",
                    email: userDetails.data?.email || "",
                    mobile: userDetails.data?.mobile || "",
                    avatar: userDetails.data?.avatar || "",
                });

                console.log("userdetails",userDetails.data.avatar)
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (!user?.name) {
            fetchData();
        }
    }, [dispatch, user?.name]);

    // Update local state when Redux user changes
    useEffect(() => {
        if (user?.name) {
            setUserData({
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                avatar: user.avatar, // Ensure avatar is updated
            });
        }
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData,
            });

            const { data: responseData } = response;
          
            if (responseData.success) {
                toast.success(responseData.message);

                // Fetch updated user details after update
                const updatedUserData = await fetchUserDetails();
                

                dispatch(setUserDetails(updatedUserData.data));
                setUserData(updatedUserData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/** Profile upload and display image */}
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
                {userData?.avatar ? (
                    <Image
                        width={80}
                        height={80}
                        alt={userData?.name}
                        src={userData?.avatar} // ✅ Ensure avatar URL is correct
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FaRegUserCircle size={65} />
                )}
            </div>
            <button
                onClick={() => setProfileAvatarEdit(true)}
                className="text-sm min-w-20 border border-primary-100 btn-primary px-3 py-1 rounded-full mt-3"
            >
                Edit
            </button>

            {openProfileAvatarEdit && (
                <UserProfileAvatarEdit 
                    close={() => setProfileAvatarEdit(false)}
                    setUserData={setUserData} // Pass state setter
                />
            )}

            {/** Name, mobile, email, change password */}
            <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
                <div className="grid">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
                        value={userData.name}
                        name="name"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div className="grid">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
                        value={userData.email}
                        name="email"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div className="grid">
                    <label htmlFor="mobile">Mobile</label>
                    <input
                        type="text"
                        id="mobile"
                        placeholder="Enter your mobile"
                        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
                        value={userData.mobile}
                        name="mobile"
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <button
                    className="border px-4 py-2 font-semibold btn-primary border-primary-100 text-primary-200 hover:text-neutral-800 rounded"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Profile;
