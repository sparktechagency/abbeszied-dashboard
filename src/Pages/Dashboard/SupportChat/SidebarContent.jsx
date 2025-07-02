// import React, { useState, useRef, useEffect } from "react";
// import { Input, Avatar, Badge, Spin } from "antd";
// import { IoIosSearch } from "react-icons/io";
// import { Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import man from "../../../assets/man.png";
// import { useGetChatListQuery } from "../../../redux/apiSlices/supportChatApi";
// import { useSocket } from "./customHook";
// import { getImageUrl } from "../../../utils/baseUrl";

// function SidebarContent() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const usersContainerRef = useRef(null);

//   const { userId } = jwtDecode(localStorage.getItem("accessToken"));
//   console.log("sfsdf", userId);

//   // Get current user ID from your auth system
//   const currentUserId = userId; // Replace with actual user ID

//   // Fetch chat list from API
//   const {
//     data: chatListData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetChatListQuery(currentUserId);

//   console.log("chatListData", chatListData);

//   // Socket for real-time updates
//   const { socket, isConnected } = useSocket(currentUserId);

//   const [chatList, setChatList] = useState([]);

//   // Update chat list when data changes - Fixed mapping
//   useEffect(() => {
//     if (chatListData?.data?.chats) {
//       const mappedChats = chatListData?.data?.chats?.map((chat) => {
//         const chatId = chat._id || chat.id;
//         const senderId = chat.lastMessage?.sender;

//         // Get the other participant (excluding current user)
//         const participant =
//           chat.participants?.find((p) => p._id !== currentUserId) ??
//           chat.participants?.[0] ??
//           {};

//         return {
//           id: chatId,
//           name:
//             participant.fullName?.trim() ||
//             `Chat ${chatId?.slice(-6) || "Unknown"}`,
//           avatar: participant.image
//             ? `${getImageUrl}${participant.image}`
//             : null,
//           email: participant.email || "",
//           isOnline: chat.status === "active",
//           lastSeen: chat.status === "active" ? 0 : "Unknown",
//           lastMessage: chat.lastMessage?.text || "No messages yet",
//           lastMessageTime: chat.lastMessage?.createdAt || chat.updatedAt,
//           newMessageCount: chat.unreadCount || 0,
//           userId: senderId,
//           chatRoomId: chatId,
//           totalUnreadMessages: chat.totalUnreadMessages || 0,
//           readBy: chat.readBy || [],
//           pinnedMessages: chat.pinnedMessages || [],
//           mutedBy: chat.mutedBy || [],
//         };
//       });

//       setChatList(mappedChats);
//     }
//   }, [chatListData, currentUserId]);

//   // Socket event listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleChatListUpdate = (updatedChat) => {
//       setChatList((prev) => {
//         const existingIndex = prev.findIndex(
//           (chat) => chat.id === updatedChat.id
//         );
//         if (existingIndex >= 0) {
//           // Update existing chat
//           const updated = [...prev];
//           updated[existingIndex] = {
//             ...updated[existingIndex],
//             ...updatedChat,
//           };
//           return updated.sort(
//             (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
//           );
//         } else {
//           // Add new chat
//           return [updatedChat, ...prev];
//         }
//       });
//     };

//     const handleNewMessage = (data) => {
//       setChatList((prev) =>
//         prev
//           .map((chat) =>
//             chat.chatRoomId === data.chatRoomId
//               ? {
//                   ...chat,
//                   lastMessage: data.message.text || "File",
//                   lastMessageTime: data.message.timestamp,
//                   newMessageCount:
//                     chat.chatRoomId === data.chatRoomId
//                       ? chat.newMessageCount + 1
//                       : chat.newMessageCount,
//                 }
//               : chat
//           )
//           .sort(
//             (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
//           )
//       );
//     };

//     const handleUserStatusChange = (data) => {
//       setChatList((prev) =>
//         prev.map((chat) =>
//           chat.userId === data.userId
//             ? { ...chat, isOnline: data.isOnline, lastSeen: data.lastSeen }
//             : chat
//         )
//       );
//     };

