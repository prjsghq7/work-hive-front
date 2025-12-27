import "./UserDetailModal.min.css";

import { detailService } from "../../services/user/userService.js";

import {useEffect, useState} from "react";

export default function UserDetailModal({ targetIndex, onClose }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!targetIndex) return;

        const fetchDetail = async () => {
            try {
                const res = await detailService.getDetailInfo(targetIndex);
                const data = res.data.data;

                setUser({
                    index: data.index,
                    empId: data.empId ?? "",
                    name: data.name ?? "",
                    teamName: data.teamName ?? "",
                    roleName: data.roleName ?? "",
                    email: data.email ?? "",
                    phoneNumber: data.phoneNumber ?? "",
                    profileImg: data.profileImg ?? data.imageUrl ?? "",
                });
            } catch (e) {
                setUser(null);
            }
        };

        fetchDetail();
    }, [targetIndex]);

    if (!targetIndex) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">회원 상세</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {!user && (
                        <div className="detail-empty">
                            회원 정보를 불러올 수 없습니다.
                        </div>
                    )}

                    {user && (
                        <>
                            <div className="detail-top">
                                <div className="avatar">
                                    <img src={user.profileImg} alt="profile" />
                                </div>

                                <div className="head">
                                    <div className="name">
                                        {user.name}
                                    </div>
                                    <div className="sub">
                                        <span>{user.teamName}</span>
                                        <span className="sep">|</span>
                                        <span>{user.roleName}</span>
                                    </div>
                                </div>
                            </div>


                            <div className="divider"></div>


                            <div className="grid">
                                <div className="item">
                                    <div className="label">사번</div>
                                    <div className="value">{user.empId}</div>
                                </div>

                                <div className="item">
                                    <div className="label">이메일</div>
                                    <div className="value">{user.email}</div>
                                </div>

                                <div className="item">
                                    <div className="label">연락처</div>
                                    <div className="value">{user.phoneNumber}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="-button --blue"
                        onClick={onClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
