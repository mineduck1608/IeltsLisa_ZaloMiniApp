import { useAtomValue } from 'jotai';
import { userInfoAtom } from '../../state';
export default function PictureProfile() {
    const userInfo = useAtomValue(userInfoAtom);
    return (
        <div className="min-h-full w-full bg-section space-y-2.5">
            {/* Phần Header: hiển thị ảnh nền và ảnh đại diện */}
            <div className="relative bg-cover bg-center h-32" style={{ backgroundImage: `url(${userInfo?.avatar})` }}>
                {/* Avatar */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <img
                        src={userInfo?.avatar}
                        alt="Avatar"
                        className="w-28 h-26 rounded-full border-4 border-white shadow-md"
                    />
                </div>
            </div>

            {/* Phần mô tả */}
            <div className="text-center relative" style={{ top: '35px' }}>
                <h1 className="text-xl font-bold text-gray-800">{userInfo?.name}</h1>
            </div>
        </div>
    );
}
