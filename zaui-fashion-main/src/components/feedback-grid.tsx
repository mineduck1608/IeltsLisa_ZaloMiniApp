import { Product } from "types";
import ProductItem from "./product-item";
import { HTMLAttributes } from "react";
import FeedbackItem from "./feedback-item";

export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  products: Product[];
  replace?: boolean;
}

export default function FeedbackGrid({
  products,
  className,
  replace,
  ...props
}: ProductGridProps) {
  return (
    <div
      className={"grid grid-cols-2 px-4 py-2 gap-4".concat(className ?? "")}
      {...props}
    >
      {products.map((product) => (
        <FeedbackItem key={product.id} product={product} replace={replace}/>
      ))}
    </div>
  );
}