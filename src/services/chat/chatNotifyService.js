import { connectStomp, subscribeStomp, disconnectStomp, isStompConnected } from "../common/stompClient.js";

let notifySubscription = null;

/**
 * 로그인 이후 1회만 실행되도록 설계
 * onNotify(payload): 서버가 보내는 notify dto를 그대로 넘김
 */
export function startChatNotify(onNotify) {
    const client = connectStomp();
    if (!client) return null;

    // 이미 연결이 완료된 상태면 즉시 subscribe 시도
    if (isStompConnected()) {
        if (!notifySubscription) {
            notifySubscription = subscribeStomp("/user/queue/chat-notify", onNotify);
        }
        return notifySubscription;
    }

    // 아직 connecting 단계면 onConnect 타이밍에 subscribe
    client.onConnect = () => {
        if (!notifySubscription) {
            notifySubscription = subscribeStomp("/user/queue/chat-notify", onNotify);
        }
    };

    return notifySubscription;
}

export function stopChatNotify() {
    try {
        if (notifySubscription) {
            notifySubscription.unsubscribe();
            notifySubscription = null;
        }
    } finally {
        // 전역 stomp를 완전히 끊을지 여부는 정책 선택
        // 채팅 외 실시간 기능이 더 생길 수 있으면 disconnectStomp는 하지 말고
        // 지금은 채팅만 쓴다면 끊어도 됨
        disconnectStomp();
    }
}