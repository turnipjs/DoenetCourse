/*jshint esversion: 8 */
import React, { useEffect, useState } from "react";
import crypto from "crypto";
import styled from "styled-components";
import { io } from "socket.io-client";
import RTMessage from "../../realtime/RTMessage";
import RTChatMessage from "../../realtime/RTChatMessage.mjs";

const ChatContainer = styled.div`
    width: 500px;
    border: solid black 1px;
`;

const ChatForm = styled.form``;

const ChatInput = styled.input``;

const ChatSend = styled.button`
    border: none;
    background: black;
    color: white;
`;

const MessageLogContainer = styled.div`
    height: 800px;
    overflow: scroll;
`;

const MessageElement = styled.div`
    border: 1px solid black;
    margin: 1em 0;
`;

const MessageName = styled.div`
    font-weight: bold;
`;
const MessageContent = styled.div``;

const RoomForm = styled.form``;

const RoomInput = styled.input``;

const RoomJoin = styled.button`
    border: none;
    background: black;
    color: white;
`;

const NameInput = styled.input``;

const NameLabel = styled.label``;

function ChatMessage(props) {
    return (
        <MessageElement>
            <MessageName>{props.userId}:</MessageName>
            <MessageContent>{props.children}</MessageContent>
        </MessageElement>
    );
}

export default function DoenetChat(props) {
    const key = props.key ? props.key : "";
    const [chatLog, setCL] = useState([]);
    const [socket, setSocket] = useState({ id: null });
    const [room, setRoom] = useState(undefined);

    useEffect(() => {
        console.log("running setup effect");
        setSocket(io("localhost:81"));
    }, []);

    useEffect(() => {
        console.log("running config effect");
        if (socket.id !== null) {
            socket.on("connect", () => {
                console.log("socket connected");
            });
            socket.on("connect_error", (e) => {
                console.log("socket connection error", e);
            });

            socket.on("message", (message) => {
                console.log(message);
                setCL((prev) => [...prev, JSON.parse(message)]);
                let log = document.getElementById("messageLogContainer");
                log.scrollTop = log.scrollHeight;
            });

            socket.on("disconnect", () => {
                console.log("disconnecting socket");
            });
        }
    }, [socket.id])

    let messages = chatLog.map((val, i) => (
        <ChatMessage
            key={`doenet-chat-message-${key}-${i}-${val.messageId}`}
            messageId={val.messageId}
            userId={val.userId}
        >
            {val.message}
        </ChatMessage>
    ));

    return (
        <>
            <RoomForm
                onSubmit={(e) => {
                    e.preventDefault();
                    let roomEl = document.getElementById("roomInput");
                    socket.emit("leaveRoom", "chat:" + room);
                    socket.emit("joinRoom", "chat:" + roomEl.value);
                    setRoom(roomEl.value);
                }}
            >
                <RoomInput type="number" id="roomInput" defaultValue="12" />
                <RoomJoin type="submit">Join Room</RoomJoin>
            </RoomForm>
            <NameLabel htmlFor="nameInput" />
            <NameInput type="text" name="nameInput" id="nameInput" />
            <ChatContainer>
                <MessageLogContainer id="messageLogContainer">
                    {messages}
                </MessageLogContainer>
                <ChatForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        let messageEl = document.getElementById("chatInput");
                        let nameEl = document.getElementById("nameInput");
                        socket.emit("produce", new RTChatMessage("a user, security TBI", "user", new Date, messageEl.value, new Date, room).toString())
                        console.log(messageEl.value, nameEl.value, room)
                        messageEl.value = "";
                    }}
                >
                    <ChatInput
                        type="text"
                        autocomplete="hidden"
                        id="chatInput"
                    />
                    <ChatSend type="submit">Send Message</ChatSend>
                </ChatForm>
            </ChatContainer>
        </>
    );
}
