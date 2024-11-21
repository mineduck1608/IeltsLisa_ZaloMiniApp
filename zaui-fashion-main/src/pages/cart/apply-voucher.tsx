import { VoucherIcon, ChevronRight } from "@/components/vectors";
import { useToBeImplemented } from "@/hooks";

export default function ApplyVoucher() {
  const toBeImplemented = useToBeImplemented();
  return (
    <div
      className="flex-none flex items-center py-2 px-4 space-x-2 cursor-pointer"
      onClick={toBeImplemented}
    >
      <VoucherIcon />
      <div className="text-sm flex-1">Voucher</div>
      <div className="flex items-center space-x-1">
        <div className="text-sm font-medium">Chọn</div>
        <ChevronRight />
      </div>
    </div>
  );
}
