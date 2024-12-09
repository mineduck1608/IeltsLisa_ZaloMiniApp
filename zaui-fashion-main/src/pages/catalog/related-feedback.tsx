import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { feedbackAtom } from "@/state";
import FeedbackGrid from "@/components/feedback-grid";

export interface RelatedFeedbacksProps {
  currentFeedbackId: string | undefined;
}

export default function RelatedFeedback(props: RelatedFeedbacksProps) {
  const products = useAtomValue(feedbackAtom);
  const otherProducts = useMemo(
    () => products.filter((product) => product.fbId !== props.currentFeedbackId),
    [products, props.currentFeedbackId]
  );

  return <FeedbackGrid replace feedbacks={otherProducts} />;
}
