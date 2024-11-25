import { Product } from "types";
import TransitionLink from "./transition-link";
import { useState } from "react";

export interface ProductItemProps {
    product: Product;
    /**
     * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
     * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
     */
    replace?: boolean;
}

export default function FeedbackItem(props: ProductItemProps) {
    const [selected, setSelected] = useState(false);

    return (
        <TransitionLink
            className="flex flex-col cursor-pointer group"
            to={`/product/${props.product.id}`}
            replace={props.replace}
            onClick={() => setSelected(true)}
        >
            {({ isTransitioning }) => (
                <>
                    <img
                        src={props.product.image}
                        className="w-full h-28 aspect-square object-cover rounded-lg"
                        style={{
                            viewTransitionName:
                                isTransitioning && selected // only animate the "clicked" product item in related products list
                                    ? `product-image-${props.product.id}`
                                    : undefined,
                        }}
                        alt={props.product.name}
                    />
                    <div className="py-2">
                        <div className="text-xs font-semibold px-4 text-center">
                            {props.product.info}
                        </div>
                        <div className="text-3xs text-subtitle text-center">{props.product.name}</div>          </div>
                </>
            )}
        </TransitionLink>
    );
}
