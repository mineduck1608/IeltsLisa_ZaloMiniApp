import Section from "@/components/section";
import { useState, useEffect } from "react";
import { Information } from "@/types";
import { useSetAtom } from "jotai";
import { informationAtom } from "@/state";
import InformationGrid from "@/components/information-grid";


export default function FlashSales() {
  const setInformationAtom = useSetAtom(informationAtom);
  
  const [isFetched, setIsFetched] = useState(false);
  const [information, setInformation] = useState<Information[]>([]);

  const Informations = async () => {
    try {
      const information = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Information/GetAll`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (information.ok) {
        const infoRes = await information.json();

        // Cập nhật state và atom với dữ liệu đã lọc
        setInformation(infoRes);
        setInformationAtom(infoRes);
        setIsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      Informations(); // Chỉ gọi khi chưa fetch
    }
  }, [isFetched]); // Chỉ gọi lại khi isFetched thay đổi



  return (
    <Section title="Thông tin" viewMoreTo="/flash-sales">
      <InformationGrid informations={information} />
    </Section>
  );
}
