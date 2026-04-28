import React, { useEffect, useState } from "react";
import { chatApi } from "../../api/chatApi";
import { useChat } from "./Context/ChatContext";
import CreateGroupModal from "../Pages/CreateGroupModal";

function Sidebar({ openedChats, setOpenedChats, onChatsLoaded }) {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(null);

  const [showGroupModal, setShowGroupModal] = useState(false); // ✅ only needed

  const userId = parseInt(localStorage.getItem("userId"));
  const { setActiveChat } = useChat();

  useEffect(() => {
    loadChats();
  }, []);

  // ── LOAD CHATS ─────────────────────────────
  const loadChats = async () => {
    try {
      const res = await chatApi.get(`/Chat/chat-list/${userId}`);
      setChats(res.data);
      onChatsLoaded?.(res.data);
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  // ── OPEN CHAT ─────────────────────────────
  const openChat = (chat) => {
    let chatData = {};

    if (chat.groupId) {
      chatData = {
        id: `group-${chat.groupId}`,
        type: "group",
        groupId: chat.groupId,
        name: chat.groupName || "Group Chat",
        raw: chat,
      };
    } else {
      const otherUserId =
        chat.userId === userId ? chat.receiverId : chat.userId;

      chatData = {
        id: otherUserId,
        type: "personal",
        userId: otherUserId,
        name: chat.userName || `User ${otherUserId}`,
        raw: chat,
      };
    }

    if (!openedChats.includes(chatData.id)) {
      setOpenedChats([...openedChats, chatData.id]);
    }

    setActiveId(chatData.id);
    setActiveChat(chatData);
  };

  // ── HELPERS ───────────────────────────────
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const dmChats = chats.filter(
    (c) =>
      c.chatId &&
      c.groupId === null &&
      (c.userName || "").toLowerCase().includes(search.toLowerCase())
  );

  const groupChats = chats.filter(
    (c) =>
      c.groupId !== null &&
      (c.groupName || "").toLowerCase().includes(search.toLowerCase())
  );

  // ── UI ────────────────────────────────────
  return (
    <div className="w-72 h-full flex flex-col bg-[#0c0c0f] border-r border-gray-800">
      
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-semibold">Messages</h2>

          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-violet-500/20 px-2 py-1 rounded text-sm text-violet-300"
          >
            +
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white text-sm outline-none"
        />
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto">
        {dmChats.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase text-white/20 px-5 pt-4 pb-1.5">
              Direct
            </p>

            {dmChats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => openChat(chat)}
                className={`flex items-center gap-3 px-3.5 py-2.5 mx-1.5 mb-1 rounded-lg cursor-pointer transition
                  ${
                    activeId ===
                    (chat.userId === userId
                      ? chat.receiverId
                      : chat.userId)
                      ? "bg-violet-500/20"
                      : "hover:bg-white/5"
                  }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-violet-500/20 text-violet-300">
                  {getInitials(chat.userName)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {chat.userName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.lastMessage || "Start conversation"}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {groupChats.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase text-white/20 px-5 pt-4 pb-1.5">
              Groups
            </p>

            {groupChats.map((chat) => (
              <div
                key={chat.groupId}
                onClick={() => openChat(chat)}
                className={`flex items-center gap-3 px-3.5 py-2.5 mx-1.5 mb-1 rounded-lg cursor-pointer transition
                  ${
                    activeId === `group-${chat.groupId}`
                      ? "bg-violet-500/20"
                      : "hover:bg-white/5"
                  }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-violet-500/20 text-violet-300">
                  #
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {chat.groupName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.lastMessage || "Start conversation"}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ✅ NEW GROUP MODAL */}
      <CreateGroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onGroupCreated={loadChats}
        userId={userId}
      />
    </div>
  );
}

export default Sidebar;