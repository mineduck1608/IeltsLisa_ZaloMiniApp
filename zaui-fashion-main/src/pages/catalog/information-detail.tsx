import HorizontalDivider from "@/components/horizontal-divider";
import { useParams } from "react-router-dom";
import { Information } from "@/types";
import { useEffect, useState } from "react";
import RelatedInformation from "./related-informations";

export default function InformationDetailPage() {
  const { id } = useParams();
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const fetchInformation = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const response = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Information/GetInformationById?infoId=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setInformation(data); // Cập nhật state
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
      fetchInformation();
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

  if (!information) {
    // Hiển thị nếu không có dữ liệu
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Không tìm thấy thông tin.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4">
          <div className="text-lg font-semibold mt-2">{information.infoName}</div>
          <div className="py-2">
            <img
              key={information.infoId}
              src={information.infoImg}
              alt={information.infoName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="text-sm mt-1 whitespace-pre-wrap">{information.infoContent}</div>
        </div>
        <div className="bg-section h-2 w-full"></div>
        <div className="font-medium py-2 px-4">
          <div className="pt-2 pb-2.5">Thông tin khác</div>
          <HorizontalDivider />
        </div>
        <RelatedInformation currentInformationId={information.infoId} />
      </div>

      <HorizontalDivider />
    </div>
  );
}
