import ProductFilter from "./product-filter";
import HorizontalDivider from "@/components/horizontal-divider";
import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { classAtom } from "@/state";

export default function ProductListPage() {
  const classes = useAtomValue(classAtom);

  return (
    <>
      <ProductFilter />
      <HorizontalDivider />
      <ProductGrid classes={classes} className="pt-4 pb-[13px]" />
    </>
  );
}
