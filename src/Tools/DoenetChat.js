import React, {
    useEffect,
    useState
} from "react";
import axios from 'axios';
import crypto from 'crypto';
import styled from 'styled-components';

const ChatContainer = styled.div`
    width: 500px;
    border: solid black 1px;
`;

const ChatForm = styled.form`

`;

const ChatInput = styled.input`

`;

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
const MessageContent = styled.div`

`;

function ChatMessage(props) {
    return <MessageElement>
        <MessageName>{props.userId}:</MessageName>
        <MessageContent>{props.children}</MessageContent>
    </MessageElement>
}

export default function DoenetChat(props) {
    const key = props.key ? props.key : "";
    const [chatLog, setCL] = useState([]);
    const appendMessages = (msgs) => {
        let m = msgs instanceof Array ? msgs : [msgs];
        setCL([...chatLog, ...m]);
    };

    useEffect(() => {
        let eventSource = new EventSource("/api/chatSSE.php?partition=0");
        eventSource.onmessage = (e) => {
            setCL(prev => [...prev, JSON.parse(e.data)])
        };
        eventSource.onerror = e => console.error("EventSource failed:", e);
    }, []);

    let messages = chatLog.map((val, i) => <ChatMessage
                                            key={`doenet-chat-message-${key}-${i}-${val.messageId}`}
                                            messageId={val.messageId}
                                            userId={val.userId}
                                        >
                                                {val.message}
                                        </ChatMessage>);

    return <ChatContainer>
        <MessageLogContainer>
            {messages}
        </MessageLogContainer>
        <ChatForm onSubmit={e => { e.preventDefault(); axios.post("/api/chatPOST.php?message=" + document.getElementById("chatInput").value) }}>
            <ChatInput type="text" id="chatInput"/>
            <ChatSend type="submit">Send</ChatSend>
        </ChatForm>
    </ChatContainer>;
}
