import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { classAtom } from "@/state";

export interface RelatedClassessProps {
  currentClassId: string | undefined;
}

export default function RelatedProducts(props: RelatedClassessProps) {
  const products = useAtomValue(classAtom);
  const otherProducts = useMemo(
    () => products.filter((product) => product.classId !== props.currentClassId),
    [products, props.currentClassId]
  );

  return <ProductGrid replace classes={otherProducts} />;
}
