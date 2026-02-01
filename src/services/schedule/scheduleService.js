import apiClient from "../common/apiClient.js";

export const scheduleService = {
    getCalendarData(filter) {
        return apiClient.get("/schedule/calendarData", { params: { filter } });
    }
};
