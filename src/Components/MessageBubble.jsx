function MessageBubble({ message, sender }) {
  return (
    <div
      className={`flex ${sender === "me" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          sender === "me"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export default MessageBubble;