import { useAtom, useAtomValue } from "jotai";
import Tabs from "./tabs";
import { selectedTabIndexState, tabsState } from "@/state";

export default function CategoryTabs() {
  const tabs = useAtomValue(tabsState);
  const [selectedIndex, setSelectedIndex] = useAtom(selectedTabIndexState);
  return (
    <Tabs
      items={["Tất cả", "Hoạt động", "Feedback", "Ưu đãi"]}
      value={tabs[selectedIndex]}
      onChange={(tab) => setSelectedIndex(tabs.indexOf(tab))}
      renderLabel={(item) => item}
    />
  );
}
