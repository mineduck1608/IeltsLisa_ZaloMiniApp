import { useAtom, useAtomValue } from "jotai";
import Tabs from "./tabs";
import { selectedTabIndexState, tabsState } from "@/state";
import Category from "@/pages/home/category";
import FlashSales from "@/pages/home/flash-sales";
import HorizontalDivider from "@/components/horizontal-divider";
import Feedback from "@/pages/feedback/feedback";
import Gift from "@/pages/gift/gift";;

export default function CategoryTabs() {
  const tabs = useAtomValue(tabsState);
  const [selectedIndex, setSelectedIndex] = useAtom(selectedTabIndexState);

  // Render nội dung theo tab được chọn
  const renderContent = () => {
    switch (tabs[selectedIndex]) {
      case "Tất cả":
        return <div>
          <Category />
          <HorizontalDivider />
          <FlashSales />
        </div>;
      case "Feedback":
        return <div><Feedback /></div>;
      case "Ưu đãi":
        return <div><Gift /></div>;
    }
  };

  return (
    <div>
      <Tabs
        items={["Tất cả", "Feedback", "Ưu đãi"]}
        value={tabs[selectedIndex]}
        onChange={(tab) => setSelectedIndex(tabs.indexOf(tab))}
        renderLabel={(item) => item}
      />
      <div className="mt-4">{renderContent()}</div> {/* Phần hiển thị nội dung */}
    </div>
  );
}
