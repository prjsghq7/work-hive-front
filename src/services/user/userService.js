import apiClient from "../common/apiClient.js";

//dto로 받을경우 밑의 방식으로 사용
export const loginService = {
    login(id, password) {
        return apiClient.post("/user/login", {empId: id, password});
    }
}
//axios.post(url, data, config) 기본적인 형태
//첫번째 인자: url, 두번쨰 인자: body(JSON,Form등),세번째 인자:추가설정(config)
//@RequestParam을 사용할 경우 body가 필요 없어서 null로 처리하고, axios에서는 params를 사용한다.
//params는 URL 쿼리스트링을 자동으로 만들어준다.
export const userService = {
    register(form) {
        return apiClient.post("/user/register", form);
    },
    getMyInfo() {
        return apiClient.get("/user/edit");
    }
}

export const permissionService = {
    async getPermission() {
        try {
            const res = await apiClient.get("/user/permission");
            return res.data; // "ADMIN" | "USER" | "NOT_LOGIN" | "UNKNOWN"
        } catch (e) {
            console.error("getPermission failed", {
                message: e?.message,
                status: e?.response?.status,
            });
            return "ERROR";
        }
    },

    async isAdmin() {
        const permission = await this.getPermission();
        return permission === "ADMIN";
    }
};

export const subTableListService = {
    getTeamList() {
        return apiClient.get("/user/team-list");
    },

    getUserStateList() {
        return apiClient.get("/user/state-list");
    },

    getRoleList() {
        return apiClient.get("/user/role-list");
    }
}

export const searchService = {
    search(name, teamCode, userState) {
        return apiClient.post("/user/search", null, {
            params: {name, teamCode, userState}
        });
    }
}

export const editService = {
    getInfo(index) {
        return apiClient.get("/user/info", {
            params: {index}
        });
    },

    edit(form) {
        const formData = new FormData();

        formData.append("index", form.index);
        formData.append("empId", form.empId);
        formData.append("name", form.name);
        formData.append("teamCode", form.teamCode);
        formData.append("roleCode", form.roleCode);
        formData.append("userState", form.userState);
        formData.append("email", form.email);
        formData.append("phoneNumber", form.phoneNumber);
        formData.append("totalDayOffs", form.totalDayOffs);

        // ⭐ 이미지
        if (form.profile) {
            formData.append("profile", form.profile);
        }

        return apiClient.patch("/user/info", formData, {
            headers: {"Content-Type": undefined},
        });
    },
    editUserInfo(form) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("phoneNumber", form.phoneNumber);
        formData.append("email", form.email);
        if (form.profile) {
            formData.append("profile", form.profile);
        }
        return apiClient.patch("/user/user-info", formData)
    },
    getProfileImageBlob() {
        return apiClient.get("/user/profile-image", { responseType: "blob" });
    },
}

export const detailService = {
    getDetailInfo(index) {
        return apiClient.get("/user/detail-info", {
            params: {index}
        });
    },
}
