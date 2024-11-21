import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import CartItem from "./cart-item";

export default function CartList() {
  const cart = useAtomValue(cartState);

  return (
    <div className="flex-1 overflow-y-auto">
      {cart.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}
    </div>
  );
}
