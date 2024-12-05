import { Product } from "types";
import TransitionLink from "./transition-link";
import { useState } from "react";
import pic from "../../www/assets/ieltslisalogo-CR4Zp28I.png"

export interface ProductItemProps {
    product: Product;
    /**
     * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
     * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
     */
    replace?: boolean;
}

export default function GiftItem(props: ProductItemProps) {
    const [selected, setSelected] = useState(false);

    return (
        <div className="w-full">
            {/* Tiêu đề chỉ xuất hiện một lần */}
            <TransitionLink
                className="flex flex-col cursor-pointer group"
                to={`/product/${props.product.id}`}
                replace={props.replace}
                onClick={() => setSelected(true)}
            >
                {({ isTransitioning }) => (
                    <>
                        <div className="w-full relative max-w-screen flex justify-between items-center p-2 border border-gray-300 rounded-lg mb-3">
                            <img className="w-14 h-14 ml-2" src={pic} alt="Ưu đãi" />
                            <p className="text-sm font-medium absolute left-1/4 top-1/4">Voucher name</p>
                            <p className="text-sm absolute left-1/4 bottom-1/4 truncate w-2/5">Voucher name1231231212312312312312312312s</p>
                            <button className="mr-4 bg-red-800 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                                Nhận mã
                            </button>
                        </div>
                    </>
                )}
            </TransitionLink>
        </div>
    );
}
