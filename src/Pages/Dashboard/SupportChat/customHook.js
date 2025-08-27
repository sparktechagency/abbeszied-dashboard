import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://10.10.7.62:5000";

export const useSocket = (userId, chatRoomId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);

      // Join user room for personal notifications
      if (userId) {
        newSocket.emit("join-user-room", userId);
      }

      // Join chat room if provided
      if (chatRoomId) {
        newSocket.emit("join-room", chatRoomId);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Join/leave chat room when it changes
  useEffect(() => {
    if (socket && isConnected) {
      if (chatRoomId) {
        socket.emit("join-room", chatRoomId);
      }

      return () => {
        if (chatRoomId) {
          socket.emit("leave-room", chatRoomId);
        }
      };
    }
  }, [socket, isConnected, chatRoomId]);

  // Socket event listeners
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const emit = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn("Socket not connected. Cannot emit:", event);
    }
  };

  return {
    socket,
    isConnected,
    on,
    off,
    emit,
  };
};

// Hook for chat-specific socket events
export const useChatSocket = (
  userId,
  chatRoomId,
  onMessageReceived,
  onStatusUpdate
) => {
  const { socket, isConnected, emit } = useSocket(userId, chatRoomId);

  useEffect(() => {
    if (!socket) return;

    // Message received
    const handleMessageReceived = (message) => {
      console.log("Message received:", message);
      if (onMessageReceived) {
        onMessageReceived(message);
      }
    };

    // Message status update (sent, delivered, read)
    const handleStatusUpdate = (data) => {
      console.log("Message status update:", data);
      if (onStatusUpdate) {
        onStatusUpdate(data);
      }
    };

    // Chat list update
    const handleChatListUpdate = (data) => {
      console.log("Chat list updated:", data);
      // Trigger chat list refetch or update
    };

    // User typing
    const handleUserTyping = (data) => {
      console.log("User typing:", data);
      // Handle typing indicator
    };

    // User online/offline
    const handleUserStatusChange = (data) => {
      console.log("User status changed:", data);
      // Update user online status
    };

    // Register event listeners
    socket.on("message-received", handleMessageReceived);
    socket.on("message-status-update", handleStatusUpdate);
    socket.on(`chatListUpdate::${userId}`, handleChatListUpdate);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-status-change", handleUserStatusChange);

    // Cleanup
    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("message-status-update", handleStatusUpdate);
      socket.off(`chatListUpdate::${userId}`, handleChatListUpdate);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-status-change", handleUserStatusChange);
    };
  }, [socket, userId, onMessageReceived, onStatusUpdate]);

  // Socket actions
  const sendMessage = (message) => {
    emit("send-message", {
      chatRoomId,
      message,
    });
  };

  const markAsRead = (messageIds) => {
    emit("mark-as-read", {
      chatRoomId,
      messageIds,
    });
  };

  const startTyping = () => {
    emit("typing-start", {
      chatRoomId,
      userId,
    });
  };

  const stopTyping = () => {
    emit("typing-stop", {
      chatRoomId,
      userId,
    });
  };

  const joinRoom = (roomId) => {
    emit("join-room", roomId);
  };

  const leaveRoom = (roomId) => {
    emit("leave-room", roomId);
  };

  return {
    socket,
    isConnected,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    joinRoom,
    leaveRoom,
  };
};
