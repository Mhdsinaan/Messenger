import React from "react";

function ChatWindow() {

  const messages = [
    { id: 1, sender: "other", text: "Hello bro 👋", time: "10:40 AM" },
    { id: 2, sender: "me", text: "Hi Rahul!", time: "10:41 AM" },
    { id: 3, sender: "other", text: "Did you finish the project?", time: "10:42 AM" },
    { id: 4, sender: "me", text: "Almost done.", time: "10:45 AM" },
  ];

  return (
    <div className="flex-1 flex flex-col p-8">

      {/* Chat Header */}

      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/150?img=1"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold">Rahul</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>

        </div>

        <button className="bg-black text-white px-4 py-1 rounded-lg">
          Call
        </button>

      </div>

      {/* Messages */}

      <div className="flex-1 bg-white mt-3 rounded-lg border border-gray-200 p-4 overflow-y-auto space-y-4">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >

            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "me"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs opacity-70 block mt-1">
                {msg.time}
              </span>
            </div>

          </div>
        ))}

      </div>

      {/* Message Input */}

      <div className="bg-white mt-3 p-3 rounded-lg border border-gray-200 flex gap-3">

        <input
          type="text"
          placeholder="Type message..."
          className="flex-1 border rounded-lg p-2 outline-none"
        />

        <button className="bg-black text-white px-4 rounded-lg">
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatWindow;