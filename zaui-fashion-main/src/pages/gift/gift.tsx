import FeedbackGrid from "@/components/feedback-grid";
import { useAtomValue } from "jotai";
import { flashSaleProductsState } from "@/state";

export default function Gift() {
  const products = useAtomValue(flashSaleProductsState);

  return (
    <>
      <FeedbackGrid products={products} />
    </>
  );
}
