import apiClient from "../common/apiClient.js";

export const leaveService = {
    getCalendarData(filter) {
        return apiClient.get("/leave/calendarData", { params: { filter } });
    },

    getLeaveData(tab) {
        return apiClient.get("/leave/list", { params: { tab } });
    },

    getLeaveStats() {
        return apiClient.get("/leave/stats");
    },

    request(leaveData) {
        return apiClient.post("/leave/request", leaveData);
    },

    getDetail(index) {
        return apiClient.get("/leave/detail", { params: { index } });
    },

    patchAction(index, action) {
        return apiClient.patch("/leave/action", null, { params: { index, action } });
    }
};