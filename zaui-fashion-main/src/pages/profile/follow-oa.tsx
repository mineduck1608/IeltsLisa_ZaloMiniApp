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
import pic from "../../../www/assets/ieltslisalogo-CR4Zp28I.png";
import { AdminTalkIcon, GiftSaleIcon, InfoIcon } from "@/components/vectors";





export default function FollowOAWidget() {
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
      if (userPhone.userPhonenumber == false) {
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

  useEffect(() => {
    showOAWidget({
      id: "oaWidget",
      guidingText: "Quan tâm để nhận thông báo mới nhất từ trung tâm nhé",
      color: "#0068FF",
      onStatusChange: (status) => {
        if (typeof status === "boolean") {
          console.log("Widget status:", status);
          if (status == true) {
            console.log("Chuc mung ban da nhan duoc voucher");
            getSettings();
          }
        } else {
          console.log("Invalid status type:", status);
        }
      }
    });
  }, []);

  return <div  >
    
  </div>
    ;
}