//     // Listen for events
//     socket.on(`chatListUpdate::${currentUserId}`, handleChatListUpdate);
//     socket.on("message-received", handleNewMessage);
//     socket.on("user-status-change", handleUserStatusChange);

//     return () => {
//       socket.off(`chatListUpdate::${currentUserId}`, handleChatListUpdate);
//       socket.off("message-received", handleNewMessage);
//       socket.off("user-status-change", handleUserStatusChange);
//     };
//   }, [socket, currentUserId]);

//   // Filter & prioritize searched users
//   const filteredUsers = chatList
//     .filter((chat) =>
//       chat.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       // Prioritize exact matches
//       const aStartsWith = a.name
//         .toLowerCase()
//         .startsWith(searchQuery.toLowerCase());
//       const bStartsWith = b.name
//         .toLowerCase()
//         .startsWith(searchQuery.toLowerCase());

//       if (aStartsWith && !bStartsWith) return -1;
//       if (!aStartsWith && bStartsWith) return 1;

//       // Then sort by last message time
//       return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
//     });

//   const handleChatClick = (chat) => {
//     // Mark as read when clicking on chat
//     if (chat.newMessageCount > 0) {
//       setChatList((prev) =>
//         prev.map((c) => (c.id === chat.id ? { ...c, newMessageCount: 0 } : c))
//       );
//     }
//   };

//   // Helper function to format time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     try {
//       return new Date(timestamp).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       return "";
//     }
//   };

//   // Helper function to format last seen
//   const formatLastSeen = (isOnline, lastSeen) => {
//     if (isOnline) return "Online";
//     if (typeof lastSeen === "number" && lastSeen === 0) return "Online";
//     if (typeof lastSeen === "string") return lastSeen;
//     return "Offline";
//   };

//   if (isError) {
//     return (
//       <div className="h-full flex flex-col bg-white rounded-lg border-r">
//         <div className="p-4">
//           <p className="text-red-500">Error loading chats</p>
//           <button
//             onClick={() => refetch()}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white rounded-lg border-r">
//       {/* Header Section */}
//       <div className="flex flex-col justify-start gap-2 p-4 bg-white sticky top-0 z-10 rounded-bl-lg rounded-br-lg rounded-tl-lg">
//         <div className="flex items-center justify-between">
//           <p className="text-[16px] font-semibold text-black">Support Chat</p>
//           <div className="flex items-center gap-2">
//             {isConnected ? (
//               <div
//                 className="w-2 h-2 bg-green-500 rounded-full"
//                 title="Connected"
//               />
//             ) : (
//               <div
//                 className="w-2 h-2 bg-red-500 rounded-full"
//                 title="Disconnected"
//               />
//             )}
//           </div>
//         </div>

//         <Input
//           prefix={<IoIosSearch />}
//           placeholder="Search..."
//           className="h-10 w-[90%] gap-2"
//           allowClear
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <p className="text-[#343A40] font-semibold">Recent</p>
//       </div>

//       {/* Scrollable User List */}
//       <div
//         ref={usersContainerRef}
//         className="bg-white rounded-bl-lg flex-1 overflow-y-auto"
//       >
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <Spin size="large" />
//           </div>
//         ) : filteredUsers.length > 0 ? (
//           filteredUsers.map((chat) => (
//             <Link
//               key={chat.id}
//               to={`/chat/${chat.id}`}
//               state={{ user: chat }}
//               onClick={() => handleChatClick(chat)}
//             >
//               <div className="h-16 border-t hover:bg-slate-50 px-4 transition-colors">
//                 <div className="flex justify-between py-2.5">
//                   <div className="flex items-center gap-2">
//                     <Badge
//                       dot={chat.isOnline}
//                       status={chat.isOnline ? "success" : "default"}
//                       className="border-2 rounded-full"
//                     >
//                       <Avatar src={chat.avatar || man}>
//                         {!chat.avatar && chat.name.charAt(0).toUpperCase()}
//                       </Avatar>
//                     </Badge>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-sm truncate">
//                         {chat.name}
//                       </h3>
//                       <p className="text-xs text-gray-500 truncate">
//                         {chat.lastMessage || "No messages yet"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-1 items-end">
//                     <p className="text-xs text-gray-400">
//                       {formatLastSeen(chat.isOnline, chat.lastSeen)}
//                     </p>
//                     {chat.newMessageCount > 0 && (
//                       <div className="rounded-full bg-[#EF476F] text-white text-[10px] w-5 h-5 flex items-center justify-center">
//                         {chat.newMessageCount > 99
//                           ? "99+"
//                           : chat.newMessageCount}
//                       </div>
//                     )}
//                     {chat.lastMessageTime && (
//                       <p className="text-xs text-gray-400">
//                         {formatTime(chat.lastMessageTime)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 mt-8 px-4">
//             {searchQuery ? (
//               <div>
//                 <p>No chats found for "{searchQuery}"</p>
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="text-blue-500 text-sm mt-2 hover:underline"
//                 >
//                   Clear search
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <p>No chats available</p>
//                 <p className="text-xs mt-1">Start a new conversation</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SidebarContent;

