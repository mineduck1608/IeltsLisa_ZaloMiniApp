import { Class } from "../types";
import ClassItem from "./product-item";
import { HTMLAttributes } from "react";

export interface ClassGridProps extends HTMLAttributes<HTMLDivElement> {
  classes: Class[];
  replace?: boolean;
}

export default function ClassGrid({
  classes,
  className,
  replace,
  ...props
}: ClassGridProps) {
  return (
    <div
      className={"grid grid-cols-2 px-4 py-2 gap-4 ".concat(className ?? "")}
      {...props}
    >
      {classes.map((product) => (
        <ClassItem key={product.classId} class={product} replace={replace} />
      ))}
    </div>
  );
}
