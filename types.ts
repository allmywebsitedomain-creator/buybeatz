
export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  price?: number;
  coverUrl: string;
  audioUrl: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: 'producer' | 'listener';
}
