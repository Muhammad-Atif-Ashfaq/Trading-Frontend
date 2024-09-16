import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex rounded-md bg-white shadow-md">
        <div className="flex flex-col justify-center  p-4 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
