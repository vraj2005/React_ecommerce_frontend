import React from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderOne from "../components/HeaderOne";
import Breadcrumb from "../components/Breadcrumb";
import BottomFooter from "../components/BottomFooter";
import ShippingOne from "../components/ShippingOne";
import Blog from "../components/Blog";
import ScrollToTop from "react-scroll-to-top";


const BlogPage = () => {

  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* Header */}
      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Blog"} />

      {/* Blog */}
      <Blog />

      {/* ShippingOne */}
      <ShippingOne />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default BlogPage;
