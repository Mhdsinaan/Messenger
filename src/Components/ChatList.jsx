import React from "react";

function ChatList() {

  const chats = [
    {
      id: 1,
      name: "Bella Huffman",
      message: "That looks amazing",
      type: "user",
      image: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Frontend Team",
      message: "Meeting at 4 PM",
      type: "group",
      image: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
    },
  ];

  return (
    <div className="w-80 bg-white border-r flex flex-col">

      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-lg border focus:outline-none"
        />
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto">

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          >

            <img
              src={chat.image}
              className="w-10 h-10 rounded-full"
            />

            <div className="ml-3">
              <h3 className="font-semibold">
                {chat.name}

                {chat.type === "group" && (
                  <span className="text-xs text-blue-500 ml-2">(Group)</span>
                )}

              </h3>

              <p className="text-sm text-gray-500">{chat.message}</p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ChatList;