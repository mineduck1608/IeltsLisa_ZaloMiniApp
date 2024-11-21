import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banners from "./banners";
import SearchBar from "../../components/search-bar";
import Category from "./category";
import FlashSales from "./flash-sales";
import HorizontalDivider from "@/components/horizontal-divider";
import CategoryTabs from "@/components/category-tabs";

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-section">
      <div className="bg-background pt-0">
        <SearchBar onClick={() => navigate("/search")} />
        <div className="news-header">
          <span className="highlight-bar"></span>
          Bảng tin gần đây
        </div>
        <Banners />
      </div>
      <div className="bg-background space-y-2 mt-2">
        <CategoryTabs />
        <Category />
      </div>
      <HorizontalDivider />
      <FlashSales />
    </div>
  );
};

export default HomePage;
