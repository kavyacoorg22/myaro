export const SOCKET_EVENTS = Object.freeze({
  // Client → Server
  JOIN_USER_ROOM: "join_user_room",
  JOIN_CHAT: "join_chat",
  SEND_MESSAGE: "send_message",
  MARK_SEEN: "mark_seen",
  GET_MESSAGES: "get_messages",
  GET_CHATS: "get_chats",
  REFUND_REQUESTED:'refund_requested',
  REFUND_APPROVED:'refund_approved',
  REFUND_DISPUTED : 'refund_disputed',

  // Server → Client
  NEW_MESSAGE: "new_message",
  MESSAGE_SEEN: "message_seen",
  MESSAGES_LIST: "messages_list",
  CHATS_LIST: "chats_list",
  USER_JOINED_CHAT: "user_joined_chat",
  ERROR: "chat_error",
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  NEW_NOTIFICATION: "new_notification",
} as const);
