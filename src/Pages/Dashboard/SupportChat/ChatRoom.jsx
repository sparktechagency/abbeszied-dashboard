import React, { useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Avatar } from "antd";
import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function ChatRoom() {
  const { chatRoomId } = useParams(); // Get chat ID from URL
  const location = useLocation();
  const user = location.state?.user || {}; // Get user data from state

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how are you?", sender: "other", time: "10:00" },
    { id: 2, text: "I'm good, what about you?", sender: "me", time: "10:01" },
  ]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null); // Track the selected message for reply
  const fileInputRef = useRef(null);

  // Function to send text message
  const sendMessage = () => {
    if (messageText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      replyTo: selectedMessage ? selectedMessage.id : null, // Attach reply to the message if any
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    setSelectedMessage(null); // Clear selected message after sending
  };

  // Function to handle emoji selection
  const addEmoji = (emoji) => {
    setMessageText((prev) => prev + emoji.native);
    setShowEmojiPicker(false); // Hide the picker after selecting an emoji
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      file: {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "file",
      },
      replyTo: selectedMessage ? selectedMessage.id : null, // Attach reply to the message if any
    };

    setMessages([...messages, newMessage]);

    // Reset the file input to allow re-selecting the same file
    event.target.value = null;
    setSelectedMessage(null); // Clear selected message after sending
  };

  const handleMessageClick = (msg) => {
    // Set the message to be replied to and highlight it
    setSelectedMessage(msg);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-r-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shadow-sm">
        <Avatar src={user.avatar} size={50} />
        <div>
          <h2 className="text-lg font-semibold">{user.name || "Unknown"}</h2>
          <p className="text-gray-500 text-sm">
            Last seen: {user.lastSeen} min ago
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex flex-col gap-3 p-4 flex-grow overflow-y-auto  [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-slate-400
  dark:[&::-webkit-scrollbar-thumb]:bg-slate-200"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            } ${
              selectedMessage?.id === msg.id
                ? "w-fit bg-slate-400 rounded-lg"
                : ""
            }`}
            onClick={() => handleMessageClick(msg)} // Click to select message for reply
          >
            {msg.sender === "other" && <Avatar src={user.avatar} size={40} />}

            <div
              className={`p-3 rounded-lg shadow-md max-w-[60%] ${
                msg.sender === "me"
                  ? "bg-abbes text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-tl-none"
              }`}
            >
              {msg.replyTo && (
                <div className="bg-gray-100 p-2 rounded-md mb-2 text-sm italic">
                  <p>{messages.find((m) => m.id === msg.replyTo)?.text}</p>
                </div>
              )}
              {msg.text && (
                <p
                  className={`text-sm ${
                    msg.sender === "me" ? "text-white" : ""
                  }`}
                >
                  {msg.text}
                </p>
              )}
              {msg.file && msg.file.type === "image" && (
                <img
                  src={msg.file.url}
                  alt="Sent"
                  className="rounded-md w-48 mt-2"
                />
              )}
              {msg.file && msg.file.type === "file" && (
                <a
                  href={msg.file.url}
                  download={msg.file.name}
                  className="text-blue-700 underline mt-2 block"
                >
                  {msg.file.name}
                </a>
              )}
              <p
                className={`text-xs text-right mt-1  ${
                  msg.sender === "me" ? "text-slate-300" : null
                }`}
              >
                {msg.time}
              </p>
            </div>

            {msg.sender === "me" && (
              <Avatar src={"/your-avatar.png"} size={40} />
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="relative flex items-center p-4 border-t">
        <button
          className="p-2 text-gray-600"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaRegSmile size={24} />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-4 z-10">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}

        <button
          className="p-2 text-gray-600"
          onClick={() => fileInputRef.current.click()}
        >
          <FaPaperclip size={24} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*, .pdf, .doc, .docx"
        />

        <input
          type="text"
          placeholder="Enter Message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-grow p-3 border rounded-lg focus:outline-none"
        />

        <button
          className="ml-2 bg-abbes text-white p-3 rounded-lg"
          onClick={sendMessage}
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
