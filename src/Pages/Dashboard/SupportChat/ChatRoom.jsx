// import React, { useState, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { Avatar } from "antd";
// import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";

// function ChatRoom() {
//   const { chatRoomId } = useParams(); // Get chat ID from URL
//   const location = useLocation();
//   const user = location.state?.user || {}; // Get user data from state

//   const [messages, setMessages] = useState([
//     { id: 1, text: "Hey, how are you?", sender: "other", time: "10:00" },
//     { id: 2, text: "I'm good, what about you?", sender: "me", time: "10:01" },
//   ]);
//   const [messageText, setMessageText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null); // Track the selected message for reply
//   const fileInputRef = useRef(null);

//   // Function to send text message
//   const sendMessage = () => {
//     if (messageText.trim() === "") return;

//     const newMessage = {
//       id: messages.length + 1,
//       text: messageText,
//       sender: "me",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       replyTo: selectedMessage ? selectedMessage.id : null, // Attach reply to the message if any
//     };

//     setMessages([...messages, newMessage]);
//     setMessageText("");
//     setSelectedMessage(null); // Clear selected message after sending
//   };

//   // Function to handle emoji selection
//   const addEmoji = (emoji) => {
//     setMessageText((prev) => prev + emoji.native);
//     setShowEmojiPicker(false); // Hide the picker after selecting an emoji
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const newMessage = {
//       id: messages.length + 1,
//       sender: "me",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       file: {
//         name: file.name,
//         url: URL.createObjectURL(file),
//         type: file.type.startsWith("image/") ? "image" : "file",
//       },
//       replyTo: selectedMessage ? selectedMessage.id : null, // Attach reply to the message if any
//     };

//     setMessages([...messages, newMessage]);

//     // Reset the file input to allow re-selecting the same file
//     event.target.value = null;
//     setSelectedMessage(null); // Clear selected message after sending
//   };

//   const handleMessageClick = (msg) => {
//     // Set the message to be replied to and highlight it
//     setSelectedMessage(msg);
//   };

//   return (
//     <div className="h-full flex flex-col bg-white rounded-r-lg">
//       {/* Header */}
//       <div className="flex items-center gap-3 p-4 border-b shadow-sm">
//         <Avatar src={user.avatar} size={50} />
//         <div>
//           <h2 className="text-lg font-semibold">{user.name || "Unknown"}</h2>
//           <p className="text-gray-500 text-sm">
//             Last seen: {user.lastSeen} min ago
//           </p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         className="flex flex-col gap-3 p-4 flex-grow overflow-y-auto  [&::-webkit-scrollbar]:w-1
//   [&::-webkit-scrollbar-track]:rounded-full
//   [&::-webkit-scrollbar-track]:bg-gray-100
//   [&::-webkit-scrollbar-thumb]:rounded-full
//   [&::-webkit-scrollbar-thumb]:bg-gray-300
//   dark:[&::-webkit-scrollbar-track]:bg-slate-400
//   dark:[&::-webkit-scrollbar-thumb]:bg-slate-200"
//       >
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex items-start gap-2 ${
//               msg.sender === "me" ? "justify-end" : "justify-start"
//             } ${
//               selectedMessage?.id === msg.id
//                 ? "w-fit bg-slate-400 rounded-lg"
//                 : ""
//             }`}
//             onClick={() => handleMessageClick(msg)} // Click to select message for reply
//           >
//             {msg.sender === "other" && <Avatar src={user.avatar} size={40} />}

//             <div
//               className={`p-3 rounded-lg shadow-md max-w-[60%] ${
//                 msg.sender === "me"
//                   ? "bg-abbes text-white rounded-br-none"
//                   : "bg-gray-200 text-black rounded-tl-none"
//               }`}
//             >
//               {msg.replyTo && (
//                 <div className="bg-gray-100 p-2 rounded-md mb-2 text-sm italic">
//                   <p>{messages.find((m) => m.id === msg.replyTo)?.text}</p>
//                 </div>
//               )}
//               {msg.text && (
//                 <p
//                   className={`text-sm ${
//                     msg.sender === "me" ? "text-white" : ""
//                   }`}
//                 >
//                   {msg.text}
//                 </p>
//               )}
//               {msg.file && msg.file.type === "image" && (
//                 <img
//                   src={msg.file.url}
//                   alt="Sent"
//                   className="rounded-md w-48 mt-2"
//                 />
//               )}
//               {msg.file && msg.file.type === "file" && (
//                 <a
//                   href={msg.file.url}
//                   download={msg.file.name}
//                   className="text-blue-700 underline mt-2 block"
//                 >
//                   {msg.file.name}
//                 </a>
//               )}
//               <p
//                 className={`text-xs text-right mt-1  ${
//                   msg.sender === "me" ? "text-slate-300" : null
//                 }`}
//               >
//                 {msg.time}
//               </p>
//             </div>

//             {msg.sender === "me" && (
//               <Avatar src={"/your-avatar.png"} size={40} />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="relative flex items-center p-4 border-t">
//         <button
//           className="p-2 text-gray-600"
//           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//         >
//           <FaRegSmile size={24} />
//         </button>
//         {showEmojiPicker && (
//           <div className="absolute bottom-14 left-4 z-10">
//             <Picker data={data} onEmojiSelect={addEmoji} />
//           </div>
//         )}

//         <button
//           className="p-2 text-gray-600"
//           onClick={() => fileInputRef.current.click()}
//         >
//           <FaPaperclip size={24} />
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           accept="image/*, .pdf, .doc, .docx"
//         />

//         <input
//           type="text"
//           placeholder="Enter Message..."
//           value={messageText}
//           onChange={(e) => setMessageText(e.target.value)}
//           className="flex-grow p-3 border rounded-lg focus:outline-none"
//         />

//         <button
//           className="ml-2 bg-abbes text-white p-3 rounded-lg"
//           onClick={sendMessage}
//         >
//           <FaPaperPlane size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatRoom;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Avatar, message as antMessage } from "antd";
import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { jwtDecode } from "jwt-decode";
import { useChatSocket } from "./customHook";
import {
  useGetMessageQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
} from "../../../redux/apiSlices/supportChatApi";

function ChatRoom() {
  const { chatRoomId } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};

  const { userId } = jwtDecode(localStorage.getItem("accessToken"));
  console.log("sfsdf", userId);
  // Get current user ID from your auth system
  const currentUserId = userId; // Replace with actual user ID

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // RTK Query hooks
  const {
    data: messageData,
    isLoading,
    error,
  } = useGetMessageQuery(chatRoomId, {
    skip: !chatRoomId,
  });
  const [sendMessageMutation, { isLoading: isSending }] =
    useSendMessageMutation();
  const [markAsReadMutation] = useMarkAsReadMutation();

  // Socket event handlers
  const handleMessageReceived = useCallback(
    (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();

      // Mark as read if chat is active
      if (document.hasFocus()) {
        markAsReadMutation({
          chatRoomId,
          messageIds: [message.id],
        });
      }
    },
    [chatRoomId, markAsReadMutation]
  );

  const handleStatusUpdate = useCallback((data) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === data.messageId ? { ...msg, status: data.status } : msg
      )
    );
  }, []);

  // Custom socket hook
  const {
    isConnected,
    sendMessage: socketSendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  } = useChatSocket(
    currentUserId,
    chatRoomId,
    handleMessageReceived,
    handleStatusUpdate
  );

  // Load messages from API
  useEffect(() => {
    if (messageData?.messages) {
      setMessages(messageData.messages);
      scrollToBottom();
    }
  }, [messageData]);

  // Handle errors
  useEffect(() => {
    if (error) {
      antMessage.error("Failed to load messages");
    }
  }, [error]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle typing indicators
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 2000);
  };

  // Send text message
  const sendMessage = async () => {
    if (messageText.trim() === "" || isSending) return;

    const messagePayload = {
      text: messageText,
      type: "text",
      replyTo: selectedMessage ? selectedMessage.id : null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send to API
      const response = await sendMessageMutation({
        id: chatRoomId,
        message: messagePayload,
      }).unwrap();

      // Send via socket for real-time updates
      const socketMessage = {
        ...messagePayload,
        id: response.messageId || `msg_${Date.now()}`,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socketSendMessage(socketMessage);

      // Clear input and selected message
      setMessageText("");
      setSelectedMessage(null);
      setIsTyping(false);
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
      antMessage.error("Failed to send message");
    }
  };

  // Send file message
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "file");
    formData.append("replyTo", selectedMessage ? selectedMessage.id : "");
    formData.append("timestamp", new Date().toISOString());

    try {
      // Send file to API
      const response = await sendMessageMutation({
        id: chatRoomId,
        message: formData,
      }).unwrap();

      // Create file message object for socket
      const fileMessage = {
        id: response.messageId || `file_${Date.now()}`,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: {
          name: file.name,
          url: response.fileUrl || URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "file",
        },
        replyTo: selectedMessage ? selectedMessage.id : null,
        timestamp: new Date().toISOString(),
      };

      // Send via socket
      socketSendMessage(fileMessage);

      // Reset file input and selected message
      event.target.value = null;
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to send file:", error);
      antMessage.error("Failed to send file");
    }
  };

  // Handle emoji selection
  const addEmoji = (emoji) => {
    setMessageText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle message click for reply
  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-r-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} size={50} />
          <div>
            <h2 className="text-lg font-semibold">{user.name || "Unknown"}</h2>
            <p className="text-gray-500 text-sm">
              {user.isOnline ? "Online" : `Last seen: ${user.lastSeen} min ago`}
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "Connected" : "Reconnecting..."}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 p-4 flex-grow overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            } ${
              selectedMessage?.id === msg.id ? "bg-blue-50 rounded-lg p-2" : ""
            }`}
            onClick={() => handleMessageClick(msg)}
          >
            {msg.sender === "other" && <Avatar src={user.avatar} size={40} />}

            <div
              className={`p-3 rounded-lg shadow-md max-w-[60%] cursor-pointer hover:shadow-lg transition-shadow ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-tl-none"
              }`}
            >
              {msg.replyTo && (
                <div className="bg-gray-100 p-2 rounded-md mb-2 text-sm italic opacity-80">
                  <p className="text-gray-600">
                    {messages.find((m) => m.id === msg.replyTo)?.text ||
                      "Original message"}
                  </p>
                </div>
              )}

              {msg.text && (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}

              {msg.file && msg.file.type === "image" && (
                <img
                  src={msg.file.url}
                  alt="Sent"
                  className="rounded-md max-w-48 mt-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open image in modal or new tab
                    window.open(msg.file.url, "_blank");
                  }}
                />
              )}

              {msg.file && msg.file.type === "file" && (
                <a
                  href={msg.file.url}
                  download={msg.file.name}
                  className="text-blue-700 underline mt-2 block hover:text-blue-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  📎 {msg.file.name}
                </a>
              )}

              <div className="flex justify-between items-center mt-1">
                <p
                  className={`text-xs ${
                    msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
                {msg.sender === "me" && msg.status && (
                  <span
                    className={`text-xs ml-2 ${
                      msg.status === "sent"
                        ? "text-gray-300"
                        : msg.status === "delivered"
                        ? "text-blue-300"
                        : msg.status === "read"
                        ? "text-green-300"
                        : ""
                    }`}
                  >
                    {msg.status === "sent"
                      ? "✓"
                      : msg.status === "delivered"
                      ? "✓✓"
                      : msg.status === "read"
                      ? "✓✓"
                      : ""}
                  </span>
                )}
              </div>
            </div>

            {msg.sender === "me" && (
              <Avatar src={"/your-avatar.png"} size={40} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {selectedMessage && (
        <div className="px-4 py-2 bg-blue-50 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium text-blue-600">Replying to:</span>
              <p className="text-gray-600 truncate max-w-md">
                {selectedMessage.text || selectedMessage.file?.name}
              </p>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="relative flex items-center p-4 border-t bg-gray-50">
        <button
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
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
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <FaPaperclip size={24} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*, .pdf, .doc, .docx, .txt"
        />

        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-grow p-3 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isConnected}
        />

        <button
          className={`p-3 rounded-lg transition-all ${
            messageText.trim() && isConnected
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={sendMessage}
          disabled={!messageText.trim() || isSending || !isConnected}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaPaperPlane size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
