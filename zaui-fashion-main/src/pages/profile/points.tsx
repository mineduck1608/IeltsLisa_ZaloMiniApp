import pointsCover from "@/static/points-cover.png";
import Barcode from "./barcode";

export default function Points() {
  return (
    <div
      className="rounded-lg bg-primary text-white p-8 pt-6 bg-cover text-center"
      style={{
        backgroundImage: `url(${pointsCover})`,
      }}
    >
      <div className="text-xl font-medium opacity-95">20 điểm</div>
      <div className="opacity-95 text-2xs">HSD: 02/12/2024</div>
      <div className="bg-white rounded-lg mt-2 py-2.5 space-y-2.5 flex flex-col items-center">
        <div className="text-2xs text-subtitle text-center">
          Quét mã để tích điểm
        </div>
        <Barcode />
      </div>
    </div>
  );
}
