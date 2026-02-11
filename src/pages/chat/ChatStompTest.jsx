import { useEffect, useRef, useState } from "react";
import { chatService } from "../../services/chat/chatService.js";
import {
    connectStomp,
    disconnectStomp,
    isStompConnected,
    subscribeStomp,
    publishStomp,
} from "../../services/common/stompClient.js";

export default function ChatStompTest() {
    const subRef = useRef(null);

    const [connected, setConnected] = useState(false);
    const [roomIndex, setRoomIndex] = useState(1);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);
    const [beforeIndex, setBeforeIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const connect = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.log("STOMP connect failed: accessToken 없음");
            return;
        }

        if (isStompConnected()) {
            console.log("이미 STOMP 연결됨");
            setConnected(true);
            return;
        }

        connectStomp({
            onConnect: () => {
                console.log("STOMP 연결 성공");
                setConnected(true);
            },
            onDisconnect: () => {
                console.log("STOMP 연결 해제");
                setConnected(false);
            },
            onError: (e) => {
                console.error("STOMP ERROR", e);
            },
        });
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
        setMessages([]);
        setBeforeIndex(null);
        setHasMore(true);

        console.log("STOMP 연결 종료");
    };

    const loadInitialMessages = async (targetRoomIndex) => {
        setLoading(true);
        try {
            const res = await chatService.getMessages(targetRoomIndex);
            const list = Array.isArray(res.data) ? res.data : [];

            setMessages(list);

            if (list.length > 0) {
                setBeforeIndex(list[0].index);
                setHasMore(true);
            } else {
                setBeforeIndex(null);
                setHasMore(false);
            }

            console.log("초기 메시지 로드:", list.length);
        } catch (e) {
            console.error("초기 메시지 로드 실패", e);
            setMessages([]);
            setBeforeIndex(null);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        const targetRoomIndex = Number(roomIndex);
        if (!targetRoomIndex || targetRoomIndex <= 0) return;
        if (!hasMore || loading) return;
        if (beforeIndex == null) return;

        setLoading(true);
        try {
            const res = await chatService.getMessages(targetRoomIndex, beforeIndex);
            const list = Array.isArray(res.data) ? res.data : [];

            if (list.length === 0) {
                setHasMore(false);
                console.log("이전 메시지 없음");
                return;
            }

            setMessages((prev) => [...list, ...prev]);
            setBeforeIndex(list[0].index);

            console.log("이전 메시지 로드:", list.length);
        } catch (e) {
            console.error("이전 메시지 로드 실패", e);
        } finally {
            setLoading(false);
        }
    };

    const subscribeRoom = async () => {
        const targetRoomIndex = Number(roomIndex);

        if (!isStompConnected()) {
            console.log("구독 실패: STOMP 미연결");
            return;
        }

        if (!targetRoomIndex || targetRoomIndex <= 0) {
            console.log("roomIndex 잘못됨");
            return;
        }

        try {
            subRef.current?.unsubscribe();
            subRef.current = null;
        } catch (e) {
            console.log(e);
        }

        setMessages([]);
        setBeforeIndex(null);
        setHasMore(true);

        await loadInitialMessages(targetRoomIndex);

        const dest = `/topic/chat/room/${targetRoomIndex}`;
        subRef.current = subscribeStomp(dest, (body) => {
            setMessages((prev) => [...prev, body]);
            console.log("실시간 메시지 수신", body);
        });

        console.log("구독 완료:", dest);
    };

    const send = () => {
        if (!isStompConnected()) {
            console.log("전송 실패: STOMP 미연결");
            return;
        }

        const trimmed = message.trim();
        if (!trimmed) return;

        publishStomp("/app/chat/send", {
            roomIndex: Number(roomIndex),
            message: trimmed,
        });

        setMessage("");
    };

    useEffect(() => {
        setConnected(isStompConnected());
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Chat STOMP Test</h2>

            <button onClick={connect} disabled={connected}>
                CONNECT
            </button>
            <button onClick={disconnect} disabled={!connected}>
                DISCONNECT
            </button>

            <div style={{ marginTop: 12 }}>
                roomIndex
                <input
                    type="number"
                    value={roomIndex}
                    onChange={(e) => setRoomIndex(e.target.value)}
                    style={{ width: 120, marginLeft: 8 }}
                />
                <button onClick={subscribeRoom} disabled={!connected || loading} style={{ marginLeft: 8 }}>
                    SUBSCRIBE
                </button>
                <button onClick={loadMore} disabled={!connected || loading || !hasMore} style={{ marginLeft: 8 }}>
                    LOAD MORE
                </button>
            </div>

            <div style={{ marginTop: 12 }}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message..."
                    style={{ width: 360 }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") send();
                    }}
                />
                <button onClick={send} disabled={!connected} style={{ marginLeft: 8 }}>
                    SEND
                </button>
            </div>

            <div style={{ border: "1px solid #ddd", marginTop: 12, height: 360, overflow: "auto", padding: 12 }}>
                {messages.map((m) => (
                    <div key={m.index} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>
                            {m.senderName} ({m.senderTeamName}/{m.senderRoleName}){m.mine ? " (me)" : ""}
                        </div>
                        <div style={{ fontSize: 14 }}>{m.message}</div>
                    </div>
                ))}
                {loading ? <div>loading...</div> : null}
            </div>
        </div>
    );
}
