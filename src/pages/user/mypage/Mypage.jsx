// import {useAuth} from "../AuthContext.jsx";
// import Loading from "../../../components/loading/Loading.jsx";
// import {useRef, useState} from "react";
//
// export default function Mypage() {
//     const {user, loading} = useAuth();
//
//     const fileRef = useRef(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [profileImage, setProfileImage] = useState(null);
//     if (loading) return <Loading message="불러오는중입니다."/>;
//     if (!user) return <div>정보가 없습니다.</div>;
//
//     const onClickChange = () => {
//         fileRef.current?.click(); //changeBtn클릭 시 input 클릭
//     }
//     const onChangeFile = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) {
//             return;
//         }
//         const reader = new FileReader();
//         reader.onload = (ev) => setPreviewUrl(ev.target.result);
//         reader.readAsDataURL(file);
//
//         setProfileImage(file);
//     }
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//     }
//     return (
//         <div>
//             <h2>내 정보</h2>
//             <div>{user.name ?? "-"}</div>
//
//             <img
//                 src={previewUrl ?? "/user/profile-image"} // 선택하면 preview, 아니면 서버 이미지
//                 alt="프로필 이미지"
//                 style={{width: 120, height: 120, borderRadius: "50%"}}
//             />
//
//             {/* 실제 파일 input은 숨기고 ref로 클릭만 */}
//             <input
//                 ref={fileRef}
//                 type="file"
//                 accept="image/*"
//                 style={{display: "none"}}
//                 onChange={onChangeFile}
//             />
//
//             <button type="button" onClick={onClickChange}>
//                 이미지 변경
//             </button>
//
//             <div>{user.email ?? "-"}</div>
//             {profileImage && <div>선택됨:{profileImage.name}</div>}
//             {previewUrl && <div>선택됨:{previewUrl.name}</div>}
//
//             <button type="submit" onClick={handleSubmit}></button>
//
//             {/* 여기서 profileImage를 FormData로 서버에 보내면 됨 */}
//             {/* 예: profileImage && <div>선택됨: {profileImage.name}</div> */}
//         </div>
//     );
// }

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
            onChanegFile={onChangeFile}
            handleSubmit={handleSubmit}/>
    );
}