import Footer from "components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";
import { SiFiverr } from "react-icons/si";

function AuthenticationLayout() {
  return (
    <div className="bg-[#093f25]">
      <span className="flex flex-row pl-5">
        <SiFiverr className="h-20 w-20 fill-white" />
      </span>
      <div className=" bg-[#093f25] flex flex-row px-14 py-24 justify-center">
        <Outlet />
        <div className="">
          <img src="career.webp" alt="login_image" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuthenticationLayout;
