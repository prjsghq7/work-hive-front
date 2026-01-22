import { useEffect, useRef, useState } from "react";
import {
    connectStomp,
    disconnectStomp,
    isStompConnected,
    subscribeStomp,
    publishStomp,
} from "../../services/common/stompClient.js"; // 경로는 네 폴더에 맞게 조정

export default function ChatStompTest() {
    const subRef = useRef(null);

    const [connected, setConnected] = useState(false);
    const [roomIndex, setRoomIndex] = useState(1);
    const [message, setMessage] = useState("");
    const [logs, setLogs] = useState([]);

    const addLog = (text) => {
        setLogs((prev) => [`${new Date().toLocaleTimeString()}  ${text}`, ...prev]);
    };

    const connect = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            addLog("accessToken 없음: 로그인 후 토큰 저장 확인 필요");
            return;
        }

        connectStomp({
            onConnect: () => {
                setConnected(true);
                addLog("STOMP 연결 성공");
            },
            onDisconnect: () => {
                setConnected(false);
                addLog("STOMP 연결 해제");
            },
            onError: (e) => {
                // stomp error frame 또는 websocket error 이벤트가 올 수 있음
                if (e?.body || e?.headers) {
                    addLog(`STOMP ERROR: ${e.headers?.message || ""} ${e.body || ""}`);
                } else {
                    addLog(`WebSocket ERROR: ${String(e)}`);
                }
            },
        });

        addLog("STOMP 연결 시도");
    };

    const disconnect = () => {
        try {
            subRef.current?.unsubscribe();
            subRef.current = null;
        } catch (e) {
            console.log(e);
        }
        disconnectStomp();
        setConnected(false);
        addLog("STOMP 연결 종료 요청");
    };

    const subscribeRoom = () => {
        if (!isStompConnected()) {
            addLog("구독 실패: STOMP 미연결");
            return;
        }

        const ri = Number(roomIndex);
        if (!ri || ri <= 0) {
            addLog("roomIndex가 올바르지 않음");
            return;
        }

        try {
            subRef.current?.unsubscribe();
            subRef.current = null;
        } catch (e) {
            console.log(e);
        }

        const dest = `/topic/chat/room/${ri}`;
        subRef.current = subscribeStomp(dest, (msg) => {
            try {
                const body = JSON.parse(msg.body);
                addLog(`수신(${dest}): ${JSON.stringify(body)}`);
            } catch (e) {
                addLog(`수신(${dest}): ${msg.body}`);
                console.log(e);
            }
        });

        if (!subRef.current) {
            addLog("구독 실패: subscribe 반환값 null (연결 상태 확인)");
            return;
        }

        addLog(`구독 성공: ${dest}`);
    };

    const send = () => {
        if (!isStompConnected()) {
            addLog("전송 실패: STOMP 미연결");
            return;
        }

        const trimmed = message.trim();
        if (!trimmed) {
            addLog("전송 실패: message 비었음");
            return;
        }

        const payload = {
            roomIndex: Number(roomIndex),
            message: trimmed,
        };

        const ok = publishStomp("/app/chat/send", payload);
        if (!ok) {
            addLog("전송 실패: publish 실패 (연결 상태 확인)");
            return;
        }

        addLog(`전송: ${JSON.stringify(payload)}`);
        setMessage("");
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Chat STOMP Test</h2>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <button onClick={connect} disabled={connected}>
                    CONNECT
                </button>
                <button onClick={disconnect} disabled={!connected}>
                    DISCONNECT
                </button>
                <span>{connected ? "connected" : "disconnected"}</span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <label>roomIndex</label>
                <input
                    type="number"
                    value={roomIndex}
                    onChange={(e) => setRoomIndex(e.target.value)}
                    style={{ width: 120 }}
                />
                <button onClick={subscribeRoom} disabled={!connected}>
                    SUBSCRIBE ROOM
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message..."
                    style={{ width: 360 }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") send();
                    }}
                />
                <button onClick={send} disabled={!connected}>
                    SEND
                </button>
            </div>

            <div style={{ border: "1px solid #ddd", padding: 12, height: 360, overflow: "auto" }}>
                {logs.map((l, idx) => (
                    <div key={idx} style={{ fontFamily: "monospace", marginBottom: 6 }}>
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
}
