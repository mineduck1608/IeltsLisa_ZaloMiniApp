import { Feedback } from "../types";
import TransitionLink from "./transition-link";
import { HTMLAttributes, useState } from "react";

export interface FeedbackGridProps extends HTMLAttributes<HTMLDivElement> {
  feedbacks: Feedback[];
  replace?: boolean;
}

export default function FeedbackGrid({
  feedbacks,
  className,
  replace,
  ...props
}: FeedbackGridProps) {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">Không có phản hồi nào để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className={"grid px-4 py-2".concat(className ?? "")} {...props}>
      {feedbacks.map((feedback) => {
        const [selected, setSelected] = useState(false);

        return (
          <TransitionLink
            key={feedback.fbId}
            className="flex flex-col cursor-pointer group"
            to={`/feedback/${feedback.fbId}`}
            replace={replace}
            onClick={() => setSelected(true)}
          >
            {({ isTransitioning }) => (
              <>
                {feedback.fbPic && (
                  <img
                    src={feedback.fbPic}
                    className="w-full h-40 aspect-square object-cover rounded-t-lg"
                    style={{
                      viewTransitionName:
                        isTransitioning && selected
                          ? `${feedback.fbId}`
                          : undefined,
                    }}
                    alt={feedback.fbName}
                  />
                )}
                <div className="py-2">
                  <div className="text-xs line-clamp-2">{feedback.fbTitle}</div>
                  <div className="text-3xs text-subtitle line-clamp-2">{feedback.fbContent}</div>
                </div>
              </>
            )}
          </TransitionLink>
        );
      })}
    </div>
  );
}
