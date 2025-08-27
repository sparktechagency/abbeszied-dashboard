// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { Avatar, message as antMessage } from "antd";
// import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// import { jwtDecode } from "jwt-decode";
// import { useChatSocket } from "./customHook";
// import {
//   useGetMessageQuery,
//   useMarkAsReadMutation,
//   useSendMessageMutation,
// } from "../../../redux/apiSlices/supportChatApi";
// import { getImageUrl } from "../../../utils/baseUrl";

// function ChatRoom() {
//   const { chatRoomId } = useParams();
//   const location = useLocation();
//   const user = location.state?.user || {};

//   const { userId } = jwtDecode(localStorage.getItem("accessToken"));

//   // Get current user ID from your auth system
//   const currentUserId = userId; // Replace with actual user ID

//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // RTK Query hooks
//   const {
//     data: messageData,
//     isLoading,
//     error,
//     refetch,
//   } = useGetMessageQuery(chatRoomId, {
//     skip: !chatRoomId,
//   });
//   const [sendMessageMutation, { isLoading: isSending }] =
//     useSendMessageMutation();
//   const [markAsReadMutation] = useMarkAsReadMutation();

//   console.log("messageData", messageData);

//   // Socket connection and message handling
//   const {
//     socket,
//     isConnected,
//     sendMessage: socketSendMessage,
//     markAsRead,
//     startTyping,
//     stopTyping,
//   } = useChatSocket(
//     currentUserId,
//     chatRoomId,
//     // Message received handler
//     (receivedMessage) => {
//       console.group("Socket Message Received");
//       console.log("Raw Received Message:", receivedMessage);

//       try {
//         // Process and add the received message
//         const processedMessage = processMessages({
//           data: {
//             messages: [receivedMessage],
//           },
//         })[0];

//         if (processedMessage) {
//           setMessages((prevMessages) => {
//             // Prevent duplicate messages
//             const isDuplicate = prevMessages.some(
//               (msg) => msg.id === processedMessage.id
//             );

//             if (!isDuplicate) {
//               return [...prevMessages, processedMessage];
//             }
//             return prevMessages;
//           });

//           // Automatically scroll to bottom
//           scrollToBottom();
//         }
//       } catch (error) {
//         console.error("Error processing received message:", error);
//       }
//       console.groupEnd();
//     },
//     // Status update handler
//     (statusUpdate) => {
//       console.log("Message Status Update:", statusUpdate);
//       // Update message status in the messages list
//       setMessages((prevMessages) =>
//         prevMessages.map((msg) =>
//           msg.id === statusUpdate.messageId
//             ? { ...msg, status: statusUpdate.status }
//             : msg
//         )
//       );
//     }
//   );

//   // Enhanced connection status tracking
//   const [connectionAttempts, setConnectionAttempts] = useState(0);
//   const MAX_CONNECTION_ATTEMPTS = 3;

//   // Connection status effect
//   // useEffect(() => {
//   //   if (!isConnected) {
//   //     setConnectionAttempts((prev) => prev + 1);

//   //     // Show connection status message
//   //     antMessage.warning("Chat connection lost. Attempting to reconnect...", 3);
//   //   } else {
//   //     // Reset connection attempts on successful connection
//   //     setConnectionAttempts(0);
//   //   }

//   //   // Auto-retry connection or show permanent error
//   //   if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
//   //     antMessage.error(
//   //       "Unable to establish chat connection. Please check your network.",
//   //       5
//   //     );
//   //   }
//   // }, [isConnected, connectionAttempts]);

//   // Retry connection manually
//   const handleRetryConnection = () => {
//     if (socket) {
//       socket.connect();
//       setConnectionAttempts(0);
//     }
//   };

//   // Modify message data processing
//   const processMessages = useCallback((rawMessages) => {
//     // Extensive null and type checking
//     console.group("Message Processing Debug");
//     console.log("Raw Input:", rawMessages);

//     // Handle null or undefined input
//     if (rawMessages === null || rawMessages === undefined) {
//       console.warn("Received null or undefined messages");
//       console.groupEnd();
//       return [];
//     }

//     // Handle non-object input
//     if (typeof rawMessages !== "object") {
//       console.warn("Invalid message data type:", typeof rawMessages);
//       console.groupEnd();
//       return [];
//     }

