import React, { useEffect, useRef, useState } from "react";
import { ChatApi } from "../api/chatApi";
import { UseSignalR } from "../Hooks/useSignalR";
import { useChat } from "./Context/ChatContext";

// ── ADD MEMBERS SUB-PANEL ─────────────────────────────────────────────────────
function AddMembersPanel({ activeChat, currentMemberIds, onBack, onAdded }) {
  const [results, setResults]     = useState([]);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding]       = useState(false);
  const [error, setError]         = useState("");
  const debounceRef               = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = search.trim();
    if (!trimmed) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError("");

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await ChatApi.get(`/Chat/search-users?word=${encodeURIComponent(trimmed)}`);
        const users = res.data || [];
        setResults(users.filter((u) => !currentMemberIds.includes(u.userId ?? u.UserId)));
      } catch (err) {
        console.error("Search failed", err);
        setError("Search failed. Please try again.");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAdd = async () => {
    if (!selected.length) return;
    setAdding(true);
    setError("");
    try {
      await ChatApi.post("/Chat/add-members", {
        groupId: activeChat.groupId,
        userIds: selected,
      });
      onAdded(selected.length);
    } catch (err) {
      console.error(err);
      setError("Failed to add members. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const displayList = results;

  return (
    <div style={{ animation: "slideLeft 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>

      {/* Sub-header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-800"
        style={{ background: "linear-gradient(135deg,#7c3aed18,#4c1d9518)" }}
      >
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ←
        </button>
        <p className="text-white font-semibold text-sm flex-1">Add Members</p>
        {selected.length > 0 && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Search box */}
      <div className="px-4 pt-3 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "#1a1a24", border: "1px solid #2a2a36" }}
        >
          {searching ? (
            <span className="text-gray-500 text-xs animate-spin">⟳</span>
          ) : (
            <span className="text-gray-500 text-sm">🔍</span>
          )}
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-600"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setResults([]); }}
              className="text-gray-600 hover:text-gray-400 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results list */}
      <div
        className="flex flex-col gap-1 px-4 overflow-y-auto"
        style={{ maxHeight: 200 }}
      >
        {!search.trim() ? (
          <p className="text-gray-600 text-xs text-center py-6">
            Type a name to search users
          </p>
        ) : searching ? (
          <p className="text-gray-500 text-xs text-center py-6">Searching…</p>
        ) : error ? (
          <p className="text-red-400 text-xs text-center py-4">{error}</p>
        ) : displayList.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-6">No users found</p>
        ) : (
          displayList.map((u) => {
            const name = u.name ?? u.Name ?? u.userName ?? u.UserName ?? "Unknown";
            const isSelected = selected.includes(u.userId);
            return (
              <div
                key={u.userId}
                onClick={() => toggle(u.userId)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isSelected ? "#7c3aed22" : "#1a1a24",
                  border: isSelected ? "1px solid #7c3aed55" : "1px solid transparent",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg,#7c3aed,#5b21b6)"
                      : "linear-gradient(135deg,#4c1d95,#6d28d9)",
                  }}
                >
                  {getInitials(name)}
                </div>

                <span className="text-gray-300 text-xs flex-1 truncate">{name}</span>

                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isSelected ? "#7c3aed" : "transparent",
                    border: isSelected ? "1px solid #7c3aed" : "1px solid #4b5563",
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add button */}
      <div className="px-4 py-3">
        <button
          onClick={handleAdd}
          disabled={!selected.length || adding}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: selected.length ? "#7c3aed" : "#7c3aed55" }}
        >
          <span>➕</span>
          {adding
            ? "Adding…"
            : selected.length
            ? `Add ${selected.length} Member${selected.length > 1 ? "s" : ""}`
            : "Select members to add"}
        </button>
      </div>
    </div>
  );
}

// ── GROUP SETTINGS MODAL ──────────────────────────────────────────────────────
function GroupSettingsModal({ activeChat, userId, onClose }) {
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [exiting, setExiting]     = useState(false);
  const [view, setView]           = useState("info");
  const [toast, setToast]         = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      console.group("🎯 Active Chat Debug");
      console.log("Full activeChat object:", JSON.stringify(activeChat, null, 2));
      console.log("activeChat.groupId:", activeChat.groupId, "| type:", typeof activeChat.groupId);
      console.log("activeChat.id:", activeChat.id, "| type:", typeof activeChat.id);
      console.log("activeChat.chatId:", activeChat.chatId, "| type:", typeof activeChat.chatId);
      console.log("URL being called:", `/Chat/group-members/${activeChat.groupId}`);
      console.groupEnd();

      const res = await ChatApi.get(`/Chat/group-members/${activeChat.groupId}`);

      console.group("🔍 Group Members Debug");
      console.log("📦 Raw API response:", res.data);
      console.log("🙋 My userId (prop):", userId, "| type:", typeof userId);
      console.table(
        (res.data || []).map((m) => ({
          userId:      m.userId  ?? m.UserId,
          userIdType:  typeof (m.userId ?? m.UserId),
          name:        m.name    ?? m.Name ?? m.userName ?? m.UserName ?? "Unknown",
          isAdmin:     m.isAdmin ?? m.IsAdmin,
          isAdminType: typeof (m.isAdmin ?? m.IsAdmin),
        }))
      );

      const amIInList = (res.data || []).some(
        (m) => parseInt(m.userId ?? m.UserId) === parseInt(userId)
      );
      console.log("❓ Am I in the member list?", amIInList);

      const amIAdmin = (res.data || []).some(
        (m) =>
          parseInt(m.userId ?? m.UserId) === parseInt(userId) &&
          (m.isAdmin ?? m.IsAdmin) === true
      );
      console.log("⭐ Am I admin?", amIAdmin);

      if (!amIInList) {
        console.warn("⚠️ Current user (userId =", userId, ") is NOT present in the API response.");
      } else if (!amIAdmin) {
        console.warn("⚠️ Current user IS in the list but isAdmin is false.");
      } else {
        console.log("✅ Current user is in the list and is an admin.");
      }

      console.groupEnd();

      setMembers(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [activeChat.groupId]);

  const handleExitGroup = async () => {
    if (!window.confirm("Are you sure you want to exit this group?")) return;
    setExiting(true);
    try {
      await ChatApi.post("/Chat/exit-group", { groupId: activeChat.groupId, userId });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to exit group. Please try again.");
    } finally {
      setExiting(false);
    }
  };

  const handleAdded = (count) => {
    setView("info");
    fetchMembers();
    setToast(`${count} member${count > 1 ? "s" : ""} added!`);
    setTimeout(() => setToast(""), 3000);
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const normalizedMembers = members.map((m) => ({
    userId:     m.userId    ?? m.UserId,
    name:       m.name      ?? m.Name ?? m.userName ?? m.UserName ?? "Unknown",
    profilePic: m.profilePic ?? m.ProfilePic,
    isAdmin:    m.isAdmin   ?? m.IsAdmin ?? false,
  }));

  const currentUserIsAdmin = normalizedMembers.some(
    (m) => parseInt(m.userId) === parseInt(userId) && m.isAdmin === true
  );

  const currentMemberIds = normalizedMembers.map((m) => m.userId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="w-72 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#13131a",
          border: "1px solid #2a2a36",
          animation: "slideDown 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>

        {/* Toast */}
        {toast && (
          <div
            className="px-4 py-2 text-center text-xs font-semibold text-white"
            style={{ background: "#16a34a" }}
          >
            ✅ {toast}
          </div>
        )}

        {view === "addMembers" ? (
          <AddMembersPanel
            activeChat={activeChat}
            currentMemberIds={currentMemberIds}
            onBack={() => setView("info")}
            onAdded={handleAdded}
          />
        ) : (
          <>
            {/* Header */}
            <div
              className="text-center px-5 py-5 border-b border-gray-800"
              style={{ background: "linear-gradient(135deg,#7c3aed18,#4c1d9518)" }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                  boxShadow: "0 0 0 3px #7c3aed33",
                }}
              >
                #
              </div>
              <p className="text-white font-bold text-base">{activeChat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Group · {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Group Info */}
            <div className="px-4 pt-4">
              <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">
                Group Info
              </p>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                style={{ background: "#1a1a24" }}
              >
                <span className="text-sm">🆔</span>
                <span className="text-gray-300 text-xs">Group ID: {activeChat.groupId}</span>
              </div>
              {normalizedMembers.filter((m) => m.isAdmin).map((admin) => (
                <div
                  key={admin.userId}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                  style={{ background: "#1a1a24" }}
                >
                  <span className="text-sm">⭐</span>
                  <span className="text-gray-300 text-xs">
                    Admin:{" "}
                    <span className="text-violet-400 font-semibold">{admin.name}</span>
                    {parseInt(admin.userId) === parseInt(userId) && (
                      <span className="text-gray-500 ml-1">(You)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Members */}
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                  Members
                </p>
                {currentUserIsAdmin && (
                  <button
                    onClick={() => setView("addMembers")}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-all"
                    style={{
                      color: "#a78bfa",
                      background: "#7c3aed18",
                      border: "1px solid #7c3aed33",
                    }}
                  >
                    <span>➕</span> Add
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: 176 }}>
                {loading ? (
                  <p className="text-gray-500 text-xs text-center py-4">Loading members…</p>
                ) : members.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-4">No members found</p>
                ) : (
                  normalizedMembers.map((m, index) => {
                    const isMe = parseInt(m.userId) === parseInt(userId);
                    return (
                      <div
                        key={`${m.userId}-${index}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{
                          background: "#1a1a24",
                          border: m.isAdmin ? "1px solid #7c3aed22" : "1px solid transparent",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{
                            background: m.isAdmin
                              ? "linear-gradient(135deg,#7c3aed,#5b21b6)"
                              : "linear-gradient(135deg,#4c1d95,#6d28d9)",
                          }}
                        >
                          {getInitials(m.name)}
                        </div>

                        <span className="text-gray-300 text-xs flex-1 truncate">
                          {m.name}
                          {isMe && <span className="text-gray-500 ml-1">(You)</span>}
                        </span>

                        {m.isAdmin && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              color: "#a78bfa",
                              background: "#7c3aed18",
                              border: "1px solid #7c3aed33",
                            }}
                          >
                            ⭐ Admin
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 mx-4 h-px bg-gray-800" />

            {/* Exit Button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleExitGroup}
                disabled={exiting}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ef444420";
                  e.currentTarget.style.borderColor = "#ef444466";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#7f1d1d22";
                  e.currentTarget.style.borderColor = "#ef444433";
                }}
              >
                <span>🚪</span>
                {exiting ? "Exiting…" : "Exit Group"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CHAT WINDOW ───────────────────────────────────────────────────────────────
function ChatWindow() {
  const userId = parseInt(localStorage.getItem("userId"));
  const { activeChat } = useChat();

  const [messages, setMessages]         = useState([]);
  const [text, setText]                 = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { isConnected, connection } = UseSignalR(userId);

  const isGroup  = activeChat?.type === "group";
  const chatName = activeChat?.name || "Select a conversation";

  // ── LOAD MESSAGES ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeChat) return;
    setMessages([]);
    setShowSettings(false);
    loadMessages();
  }, [activeChat]);

  const loadMessages = async () => {
    try {
      let res;
      if (isGroup) {
        res = await ChatApi.get(`/Chat/group/${activeChat.groupId}`);
      } else {
        res = await ChatApi.get(
          `/Chat/personal?senderId=${userId}&receiverId=${activeChat.userId}`
        );
      }
      const msgs = res.data.messages || [];
      setMessages(msgs.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)));
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  // ── AUTO SCROLL ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── SIGNALR RECEIVE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConnected || !activeChat) return;

    connection.on("ReceiveMessage", (payload) => {
      if (
        payload.senderId !== userId &&
        (payload.senderId === activeChat.userId ||
          payload.receiverId === activeChat.userId)
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    connection.on("ReceiveGroupMessage", (payload) => {
      if (
        isGroup &&
        payload.groupId === activeChat.groupId &&
        payload.senderId !== userId
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    return () => {
      connection.off("ReceiveMessage");
      connection.off("ReceiveGroupMessage");
    };
  }, [isConnected, activeChat]);

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!text.trim() || !isConnected || !activeChat) return;
    const trimmed = text.trim();
    setText("");

    const optimisticMsg = {
      senderId:    userId,
      message:     trimmed,
      messageText: trimmed,
      sentAt:      new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      if (isGroup) {
        await connection.invoke("SendGroupMessage", {
          groupId:  activeChat.groupId,
          senderId: userId,
          message:  trimmed,
        });
      } else {
        await connection.invoke("SendMessageToUser", {
          senderId:    userId,
          receiverId:  activeChat.userId,
          messageText: trimmed,
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m !== optimisticMsg));
      setText(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#0e0e12]">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0e0e12] relative">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#0c0c0f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold">
            {isGroup ? "#" : getInitials(chatName)}
          </div>
          <div>
            <p className="text-white font-semibold">{chatName}</p>
            <p className="text-xs text-green-400">
              {isConnected ? "● Online" : "Connecting..."}
            </p>
          </div>
        </div>

        {isGroup && (
          <button
            onClick={() => {
              console.log("⚙️ Settings opened — activeChat:", JSON.stringify(activeChat, null, 2));
              setShowSettings(true);
            }}
            title="Group Settings"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>

      {/* ── MESSAGES ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
        {messages.map((msg, i) => {
          const isMine  = msg.senderId === userId;
          const content = msg.message || msg.messageText;
          return (
            <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-xl max-w-xs ${
                  isMine ? "bg-violet-500 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ───────────────────────────────────────────────────────────── */}
      <div className="p-3 flex gap-2 border-t border-gray-800 bg-[#0c0c0f]">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          className="flex-1 bg-gray-800 text-white p-2 rounded outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || !isConnected}
          className="bg-violet-500 px-4 rounded text-white disabled:opacity-30"
        >
          Send
        </button>
      </div>

      {/* ── GROUP SETTINGS MODAL ────────────────────────────────────────────── */}
      {showSettings && isGroup && (
        <GroupSettingsModal
          activeChat={activeChat}
          userId={userId}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default ChatWindow;
