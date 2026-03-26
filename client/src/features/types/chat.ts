import type { ServiceModesType } from "../../constants/types/beautician";

export interface ContactProps {
  chatId:      string;
  name:        string;
  profileImg?: string;
  sub:         string;
  unreadCount: number;
  active?:     boolean;
  onClick:     () => void;
  isOnline:boolean,
  isTyping:boolean
}

export interface ChatParticipant {
  id: string;
  fullName: string;
  userName: string;
  profileImg?: string;
  role?: 'customer' | 'beautician';
  serviceModes?: ServiceModesType[];
}

export interface ChatWindowProps {
  chatId: string;
  userId: string;
  participant: ChatParticipant | null;
}