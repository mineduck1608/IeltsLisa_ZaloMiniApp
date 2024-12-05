import { ReactNode, useEffect, useState } from "react";
import { ChevronDown } from "./vectors";
import { Picker } from "zmp-ui";
import "zmp-ui/zaui.css";

export interface SelectProps<T> {
  renderTitle: (selectedItem?: T) => ReactNode;
  renderItemKey: (item: T) => string;
  renderItemLabel?: (item: T) => string;
  items: T[];
  value?: T;
  onChange: (selectedItem?: T) => void;
}

export default function Select<T>(props: SelectProps<T>) {
  const [localValue, setLocalValue] = useState(
    props.value ? props.renderItemKey(props.value) : ""
  );

  const flush = () => {
    const selectedItem = props.items.find(
      (item) => props.renderItemKey(item) === localValue
    );
    props.onChange(selectedItem);
  };

  return (
    <div>
    </div>
  );
}
