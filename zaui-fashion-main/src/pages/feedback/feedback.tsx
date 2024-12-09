import FeedbackGrid from "@/components/feedback-grid";
import { useSetAtom } from "jotai";
import { feedbackAtom } from "@/state";
import { useEffect, useState } from "react";
import { Feedback } from "@/types";

export default function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const setFeedback = useSetAtom(feedbackAtom);

  const [isFetched, setIsFetched] = useState(false);

  const Feedbacks = async () => {
    try {
      const feedback = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Feedback/GetAll`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (feedback.ok) {
        const feedbackRes = await feedback.json();
        // Cập nhật state và atom với dữ liệu đã lọc
        setFeedback(feedbackRes);
        setFeedbacks(feedbackRes);
        setIsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      Feedbacks(); // Chỉ gọi khi chưa fetch
    }
  }, [isFetched]); // Chỉ gọi lại khi isFetched thay đổi

  return (
    <>
      <FeedbackGrid feedbacks={feedbacks} />
    </>
  );
}