//     // Extract messages with multiple fallback strategies
//     let messages = [];
//     try {
//       // Multiple ways to extract messages
//       messages =
//         rawMessages.data?.messages ||
//         rawMessages.messages ||
//         (Array.isArray(rawMessages) ? rawMessages : []);
//     } catch (extractError) {
//       console.error("Error extracting messages:", extractError);
//       console.groupEnd();
//       return [];
//     }

//     // Validate messages array
//     if (!Array.isArray(messages)) {
//       console.warn("Extracted messages is not an array:", messages);
//       console.groupEnd();
//       return [];
//     }

//     // Get current user ID
//     let userId = null;
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         userId = decodedToken.userId || decodedToken.id;
//       }
//     } catch (error) {
//       console.error("Failed to decode token:", error);
//     }

//     // Process each message with extensive error handling
//     const processedMessages = messages
//       .map((msg, index) => {
//         // Skip invalid messages
//         if (!msg || typeof msg !== "object") {
//           console.warn(`Invalid message at index ${index}:`, msg);
//           return null;
//         }

//         try {
//           // Safely extract sender information
//           const sender = msg.sender || {};
//           const senderId =
//             typeof sender === "object" ? sender._id || sender.id : sender;

//           // Determine if message is from current user
//           const isCurrentUserMessage =
//             senderId === userId ||
//             (typeof sender === "object" && sender._id === userId);

//           // Safely extract text
//           const text =
//             typeof msg.text === "string"
//               ? msg.text
//               : msg.text?.toString() || "";

//           // Safely handle images
//           const images = Array.isArray(msg.images)
//             ? msg.images
//             : msg.images
//             ? [msg.images]
//             : [];

//           // Create processed message object
//           return {
//             id: msg._id || msg.id || `msg_${Date.now()}_${index}`,
//             text: text,
//             sender: isCurrentUserMessage ? "me" : "other",
//             time: msg.createdAt
//               ? new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               : "",
//             timestamp: msg.createdAt || new Date().toISOString(),
//             status: msg.read ? "read" : "sent",
//             // Handle file messages
//             file:
//               images.length > 0
//                 ? {
//                     type: "image",
//                     url: images[0],
//                     name: "Uploaded Image",
//                   }
//                 : null,
//             // Include additional metadata
//             originalSender:
//               typeof sender === "object"
//                 ? sender.fullName || sender.email || "Unknown"
//                 : sender || "Unknown",
//             // Add raw message for debugging
//             _rawMessage: JSON.stringify(msg),
//           };
//         } catch (processingError) {
//           console.error(
//             `Error processing message at index ${index}:`,
//             processingError
//           );
//           return null;
//         }
//       })
//       .filter(Boolean); // Remove any null entries

//     console.log("Processed Messages:", processedMessages);
//     console.groupEnd();

//     return processedMessages;
//   }, []);

//   // Handle message click for reply or selection
//   const handleMessageClick = useCallback((msg) => {
//     // Prevent error if msg is undefined or null
//     if (!msg || typeof msg !== "object") {
//       console.warn("Invalid message clicked:", msg);
//       return;
//     }

//     // Set selected message for potential reply or other interactions
//     setSelectedMessage((prevSelected) =>
//       prevSelected?.id === msg.id ? null : msg
//     );
//   }, []);

//   // Error Boundary Component
//   const MessageErrorBoundary = ({ children }) => {
//     const [hasError, setHasError] = useState(false);

//     useEffect(() => {
//       const handleError = (error) => {
//         console.error("Rendering error in messages:", error);
//         setHasError(true);
//       };

//       window.addEventListener("error", handleError);
//       return () => window.removeEventListener("error", handleError);
//     }, []);

//     if (hasError) {
//       return (
//         <div className="text-red-500 p-4 text-center">
//           <p>Error rendering messages. Please try again.</p>
//           <button
//             onClick={() => {
//               setHasError(false);
//               // Optionally, trigger a refresh
//               refetch();
//             }}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }

//     return children;
//   };

//   // Helper function to generate safe image URL
//   const generateSafeImageUrl = useCallback(
//     (imagePath) => {
//       // Ensure image path is a string and not empty
//       if (!imagePath || typeof imagePath !== "string") {
//         return null;
//       }

//       // Remove leading slash if present
//       const cleanPath = imagePath.startsWith("/")
//         ? imagePath.slice(1)
//         : imagePath;

//       // Construct full URL
//       const fullUrl = `${getImageUrl}${cleanPath}`;

