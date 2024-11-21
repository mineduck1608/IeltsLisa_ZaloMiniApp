import { Select } from "@/components/lazyloaded";
import { SelectSkeleton } from "@/components/skeleton";
import { useAtom, useAtomValue } from "jotai";
import { Suspense } from "react";
import {
  colorsState,
  selectedColorState,
  selectedSizeState,
  sizesState,
} from "@/state";
import { Color } from "types";

export default function ProductFilter() {
  const sizes = useAtomValue(sizesState);
  const [size, setSize] = useAtom(selectedSizeState);
  const colors = useAtomValue(colorsState);
  const [color, setColor] = useAtom(selectedColorState);

  return (
    <div className="flex px-4 py-3 space-x-2 overflow-x-auto">
      <Suspense fallback={<SelectSkeleton width={110} />}>
        <Select
          items={sizes}
          value={size}
          onChange={setSize}
          renderTitle={(selectedSize?: string) =>
            `Kích thước${selectedSize ? `: ${selectedSize}` : ""}`
          }
          renderItemKey={(size: string) => String(size)}
        />
      </Suspense>
      <Suspense fallback={<SelectSkeleton width={95} />}>
        <Select
          items={colors}
          value={color}
          onChange={setColor}
          renderTitle={(selectedColor?: Color) =>
            `Màu sắc${selectedColor ? `: ${selectedColor.name}` : ""}`
          }
          renderItemLabel={(color: Color) => color.name}
          renderItemKey={(color: Color) => color.name}
        />
      </Suspense>
      {(color !== undefined || size !== undefined) && (
        <button
          className="bg-primary text-white rounded-full h-8 flex-none px-3"
          onClick={() => {
            setColor(undefined);
            setSize(undefined);
          }}
        >
          Xoá bộ lọc
        </button>
      )}
    </div>
  );
}
