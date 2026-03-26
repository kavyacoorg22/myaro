

export const SOCKET_EVENTS = Object.freeze({
  // client → server
  JOIN_USER_ROOM: "join_user_room",
  JOIN_CHAT:      "join_chat",
  SEND_MESSAGE:   "send_message",
  TYPING_START:   "typing_start",
  TYPING_STOP:    "typing_stop",
  MARK_SEEN:      "mark_seen",

  // server → client
  NEW_MESSAGE:      "new_message",
  NEW_NOTIFICATION: "new_notification",
  MESSAGE_SEEN:     "message_seen",
  USER_JOINED_CHAT: "user_joined_chat",
  USER_ONLINE:      "user_online",
  USER_OFFLINE:     "user_offline",
  TYPING:           "typing_start",
  STOP_TYPING:      "typing_stop",
  ERROR:            "chat_error",
});
