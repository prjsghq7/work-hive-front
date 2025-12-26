
import {useAuth} from "../AuthContext.jsx";
import Loading from "../../../components/loading/Loading.jsx";
import {useEffect, useRef, useState} from "react";
import {editService} from "../../../services/user/userService.js";
import MypageForm from "./MypageForm.jsx";

export default function Mypage() {
    const {user, loading} = useAuth();
    const fileRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [serverImgUrl, setServerImgUrl] = useState(null);


    const loadServerImage = async () => {
        try {
            const res = await editService.getProfileImageBlob();
            const url = URL.createObjectURL(res.data);
            setServerImgUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } catch (e) {
            // 서버 이미지 못 가져오면 그냥 null 유지(백엔드에서 default 이미지를 주면 여기서도 정상)
            setServerImgUrl(null);
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
            setPhoneNumber(user.phoneNumber ?? "");
            loadServerImage(); // ✅ 처음 로드
        }
    }, [user]);

    if (loading) return <Loading message="불러오는중입니다."/>;
    if (!user) return <div>정보가 없습니다.</div>;


    const onClickChange = () => fileRef.current?.click();

    const onChangeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택하세요.");
            return;
        }
        setProfileImage(file);

        const url = URL.createObjectURL(file);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editService.editUserInfo({
                name,
                email,
                phoneNumber,
                profile: profileImage,
            });

            alert("프로필이 수정되었습니다.");
            setProfileImage(null);
            setPreviewUrl(null);

            await loadServerImage(); // ✅ 업로드 후 서버 이미지 다시 로드
        } catch (err) {
            console.error(err);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <MypageForm
            fileRef={fileRef}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            profileImage={profileImage}
            previewUrl={previewUrl}
            serverImgUrl={serverImgUrl}
            onClickChange={onClickChange}
            onChangeFile={onChangeFile}
            handleSubmit={handleSubmit}/>
    );
}