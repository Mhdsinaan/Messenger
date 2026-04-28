import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { ChatApi, chatApi } from "../../api/chatApi";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [openedChats, setOpenedChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await ChatApi.get(`/Chat/chat-list/${userId}`);
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        setChats={setChats}
        openedChats={openedChats}
        setOpenedChats={setOpenedChats}
        setActiveChat={setActiveChat}
      />

      <ChatWindow
        chats={chats}   // 🔥 FIX
        openedChats={openedChats}
        activeChat={activeChat}
      />
    </div>
  );
}

export default ChatPage;