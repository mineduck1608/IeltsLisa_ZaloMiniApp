import GiftGrid from "@/components/gift-grid";
import { useAtomValue } from "jotai";
import { flashSaleProductsState } from "@/state";

export default function Gift() {
  const products = useAtomValue(flashSaleProductsState);

  return (
    <>
      <GiftGrid products={products} />
    </>
  );
}
