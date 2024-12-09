import { Class } from "../types";
import TransitionLink from "./transition-link";
import { useState } from "react";

export interface ClassItemProps {
  class: Class;
  replace?: boolean;
}

export default function ClassItem(props: ClassItemProps) {
  const [selected, setSelected] = useState(false);

  if (!props.class || !props.class.classId) {
    console.error("Invalid class data", props.class);
    return <div>Class information is missing</div>;
  }

  return (
    <TransitionLink
      className="flex flex-col cursor-pointer group"
      to={`/product/${props.class.classId}`}
      replace={props.replace || false}
      onClick={() => setSelected(true)}
    >
      {({ isTransitioning }) => (
        <>
          <img
            src={props.class.classImg || "/placeholder.png"}
            className="w-full aspect-square object-cover rounded-t-lg"
            style={{
              viewTransitionName:
                isTransitioning && selected
                  ? `class-image-${props.class.classId}`
                  : undefined,
            }}
            alt={props.class.className || "Class"}
          />
          <div className="py-2">
            <div className="text-xs truncate">
              {props.class.className || "Unknown Category"}
            </div>
          </div>
        </>
      )}
    </TransitionLink>
  );
}
