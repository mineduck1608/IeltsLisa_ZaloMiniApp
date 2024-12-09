import HorizontalDivider from "@/components/horizontal-divider";
import { useParams } from "react-router-dom";
import { Feedback } from "@/types";
import { useEffect, useState } from "react";
import RelatedFeedback from "./related-feedback";
import Collapse from "@/components/collapse";

export default function FeedbackDetailPage() {
    const { id } = useParams();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading

    const fetchFeedback = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const response = await fetch(
                `https://ieltslisazaloapp.azurewebsites.net/Feedback/GetFeedbackById?feedbackId=${id}`
            );
            if (response.ok) {
                const data = await response.json();
                setFeedback(data); // Cập nhật state
            } else {
                console.error("Failed to fetch feedback:", response.status);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false); // Hoàn tất tải dữ liệu
        }
    };

    useEffect(() => {
        if (id) {
            fetchFeedback();
        }
    }, [id]);

    if (loading) {
        // Hiển thị khi đang tải
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p>Đang tải phản hồi...</p>
            </div>
        );
    }

    if (!feedback) {
        // Hiển thị nếu không có dữ liệu
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p>Không tìm thấy phản hồi.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="w-full px-4">
                    <div className="text-lg font-semibold mt-2">{feedback.fbTitle}</div>
                    <div className="py-2">
                        <img
                            key={feedback.fbId}
                            src={feedback.fbPic}
                            alt={feedback.fbTitle}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <HorizontalDivider />

                    <>
                        <div className="bg-section h-2 w-full"></div>
                        <Collapse content={feedback.fbName} title="Học viên:" />
                    </>
                    <>
                        <div className="bg-section h-2 w-full"></div>
                        <Collapse content={feedback.fbClass} title="Lớp:" />
                    </>
                    <>
                        <div className="bg-section h-2 w-full"></div>
                        <Collapse content={feedback.fbContent} title="Cảm nhận học viên:" />
                    </>
                </div>
                <div className="bg-section h-2 w-full"></div>
                <div className="font-medium py-2 px-4">
                    <div className="pt-2 pb-2.5">Phản hồi khác</div>
                    <HorizontalDivider />
                </div>
                <RelatedFeedback currentFeedbackId={feedback.fbId} />
            </div>

            <HorizontalDivider />
        </div>
    );
}
