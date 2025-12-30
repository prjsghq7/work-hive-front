import "./MypageForm.min.css";
import {useEffect, useState} from "react";
import {subTableListService} from "../../../services/user/userService.js";
import {useApi} from "../../../hooks/useApi.js";

export default function MypageForm({
                                       fileRef,
                                       handleSubmit,
                                       onClickChange,
                                       onChangeFile,
                                       previewUrl,
                                       serverImgUrl,
                                       name,
                                       setName,
                                       email,
                                       setEmail,
                                       phoneNumber,
                                       setPhoneNumber,
                                       totalDayOff,
                                       roleCode,
                                       teamCode,
                                       birth,
                                       remainingDayOffs,
                                   }) {
    const { run } = useApi();
    const [roleList, setRoleList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);



    useEffect(() => {
        (async () => {
            try {
                const [teamBody, roleBody] = await Promise.all([
                    run(() => subTableListService.getTeamList()), // ✅ 여기서 body(res.data)로 변환됨
                    run(() => subTableListService.getRoleList()),
                ]);

                // teamBody / roleBody 는 이제 CommonResult(= res.data)
                setTeamList(teamBody?.data?.codes ?? []);
                setRoleList(roleBody?.data?.codes ?? []);
            } catch (e) {
                setTeamList([]);
                setRoleList([]);
            }
        })();
    }, [run]);

    const imgSrc = previewUrl || serverImgUrl;

    const roleText =
        roleList.find((r) => String(r.code) === String(roleCode))?.displayText ?? "-";
    const teamText =
        teamList.find((t) => String(t.code) === String(teamCode))?.displayText ?? "-";

    const onSubmit = async (e) => {
        setIsEditingName(false);
        await handleSubmit(e);
    }
    return (
        <div className="mypage">
            <form className="info" onSubmit={onSubmit}>
                <h2>프로필</h2>

                <section className="image">
                    <div className="image-box">
                        {imgSrc ? (
                            <img src={imgSrc} alt="프로필"/>
                        ) : (
                            <div className="profile-placeholder">No Image</div>
                        )}

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{display: "none"}}
                            onChange={onChangeFile}
                        />

                        <button
                            type="button"
                            className="-button --blue"
                            onClick={onClickChange}
                        >
                            이미지 변경
                        </button>
                    </div>

                    <div className="info-box">
                        <div className="row name-row">
                            <label>이름</label>
                            {!isEditingName ? (
                                <div>
                                    <span>{name || "-"}</span>
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => setIsEditingName(true)}
                                        title="이름 수정"
                                    >+
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                setIsEditingName(false);
                                            }
                                            if (e.key === "Escape") {
                                                setIsEditingName(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="row">
                            <label>이메일</label>
                            {!isEditingEmail ? (
                                <div>
                                    <span>
                                        {email || "-"}
                                    </span>
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => setIsEditingEmail(true)}
                                        title="이메일 수정"
                                    >+
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            setIsEditingEmail(false);
                                        }
                                        if (e.key === "Escape") {
                                            setIsEditingEmail(false);
                                        }
                                    }}
                                />
                            )}
                            {/*<input value={email} onChange={(e) => setEmail(e.target.value)}/>*/}
                        </div>
                    </div>
                </section>

                {/* 하단: 상세 정보 */}
                <section className="detail">
                    <div className="row">
                        <label>부서</label>
                        <span>{teamText}</span>
                    </div>

                    <div className="row">
                        <label>직급</label>
                        <span>{roleText}</span>
                    </div>

                    <div className="row">
                        <label>생일</label>
                        <span>{birth ?? "-"}</span>
                    </div>

                    <div className="row">
                        <label>연차</label>
                        <span>
              {remainingDayOffs ?? "-"} / {totalDayOff ?? "-"}
            </span>
                    </div>

                    <div className="row full">
                        <label>전화번호</label>
                        {!isEditingPhone? (
                            <div>
                                <span>{phoneNumber}</span>
                                <button
                                    type="button"
                                    title="전화번호 변경"
                                    onClick={()=>setIsEditingPhone(true)}
                                >+</button>
                            </div>

                        ):(
                            <input
                                autoFocus
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.key==="Enter"){
                                        e.preventDefault();
                                        setIsEditingPhone(false);
                                    }
                                    if(e.key==="Escape"){
                                        setIsEditingPhone(false);
                                    }
                                }}
                            />
                        )}

                    </div>
                </section>

                <div className="actions">
                    <button className="-button --blue" type="submit">
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}