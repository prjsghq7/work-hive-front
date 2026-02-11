import apiClient from "../common/apiClient.js";

export const chatService = {
    getMessages(roomIndex, beforeIndex) {
        return apiClient.get("/chat/messages", {
            params: {
                roomIndex,
                beforeIndex, // undefined면 자동으로 안 붙음
            },
        });
    },
};
