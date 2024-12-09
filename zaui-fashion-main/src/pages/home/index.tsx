import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banners from "./banners";
import SearchBar from "../../components/search-bar";
import CategoryTabs from "@/components/category-tabs";
import { getUserInfo } from "zmp-sdk/apis";
import { useSetAtom } from 'jotai';
import { userInfoAtom, userGetSetting } from '../../state'; // Import atom đã tạo
import { authorize } from "zmp-sdk/apis";
import { getSetting } from "zmp-sdk/apis";
import pic from "../../../www/assets/ieltslisalogo-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I.png";
import { AdminTalkIcon, GiftSaleIcon, InfoIcon } from "@/components/vectors";
import { getPhoneNumber } from "zmp-sdk/apis";
import axios from 'axios';
import { getAccessToken } from "zmp-sdk/apis";
import { UserInfo, GetSetting } from "../../types";
import { cartState } from "@/state";

const HomePage: React.FunctionComponent = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const setUserInfo = useSetAtom(userInfoAtom); // Hook để cập nhật atom
  const setUserGetSetting = useSetAtom(userGetSetting);
  const [userInfo, saveUserInfo] = useState<UserInfo | undefined>();
  const [showPhoneAccessRequest, setShowPhoneAccessRequest] = useState(false); // State để kiểm soát việc hiển thị yêu cầu quyền
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
      fetchUserVoucher();
      setUserInfo(userInfo); // Cập nhật atom với dữ liệu lấy từ API
      saveUserInfo(userInfo)
      console.log(userInfo);
    } catch (error) {
      console.error('Lỗi khi gọi getUserInfo:', error);
    }
  };

  const fetchUserVoucher = async () => {
    try {
      const voucherResponse = await fetch(`https://ieltslisazaloapp.azurewebsites.net/UserVoucher/GetVoucherByUserId?id=${userInfo?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!voucherResponse.ok) {
        console.error('Error fetching vouchers:', await voucherResponse.json());
        return;
      }
      const vouchers = await voucherResponse.json();
      setCart(vouchers);
    }catch(error){
      console.log(error);
    }
  }

  const authorizeUser = async () => {
    setShowPhoneAccessRequest(false);
    try {
      const data = await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      });
      console.log(data);
      if (data["scope.userPhonenumber"] == true) {
        getAccessToken({
          success: (accessToken) => {
            // xử lý khi gọi api thành công
            getPhoneNumber({
              success: async (data) => {
                try {
                  let { token } = data;
                  console.log("Phone token:", token);

                  const endpoint = "https://graph.zalo.me/v2.0/me/info";
                  const userAccessToken = accessToken; // Thay thế bằng token thực tế của bạn
                  const phoneToken = token;
                  const secretKey = "GbFTGQM13rUIOv1WFcPL"; // Thay thế bằng secret key thực tế của bạn

                  // Sử dụng Axios để gửi yêu cầu HTTP GET
                  const response = await axios.get(endpoint, {
                    params: {
                      access_token: userAccessToken, // Gửi access_token qua query params
                      code: phoneToken,              // Gửi phoneToken qua query params
                      secret_key: secretKey          // Gửi secret_key qua query params
                    }
                  });

                  console.log("Response Code:", response.status);
                  console.log("Response Body:", response.data);
                  const phoneNumber = response.data.data.number;
                  const modifiedPhoneNumber = phoneNumber.replace(/^84/, '0');
                  try {
                    console.log(modifiedPhoneNumber)

                    const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/User/AddNewUser?userId=' + userInfo?.id + '&userName=' + userInfo?.name + '&phone=' + modifiedPhoneNumber, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',  // Set content type to JSON
                      },
                    });
                    if (response.ok) {
                      const data = await response.json();  // Parse the response as JSON
                      console.log(data);
                    } else {
                      const data = await response.json();  // Parse the response as JSON
                      console.log(data);
                    }
                  } catch (error) {
                    console.error('Error find user:', error);
                  }
                } catch (error) {
                  console.error("Error:", error);
                }
              },

              fail: (error) => {
                // Xử lý khi gọi API thất bại
                console.log("Error during phone number request:", error);
              },
            });
          },
          fail: (error) => {
            // xử lý khi gọi api thất bại
            console.log(error);
          },
        });
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const getSettings = async () => {
    try {
      const data = await getSetting({});
      const userPhone: GetSetting = {
        userInfo: data.authSetting["scope.userInfo"],
        userPhonenumber: data.authSetting["scope.userPhonenumber"]
      };
      setUserGetSetting(userPhone);

      if (userPhone.userPhonenumber == true) {
        console.log("User accepts to access phone number");
        setShowPhoneAccessRequest(false); // Nếu đã cấp quyền, không cần yêu cầu nữa
      } else {
        setTimeout(() => {
          setShowPhoneAccessRequest(true); // Sau 2 giây sẽ hiển thị yêu cầu quyền
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const denyAuthentication = async () => {
    setShowPhoneAccessRequest(false);
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/User/AddNewUser?userId=' + userInfo?.id + '&userName=' + userInfo?.name + '&phone=N/A', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Set content type to JSON
        },
      });
      if (response.ok) {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
      } else {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const setCart = useSetAtom(cartState);

  useEffect(() => {
    fetchUserInfo();
    if (count == 0) {
      getSettings();
      setCount(1);
    }
  }, [fetchUserVoucher()]);

  return (
    <div className={`min-h-full bg-section ${showPhoneAccessRequest ? 'relative' : ''}`}>
      {showPhoneAccessRequest ? (
        <div className="flex justify-center items-center bg-gray-100 z-50">
          <div className={`absolute inset-0 bg-background space-y-2 mt-2 ${showPhoneAccessRequest ? 'blur-screen' : ''} overflow-y-auto`}>
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

          {/* Modal phần ảnh và nội dung cố định */}
          <div className="text-center mt-7 p-4 bg-white rounded-lg shadow-lg modal-enter modal-enter-active transform">
            <div className="flex justify-center">
              <img src={pic} alt="Logo" className="w-40 h-auto sm:w-48 md:w-56 lg:w-60 xl:w-72" />
            </div>

            <h1 className="text-2xl font-bold">Chào mừng bạn đến với</h1>
            <h1 className="text-2xl font-bold">IELTS LISA</h1>
            <div className="flex">
              <div className="space-y-2 mt-2 flex flex-col items-center justify-center">
                <InfoIcon />
                <GiftSaleIcon />
                <AdminTalkIcon />
              </div>
              <div className="space-y-3 mt-2">
                <p className="text-lg text-left ml-2 font-medium">Nhận các thông tin mới nhất</p>
                <p className="text-lg text-left ml-2 font-medium">Nhận các ưu đãi từ trung tâm</p>
                <p className="text-lg text-left ml-2 font-medium">Admin tư vấn lộ trình học</p>
              </div>
            </div>
            <p className="text-left text-lg mt-3 text-left w-72">Vui lòng chia sẻ số điện thoại của bạn để nhận những ưu đãi mới nhất về chương trình học của IELTS LISA nhé!!!</p>
            <button className="font-medium bg-red-800 text-white p-3 w-full rounded-full mt-5" onClick={authorizeUser}>Liên kết số điện thoại</button>
            <button className="font-medium text-red-600 mt-3" onClick={denyAuthentication}>Từ chối</button>
          </div>
        </div>

      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default HomePage;
