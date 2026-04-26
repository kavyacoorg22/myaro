export const chatMessages = {
  SUCCESS: {
    CREATED: "Chat created successfully",
    FETCHED: "Chat fetched successfully",
    LIST_FETCHED: "Chats fetched successfully",
    MESSAGES_FETCHED: "Messages fetched successfully",
  },

  ERROR: {
    NOT_FOUND: "Chat not found",
    INVALID_INPUT: "Invalid chat input",
    SELF_CHAT_NOT_ALLOWED: "Can't create chat with yourself",
    NOT_FOUND_WITH_ID: (id: string) => `Chat ${id} not found.`
  },
};