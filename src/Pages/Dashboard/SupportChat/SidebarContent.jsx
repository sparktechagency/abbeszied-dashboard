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
      const mappedChats = chatListData.data.chats
        .map((chat) => {
          try {
            // Ensure chat is a valid object
            if (!chat || typeof chat !== "object") {
              console.warn("Invalid chat object:", chat);
              return null;
            }

            const chatId = chat._id || chat.id;
            if (!chatId) {
              console.warn("Chat missing ID:", chat);
              return null;
            }

            // Get the other participant (excluding current user)
            const participant =
              chat.participants?.find((p) => p._id !== currentUserId) ??
              chat.participants?.[0] ??
              {};

            // Get participant ID
            const participantId = participant._id || participant.id;

            // Ensure name is always a string with fallback
            const participantName =
              (typeof participant.fullName === "string"
                ? participant.fullName.trim()
                : "") ||
              (typeof participant.name === "string"
                ? participant.name.trim()
                : "") ||
              `Chat ${chatId?.slice(-6) || "Unknown"}` ||
              "Unknown Chat";

            // Safely handle last message
            let lastMessageText = "No messages yet";
            if (chat.lastMessage) {
              if (typeof chat.lastMessage === "object") {
                // Check if it's an image message
                if (
                  chat.lastMessage.images &&
                  chat.lastMessage.images.length > 0
                ) {
                  lastMessageText = "Sent an image";
                } else {
                  lastMessageText = chat.lastMessage?.text || "No messages yet";
                }
              } else if (typeof chat.lastMessage === "string") {
                lastMessageText = chat.lastMessage;
              }
            }

            // Determine the most recent timestamp
            const lastMessageTimestamp = new Date(
              chat.lastMessage?.createdAt ||
                chat.updatedAt ||
                new Date().toISOString()
            ).getTime();

            return {
              id: chatId,
              name: participantName,
              avatar: participant.image
                ? `${getImageUrl}${participant.image}`
                : null,
              email:
                typeof participant.email === "string" ? participant.email : "",
              isOnline: chat.status === "active",
              lastSeen: chat.status === "active" ? 0 : "Unknown",
              lastMessage: lastMessageText,
              lastMessageTime:
                chat.lastMessage?.createdAt ||
                chat.updatedAt ||
                new Date().toISOString(),
              lastMessageTimestamp, // Add timestamp for sorting
              newMessageCount:
                typeof chat.unreadCount === "number" ? chat.unreadCount : 0,
              userId: participantId,
              chatRoomId: chatId,
              totalUnreadMessages:
                typeof chat.totalUnreadMessages === "number"
                  ? chat.totalUnreadMessages
                  : 0,
              readBy: Array.isArray(chat.readBy) ? chat.readBy : [],
              pinnedMessages: Array.isArray(chat.pinnedMessages)
                ? chat.pinnedMessages
                : [],
              mutedBy: Array.isArray(chat.mutedBy) ? chat.mutedBy : [],
            };
          } catch (error) {
            console.error("Error processing chat:", error);
            return null;
          }
        })
        .filter(Boolean) // Remove any null entries
        .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp); // Sort by most recent

      setChatList(mappedChats);
    }
  }, [chatListData, currentUserId, getImageUrl]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    console.log("=== SOCKET SETUP DEBUG ===");
    console.log("Socket object:", socket);
    console.log("Socket connected:", isConnected);
    console.log("Current user ID:", currentUserId);

    if (!socket) {
      console.log("No socket available, returning early");
      return;
    }

    // Enhanced chat list update handler
    const handleChatListUpdate = (updatedChatData) => {
      console.log("=== FULL CHAT LIST UPDATE DEBUG ===");
      console.log("Received chat update:", updatedChatData);

      setChatList((prev) => {
        // Find the existing chat or prepare to add a new one
        const existingIndex = prev.findIndex(
          (chat) => chat.chatRoomId === updatedChatData.chatId
        );

        // Extract participant information
        const participants = updatedChatData.chat?.participants || [];
        const otherParticipant = participants.find(
          (p) => p._id !== currentUserId
        );

        // Prepare updated chat object
        const updatedChat = {
          id: updatedChatData.chatId,
          chatRoomId: updatedChatData.chatId,
          name:
            otherParticipant?.fullName ||
            otherParticipant?.name ||
            "Unknown Chat",
          email: otherParticipant?.email || "",

          // Improved avatar handling with fallback
          avatar: otherParticipant?.image
            ? `${getImageUrl}${otherParticipant.image}`
            : prev.find((chat) => chat.chatRoomId === updatedChatData.chatId)
                ?.avatar || null,

          userId: otherParticipant?._id,
          lastMessage: updatedChatData.lastMessage?.text || "No messages yet",
          lastMessageTime: updatedChatData.updatedAt,
          lastMessageTimestamp: new Date(updatedChatData.updatedAt).getTime(),

          // Robust handling of message count
          newMessageCount:
            typeof updatedChatData.chat?.unreadCount === "number"
              ? updatedChatData.chat.unreadCount
              : 0,

          isOnline: updatedChatData.chat?.status === "active",
        };

        console.log("=== AVATAR DEBUG ===");
        console.log("Other Participant:", otherParticipant);
        console.log(
          "Existing Chat Avatar (from list):",
          prev.find((chat) => chat.chatRoomId === updatedChatData.chatId)
            ?.avatar
        );
        console.log("Updated Chat Avatar:", updatedChat.avatar);
        console.log("=== END AVATAR DEBUG ===");

        console.log("=== MESSAGE COUNT DEBUG ===");
        console.log("Chat ID:", updatedChatData.chatId);
        console.log("Unread Count:", updatedChatData.chat?.unreadCount);
        console.log(
          "Processed New Message Count:",
          updatedChat.newMessageCount
        );
        console.log("=== END MESSAGE COUNT DEBUG ===");

        console.log("Processed Updated Chat:", updatedChat);

        // Update existing chat or add new chat
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...updatedChat,
          };
          return updated.sort(
            (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
          );
        } else {
          // Add new chat to the top of the list
          return [updatedChat, ...prev].sort(
            (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
          );
        }
      });

      console.log("=== END CHAT LIST UPDATE DEBUG ===");
    };

    // Enhanced new message handler
    const handleNewMessage = (data) => {
      console.log("=== FULL NEW MESSAGE DEBUG ===");
      console.log("Received message data:", data);

      setChatList((prev) => {
        // Find the existing chat
        const existingIndex = prev.findIndex(
          (chat) => chat.chatRoomId === data.chatRoomId
        );

        // If no existing chat found, return current list
        if (existingIndex === -1) {
          console.log(
            "No matching chat found for chatRoomId:",
            data.chatRoomId
          );
          return prev;
        }

        // Clone the existing chat or create a default
        const existingChat = prev[existingIndex] || {
          chatRoomId: data.chatRoomId,
          name: "Unknown Chat",
          newMessageCount: 0,
          avatar: null,
          userId: null,
        };

        // Determine sender information
        const sender = data.lastMessage?.sender || {};
        const senderName = sender.fullName || sender.name || "Unknown Sender";

        // Prepare updated chat
        const updatedChat = {
          ...existingChat,
          lastMessage: data.lastMessage?.text || "New message",
          lastMessageTime: data.updatedAt || new Date().toISOString(),
          lastMessageTimestamp: new Date(
            data.updatedAt || new Date()
          ).getTime(),

          // Increment new message count, with additional safety checks
          newMessageCount:
            typeof existingChat.newMessageCount === "number"
              ? existingChat.newMessageCount + 1
              : 1,

          // Preserve existing name if possible
          name: existingChat.name || senderName,

          // Improved avatar handling
          avatar: sender.image
            ? `${getImageUrl}${sender.image}`
            : existingChat.avatar,

          // Update user ID if not set
          userId: existingChat.userId || sender._id,
        };

        // Clone the previous list and update the specific chat
        const updatedChats = [...prev];
        updatedChats[existingIndex] = updatedChat;

        console.log("=== NEW MESSAGE AVATAR DEBUG ===");
        console.log("Sender:", sender);
        console.log("Existing Chat Avatar:", existingChat.avatar);
        console.log("Sender Image:", sender.image);
        console.log("Updated Chat Avatar:", updatedChat.avatar);
        console.log("=== END NEW MESSAGE AVATAR DEBUG ===");

        // Sort chats by most recent message
        return updatedChats.sort(
          (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
        );
      });

      console.log("=== END NEW MESSAGE DEBUG ===");
    };

    // Listen for events
    console.log("Registering socket event listeners...");

    // Join user's personal room for notifications
    socket.emit("join-user-room", currentUserId);

    // Listen for chat list updates specific to this user
    socket.on(`chatListUpdate::${currentUserId}`, handleChatListUpdate);

    // Listen for new messages
    socket.on("message-received", handleNewMessage);

    // Listen for user status changes
    socket.on("user-status-change", (data) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.userId === data.userId
            ? { ...chat, isOnline: data.isOnline, lastSeen: data.lastSeen }
            : chat
        )
      );
    });

    // Additional event listeners for broader message updates
    socket.on("new-message", handleNewMessage);
    socket.on("message", handleNewMessage);

    console.log("Socket event listeners registered successfully");

    // Cleanup function
    return () => {
      socket.off(`chatListUpdate::${currentUserId}`, handleChatListUpdate);
      socket.off("message-received", handleNewMessage);
      socket.off("user-status-change");
      socket.off("new-message", handleNewMessage);
      socket.off("message", handleNewMessage);
    };
  }, [socket, currentUserId, getImageUrl]);

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
      return b.lastMessageTimestamp - a.lastMessageTimestamp;
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
              to={`/support-chat/${chat.id}`}
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
                      <Avatar src={chat.avatar || man} alt={chat.name}>
                        {!chat.avatar && getAvatarInitials(chat.name)}
                      </Avatar>
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {typeof chat.name === "string"
                          ? chat.name
                          : "Unknown Chat"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {typeof chat.lastMessage === "string"
                          ? chat.lastMessage
                          : "No messages yet"}
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
