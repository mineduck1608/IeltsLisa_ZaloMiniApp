import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banners from "./banners";
import SearchBar from "../../components/search-bar";
import CategoryTabs from "@/components/category-tabs";
import { getUserInfo } from "zmp-sdk/apis";
import { useSetAtom } from 'jotai';
import { userInfoAtom } from '../../state'; // Import atom đã tạo

// Định nghĩa kiểu dữ liệu cho userInfo
type UserInfo = {
  id: string;
  name: string;
  avatar: string;
  idByOA?: string;
  isSensitive?: boolean;
  followedOA?: boolean;
};

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const setUserInfo = useSetAtom(userInfoAtom); // Hook để cập nhật atom


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo(); // Gọi API để lấy thông tin người dùng
        const userInfo: UserInfo = {
          id: user.userInfo.id,
          name: user.userInfo.name,
          avatar: user.userInfo.avatar,
          idByOA: user.userInfo.idByOA,
          isSensitive: user.userInfo.isSensitive,
          followedOA: user.userInfo.followedOA,
        };

        setUserInfo(userInfo); // Cập nhật atom với dữ liệu lấy từ API
      } catch (error) {
        console.error('Lỗi khi gọi getUserInfo:', error);
      }
    };

    fetchUserInfo(); // Gọi hàm lấy thông tin người dùng
  }, [setUserInfo]);

  return (
    <div className="min-h-full bg-section">
      <div className="bg-background pt-3">
        <SearchBar onClick={() => navigate('/search')} />
        <div className="news-header">
          <span className="highlight-bar"></span>
          Bảng tin gần đây
        </div>
        <Banners />
      </div>
      <div className="bg-background space-y-2 mt-2">
        <CategoryTabs />
      </div>
    </div>
  );
};

export default HomePage;
