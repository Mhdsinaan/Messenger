import React, { useEffect, useState } from "react";
import { chatApi } from "../../api/chatApi";

function CreateGroupModal({ isOpen, onClose, onGroupCreated, userId }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 SEARCH USERS
  const searchUsers = async (word) => {
    try {
      const res = await chatApi.get(`/Chat/search-users?word=${word}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ⏳ DEBOUNCE
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) searchUsers(search);
      else setUsers([]);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // 🔄 RESET WHEN MODAL CLOSE
  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
      setSearch("");
      setUsers([]);
      setSelectedUsers([]);
      setError("");
    }
  }, [isOpen]);

  // ✅ TOGGLE USER
  const toggleUser = (user) => {
    const exists = selectedUsers.find((u) => u.userId === user.userId);

    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.userId));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // ❌ REMOVE USER
  const removeUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u.userId !== id));
  };

  // 🚀 CREATE GROUP
  const createGroup = async () => {
    setError("");

    if (!groupName.trim()) {
      setError("Group name required");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Select at least one user");
      return;
    }

    setLoading(true);

    try {
      await chatApi.post("/Chat/create-group", {
        groupName,
        createdBy: userId,
        memberIds: selectedUsers.map((u) => u.userId),
      });

      onGroupCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#18181f] w-[420px] rounded-2xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-700 flex justify-between">
          <h2 className="text-white font-semibold">Create Group</h2>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-3">

          <input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          {/* Selected users */}
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <span
                key={u.userId}
                onClick={() => removeUser(u.userId)}
                className="bg-violet-600 px-2 py-1 text-xs rounded text-white cursor-pointer"
              >
                {u.username} ✕
              </span>
            ))}
          </div>

          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <div className="max-h-40 overflow-y-auto">
            {users.map((user) => {
              const selected = selectedUsers.some(
                (u) => u.userId === user.userId
              );

              return (
                <div
                  key={user.userId}
                  onClick={() => toggleUser(user)}
                  className={`p-2 cursor-pointer ${
                    selected ? "bg-violet-500/20" : "hover:bg-gray-700"
                  }`}
                >
                  {user.username}
                </div>
              );
            })}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="p-4 flex gap-2 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-yellow text-white p-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={createGroup}
            className="flex-1 bg-violet-500 text-white p-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreateGroupModal;