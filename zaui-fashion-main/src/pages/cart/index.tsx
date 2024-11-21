import CartList from "./cart-list";
import ApplyVoucher from "./apply-voucher";
import CartSummary from "./cart-summary";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";
import SelectAll from "./select-all";

export default function CartPage() {
  const cart = useAtomValue(cartState);

  if (!cart.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
        <EmptyBoxIcon />
        <div className="text-2xs text-inactive text-center">
          Hiện không có voucher nào       
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col">
      <SelectAll />
      <HorizontalDivider />
      <CartList />
      <HorizontalDivider />
      <ApplyVoucher />
      <HorizontalDivider />
      <CartSummary />
    </div>
  );
}
