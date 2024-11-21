import Button from "./button";
import { MinusIcon, PlusIcon } from "./vectors";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
}

export default function QuantityInput(props: QuantityInputProps) {
  return (
    <div className="flex items-center">
      <button
        className="p-1 bg-secondary rounded"
        onClick={() =>
          props.onChange(Math.max(props.minValue ?? 0, props.value - 1))
        }
      >
        <MinusIcon width={10} height={10} />
      </button>
      <input
        style={{ width: `calc(${String(props.value).length}ch + 16px)` }}
        className="px-2 text-xs focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={props.value}
        type="number"
        inputMode="numeric"
        onChange={(e) =>
          props.onChange(
            Math.max(props.minValue ?? 0, Number(e.currentTarget.value))
          )
        }
      />
      <button
        className="p-1 bg-secondary rounded"
        onClick={() => props.onChange(props.value + 1)}
      >
        <PlusIcon width={10} height={10} />
      </button>
    </div>
  );
}
