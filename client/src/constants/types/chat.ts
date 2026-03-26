export const MessageType={
  TEXT:'text',
  BOOKING:'booking'
}

export type MessageTypes=(typeof MessageType)[keyof typeof MessageType]