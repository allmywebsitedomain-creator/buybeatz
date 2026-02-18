
export interface Artist {
  id: string;
  name: string; // Stage Name
  legalName?: string;
  bio: string;
  location?: string;
  profileImageUrl: string;
  headerImageUrl?: string;
  genre: string;
  contactEmail?: string;
  totalTracks?: number;
  socials: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    soundcloud?: string;
  };
  createdAt: string;
}

export interface Contributor {
  id: string;
  name: string;
  role: string;
}

export interface SocialHandle {
  id: string;
  platform: string;
  handle: string;
}

export interface ProductionCredits {
  producedBy: string;
  mixedBy?: string;
  masteredBy?: string;
  writtenBy?: string;
  additionalContributors?: Contributor[];
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string; // The linked producer/studio profile
  mainArtist: string; // The primary artist billing
  featuredArtists?: string; // e.g. "Future, Young Thug"
  genre: string;
  bpm: number;
  mood?: string;
  coverUrl: string;
  audioUrl: string;
  description: string;
  tags: string[];
  credits: ProductionCredits;
  releaseSocials?: SocialHandle[];
  licenseType: 'Free' | 'Standard' | 'Premium';
  catalogNumber?: string;
  createdAt: string;
  likes: number;
  downloads: number;
  isLiked?: boolean;
}

export interface BlogPost {
  id: string;
  trackId: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface DownloadRecord {
  trackId: string;
  downloadedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'producer' | 'listener';
  isVerified: boolean;
  followingIds: string[];
  likedTrackIds: string[]; // Track which tracks the user has liked
  downloadHistory: DownloadRecord[]; // Detailed history with timestamps
  followerCount: number;
}
