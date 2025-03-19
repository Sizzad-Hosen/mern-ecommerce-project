"use client";

import React from "react";
import { IoReload } from "react-icons/io5";

const Loading = ({ size = "40px", color = "text-blue-500", message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <IoReload className={`animate-spin ${color}`} style={{ fontSize: size }} />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
