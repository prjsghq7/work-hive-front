import apiClient from "../common/apiClient.js";

export const chatRoomService = {
    // 최초 목록
    getMyRooms() {
        return apiClient.get("/chat/rooms/my");
    },

    // notify 수신 후 특정 방만 재조회해서 목록 갱신
    getRoomSummary(roomIndex) {
        return apiClient.get(`/chat/rooms/${roomIndex}/summary`);
    },
};