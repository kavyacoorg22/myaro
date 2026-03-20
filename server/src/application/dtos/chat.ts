
export interface IChatListDto{
  chatId:        string;
  lastMessage:   string;
  lastMessageAt: Date;
  unreadCount:   number;
  participant: {
    id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
  };
}