export interface VariantPickerProps<T> {
  title: string;
  variants: T[];
  renderVariant: (variant: T, selected?: boolean) => React.ReactNode;
  value: T;
  onChange: (variant: T) => void;
}

export default function VariantPicker<T>(props: VariantPickerProps<T>) {
  return (
    <div className="py-4 space-y-2">
      <div className="text-base font-medium text-inactive">{props.title}</div>
      <div className="flex overflow-x-auto space-x-2">
        {props.variants.map((variant, index) => (
          <div
            key={index}
            className="flex-none w-8 h-8 rounded-full overflow-hidden cursor-pointer"
            onClick={() => props.onChange(variant)}
          >
            {props.renderVariant(variant, props.value === variant)}
          </div>
        ))}
      </div>
    </div>
  );
}
