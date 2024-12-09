import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import {
  unstable_useViewTransitionState,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import VariantPicker from "./variant-picker";
import { useEffect, useRef, useState } from "react";
import Collapse from "@/components/collapse";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import toast from "react-hot-toast";
import { Class } from "@/types";


export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classFetch, setClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const fetchClass = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const response = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Class/GetClassById?classId=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setClass(data); // Cập nhật state
      } else {
        console.error("Failed to fetch information:", response.status);
      }
    } catch (error) {
      console.error("Error fetching information:", error);
    } finally {
      setLoading(false); // Hoàn tất tải dữ liệu
    }
  };

  useEffect(() => {
    if (id) {
      fetchClass();
    }
  }, [id]);

  if (loading) {
    // Hiển thị khi đang tải
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4">
          <div className="py-2 mt-1">
            <img
              key={classFetch?.classId}
              src={classFetch?.classImg}
              alt={classFetch?.className}
              className="w-full h-full object-cover rounded-lg"
              style={{
                viewTransitionName: `product-image-${classFetch?.classId}`,
              }}
            />
          </div>
          <div className="text-lg font-bold mt-1 text-center">{classFetch?.className}</div>
          <div
            className="text-sm mt-1 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: classFetch?.classContent ?? '' }}
          />
          <div className="bg-section h-2 w-full"></div>
          <div className="font-medium py-2 px-4">
            <div className="pt-2 pb-2.5">Khóa học khác</div>
            <HorizontalDivider />
          </div>
          <RelatedProducts currentClassId={classFetch?.classId} />
        </div>

        <HorizontalDivider />
        {/* <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4">
        <Button
          large
          onClick={() => {
            addToCart(1);
            toast.success("Đã thêm vào giỏ hàng");
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          large
          primary
          onClick={() => {
            addToCart(1);
            navigate("/cart");
          }}
        >
          Mua ngay
        </Button>
      </div> */}
      </div>
    </div>
  );
}
