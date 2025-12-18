import { subTableListService, editService } from "../../services/user/userService.js";
import { useEffect, useState } from "react";

export default function UserEditModal({ targetIndex, onClose }) {
    const [teamList, setTeamList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const [form, setForm] = useState(null);

    useEffect(() => {
        if (!targetIndex) return;

        const fetchFilterList = async () => {
            try {
                const [teamRes, stateRes, roleRes] = await Promise.all([
                    subTableListService.getTeamList(),
                    subTableListService.getUserStateList(),
                    subTableListService.getRoleList()
                ]);

                setTeamList(teamRes.data.data.codes);
                setStateList(stateRes.data.data.codes);
                setRoleList(roleRes.data.data.codes);
            } catch (e) {
                console.error("필터 목록 로딩 실패:", e);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await editService.getInfo(targetIndex);
                const data = res.data.data;
                console.log("user:", data);

                setForm({
                    index: data.index,
                    empId: data.empId ?? "",
                    name: data.name ?? "",
                    teamCode: data.teamCode ?? "",
                    roleCode: data.roleCode ?? "",
                    userState: data.userState ?? "",
                    email: data.email ?? "",
                    phoneNumber: data.phoneNumber ?? "",
                    totalDayOffs: data.totalDayOffs ?? 0
                });
            } catch (e) {
                console.error("회원 정보 로딩 실패:", e);
            }
        };

        fetchFilterList();
        fetchUser();
    }, [targetIndex]);

    if (!form) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">회원 수정</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <form>
                        <input type="hidden" name="index" value={form.index} />
                        <div>
                            <label>사번</label>
                            <input
                                type="text"
                                name="empId"
                                value={form.empId}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>이름</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>팀 코드</label>
                            <input
                                type="text"
                                name="teamCode"
                                value={form.teamCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>권한 코드</label>
                            <input
                                type="text"
                                name="roleCode"
                                value={form.roleCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>사용자 상태</label>
                            <input
                                type="text"
                                name="userState"
                                value={form.userState}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>이메일</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>전화번호</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>총 연차</label>
                            <input
                                type="number"
                                name="totalDayOffs"
                                value={form.totalDayOffs}
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                </div>

                <div className="modal-actions">
                    <button type="button" className="-object-button --blue">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
