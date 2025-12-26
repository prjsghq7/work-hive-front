import "./MypageForm.min.css";

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
                                       profileImage,
                                   }) {

    return (
        <div>
            <form onSubmit={handleSubmit} style={{maxWidth: 420}}>
            <h2>내 정보</h2>
                <img
                    src={previewUrl ?? serverImgUrl ?? ""}
                    alt="프로필"
                    style={{width: 120, height: 120, borderRadius: "50%", objectFit: "cover"}}
                />

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={onChangeFile}
                />

                <button type="button" onClick={onClickChange}>
                    이미지 변경
                </button>

                <div>
                    <label>이름</label>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                </div>

                <div>
                    <label>이메일</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <label>전화번호</label>
                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>

                {profileImage && <div>선택된 이미지: {profileImage.name}</div>}

                <button type="submit">저장</button>
            </form>
        </div>

    )
}