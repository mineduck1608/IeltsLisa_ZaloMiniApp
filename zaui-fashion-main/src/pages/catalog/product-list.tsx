import ProductFilter from "./product-filter";
import HorizontalDivider from "@/components/horizontal-divider";
import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { productsState } from "@/state";

export default function ProductListPage() {
  const products = useAtomValue(productsState);

  return (
    <>
      <ProductFilter />
      <HorizontalDivider />
      <ProductGrid products={products} className="pt-4 pb-[13px]" />
    </>
  );
}
