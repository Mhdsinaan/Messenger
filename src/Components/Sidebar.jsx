import React from "react";

function Sidebar() {
  const chats = [
    {
      id: 1,
      name: "Rahul",
      message: "Hello bro, how are you?",
      time: "10:45 AM",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Arjun",
      message: "Did you finish the project?",
      time: "09:30 AM",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Akhil",
      message: "Let's meet tomorrow",
      time: "Yesterday",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Nikhil",
      message: "Okay 👍",
      time: "Mon",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
     {
      id: 6,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
     {
      id: 7,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
     {
      id: 8,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
     {
      id: 9,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
     {
      id: 1,
      name: "Sanjay",
      message: "Send me the files",
      time: "Sun",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];
  return (
    <div className="p-8">
      <div className="flex gap-6 items-center bg-white w-100 rounded-lg p-4 border border-gray-200 items-center ">
        <h2>Chat</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded "
        />
        <button className="bg-black text-white py-1 px-2 rounded-2xl">+</button>
      </div>
      <div className="bg-white w-100 p-3 mt-3 rounded-2xl h-110 overflow-y-auto">
    {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <img
            src={chat.image}
            alt=""
            className="w-10 h-10 rounded-full"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-sm text-gray-500">{chat.message}</p>
          </div>

          <span className="text-xs text-gray-400">{chat.time}</span>
        </div>
      ))}
      </div>
    </div>
  );
}

export default Sidebar;