//       // Validate URL
//       try {
//         new URL(fullUrl);
//         return fullUrl;
//       } catch {
//         console.warn("Invalid image URL:", fullUrl);
//         return null;
//       }
//     },
//     [getImageUrl]
//   );

//   // Render messages function
//   const renderMessages = useCallback(() => {
//     // If no messages, show a placeholder
//     if (!messages || messages.length === 0) {
//       return (
//         <div className="flex items-center justify-center h-full text-gray-500">
//           <p>No messages yet. Start a conversation!</p>
//         </div>
//       );
//     }

//     return (
//       <MessageErrorBoundary>
//         {messages.map((msg) => {
//           // Defensive rendering with additional checks
//           if (!msg || typeof msg !== "object") {
//             console.warn("Invalid message:", msg);
//             return null;
//           }

//           // Ensure all required properties exist
//           const safeMsg = {
//             id: msg.id || `invalid_msg_${Math.random()}`,
//             text: msg.text || "",
//             sender: msg.sender || "other",
//             time: msg.time || "Unknown time",
//             file: msg.file || null,
//             status: msg.status || "sent",
//             replyTo: msg.replyTo || null,
//             // Add sender image handling
//             senderImage: msg.senderImage || msg.avatar || null,
//           };

//           // Determine sender avatar
//           const senderAvatar =
//             safeMsg.sender === "me"
//               ? "/your-avatar.png" // Default avatar for current user
//               : generateSafeImageUrl(user.avatar);

//           return (
//             <div
//               key={safeMsg.id}
//               className={`flex items-start gap-2 ${
//                 safeMsg.sender === "me" ? "justify-end" : "justify-start"
//               } ${
//                 selectedMessage?.id === safeMsg.id
//                   ? "bg-blue-50 rounded-lg p-2"
//                   : ""
//               }`}
//               onClick={() => handleMessageClick(safeMsg)}
//             >
//               {safeMsg.sender === "other" && (
//                 <Avatar src={senderAvatar} size={40}>
//                   {!senderAvatar && user.name?.charAt(0).toUpperCase()}
//                 </Avatar>
//               )}

//               <div
//                 className={`p-3 rounded-lg shadow-md max-w-[60%] cursor-pointer hover:shadow-lg transition-shadow ${
//                   safeMsg.sender === "me"
//                     ? "bg-blue-500 text-white rounded-br-none"
//                     : "bg-gray-200 text-black rounded-tl-none"
//                 }`}
//               >
//                 {safeMsg.replyTo && (
//                   <div className="bg-gray-100 p-2 rounded-md mb-2 text-sm italic opacity-80">
//                     <p className="text-gray-600">
//                       {messages.find((m) => m.id === safeMsg.replyTo)?.text ||
//                         "Original message"}
//                     </p>
//                   </div>
//                 )}

//                 {safeMsg.text && (
//                   <p className="text-sm whitespace-pre-wrap">
//                     {safeMsg.text || "No message content"}
//                   </p>
//                 )}

//                 {safeMsg.file && safeMsg.file.type === "image" && (
//                   <img
//                     src={safeMsg.file.url}
//                     alt="Sent"
//                     className="rounded-md max-w-48 mt-2 cursor-pointer"
//                     onError={(e) => {
//                       console.warn("Image load error:", safeMsg.file);
//                       e.target.src = "/fallback-image.png"; // Provide a fallback image
//                     }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Open image in modal or new tab
//                       window.open(safeMsg.file.url, "_blank");
//                     }}
//                   />
//                 )}

//                 {safeMsg.file && safeMsg.file.type === "file" && (
//                   <a
//                     href={safeMsg.file.url}
//                     download={safeMsg.file.name}
//                     className="text-blue-700 underline mt-2 block hover:text-blue-900"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     📎 {safeMsg.file.name || "Unnamed File"}
//                   </a>
//                 )}

//                 <div className="flex justify-between items-center mt-1">
//                   <p
//                     className={`text-xs ${
//                       safeMsg.sender === "me"
//                         ? "text-blue-100"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {safeMsg.time}
//                   </p>
//                   {safeMsg.sender === "me" && safeMsg.status && (
//                     <span
//                       className={`text-xs ml-2 ${
//                         safeMsg.status === "sent"
//                           ? "text-gray-300"
//                           : safeMsg.status === "delivered"
//                           ? "text-blue-300"
//                           : safeMsg.status === "read"
//                           ? "text-green-300"
//                           : ""
//                       }`}
//                     >
//                       {safeMsg.status === "sent"
//                         ? "✓"
//                         : safeMsg.status === "delivered"
//                         ? "✓✓"
//                         : safeMsg.status === "read"
//                         ? "✓✓"
//                         : ""}
//                     </span>
//                   )}
//                 </div>

