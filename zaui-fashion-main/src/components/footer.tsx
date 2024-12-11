import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { cartState, userInfoAtom } from "@/state";
import { CartIcon, HomeIcon, ProfileIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import TransitionLink from "./transition-link";


export default function Footer() {
  const cart = useAtomValue(cartState); // Lấy giá trị của atom cartState
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

  useEffect(() => {
    fetchUserVoucher();
  }, [cart]); // chỉ gọi khi component load

  // Sử dụng useMemo để chỉ tạo lại NAV_ITEMS khi cart thay đổi
  const NAV_ITEMS = useMemo(() => [
    {
      name: "Trang chủ",
      path: "/",
      icon: HomeIcon,
    },
    {
      name: "Ví ưu đãi",
      path: "/cart",
      icon: (props) => (
        <div className="relative">
          {cart.length > 0 && (
            <div className="absolute top-0 left-[18px] h-4 px-1.5 pt-[1.5px] pb-[0.5px] rounded-full bg-[#FF3333] text-white text-[10px] leading-[14px] font-medium shadow-[0_0_0_2px_white]">
              {cart.length > 9 ? "9+" : cart.length}
            </div>
          )}
          <CartIcon {...props} />
        </div>
      ),
    },
    {
      name: "Cá nhân",
      path: "/profile",
      icon: ProfileIcon,
    },
  ], [cart]);

  return (
    <>
      <HorizontalDivider />
      <div
        className="w-full px-4 pt-2 grid"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
          paddingBottom: `max(16px, env(safe-area-inset-bottom))`,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <TransitionLink
            to={item.path}
            key={item.path}
            className="flex flex-col items-center space-y-0.5 p-1 pb-0.5 cursor-pointer active:scale-105"
          >
            {({ isActive }) => (
              <>
                <div className="w-6 h-6 flex justify-center items-center">
                  <item.icon active={isActive} />
                </div>
                <div className={`text-2xs ${isActive ? "text-primary" : ""}`}>
                  {item.name}
                </div>
              </>
            )}
          </TransitionLink>
        ))}
      </div>
    </>
  );
}
