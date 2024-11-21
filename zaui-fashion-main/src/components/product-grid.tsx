import { Product } from "types";
import ProductItem from "./product-item";
import { HTMLAttributes } from "react";

export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  products: Product[];
  replace?: boolean;
}

export default function ProductGrid({
  products,
  className,
  replace,
  ...props
}: ProductGridProps) {
  return (
    <div
      className={"grid px-4 py-2".concat(className ?? "")}
      {...props}
    >
      {products.map((product) => (
        <ProductItem key={product.id} product={product} replace={replace} />
      ))}
    </div>
  );
}
