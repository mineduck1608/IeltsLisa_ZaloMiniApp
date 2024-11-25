import ProfileActions from "./actions";
import FollowOA from "./follow-oa";
import PictureProfile from "./picture";
import Points from "./points";

export default function ProfilePage() {
  return (
    <div className="bg-section">
      <PictureProfile />
    <div className="min-h-full w-screen bg-section p-4 space-y-2.5 mt-8">
      <Points />
      <ProfileActions />
      <FollowOA />
    </div>
    </div>
  );
}
