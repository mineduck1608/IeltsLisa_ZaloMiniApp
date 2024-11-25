import CartList from "./cart-list";
import ApplyVoucher from "./apply-voucher";
import CartSummary from "./cart-summary";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import { EmptyBoxIcon } from "@/components/vectors";


export default function CartPage() {
  const cart = useAtomValue(cartState);

  if (!cart.length) {
    return (
      <>
        <div className="news-header">
          <span className="highlight-bar"></span>
          <div className="text-xl">Quà ưu đãi</div>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
          <EmptyBoxIcon />
          <h1 className="font-bold text-xl">Bạn hiện không có ưu đãi nào</h1>
          <div className="text-center px-2.5">
            Nhiều ưu đãi, quà tặng hấp dẫn từ trung tâm đang chờ bạn
          </div>
          <button className="flex items-center px-4 py-2 bg-red-700 text-white rounded-full shadow-md hover:bg-red-800 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="30"
              height="30"
              fill="white"
              className="mr-2"
            >
              <g>
                <path
                  d="M62.242,53.757L51.578,43.093C54.373,38.736,56,33.56,56,28C56,12.536,43.464,0,28,0S0,12.536,0,28
        s12.536,28,28,28c5.56,0,10.736-1.627,15.093-4.422l10.664,10.664c2.344,2.344,6.142,2.344,8.485,0S64.586,56.101,62.242,53.757z
        M28,54C13.641,54,2,42.359,2,28S13.641,2,28,2s26,11.641,26,26S42.359,54,28,54z M60.828,60.828c-1.562,1.562-4.095,1.562-5.656,0
        L44.769,50.425c2.145-1.606,4.051-3.513,5.657-5.656l10.402,10.402C62.391,56.732,62.391,59.266,60.828,60.828z"
                />
                <path
                  d="M28,4C14.745,4,4,14.745,4,28s10.745,24,24,24s24-10.745,24-24S41.255,4,28,4z M28,50
        C15.85,50,6,40.15,6,28S15.85,6,28,6s22,9.85,22,22S40.15,50,28,50z"
                />
                <path
                  d="M28,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c8.284,0,15,6.716,15,15c0,0.553,0.447,1,1,1s1-0.447,1-1
        C45,18.611,37.389,11,28,11z"
                />
              </g>
            </svg>
            <div className="font-medium">Khám phá ngay</div>
          </button>
        </div >
      </>
    );
  }
  return (
    <div className="w-full h-full flex flex-col bg-skeleton">
      <div className="news-header">
        <span className="highlight-bar"></span>
        <div className="text-xl">Quà ưu đãi</div>
      </div>
    </div>
  );
}
