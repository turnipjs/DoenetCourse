import React, { useEffect, useState } from "react";
import axios from "axios";
import crypto from "crypto";
import styled from "styled-components";
import { io } from "socket.io-client";

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

    useEffect(() => {
        const socket = io("localhost:81");
        socket.on("connect", () => {});
        socket.on("connect_error", () => {});

        socket.on("message", (message) => {
            console.log(message);
            setCL((prev) => [...prev, message]);
            let log = document.getElementById("messageLogContainer");
            log.scrollTop = log.scrollHeight;
        });

        socket.on("disconnect", () => {});
    }, []);

    let messages = chatLog.map((val, i) => (
        <ChatMessage
            key={`doenet-chat-message-${key}-${i}-${val.messageId}`}
            messageId={val.messageId}
            userId={val.userId}
        >
            {val.message}
        </ChatMessage>
    ));
    console.log(chatLog);

    return (
        <ChatContainer>
            <MessageLogContainer id="messageLogContainer">
                
                {messages}
            
            </MessageLogContainer>
            <ChatForm
                onSubmit={(e) => {
                    e.preventDefault();
                    let messageEl = document.getElementById("chatInput");
                    axios.post("/api/chatPOST.php?message=" + messageEl.value);
                    messageEl.value = "";
                }}
            >
                <ChatInput type="text" id="chatInput" />
                <ChatSend type="submit">Send</ChatSend>
            </ChatForm>
        </ChatContainer>
    );
}
