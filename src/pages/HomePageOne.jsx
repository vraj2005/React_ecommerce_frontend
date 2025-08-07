import React, { useState, useEffect } from "react";
import axios from "axios";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";
import FlashSalesOne from "../components/FlashSalesOne";
import ProductListOne from "../components/ProductListOne";
import RecommendedOne from "../components/RecommendedOne";
import BestSellsOne from "../components/BestSellsOne";
import NewArrivalOne from "../components/NewArrivalOne";
import ShippingOne from "../components/ShippingOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";

const HomePageOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Preloader />;

  return (
    <>
      <ScrollToTop smooth color="#299E60" />
      <ColorInit color={false} />
      <HeaderOne 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        products={products}
      />
      <BannerOne />
      <FlashSalesOne />
      <ProductListOne 
        products={products} 
        searchQuery={searchQuery} 
      />
      <RecommendedOne />
      <BestSellsOne />
      <NewArrivalOne />
      <ShippingOne />
      {/* <FooterOne /> */}
      <BottomFooter />
    </>
  );
};

export default HomePageOne;