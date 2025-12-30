import {useAuth} from "../AuthContext.jsx";
import Loading from "../../../components/loading/Loading.jsx";
import {useEffect, useRef, useState} from "react";
import {editService} from "../../../services/user/userService.js";
import MypageForm from "./MypageForm.jsx";
import {useDialog} from "../../../contexts/modal/DialogContext.jsx";
import {useApi} from "../../../hooks/useApi.js";

export default function Mypage() {
    const {user, loading, refreshUser} = useAuth();
    const fileRef = useRef(null);
    const title = user?.name ?? "";
    const totalDayOff = user?.totalDayOffs;
    const roleCode = user?.roleCode;
    const teamCode = user?.teamCode;
    const birth = user?.birth;
    const remainingDayOffs = user?.remainingDayOffs;
    const {openDialog} = useDialog();
    const {run} = useApi();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [serverImgUrl, setServerImgUrl] = useState(null);


    const loadServerImage = async () => {
        try {
            const blob = await run(()=>editService.getProfileImageBlob()) ;
            const url = URL.createObjectURL(blob);
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
            openDialog("회원 정보 수정", "이미지만 선택해주세요", "warning");
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
            await run(() => editService.editUserInfo({
                name,
                email,
                phoneNumber,
                profile: profileImage,
            }));

            openDialog("회원 정보 수정", "정보 수정을 완료하였습니다.", "success");
            setProfileImage(null);
            setPreviewUrl(null);

            await loadServerImage(); // ✅ 업로드 후 서버 이미지 다시 로드
            await refreshUser();
        } catch (err) {
            console.error(err);
            openDialog("회원 정보 수정", "정보 수정에 실패하였습니다.");
        }
    };

    return (
        <MypageForm
            title={title}
            fileRef={fileRef}
            name={name}
            birth={birth}
            remainingDayOffs={remainingDayOffs}
            teamCode={teamCode}
            totalDayOff={totalDayOff}
            roleCode={roleCode}
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