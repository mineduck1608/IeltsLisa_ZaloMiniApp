import { useAtomValue, useSetAtom } from "jotai";
import { cartState, userInfoAtom } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";
import ticket from "../../../www/assets/ticket.png";
import pic from "../../../www/assets/ieltslisalogo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserVoucher } from "@/types";

export default function CartPage() {
  const cart = useAtomValue(cartState);
  const [voucher, setVoucher] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Thêm state loading
  const setCart = useSetAtom(cartState);
  const userInfo = useAtomValue(userInfoAtom);

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
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGiftMap = async () => {
    try {
      const voucherResponse = await fetch(`https://ieltslisazaloapp.azurewebsites.net/UserVoucher/GetMapVoucherByUserId?id=${userInfo?.id}`, {
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
      setVoucher(vouchers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Bắt đầu loading
      await fetchUserVoucher();
      await fetchGiftMap();
      setLoading(false); // Kết thúc loading
    };
    loadData();
  }, []); // chỉ gọi khi component load

  const navigate = useNavigate();

  if (loading) {
    // Hiển thị skeleton loading khi đang load dữ liệu
    return (
      <div>
        <div className="news-header">
          <span className="highlight-bar"></span>
          <div className="text-xl">Quà ưu đãi</div>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-3" style={{ minHeight: '70vh' }}>
          <div className="animate-pulse">
            <EmptyBoxIcon />
          </div>
          <h1 className="text-xl">Đang tải ưu đãi...</h1>
        </div>
      </div>
    );
  }

  if (cart.length == 0) {
    return (
      <>
        <div className="news-header">
          <span className="highlight-bar"></span>
          <div className="text-xl">Quà ưu đãi</div>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-3"
          style={{ minHeight: '70vh' }}>
          <EmptyBoxIcon />
          <h1 className="font-bold text-xl">Bạn hiện không có ưu đãi nào</h1>
          <div className="text-center px-2.5">
            Nhiều ưu đãi, quà tặng hấp dẫn từ trung tâm đang chờ bạn
          </div>
          <button className="flex items-center px-4 py-2 bg-red-700 text-white rounded-full shadow-md hover:bg-red-800 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="30"
              height="30"
              fill="white"
              className="mr-2"
            >
              <g>
                <path
                  d="M62.242,53.757L51.578,43.093C54.373,38.736,56,33.56,56,28C56,12.536,43.464,0,28,0S0,12.536,0,28
        s12.536,28,28,28c5.56,0,10.736-1.627,15.093-4.422l10.664,10.664c2.344,2.344,6.142,2.344,8.485,0S64.586,56.101,62.242,53.757z
        M28,54C13.641,54,2,42.359,2,28S13.641,2,28,2s26,11.641,26,26S42.359,54,28,54z M60.828,60.828c-1.562,1.562-4.095,1.562-5.656,0
        L44.769,50.425c2.145-1.606,4.051-3.513,5.657-5.656l10.402,10.402C62.391,56.732,62.391,59.266,60.828,60.828z"
                />
                <path
                  d="M28,4C14.745,4,4,14.745,4,28s10.745,24,24,24s24-10.745,24-24S41.255,4,28,4z M28,50
        C15.85,50,6,40.15,6,28S15.85,6,28,6s22,9.85,22,22S40.15,50,28,50z"
                />
                <path
                  d="M28,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c8.284,0,15,6.716,15,15c0,0.553,0.447,1,1,1s1-0.447,1-1
        C45,18.611,37.389,11,28,11z"
                />
              </g>
            </svg>
            <button className="font-medium"
              onClick={() => navigate("/")}>Khám phá ngay</button>
          </button>
        </div >
      </>
    );
  }
  return (
    <div className="w-full flex flex-col bg-skeleton">
      <div className="news-header px-2 mt-7 mb-2">
        <span className="highlight-bar"></span>
        <div className="text-xl">Quà ưu đãi</div>
      </div>
      {voucher.map((voucher) => (
        <div className="relative px-2 mt-2">
          <img src={ticket} alt="Ảnh ticket" className="w-full rounded-md"
          />
          <img src={pic} alt="Ảnh chèn"
            style={{
              width: '15%',
              height: '40%',
              position: 'absolute',
              top: '50%',
              left: '12%',
              transform: 'translate(calc(-50% + 16.666%), -50%)',
            }} />
          <div className="absolute top-1/2 left-1/3 space-y-4 transform -translate-y-12 flex flex-col text-left">
            <p className="text-gray-500 truncate w-40">{voucher.voucherName || 'Đang tải...'}</p>
            <h3 className="text-lg font-semibold text-black truncate w-52">{voucher.giftName || 'Đang tải...'}</h3>
            <p className="text-sm mt-1">
              {'Hạn sử dụng: ' + (voucher.endDate
                ? new Date(voucher.endDate).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                : 'Đang tải...')}
            </p>
          </div>
          <button
            className="absolute -translate-y-8 flex flex-col top-1/3 right-4 transform -translate-y-1 text-red-800 px-3 rounded-md text-sm font-medium"
            onClick={() => navigate(`/voucherqr?voucherId=${voucher.voucherId}&giftId=${voucher.giftId}`)}
          >
            Dùng ngay
          </button>
        </div >
      ))}
      <div className="ml-2 mb-2 mr-2 mt-4 flex items-center bg-red-800 text-white p-4 rounded-2xl">
        <div className="text-left flex-1 text-white">
          Nhiều ưu đãi, quà tặng hấp dẫn từ trung tâm đang chờ bạn
        </div>
        <button className="hover:bg-skeleton flex items-center px-3 py-1 bg-white text-black rounded-full shadow-md transition duration-300 text-sm"
          onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="30"
            height="30"
            fill="black"
            className="mr-2"
          >
            <g>
              <path
                d="M62.242,53.757L51.578,43.093C54.373,38.736,56,33.56,56,28C56,12.536,43.464,0,28,0S0,12.536,0,28
        s12.536,28,28,28c5.56,0,10.736-1.627,15.093-4.422l10.664,10.664c2.344,2.344,6.142,2.344,8.485,0S64.586,56.101,62.242,53.757z
        M28,54C13.641,54,2,42.359,2,28S13.641,2,28,2s26,11.641,26,26S42.359,54,28,54z M60.828,60.828c-1.562,1.562-4.095,1.562-5.656,0
        L44.769,50.425c2.145-1.606,4.051-3.513,5.657-5.656l10.402,10.402C62.391,56.732,62.391,59.266,60.828,60.828z"
              />
              <path
                d="M28,4C14.745,4,4,14.745,4,28s10.745,24,24,24s24-10.745,24-24S41.255,4,28,4z M28,50
        C15.85,50,6,40.15,6,28S15.85,6,28,6s22,9.85,22,22S40.15,50,28,50z"
              />
              <path
                d="M28,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c8.284,0,15,6.716,15,15c0,0.553,0.447,1,1,1s1-0.447,1-1
        C45,18.611,37.389,11,28,11z"
              />
            </g>
          </svg>
          <div className="font-medium whitespace-nowrap">Khám phá</div>
        </button>
      </div>
    </div>
  );
}
