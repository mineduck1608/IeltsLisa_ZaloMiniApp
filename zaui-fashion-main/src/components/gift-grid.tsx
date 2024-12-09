import { Voucher } from "../types";
import { HTMLAttributes } from "react";
import pic from "../../www/assets/ieltslisalogo-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I-CR4Zp28I.png";
import { useAtomValue, useSetAtom } from "jotai";
import { userInfoAtom, voucherAtom } from "@/state";
import { showToast } from "zmp-sdk/apis";

export interface VoucherItemProps {
    voucher: Voucher;
    replace?: boolean;
}

export interface VoucherGridProps extends HTMLAttributes<HTMLDivElement> {
    vouchers: Voucher[];
    replace?: boolean;
}

export default function GiftGrid({
    vouchers,
    className,
    ...props
}: VoucherGridProps) {
    const voucherAtomValue = useAtomValue(voucherAtom);  // Lấy dữ liệu từ atom
    const userInfo = useAtomValue(userInfoAtom);
    const setVoucherAtom = useSetAtom(voucherAtom);
    console.log(voucherAtomValue);

    const AddUserVoucher = async (voucher: Voucher) => {
        try {
            console.log("Voucher được chọn:", voucher);

            if (!voucher || !voucher.voucherId) {
                console.error("Voucher không hợp lệ.");
                return;
            }

            // Gọi API để lấy giftId
            const giftIdResponse = await fetch(
                `https://ieltslisazaloapp.azurewebsites.net/VoucherGift/GetVoucherGift?voucherId=${voucher.voucherId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!giftIdResponse.ok) {
                console.error("Không thể lấy thông tin voucher gift:", giftIdResponse.statusText);
                return;
            }

            const giftRes = await giftIdResponse.json();
            console.log("Thông tin gift:", giftRes);

            // Gọi API để thêm voucher cho user
            const addUserVoucherResponse = await fetch(
                `https://ieltslisazaloapp.azurewebsites.net/UserVoucher/AddUserVoucher?voucherId=${voucher.voucherId}&userId=${userInfo?.id}&giftId=${giftRes.giftId}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!addUserVoucherResponse.ok) {
                console.error("Không thể thêm voucher:", addUserVoucherResponse.statusText);
                return;
            }

            const addUserMessage = await addUserVoucherResponse.json();
            console.log("Kết quả thêm voucher:", addUserMessage);

            // Hiển thị thông báo thành công
            await showToast({
                message: `Chúc mừng bạn đã nhận được ${giftRes.giftDescription}`,
            });
            const userVoucher = await fetch(
                `https://ieltslisazaloapp.azurewebsites.net/Voucher/GetNotOwnVoucher?userId=${userInfo?.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              if (userVoucher.ok) {
                const voucherRes = await userVoucher.json();
        
                // Lọc các voucher bị trùng lặp
                const uniqueVouchers = voucherRes.filter(
                  (item, index, self) =>
                    index === self.findIndex((v) => v.voucherId === item.voucherId)
                );
        
                console.log("Unique vouchers:", uniqueVouchers);
        
                // Cập nhật state và atom với dữ liệu đã lọc
                setVoucherAtom(uniqueVouchers);
              }
        } catch (error) {
            console.error("Lỗi khi xử lý AddUserVoucher:", error);
        }
    };

    if (!voucherAtomValue || voucherAtomValue.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-sm text-gray-500">Không có ưu đãi nào để hiển thị.</p>
            </div>
        );
    }

    return (
        <div
            className={"grid grid-cols-1 px-4 py-2 gap-4".concat(className ?? "")}
            {...props}
        >
            <p className="text-sm font-medium p-2 truncate">Ưu đãi hiện có:</p>
            {voucherAtomValue?.map((voucher) => (
                <div
                    key={voucher.voucherId}  // Nên thêm `key` để tránh lỗi trong React
                    className="w-full relative max-w-screen flex justify-between items-center p-2 border border-gray-300 rounded-lg mb-3"
                >
                    <img className="w-14 h-14 ml-2" src={pic} alt="Ưu đãi" />
                    <p className="text-sm font-medium absolute left-1/4 top-1/4">{voucher.voucherCode}</p>
                    <p className="text-sm absolute left-1/4 bottom-1/4 truncate w-2/5">{voucher.voucherName}</p>
                    <button className="mr-4 bg-red-800 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
                        onClick={() => AddUserVoucher(voucher)}>
                        Nhận mã
                    </button>
                </div>
            ))}
        </div>
    );
}