//                 {/* Debug info for problematic messages */}
//                 {process.env.NODE_ENV === "development" && msg._rawMessage && (
//                   <details className="text-xs text-gray-400 mt-2">
//                     <summary>Debug Message</summary>
//                     <pre>{msg._rawMessage}</pre>
//                   </details>
//                 )}
//               </div>

//               {safeMsg.sender === "me" && (
//                 <Avatar src={senderAvatar} size={40}>
//                   {!senderAvatar && "Me"}
//                 </Avatar>
//               )}
//             </div>
//           );
//         })}
//       </MessageErrorBoundary>
//     );
//   }, [
//     messages,
//     selectedMessage,
//     user,
//     generateSafeImageUrl,
//     handleMessageClick,
//   ]);

//   // Load messages from API
//   useEffect(() => {
//     console.log("Full messageData:", messageData);

//     if (messageData) {
//       try {
//         const processedMessages = processMessages(messageData);

//         // Additional validation before setting state
//         if (Array.isArray(processedMessages)) {
//           setMessages(processedMessages);
//           scrollToBottom();
//         } else {
//           console.error(
//             "Processed messages is not an array:",
//             processedMessages
//           );
//           antMessage.error("Failed to process messages");
//         }
//       } catch (error) {
//         console.error("Message Processing Failure:", error);
//         antMessage.error(`Failed to process messages: ${error.message}`);
//       }
//     }
//   }, [messageData, processMessages]);

//   // Debug logging for chat room details
//   // useEffect(() => {
//   //   console.log("ChatRoom Details:", {
//   //     chatRoomId,
//   //     user,
//   //     currentUserId,
//   //     messageData,
//   //     error,
//   //   });
//   // }, [chatRoomId, user, currentUserId, messageData, error]);

//   // Modify error handling to be more verbose
//   useEffect(() => {
//     if (error) {
//       console.error("Message Fetch Error:", error);
//       antMessage.error(
//         `Failed to load messages: ${error.message || "Unknown error"}`
//       );
//     }
//   }, [error]);

//   // Auto-scroll to bottom
//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   // Handle typing indicators
//   const handleTyping = () => {
//     if (!isTyping) {
//       setIsTyping(true);
//       startTyping();
//     }

//     // Clear existing timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     // Set new timeout
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       stopTyping();
//     }, 2000);
//   };

//   // Send message with enhanced error handling
//   const sendMessage = async () => {
//     // Check if there's a file or text to send
//     const fileInput = fileInputRef.current;
//     const file = fileInput?.files[0];
//     const text = messageText.trim();

//     if (!file && !text) return;

//     // Check socket connection before sending
//     if (!isConnected) {
//       antMessage.error("Cannot send message. Chat connection is lost.");
//       return;
//     }

//     try {
//       // Prepare form data for sending
//       const formData = new FormData();

//       // Add text if present
//       if (text) {
//         formData.append("text", text);
//       }

//       // Add file if present
//       if (file) {
//         formData.append("image", file);
//       }

//       // Send to API
//       const response = await sendMessageMutation({
//         id: chatRoomId,
//         message: formData,
//       }).unwrap();

//       // Prepare socket message
//       const socketMessage = {
//         id: response.messageId || `msg_${Date.now()}`,
//         text: text,
//         sender: "me",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         timestamp: new Date().toISOString(),
//         status: "sent",
//         replyTo: selectedMessage ? selectedMessage.id : null,
//         file: file
//           ? {
//               type: file.type.startsWith("image/") ? "image" : "file",
//               url: response.fileUrl || URL.createObjectURL(file),
//               name: file.name,
//             }
//           : null,
//       };

//       // Send via socket for real-time updates
//       socketSendMessage(socketMessage);

//       // Clear input and selected message
//       setMessageText("");
//       setSelectedMessage(null);
//       setIsTyping(false);
//       stopTyping();

//       // Reset file input
//       if (fileInput) {
//         fileInput.value = "";
//       }
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       antMessage.error("Failed to send message. Please try again.");
//     }
//   };

