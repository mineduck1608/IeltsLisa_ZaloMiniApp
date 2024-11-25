import { ReactNode } from "react";

export interface TabsProps<T> {
  items: T[];
  value: T;
  onChange: (item: T) => void;
  renderLabel: (item: T) => ReactNode;
}

export default function Tabs<T>(props: TabsProps<T>) {
  return (
    <div
      className="grid h-11 border-b-[0.5px] border-black/10"
      style={{
        gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))`,
      }}
    >
      {props.items.map((item, i) => (
        <div
          key={i}
          className="h-full flex flex-col px-1 cursor-pointer"
          onClick={() => props.onChange(item)}
        >
          {/* Nội dung tab */}
          <div className="flex-1 flex items-center justify-center">
            <span
              className={`truncate ${
                item === props.value
                  ? "font-bold text-black" // Tab được chọn
                  : "font-medium text-gray-500" // Tab không được chọn
              }`}
            >
              {props.renderLabel(item)}
            </span>
          </div>
          {/* Gạch chân nếu là tab được chọn */}
          {props.value === item && (
            <div className="bg-black h-[2px] rounded-t-sm -mt-px" />
          )}
        </div>
      ))}
    </div>
  );
}
