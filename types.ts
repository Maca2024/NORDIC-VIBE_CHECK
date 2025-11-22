export enum VibeStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface VibeResponse {
  text: string;
  imageUrl?: string;
  tags?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string;
}
