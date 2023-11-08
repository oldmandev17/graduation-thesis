import React from "react";
import { Outlet } from "react-router-dom";
import HeaderBasic from "components/HeaderBasic";
import Footer from "components/Footer";

function SellerOnboardLayout() {
  return (
    <div>
      <HeaderBasic />
      <Outlet />
      <Footer />
    </div>
  );
}

export default SellerOnboardLayout;
