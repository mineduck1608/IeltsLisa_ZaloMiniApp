import { Information } from "../types";
import TransitionLink from "./transition-link";
import { HTMLAttributes, useState } from "react";

export interface InformationGridProps extends HTMLAttributes<HTMLDivElement> {
  informations: Information[];
  replace?: boolean;
}

export default function InformationGrid({
  informations,
  className,
  replace,
  ...props
}: InformationGridProps) {

  if (!informations || informations.length === 0) {
    return (
        <div className="text-center py-4">
            <p className="text-sm text-gray-500">Không có thông tin nào để hiển thị.</p>
        </div>
    );
}
  return (
    <div
      className={"grid px-4 py-2".concat(className ?? "")}
      {...props}
    >
      {informations.map((information) => {
        const [selected, setSelected] = useState(false);
        return (
          <TransitionLink
            key={information.infoId}
            className="flex flex-col cursor-pointer group"
            to={`/information/${information.infoId}`}
            replace={replace}
            onClick={() => setSelected(true)}
          >
            {({ isTransitioning }) => (
              <>
                <img
                  src={information.infoImg}
                  className="w-full h-40 aspect-square object-cover rounded-t-lg"
                  style={{
                    viewTransitionName:
                      isTransitioning && selected
                        ? `${information.infoId}`
                        : undefined,
                  }}
                  alt={information.infoName}
                />
                <div className="py-2">
                  <div className="text-xs line-clamp-2">{information.infoName}</div>
                  <div className="text-3xs text-subtitle line-clamp-2">{information.infoContent}</div>

                </div>
              </>
            )}
          </TransitionLink>
        );
      })}
    </div>
  );
}
