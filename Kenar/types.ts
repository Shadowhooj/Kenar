
export interface User {
  id: string;
  name: string;
  avatar: string;
  bluetoothName: string;
}

export interface Message {
  id: string;
  senderId: 'me' | string; // 'me' for the current user
  type: 'text' | 'image';
  content: string; // Text content or image Data URL
  caption?: string; // Optional caption for images
  timestamp: Date;
}

export interface Chat {
  userId: string;
  messages: Message[];
}