//   // Send file message
//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Trigger send message which now handles both text and file
//     sendMessage();
//   };

//   // Handle emoji selection
//   const addEmoji = (emoji) => {
//     setMessageText((prev) => prev + emoji.native);
//     setShowEmojiPicker(false);
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Handle input change with typing indicator
//   const handleInputChange = (e) => {
//     setMessageText(e.target.value);
//     handleTyping();
//   };

//   if (isLoading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-gray-500">Loading messages...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white rounded-r-lg">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-3 p-4 border-b shadow-sm">
//         <div className="flex items-center gap-3">
//           <Avatar
//             src={user.avatar ? `${getImageUrl}${user.avatar}` : undefined}
//             size={50}
//           >
//             {!user.avatar && user.name?.charAt(0).toUpperCase()}
//           </Avatar>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {user.name || messages[0]?.originalSender || "Unknown"}
//             </h2>
//             <p className="text-gray-500 text-sm">
//               {user.isOnline ? "Online" : `Last seen: ${user.lastSeen} min ago`}
//             </p>
//           </div>
//         </div>

//         {/* Connection Status */}
//         <div className="flex items-center gap-2">
//           <div
//             className={`w-2 h-2 rounded-full ${
//               isConnected ? "bg-green-500" : "bg-red-500"
//             }`}
//           />
//           <span className="text-xs text-gray-500">
//             {isConnected ? "Connected" : "Reconnecting..."}
//           </span>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex flex-col gap-3 p-4 flex-grow overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
//         {renderMessages()}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Reply Preview */}
//       {selectedMessage && (
//         <div className="px-4 py-2 bg-blue-50 border-t">
//           <div className="flex justify-between items-center">
//             <div className="text-sm">
//               <span className="font-medium text-blue-600">Replying to:</span>
//               <p className="text-gray-600 truncate max-w-md">
//                 {selectedMessage.text || selectedMessage.file?.name}
//               </p>
//             </div>
//             <button
//               onClick={() => setSelectedMessage(null)}
//               className="text-gray-500 hover:text-gray-700 font-bold"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Message Input */}
//       <div className="relative flex items-center p-4 border-t bg-gray-50">
//         <button
//           className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
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
//           className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
//           onClick={() => fileInputRef.current.click()}
//         >
//           <FaPaperclip size={24} />
//         </button>

//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           accept="image/*, .pdf, .doc, .docx, .txt"
//         />

//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={messageText}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           className="flex-grow p-3 mx-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           disabled={!isConnected}
//         />

//         <button
//           className={`p-3 rounded-lg transition-all ${
//             messageText.trim() && isConnected
//               ? "bg-blue-500 hover:bg-blue-600 text-white"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//           onClick={sendMessage}
//           disabled={!messageText.trim() || isSending || !isConnected}
//         >
//           {isSending ? (
//             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//           ) : (
//             <FaPaperPlane size={20} />
//           )}
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
import { getImageUrl } from "../../../utils/baseUrl";

