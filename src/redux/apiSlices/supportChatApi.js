// import { api } from "../api/baseApi";

// const supportChatSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     sendMessage: builder.mutation({
//       query: ({ id, message }) => {
//         return {
//           url: `/messages/send-message/${id}`,
//           method: "POST",
//           body: message,
//         };
//       },
//       invalidatesTags: ["CHAT"],
//     }),
//     editMessage: builder.mutation({
//       query: ({ id, editedMessage }) => {
//         return {
//           url: `/messages/send-message/${id}`,
//           method: "PATCH",
//           body: editedMessage,
//         };
//       },
//       invalidatesTags: ["CHAT"],
//     }),
//     deleteMessage: builder.mutation({
//       query: (id) => {
//         return {
//           url: `/messages/delete/${id}`,
//           method: "DELETE",
//         };
//       },
//       invalidatesTags: ["CHAT"],
//     }),
//     getMessage: builder.query({
//       query: (id) => {
//         return {
//           url: `/messages/${id}`,
//           method: "GET",
//         };
//       },
//       providesTags: ["CHAT"],
//     }),
//   }),
// });

// export const {
//   useGetMessageQuery,
//   useSendMessageMutation,
//   useEditMessageMutation,
//   useDeleteMessageMutation,
// } = supportChatSlice;

import { api } from "../api/baseApi";

const supportChatSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get messages for a specific chat room
    getMessage: builder.query({
      query: (chatRoomId) => ({
        url: `/messages/${chatRoomId}`,
        method: "GET",
      }),
      providesTags: (result, error, chatRoomId) => [
        { type: "CHAT", id: chatRoomId },
      ],
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
      query: (userId) => ({
        url: `/chats/user/${userId}`,
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
