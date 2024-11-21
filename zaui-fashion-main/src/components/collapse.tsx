import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import { useRealHeight } from "@/hooks";
import { animated, useSpring, useSpringValue } from "@react-spring/web";

export interface CollapseProps {
  items: {
    title: ReactNode;
    content: ReactNode;
  }[];
}

function CollapseItem(props: CollapseProps["items"][number]) {
  const [collapsed, setCollapsed] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const containerHeight = useRealHeight(container);
  const height = useSpringValue(0);

  useEffect(() => {
    height.start(collapsed ? 0 : 1);
  }, [collapsed]);

  return (
    <>
      <div
        className="py-3 flex justify-between items-center space-x-4 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="text-base font-medium">{props.title}</div>
        {collapsed ? <PlusIcon /> : <MinusIcon />}
      </div>
      <animated.div
        className="text-sm whitespace-pre-wrap text-subtitle overflow-hidden ease-in-out"
        style={{
          maxHeight: height.to((x) => x * containerHeight),
        }}
      >
        <div ref={container}>
          <div className="pb-3">{props.content}</div>
        </div>
      </animated.div>
    </>
  );
}

export default function Collapse(props: CollapseProps) {
  return (
    <div className="px-4 py-1">
      {props.items.map((item, index) => (
        <Fragment key={index}>
          <CollapseItem key={index} {...item} />
          {index < props.items.length - 1 && <HorizontalDivider />}
        </Fragment>
      ))}
    </div>
  );
}
