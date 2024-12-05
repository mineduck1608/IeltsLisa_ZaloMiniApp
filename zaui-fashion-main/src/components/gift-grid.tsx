import { Product } from "types";
import ProductItem from "./product-item";
import { HTMLAttributes } from "react";
import GiftItem from "./gift-item";

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
            className={"grid grid-cols-1 px-4 py-2 gap-4".concat(className ?? "")}
            {...props}
        >
            <p className="text-sm font-medium p-2 truncate">Ưu đãi hiện có:</p>
            {products.map((product) => (
                <GiftItem key={product.id} product={product} replace={replace} />
            ))}
        </div>
    );
}
