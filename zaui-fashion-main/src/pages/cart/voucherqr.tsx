import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import pic from '../../../www/assets/ieltslisalogo.png';
import { BackIcon, AdminTalkIcon } from '@/components/vectors';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { userInfoAtom } from '../../state'; // Import atom đã tạo
import { useAtomValue } from "jotai";
import { showToast } from "zmp-sdk/apis";


export default function VoucherQR() {
    const qrValue = "https://www.example.com/voucher/duc"; // Giá trị QR
    const [startDate, setStartDate] = useState(); // ISO format
    const [expiredAt, setExpiredAt] = useState();// ISO format
    const [giftName, setGiftName] = useState();
    const [searchParams] = useSearchParams();
    const voucherId = searchParams.get("voucherId");
    const giftId = searchParams.get("giftId");
    const navigate = useNavigate();
    const userInfo = useAtomValue(userInfoAtom);


    const [timeLeft, setTimeLeft] = useState("");
    const [expired, setExpired] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
    const [inputCode, setInputCode] = useState(""); // Giá trị mã được nhập

    const handleModalClose = () => {
        setIsModalOpen(false);
        setInputCode(""); // Xóa mã sau khi đóng modal
    };

    const handleModalSubmit = () => {
        useVoucher();
        handleModalClose();
    };

    const useVoucher = async () => {
        try {
            const useVoucher = await fetch(`https://ieltslisazaloapp.azurewebsites.net/UserVoucher/AdminUpdateUserVoucher?userId=${userInfo?.id}&voucherId=${voucherId}&giftId=${giftId}&voucherCode=${inputCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (useVoucher.ok) {
                const useRes = await useVoucher.json();
                console.log(useRes.msg);
                showToast({
                    message: useRes.msg,
                  });
            };
            if (!useVoucher.ok){
                const useRes = await useVoucher.json();
                showToast({
                    message: useRes.msg,
                  });
            }

        } catch (error) {
            console.error('Error using voucher:', error);
        }
    };

    useEffect( () => {
        fetchGiftMap();
        if (expiredAt) {
            const expiryDate = new Date(expiredAt).getTime();

            const countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = expiryDate - now;

                if (distance <= 0) {
                    setExpired(true);
                    clearInterval(countdownInterval);
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setTimeLeft(`${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`);
                }
            }, 1000);
            return () => clearInterval(countdownInterval);
        } else {
            console.error("expiredAt is undefined");
        }
    }, [expiredAt]);

    const fetchGiftMap = async () => {
        try {
            // Fetch thông tin gift tương ứng cho từng voucher
            const giftResponse = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Gift/GetGiftById?giftId=${giftId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (giftResponse.ok) {
                const giftRes = await giftResponse.json();
                setGiftName(giftRes?.giftName);
            };

            const voucherResponse = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Voucher/GetVoucherById?voucherId=${voucherId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (voucherResponse.ok) {
                const voucherRes = await voucherResponse.json();
                setExpiredAt(voucherRes?.endDate);
                setStartDate(voucherRes?.startDate);
            }
        } catch (error) {
            console.error('Error fetching giftMap:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative"
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
                }}>
                {/* Top Buttons and Title */}
                <div className="p-4 text-center">
                    <div className="flex justify-between items-center">
                        <button className="bg-red-800 rounded-full p-1"
                            onClick={() => navigate("/cart")}><BackIcon /></button>
                        <p className="text-gray-500 text-xs mt-2">MÃ QR QUÀ TẶNG</p>
                        <div className="bg-red-800 rounded-full p-1"
                            onClick={() => setIsModalOpen(true)}
                        ><AdminTalkIcon /></div>
                    </div>
                    <p className="text-lg font-semibold mt-1">{giftName}</p>

                    {/* QR Code */}
                    <div className="relative flex justify-center items-center mt-4">
                        <QRCodeCanvas
                            value={qrValue}
                            size={180}
                            fgColor="#990000"
                            bgColor="#ffffff"
                            level="H"
                        />
                        <div className="absolute">
                            <img
                                src={pic}
                                alt="Logo"
                                className="w-12 h-12"
                                style={{
                                    borderRadius: "5px",
                                    background: "white"
                                }}
                            />
                        </div>
                    </div>


                    {/* Issue and Expiry Info */}
                    <p className="text-sm text-gray-500 mt-4">
                        Mã QR phát hành lúc <span className="font-medium">{startDate}</span> <br />
                        bởi Giáo dục Tường Châu - IELTS LISA<br />
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-2">
                        Kết thúc chương trình {expiredAt}
                    </p>
                </div>

                {/* Divider with Cut-Outs */}
                <div className="relative">
                    <div className="border-t border-dashed border-gray-300 mx-4 mt-2"></div>
                    {/* Left cut-out */}
                    <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 bg-[#00000033] w-8 h-8 rounded-full"></div>
                    {/* Right cut-out */}
                    <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 bg-[#00000033] w-8 h-8 rounded-full"></div>
                </div>

                {/* Voucher Details */}
                <div className="flex items-center justify-center h-full p-4">
                    <img src={pic} alt="Voucher" className="w-12 h-12 mr-4 rounded-full object-cover" />
                    <div className="flex flex-col items-left">
                        <p className="text-sm font-medium">{giftName}</p>
                        <p className="text-xs text-gray-500 truncate">ID: {voucherId}</p>
                    </div>
                </div>

                <>
                    {/* Footer */}
                    {expired ? (
                        <div className="bg-red-100 text-red-700 text-sm p-3 flex items-center justify-center rounded-b-xl">

                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                    />
                                </svg>
                                Mã QR này đã hết thời hạn sử dụng
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-800 text-white text-sm p-3 flex items-center justify-center rounded-b-xl">

                            <p className="font-medium">Thời gian còn lại: {timeLeft}</p>
                        </div>

                    )}

                </>
                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Nhập mã sử dụng</h2>
                            <input
                                type="text"
                                placeholder="Nhập mã của bạn"
                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={handleModalClose}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-800 text-white px-4 py-2 rounded"
                                    onClick={handleModalSubmit}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