import React, { useState, useRef, useEffect } from "react";
import { Input, Avatar, Badge, Spin } from "antd";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import man from "../../../assets/man.png";
import { useGetChatListQuery } from "../../../redux/apiSlices/supportChatApi";
import { useSocket } from "./customHook";
import { getImageUrl } from "../../../utils/baseUrl";

function SidebarContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const usersContainerRef = useRef(null);

  const { userId } = jwtDecode(localStorage.getItem("accessToken"));
  console.log("sfsdf", userId);

  // Get current user ID from your auth system
  const currentUserId = userId; // Replace with actual user ID

  // Fetch chat list from API
  const {
    data: chatListData,
    isLoading,
    isError,
    refetch,
  } = useGetChatListQuery(currentUserId);

  console.log("chatListData", chatListData);

  // Socket for real-time updates
  const { socket, isConnected } = useSocket(currentUserId);

  const [chatList, setChatList] = useState([]);

  // Update chat list when data changes - Fixed mapping
  useEffect(() => {
    if (chatListData?.data?.chats) {
      const mappedChats = chatListData?.data?.chats?.map((chat) => {
        const chatId = chat._id || chat.id;
        const senderId = chat.lastMessage?.sender;

        // Get the other participant (excluding current user)
        const participant =
          chat.participants?.find((p) => p._id !== currentUserId) ??
          chat.participants?.[0] ??
          {};

        // Ensure name is always a string with fallback
        const participantName =
          participant.fullName?.trim() ||
          participant.name?.trim() ||
          `Chat ${chatId?.slice(-6) || "Unknown"}` ||
          "Unknown Chat";

        return {
          id: chatId,
          name: participantName,
          avatar: participant.image
            ? `${getImageUrl}${participant.image}`
            : null,
          email: participant.email || "",
          isOnline: chat.status === "active",
          lastSeen: chat.status === "active" ? 0 : "Unknown",
          lastMessage:
            typeof chat.lastMessage === "object"
              ? chat.lastMessage?.text || "No messages yet"
              : chat.lastMessage || "No messages yet",
          lastMessageTime: chat.lastMessage?.createdAt || chat.updatedAt,
          newMessageCount: chat.unreadCount || 0,
          userId: senderId,
          chatRoomId: chatId,
          totalUnreadMessages: chat.totalUnreadMessages || 0,
          readBy: chat.readBy || [],
          pinnedMessages: chat.pinnedMessages || [],
          mutedBy: chat.mutedBy || [],
        };
      });

      setChatList(mappedChats);
    }
  }, [chatListData, currentUserId]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = (updatedChat) => {
      setChatList((prev) => {
        const existingIndex = prev.findIndex(
          (chat) => chat.id === updatedChat.id
        );
        if (existingIndex >= 0) {
          // Update existing chat
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...updatedChat,
          };
          return updated.sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
        } else {
          // Add new chat
          return [updatedChat, ...prev];
        }
      });
    };

    const handleNewMessage = (data) => {
      setChatList((prev) =>
        prev
          .map((chat) =>
            chat.chatRoomId === data.chatRoomId
              ? {
                  ...chat,
                  lastMessage: data.message.text || "File",
                  lastMessageTime: data.message.timestamp,
                  newMessageCount:
                    chat.chatRoomId === data.chatRoomId
                      ? chat.newMessageCount + 1
                      : chat.newMessageCount,
                }
              : chat
          )
          .sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          )
      );
    };

    const handleUserStatusChange = (data) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.userId === data.userId
            ? { ...chat, isOnline: data.isOnline, lastSeen: data.lastSeen }
            : chat
        )
      );
    };

    // Listen for events
    socket.on(`chatListUpdate::${currentUserId}`, handleChatListUpdate);
    socket.on("message-received", handleNewMessage);
    socket.on("user-status-change", handleUserStatusChange);

    return () => {
      socket.off(`chatListUpdate::${currentUserId}`, handleChatListUpdate);
      socket.off("message-received", handleNewMessage);
      socket.off("user-status-change", handleUserStatusChange);
    };
  }, [socket, currentUserId]);

  // Filter & prioritize searched users
  const filteredUsers = chatList
    .filter((chat) => {
      const chatName = chat.name || "";
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const aName = a.name || "";
      const bName = b.name || "";

      // Prioritize exact matches
      const aStartsWith = aName
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());
      const bStartsWith = bName
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Then sort by last message time
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

  const handleChatClick = (chat) => {
    // Mark as read when clicking on chat
    if (chat.newMessageCount > 0) {
      setChatList((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, newMessageCount: 0 } : c))
      );
    }
  };

  // Helper function to format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  // Helper function to format last seen
  const formatLastSeen = (isOnline, lastSeen) => {
    if (isOnline) return "Online";
    if (typeof lastSeen === "number" && lastSeen === 0) return "Online";
    if (typeof lastSeen === "string") return lastSeen;
    return "Offline";
  };

  // Helper function to get avatar initials safely
  const getAvatarInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  if (isError) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg border-r">
        <div className="p-4">
          <p className="text-red-500">Error loading chats</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border-r">
      {/* Header Section */}
      <div className="flex flex-col justify-start gap-2 p-4 bg-white sticky top-0 z-10 rounded-bl-lg rounded-br-lg rounded-tl-lg">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-semibold text-black">Support Chat</p>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                title="Connected"
              />
            ) : (
              <div
                className="w-2 h-2 bg-red-500 rounded-full"
                title="Disconnected"
              />
            )}
          </div>
        </div>

        <Input
          prefix={<IoIosSearch />}
          placeholder="Search..."
          className="h-10 w-[90%] gap-2"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-[#343A40] font-semibold">Recent</p>
      </div>

      {/* Scrollable User List */}
      <div
        ref={usersContainerRef}
        className="bg-white rounded-bl-lg flex-1 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              state={{ user: chat }}
              onClick={() => handleChatClick(chat)}
            >
              <div className="h-16 border-t hover:bg-slate-50 px-4 transition-colors">
                <div className="flex justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      dot={chat.isOnline}
                      status={chat.isOnline ? "success" : "default"}
                      className="border-2 rounded-full"
                    >
                      <Avatar src={chat.avatar || man}>
                        {!chat.avatar && getAvatarInitials(chat.name)}
                      </Avatar>
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {chat.name || "Unknown Chat"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 items-end">
                    <p className="text-xs text-gray-400">
                      {formatLastSeen(chat.isOnline, chat.lastSeen)}
                    </p>
                    {chat.newMessageCount > 0 && (
                      <div className="rounded-full bg-[#EF476F] text-white text-[10px] w-5 h-5 flex items-center justify-center">
                        {chat.newMessageCount > 99
                          ? "99+"
                          : chat.newMessageCount}
                      </div>
                    )}
                    {chat.lastMessageTime && (
                      <p className="text-xs text-gray-400">
                        {formatTime(chat.lastMessageTime)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8 px-4">
            {searchQuery ? (
              <div>
                <p>No chats found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-blue-500 text-sm mt-2 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                <p>No chats available</p>
                <p className="text-xs mt-1">Start a new conversation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarContent;
