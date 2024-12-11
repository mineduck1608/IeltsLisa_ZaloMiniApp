
import headerLogoImage from "../../www/assets/ieltslisalogo.png";
import { getUserInfo } from "zmp-sdk/apis";
import { openShareSheet } from 'zmp-sdk';
import { useEffect, useState } from "react";
import "../css/app.scss";
import { useAtomValue } from "jotai";
import { userInfoAtom } from "@/state";

export default function Header() {
  const userInformation = useAtomValue(userInfoAtom);
  const shareContent = async () => {
    try {
      const result = await openShareSheet({
        type: 'link', // Loại nội dung chia sẻ
        data: {
          link: 'https://zalo.me/s/3653009784996743169/?utm_source=zalo-qr', // Đường dẫn cần chia sẻ
          chatOnly: true// Cho phép chia sẻ qua chat và nhật ký
        },
      });
      console.log('Chia sẻ thành công:', result);
    } catch (error) {
      console.error('Chia sẻ thất bại:', error);
    }
  };
  type UserInfo = {
    id: string;
    name: string;
    avatar: string;
    idByOA?: string;
    isSensitive?: boolean;
    followedOA?: boolean;
  };

  // State userInfo
  const [userInfo, setUserInfo] = useState<String>();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo(); // Gọi API
        const userInfo: UserInfo = {
          id: user.userInfo.id,
          name: user.userInfo.name,
          avatar: user.userInfo.avatar,
          idByOA: user.userInfo.idByOA,
          isSensitive: user.userInfo.isSensitive,
          followedOA: user.userInfo.followedOA,
        };
        setUserInfo(userInfo.name); // Gán dữ liệu đã chuyển đổi vào state
      } catch (error) {
        console.error('Lỗi khi gọi getUser:', error);
      }
    };

    fetchUserInfo(); // Gọi hàm lấy dữ liệu
  }, [userInformation]);
    return (
      <div className="h-28 w-full items-center"
        style={{ borderBottom: '1px solid lightgray', }}>
        <div className="h-12 w-full flex items-center "
          style={{ backgroundColor: '#990000' }}>
          <p className="font-medium text-xl truncate pr-24 px-4 text-white">
            IELTS LISA - Flying Colors, Flying High
          </p>
        </div>
        <div className="share-div">
          <div className="h-20 flex items-center px-2 mt-1">
            <img src={headerLogoImage} className="max-h-full flex-none" />
          </div>
          <div className="message-content">
            <h3>Giáo dục Tường Châu - IELTS LISA</h3>
            <h1>Chào {userInfo}!</h1>
          </div>
          <button onClick={shareContent} className="share-button-click px-1 py-1" id="btnShare"
            style={{
              position: 'absolute',
              right: '30px',
              top: '60px' // hoặc bất kỳ giá trị nào bạn muốn để định vị theo chiều dọc
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px">
              <path d="M21.7,10.2l-6.6-6C14.6,3.7,14,4.2,14,5v3c-4.7,0-8.7,2.9-10.6,6.8c-0.7,1.3-1.1,2.7-1.4,4.1   c-0.2,1,1.3,1.5,1.9,0.6C6.1,16,9.8,13.7,14,13.7V17c0,0.8,0.6,1.3,1.1,0.8l6.6-6C22.1,11.4,22.1,10.6,21.7,10.2z" />
            </svg>
          </button>
        </div>
      </div>
    );
}
