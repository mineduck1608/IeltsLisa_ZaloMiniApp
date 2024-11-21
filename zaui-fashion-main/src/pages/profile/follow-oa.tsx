import { useEffect } from "react";
import { showOAWidget } from "zmp-sdk";

export default function FollowOAWidget() {
  useEffect(() => {
    showOAWidget({
      id: "4342393047205568841",
      guidingText: "Quan tâm OA để nhận các đặc quyền ưu đãi",
      color: "#F7F7F8",
    });
  }, []);

  return <div id="4342393047205568841" />;
}
