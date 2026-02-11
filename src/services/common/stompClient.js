import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { WS_BASE_URL } from "../../configs/apiConfig.js";

let stomp = null;

/**
 * 공용 STOMP Client 생성 및 연결
 * - 로그인 후 accessToken이 있어야 CONNECT 가능
 * - 여러 번 호출해도 이미 살아있으면 재사용
 */
export function connectStomp({ onConnect, onError, onDisconnect } = {}) {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    // 이미 활성화된 클라이언트가 있으면 재사용
    if (stomp?.active) return stomp;

    stomp = new Client({
        webSocketFactory: () => new SockJS(WS_BASE_URL),

        // CONNECT Frame에 JWT 전달
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        // 끊기면 자동 재연결 (원치 않으면 0 또는 제거)
        reconnectDelay: 3000,


        onConnect: (frame) => {
            onConnect?.(frame);
        },

        onDisconnect: (frame) => {
            onDisconnect?.(frame);
        },

        onStompError: (frame) => {
            onError?.(frame);
        },

        onWebSocketError: (evt) => {
            onError?.(evt);
        },
    });

    stomp.activate();
    return stomp;
}

/**
 * 연결 종료
 */
export function disconnectStomp() {
    if (!stomp) return;

    try {
        stomp.deactivate();
    } finally {
        stomp = null;
    }
}

/**
 * 현재 연결 여부
 */
export function isStompConnected() {
    return !!stomp?.connected;
}

/**
 * 구독
 * 반환값(subscription)은 unsubscribe() 가능
 */
export function subscribeStomp(destination, onMessage, headers = {}) {
    if (!stomp?.connected) return null;

    return stomp.subscribe(
        destination,
        (message) => {
            try {
                // 일반적으로는 여기로 들어옴 (string)
                if (typeof message.body === "string") {
                    const parsed = message.body ? JSON.parse(message.body) : null;
                    onMessage?.(parsed);
                    return;
                }

                console.log("subscribeStomp: unknown message shape", message);
                onMessage?.(null);
            } catch (e) {
                console.error("subscribeStomp parse failed", e, message);
                onMessage?.(null);
            }
        },
        headers
    );
}

/**
 * 발행
 * bodyObj는 자동 JSON stringify
 */
export function publishStomp(destination, bodyObj, headers = {}) {
    if (!stomp?.connected) return false;

    stomp.publish({
        destination,
        headers,
        body: JSON.stringify(bodyObj),
    });

    return true;
}

/**
 * 필요 시 외부에서 raw client 접근
 */
export function getStompClient() {
    return stomp;
}
