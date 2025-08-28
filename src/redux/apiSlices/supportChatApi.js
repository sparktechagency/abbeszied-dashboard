import { api } from "../api/baseApi";

const supportChatSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get messages for a specific chat room with pagination
    getMessage: builder.query({
      query: (params) => {
        // Handle both string (backward compatibility) and object parameters
        console.log("getMessage query params:", params);

        const chatRoomId =
          typeof params === "string" ? params : params.chatRoomId;
        const page = typeof params === "string" ? 1 : params.page || 1;
        const limit = typeof params === "string" ? 10 : params.limit || 10;

        console.log("Extracted params:", { chatRoomId, page, limit });

        return {
          url: `/messages/${chatRoomId}?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: (result, error, params) => {
        const chatRoomId =
          typeof params === "string" ? params : params.chatRoomId;
        return [{ type: "CHAT", id: chatRoomId }];
      },
    }),

    // Send text or file message
    sendMessage: builder.mutation({
      query: ({ id, message }) => {
        // Check if message is FormData (file upload)
        const isFormData = message instanceof FormData;

        return {
          url: `/messages/send-message/${id}`,
          method: "POST",
          body: message,
          // Don't set Content-Type for FormData, let browser set it
          ...(isFormData && {
            formData: true,
          }),
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "CHAT", id },
        "CHAT_LIST",
      ],
      // Optimistic update for better UX
      async onQueryStarted({ id, message }, { dispatch, queryFulfilled }) {
        // Only for text messages, not files
        if (!(message instanceof FormData) && message.text) {
          const patchResult = dispatch(
            supportChatSlice.util.updateQueryData("getMessage", id, (draft) => {
              const optimisticMessage = {
                id: `temp_${Date.now()}`,
                text: message.text,
                sender: "me",
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                replyTo: message.replyTo || null,
                status: "sending",
                timestamp: new Date().toISOString(),
              };

              if (draft.messages) {
                draft.messages.push(optimisticMessage);
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        }
      },
    }),

    // Edit an existing message
    editMessage: builder.mutation({
      query: ({ messageId, editedMessage }) => ({
        url: `/messages/edit/${messageId}`,
        method: "PATCH",
        body: editedMessage,
      }),
      invalidatesTags: (result, error, { messageId }) => [
        "CHAT",
        { type: "MESSAGE", id: messageId },
      ],
    }),

    // Delete a message
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/delete/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, messageId) => [
        "CHAT",
        { type: "MESSAGE", id: messageId },
      ],
    }),

    // Get chat list for sidebar
    getChatList: builder.query({
      query: () => ({
        url: `/chat`,
        method: "GET",
      }),
      providesTags: ["CHAT_LIST"],
    }),

    // Mark messages as read
    markAsRead: builder.mutation({
      query: ({ chatRoomId, messageIds }) => ({
        url: `/messages/mark-read/${chatRoomId}`,
        method: "POST",
        body: { messageIds },
      }),
      invalidatesTags: (result, error, { chatRoomId }) => [
        { type: "CHAT", id: chatRoomId },
        "CHAT_LIST",
      ],
    }),

    // Get online users
    getOnlineUsers: builder.query({
      query: () => ({
        url: `/users/online`,
        method: "GET",
      }),
      providesTags: ["ONLINE_USERS"],
    }),

    // Upload file separately (if needed)
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/upload/file`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetMessageQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useGetChatListQuery,
  useMarkAsReadMutation,
  useGetOnlineUsersQuery,
  useUploadFileMutation,
} = supportChatSlice;

export default supportChatSlice;
