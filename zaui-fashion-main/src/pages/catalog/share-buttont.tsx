import { ChevronRight, ShareDecor } from "@/components/vectors";
import { Product } from "types";
import { openShareSheet } from "zmp-sdk";

export default function ShareButton(props: { product: Product }) {
  const share = () => {
    openShareSheet({
      type: "zmp_deep_link",
      data: {
        title: props.product.name,
        thumbnail: props.product.image,
        path: `/product/${props.product.id}`,
      },
    });
  };

  return (
    <button
      className="relative p-4 w-full flex space-x-1 bg-[#016BD9] rounded-lg text-white text-sm font-medium cursor-pointer"
      onClick={share}
    >
      <div>Chia sẻ ngay cho bạn bè</div>
      <ChevronRight />
      <div className="absolute right-5 top-[11px]">
        <ShareDecor />
      </div>
    </button>
  );
}
