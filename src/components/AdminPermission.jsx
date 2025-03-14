"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  if (role === null) {
    return <p>Loading...</p>; 
  }

  return role === "ADMIN" ? (
    children
  ) : (
    <p className="text-red-600 bg-red-100 p-4">You do not have permission to access this page.</p>
  );
};

export default AdminPermission;
