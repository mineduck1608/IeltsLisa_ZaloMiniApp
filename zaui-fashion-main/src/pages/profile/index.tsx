import ProfileActions from "./actions";
import PictureProfile from "./picture";
import Points from "./points";
import { useEffect } from "react";
import { showOAWidget } from "zmp-sdk";
import { useAtom } from "jotai";
import { useState } from 'react'
import { getSetting } from "zmp-sdk/apis";
import { GetSetting } from "@/types";
import axios from 'axios';
import { getAccessToken } from "zmp-sdk/apis";
import { authorize } from "zmp-sdk/apis";
import { getPhoneNumber } from "zmp-sdk/apis";
import { userInfoAtom } from '../../state'; // Import atom đã tạo
import pic from "../../../www/assets/ieltslisalogo-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I.png";
import { AdminTalkIcon, GiftSaleIcon, InfoIcon } from "@/components/vectors";
import { showToast } from "zmp-sdk/apis";

export default function ProfilePage() {
  const [showPhoneAccessRequest, setShowPhoneAccessRequest] = useState(false); // State để kiểm soát việc hiển thị yêu cầu quyền
  const tabs = useAtom(userInfoAtom);

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
                    const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/User/AddNewUser?userId=' + tabs[0]?.id + '&userName=' + tabs[0]?.name + '&phone=' + modifiedPhoneNumber, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',  // Set content type to JSON
                      },
                    });
                    if (response.ok) {
                      const data = await response.json();  // Parse the response as JSON
                      openToast();
                      console.log(data);
                    } else {
                      openToast();
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
      if (userPhone.userPhonenumber == true) {
        console.log("User accepts to access phone number");
        openToast();
        setShowPhoneAccessRequest(false); // Nếu đã cấp quyền, không cần yêu cầu nữa
      } else {
        setShowPhoneAccessRequest(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openToast = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/VoucherGift/GetRandomGift?voucherId=VC1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',  // Set content type to JSON
        },
      });
      if (response.ok) {
        const dataMessage = await response.json();  // Parse the response as JSON


        const addUserVoucher = await fetch('https://ieltslisazaloapp.azurewebsites.net/UserVoucher/AddUserVoucher?voucherId=VC1&userId=' + tabs[0]?.id + '&giftId=' + dataMessage.giftId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Set content type to JSON
          },
        });
        if (addUserVoucher.ok) {
          const addUserMessage = await addUserVoucher.json();  // Parse the response as JSON
          console.log(addUserMessage)
          const data = await showToast({
            message: "Chúc mừng bạn đã nhận được " + dataMessage.giftDescription,
          });
        } else {
          const addUserMessage = await addUserVoucher.json();  // Parse the response as JSON
          console.log(addUserMessage)
        }
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    showOAWidget({
      id: "oaWidget",
      guidingText: "Quan tâm để nhận thông báo mới nhất từ trung tâm nhé",
      color: "#0068FF",
      onStatusChange: (status) => {
        if (typeof status === "boolean") {
          console.log("Widget status:", status);
          if (status === true) {
            getSettings();
          }
        } else {
          console.log("Invalid status type:", status);
        }
      }
    });
  }, []);
  return (
    <div className={`min-h-full pb-1 bg-section ${showPhoneAccessRequest ? 'relative' : ''}`}>
      {showPhoneAccessRequest ? (<>
        {/* Phần nền với hiệu ứng blur cho toàn bộ nội dung */}
        <div
          className={`bg-background ${showPhoneAccessRequest ? 'blur-screen' : ''} overflow-y-auto`}
          style={{ zIndex: -1 }} // Đảm bảo nền mờ phía sau modal
        />

        {/* Content Section (bao gồm cả PictureProfile, Points, ProfileActions) với hiệu ứng blur */}
        <div className={`min-h-full bg-section w-screen ${showPhoneAccessRequest ? 'blur-screen' : ''}`}>
          <PictureProfile />
          <Points />
        </div>
        {/* Modal phần ảnh và nội dung cố định */}
        <div
          className="absolute inset-0 flex justify-center items-center bg-white rounded-lg shadow-lg modal-enter modal-enter-active transform"
          style={{
            zIndex: 0,
            margin: 25
          }} // Modal sẽ được hiển thị trên cùng
        >
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src={pic}
                alt="Logo"
                className="w-40 h-auto sm:w-48 md:w-56 lg:w-60 xl:w-72"
              />
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

            <p className="text-left text-lg mt-3 text-left w-72">
              Vui lòng chia sẻ số điện thoại của bạn để nhận những ưu đãi mới nhất về chương trình học của IELTS LISA nhé!!!
            </p>
            <button
              className="font-medium bg-red-800 text-white p-3 w-full rounded-full mt-5"
              onClick={authorizeUser}>
              Liên kết số điện thoại
            </button>
            <button
              className="font-medium text-red-600 mt-3"
              onClick={() => setShowPhoneAccessRequest(false)}>
              Từ chối
            </button>
          </div>
        </div>
      </>
      ) : (
        <>
          <PictureProfile />
          <div className="min-h-full w-screen bg-section p-4 space-y-4 mt-8">
            <Points />
          </div>
        </>
      )}
      <div id="oaWidget" className="min-h-full  bg-section mr-4 ml-4 mb-3 mt-6" />
    </div>
  );
}
