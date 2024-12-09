import GiftGrid from "@/components/gift-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { userInfoAtom } from "@/state";
import { useEffect, useState } from "react";
import { Voucher } from "../../types";
import { voucherAtom } from "@/state";

export default function Gift() {
  const userInfo = useAtomValue(userInfoAtom);
  const [voucher, setVoucher] = useState<Voucher[]>([]);
  const setVoucherAtom = useSetAtom(voucherAtom);
  const [isFetched, setIsFetched] = useState(false);

  const Vouchers = async () => {
    try {
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
        setVoucher(uniqueVouchers);
        setVoucherAtom(uniqueVouchers);
        setIsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      Vouchers(); // Chỉ gọi khi chưa fetch
    }
  }, [isFetched]); // Chỉ gọi lại khi isFetched thay đổi

  return (
    <>
      <GiftGrid vouchers={voucher} />
    </>
  );
}
