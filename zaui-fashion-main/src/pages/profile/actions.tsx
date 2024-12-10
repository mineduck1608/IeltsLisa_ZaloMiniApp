import {
  OrderHistoryIcon,
  PackageIcon,
  ProfileIcon,
  VoucherIcon,
} from "@/components/vectors";
import { useToBeImplemented } from "@/hooks";
import { openPermissionSetting } from "zmp-sdk/apis";

export default function ProfileActions() {
  const toBeImplemented = useToBeImplemented();

  const callAPI = async () => {
    try {
      await openPermissionSetting({});
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 grid grid-cols-4 gap-4 border-[0.5px] border-black/15">
      {[
        {
          label: "Thông tin cấp quyền",
          icon: ProfileIcon,
          onClick: callAPI,
        },
        {
          label: "Đổi voucher",
          icon: VoucherIcon,
          onClick: toBeImplemented,
        },
        {
          label: "Theo dõi thông tin",
          icon: PackageIcon,
          onClick: toBeImplemented,
        },
        {
          label: "Lịch sử đổi quà",
          icon: OrderHistoryIcon,
          onClick: toBeImplemented,
        },
      ].map((action) => (
        <div
          key={action.label}
          className="flex flex-col gap-2 items-center cursor-pointer"
          onClick={action.onClick}
        >
          <div className="w-10 h-10 rounded-full bg-[#EBEFF7] flex items-center justify-center">
            <action.icon active />
          </div>
          <div className="text-2xs text-center">{action.label}</div>
        </div>
      ))}
    </div>
  );
}
