export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
