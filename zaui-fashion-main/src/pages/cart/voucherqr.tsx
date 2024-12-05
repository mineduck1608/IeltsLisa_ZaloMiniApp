import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import pic from '../../../www/assets/ieltslisalogo-CR4Zp28I.png';
import { BackIcon, DownloadIcon } from '@/components/vectors';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

export default function VoucherQR() {
    const qrValue = "https://www.example.com/voucher/duc"; // Giá trị QR
    const issuedAt = "2024-08-24T16:49:00"; // ISO format
    const expiredAt = "2024-12-31T23:59:00"; // ISO format
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const voucherId = searchParams.get("voucherId");
    const giftId = searchParams.get("giftId");

    const [timeLeft, setTimeLeft] = useState("");
    const [expired, setExpired] = useState(false);

    useEffect(() => {
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
    }, [expiredAt]);

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
                        onClick={ () => navigate("/cart") }><BackIcon /></button>
                        <p className="text-gray-500 text-xs mt-2">MÃ QR QUÀ TẶNG</p>
                        <div className="bg-red-800 rounded-full p-1"><DownloadIcon /></div>
                    </div>
                    <p className="text-lg font-semibold mt-1">{giftId}</p>

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
                        Mã QR phát hành lúc <span className="font-medium">{issuedAt}</span> <br />
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
                        <p className="text-sm font-medium">{giftId}</p>
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
            </div>
        </div>
    );
}