function ChatRoom() {
  const { chatRoomId } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};

  const { userId } = jwtDecode(localStorage.getItem("accessToken"));

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
    refetch,
  } = useGetMessageQuery(chatRoomId, {
    skip: !chatRoomId,
  });
  const [sendMessageMutation, { isLoading: isSending }] =
    useSendMessageMutation();
  const [markAsReadMutation] = useMarkAsReadMutation();

  console.log("messageData", messageData);

  // Socket connection and message handling
  const {
    socket,
    isConnected,
    sendMessage: socketSendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  } = useChatSocket(
    currentUserId,
    chatRoomId,
    // Message received handler
    (receivedMessage) => {
      console.group("Socket Message Received");
      console.log("Raw Received Message:", receivedMessage);

      try {
        // Process and add the received message
        const processedMessage = processMessages({
          data: {
            messages: [receivedMessage],
          },
        })[0];

        if (processedMessage) {
          setMessages((prevMessages) => {
            // Prevent duplicate messages
            const isDuplicate = prevMessages.some(
              (msg) => msg.id === processedMessage.id
            );

            if (!isDuplicate) {
              return [...prevMessages, processedMessage];
            }
            return prevMessages;
          });

          // Automatically scroll to bottom
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error processing received message:", error);
      }
      console.groupEnd();
    },
    // Status update handler
    (statusUpdate) => {
      console.log("Message Status Update:", statusUpdate);
      // Update message status in the messages list
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === statusUpdate.messageId
            ? { ...msg, status: statusUpdate.status }
            : msg
        )
      );
    }
  );

  // Enhanced connection status tracking
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const MAX_CONNECTION_ATTEMPTS = 3;

  // Retry connection manually
  const handleRetryConnection = () => {
    if (socket) {
      socket.connect();
      setConnectionAttempts(0);
    }
  };

  // Modify message data processing
  const processMessages = useCallback((rawMessages) => {
    // Extensive null and type checking
    console.group("Message Processing Debug");
    console.log("Raw Input:", rawMessages);

    // Handle null or undefined input
    if (rawMessages === null || rawMessages === undefined) {
      console.warn("Received null or undefined messages");
      console.groupEnd();
      return [];
    }

    // Handle non-object input
    if (typeof rawMessages !== "object") {
      console.warn("Invalid message data type:", typeof rawMessages);
      console.groupEnd();
      return [];
    }

    // Extract messages with multiple fallback strategies
    let messages = [];
    try {
      // Multiple ways to extract messages
      messages =
        rawMessages.data?.messages ||
        rawMessages.messages ||
        (Array.isArray(rawMessages) ? rawMessages : []);
    } catch (extractError) {
      console.error("Error extracting messages:", extractError);
      console.groupEnd();
      return [];
    }

    // Validate messages array
    if (!Array.isArray(messages)) {
      console.warn("Extracted messages is not an array:", messages);
      console.groupEnd();
      return [];
    }

    // Get current user ID
    let userId = null;
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId || decodedToken.id;
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    // Process each message with extensive error handling
    const processedMessages = messages
      .map((msg, index) => {
        // Skip invalid messages
        if (!msg || typeof msg !== "object") {
          console.warn(`Invalid message at index ${index}:`, msg);
          return null;
        }

        try {
          // Safely extract sender information
          const sender = msg.sender || {};
          const senderId =
            typeof sender === "object" ? sender._id || sender.id : sender;

          // Determine if message is from current user
          const isCurrentUserMessage =
            senderId === userId ||
            (typeof sender === "object" && sender._id === userId);

          // Safely extract text
          const text =
            typeof msg.text === "string"
              ? msg.text
              : msg.text?.toString() || "";

          // Safely handle images
          const images = Array.isArray(msg.images)
            ? msg.images
            : msg.images
            ? [msg.images]
            : [];

          // Create processed message object
          const processedMessage = {
            id: msg._id || msg.id || `msg_${Date.now()}_${index}`,
            text: text,
            sender: isCurrentUserMessage ? "me" : "other",
            time: msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            timestamp: msg.createdAt || new Date().toISOString(),
            // Add timestamp for sorting
            timestampMs: new Date(msg.createdAt || new Date()).getTime(),
            status: msg.read ? "read" : "sent",
            // Handle file messages
            file:
              images.length > 0
                ? {
                    type: "image",
                    url: images[0],
                    name: "Uploaded Image",
                  }
                : null,
            // Include additional metadata
            originalSender:
              typeof sender === "object"
                ? sender.fullName || sender.email || "Unknown"
                : sender || "Unknown",
            // Add raw message for debugging
            _rawMessage: JSON.stringify(msg),
          };

          return processedMessage;
        } catch (processingError) {
          console.error(
            `Error processing message at index ${index}:`,
            processingError
          );
          return null;
        }
      })
      .filter(Boolean) // Remove any null entries
      .sort((a, b) => a.timestampMs - b.timestampMs); // Sort messages chronologically

    console.log("Processed Messages:", processedMessages);
    console.groupEnd();

    return processedMessages;
  }, []);

  // Handle message click for reply or selection
  const handleMessageClick = useCallback((msg) => {
    // Prevent error if msg is undefined or null
    if (!msg || typeof msg !== "object") {
      console.warn("Invalid message clicked:", msg);
      return;
    }

    // Set selected message for potential reply or other interactions
    setSelectedMessage((prevSelected) =>
      prevSelected?.id === msg.id ? null : msg
    );
  }, []);

  // Error Boundary Component
  const MessageErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const handleError = (error) => {
        console.error("Rendering error in messages:", error);
        setHasError(true);
      };

      window.addEventListener("error", handleError);
      return () => window.removeEventListener("error", handleError);
    }, []);

    if (hasError) {
      return (
        <div className="text-red-500 p-4 text-center">
          <p>Error rendering messages. Please try again.</p>
          <button
            onClick={() => {
              setHasError(false);
              // Optionally, trigger a refresh
              refetch();
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }

    return children;
  };

  // Helper function to generate safe image URL
  const generateSafeImageUrl = useCallback(
    (imagePath) => {
      // Ensure image path is a string and not empty
      if (!imagePath || typeof imagePath !== "string") {
        return null;
      }

      // Remove leading slash if present
      const cleanPath = imagePath.startsWith("/")
        ? imagePath.slice(1)
        : imagePath;

      // Construct full URL
      const fullUrl = `${getImageUrl}${cleanPath}`;

      // Validate URL
      try {
        new URL(fullUrl);
        return fullUrl;
      } catch {
        console.warn("Invalid image URL:", fullUrl);
        return null;
      }
    },
    [getImageUrl]
  );

  // Render messages function
  const renderMessages = useCallback(() => {
    // If no messages, show a placeholder
    if (!messages || messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start a conversation!</p>
        </div>
      );
    }

    return (
      <MessageErrorBoundary>
        {messages.map((msg) => {
          // Defensive rendering with additional checks
          if (!msg || typeof msg !== "object") {
            console.warn("Invalid message:", msg);
            return null;
          }

          // Ensure all required properties exist with safe defaults
          const safeMsg = {
            id: msg.id || `invalid_msg_${Math.random()}`,
            text:
              typeof msg.text === "string" ? msg.text : String(msg.text || ""),
            sender: msg.sender || "other",
            time:
              typeof msg.time === "string"
                ? msg.time
                : String(msg.time || "Unknown time"),
            file: msg.file || null,
            status: msg.status || "sent",
            replyTo: msg.replyTo || null,
            // Add sender image handling
            senderImage: msg.senderImage || msg.avatar || null,
            // Ensure originalSender is a string
            originalSender:
              typeof msg.originalSender === "string"
                ? msg.originalSender
                : String(msg.originalSender || "Unknown"),
          };

          // Determine sender avatar
          const senderAvatar =
            safeMsg.sender === "me"
              ? "/your-avatar.png" // Default avatar for current user
              : generateSafeImageUrl(user.avatar);

          return (
            <div
              key={safeMsg.id}
              className={`flex items-start gap-2 ${
                safeMsg.sender === "me" ? "justify-end" : "justify-start"
              } ${
                selectedMessage?.id === safeMsg.id
                  ? "bg-blue-50 rounded-lg p-2"
                  : ""
              }`}
              onClick={() => handleMessageClick(safeMsg)}
            >
              {safeMsg.sender === "other" && (
                <Avatar src={senderAvatar} size={40}>
                  {!senderAvatar && user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              )}

              <div
                className={`p-3 rounded-lg shadow-md max-w-[60%] cursor-pointer hover:shadow-lg transition-shadow ${
                  safeMsg.sender === "me"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-tl-none"
                }`}
              >
                {safeMsg.replyTo && (
                  <div className="bg-gray-100 p-2 rounded-md mb-2 text-sm italic opacity-80">
                    <p className="text-gray-600">
                      {(() => {
                        const replyMessage = messages.find(
                          (m) => m.id === safeMsg.replyTo
                        );
                        return typeof replyMessage?.text === "string"
                          ? replyMessage.text
                          : "Original message";
                      })()}
                    </p>
                  </div>
                )}

                {safeMsg.text && (
                  <p className="text-sm whitespace-pre-wrap">{safeMsg.text}</p>
                )}

                {safeMsg.file && safeMsg.file.type === "image" && (
                  <img
                    src={safeMsg.file.url}
                    alt="Sent"
                    className="rounded-md max-w-48 mt-2 cursor-pointer"
                    onError={(e) => {
                      console.warn("Image load error:", safeMsg.file);
                      e.target.src = "/fallback-image.png"; // Provide a fallback image
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open image in modal or new tab
                      window.open(safeMsg.file.url, "_blank");
                    }}
                  />
                )}

                {safeMsg.file && safeMsg.file.type === "file" && (
                  <a
                    href={safeMsg.file.url}
                    download={safeMsg.file.name}
                    className="text-blue-700 underline mt-2 block hover:text-blue-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📎 {safeMsg.file.name || "Unnamed File"}
                  </a>
                )}

                <div className="flex justify-between items-center mt-1">
                  <p
                    className={`text-xs ${
                      safeMsg.sender === "me"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {safeMsg.time}
                  </p>
                  {safeMsg.sender === "me" && safeMsg.status && (
                    <span
                      className={`text-xs ml-2 ${
                        safeMsg.status === "sent"
                          ? "text-gray-300"
                          : safeMsg.status === "delivered"
                          ? "text-blue-300"
                          : safeMsg.status === "read"
                          ? "text-green-300"
                          : ""
                      }`}
                    >
                      {safeMsg.status === "sent"
                        ? "✓"
                        : safeMsg.status === "delivered"
                        ? "✓✓"
                        : safeMsg.status === "read"
                        ? "✓✓"
                        : ""}
                    </span>
                  )}
                </div>
              </div>

              {safeMsg.sender === "me" && (
                <Avatar src={senderAvatar} size={40}>
                  {!senderAvatar && "Me"}
                </Avatar>
              )}
            </div>
          );
        })}
      </MessageErrorBoundary>
    );
  }, [
    messages,
    selectedMessage,
    user,
    generateSafeImageUrl,
    handleMessageClick,
  ]);

  // Load messages from API
  useEffect(() => {
    console.log("Full messageData:", messageData);

    if (messageData) {
      try {
        const processedMessages = processMessages(messageData);

        // Additional validation before setting state
        if (Array.isArray(processedMessages)) {
          setMessages(processedMessages);
          scrollToBottom();
        } else {
          console.error(
            "Processed messages is not an array:",
            processedMessages
          );
          antMessage.error("Failed to process messages");
        }
      } catch (error) {
        console.error("Message Processing Failure:", error);
        antMessage.error(`Failed to process messages: ${error.message}`);
      }
    }
  }, [messageData, processMessages]);

  // Modify error handling to be more verbose
  useEffect(() => {
    if (error) {
      console.error("Message Fetch Error:", error);
      antMessage.error(
        `Failed to load messages: ${error.message || "Unknown error"}`
      );
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

  // Send message with enhanced error handling
  const sendMessage = async () => {
    // Check if there's a file or text to send
    const fileInput = fileInputRef.current;
    const file = fileInput?.files[0];
    const text = messageText.trim();

    if (!file && !text) return;

    // Check socket connection before sending
    if (!isConnected) {
      antMessage.error("Cannot send message. Chat connection is lost.");
      return;
    }

    try {
      // Prepare form data for sending
      const formData = new FormData();

      // Add text if present
      if (text) {
        formData.append("text", text);
      }

      // Add file if present
      if (file) {
        formData.append("image", file);
      }

      // Send to API
      const response = await sendMessageMutation({
        id: chatRoomId,
        message: formData,
      }).unwrap();

      // Prepare socket message
      const socketMessage = {
        id: response.messageId || `msg_${Date.now()}`,
        text: text,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date().toISOString(),
        status: "sent",
        replyTo: selectedMessage ? selectedMessage.id : null,
        file: file
          ? {
              type: file.type.startsWith("image/") ? "image" : "file",
              url: response.fileUrl || URL.createObjectURL(file),
              name: file.name,
            }
          : null,
      };

      // Send via socket for real-time updates
      socketSendMessage(socketMessage);

      // Clear input and selected message
      setMessageText("");
      setSelectedMessage(null);
      setIsTyping(false);
      stopTyping();

      // Reset file input
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      antMessage.error("Failed to send message. Please try again.");
    }
  };

  // Send file message
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Trigger send message which now handles both text and file
    sendMessage();
  };

  // Handle emoji selection
  const addEmoji = (emoji) => {
    setMessageText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
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
          <Avatar
            src={user.avatar ? `${getImageUrl}${user.avatar}` : undefined}
            size={50}
          >
            {!user.avatar && user.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {user.name ||
                (messages.length > 0 &&
                typeof messages[0]?.originalSender === "string"
                  ? messages[0].originalSender
                  : "Unknown")}
            </h2>
            <p className="text-gray-500 text-sm">
              {user.isOnline
                ? "Online"
                : `Last seen: ${user.lastSeen || "unknown"} min ago`}
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
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {selectedMessage && (
        <div className="px-4 py-2 bg-blue-50 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium text-blue-600">Replying to:</span>
              <p className="text-gray-600 truncate max-w-md">
                {typeof selectedMessage.text === "string"
                  ? selectedMessage.text
                  : selectedMessage.file?.name || "Message"}
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
