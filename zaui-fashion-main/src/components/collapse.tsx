import { useEffect, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import { useRealHeight } from "@/hooks";
import { animated, useSpringValue } from "@react-spring/web";

export interface CollapseProps {
  content: string;
  title: string;
}

function CollapseItem({ content, title }: { content: string; title: string }) {
  const [collapsed, setCollapsed] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const containerHeight = useRealHeight(container);
  const height = useSpringValue(0);

  useEffect(() => {
    height.start(collapsed ? 1 : 0);
  }, [collapsed]);

  return (
    <>
      <div
        className="py-3 flex justify-between items-center space-x-4 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="text-base font-medium">{title}</div>
        {collapsed ? <PlusIcon /> : <MinusIcon />}
      </div>
      <animated.div
        className="text-sm whitespace-pre-wrap overflow-hidden ease-in-out"
        style={{
          maxHeight: height.to((x) => x * containerHeight),
        }}
      >
        <div ref={container}>
          <div className="pb-2">{content}</div>
        </div>
      </animated.div>
    </>
  );
}

export default function Collapse({ content, title }: CollapseProps) {
  return (
    <div className="px-4 py-1">
      <CollapseItem content={content} title={title} />
    </div>
  );
}
