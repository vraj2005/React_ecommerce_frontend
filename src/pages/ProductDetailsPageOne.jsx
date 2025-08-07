import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import ProductDetailsOne from "../components/ProductDetailsOne";
import ShippingOne from "../components/ShippingOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";

const ProductDetailsPageOne = () => {



  return (
    <>

      {/* Preloader */}
      <Preloader />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* HeaderOne */}
      <HeaderOne />

      {/* ProductDetailsOne */}
      <ProductDetailsOne />

      {/* ShippingOne */}
      <ShippingOne />

      {/* BottomFooter */}
      <BottomFooter />



    </>
  );
};

export default ProductDetailsPageOne;
