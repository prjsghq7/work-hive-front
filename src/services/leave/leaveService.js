import apiClient from "../common/apiClient.js";

export const leaveService = {
  getCalendarData() {
    return apiClient.get("/leave/calendarData");
  }
};