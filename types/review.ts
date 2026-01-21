import { Timestamp } from 'firebase/firestore';

export type ReviewType = 'player_to_pnj' | 'pnj_to_player';

export type ReviewStatus = 'visible' | 'hidden' | 'flagged';

export interface ReviewCriteria {
  punctuality?: number; // 1-5
  communication?: number; // 1-5
  friendliness?: number; // 1-5
  asDescribed?: number; // 1-5
}

export interface Review {
  id: string;
  bookingId: string;

  // Participants
  fromUserId: string;
  toUserId: string;
  type: ReviewType;

  // Content
  rating: number; // 1-5
  comment: string;

  // Detailed criteria
  criteria?: ReviewCriteria;

  // Moderation
  status: ReviewStatus;
  reportCount: number;

  // Timestamps
  createdAt: Timestamp;
}

// Input types
export interface CreateReviewInput {
  bookingId: string;
  toUserId: string;
  type: ReviewType;
  rating: number;
  comment: string;
  criteria?: ReviewCriteria;
}

// For display
export interface ReviewWithAuthor extends Review {
  author: {
    displayName: string;
    avatar: string;
  };
}
