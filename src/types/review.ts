import { Timestamp } from 'firebase/firestore';

export type ReviewType = 'player_to_pnj' | 'pnj_to_player';
export type ReviewStatus = 'visible' | 'hidden' | 'flagged';

export interface ReviewCriteria {
  punctuality?: number;           // 1-5
  communication?: number;
  friendliness?: number;
  asDescribed?: number;           // Correspondait au profil
}

export interface Review {
  id: string;
  bookingId: string;

  // Participants
  fromUserId: string;
  toUserId: string;
  type: ReviewType;

  // Content
  rating: number;                   // 1-5
  comment: string;                  // Max 500 chars

  // Critères détaillés (optionnel)
  criteria?: ReviewCriteria;

  // Modération
  status: ReviewStatus;
  reportCount: number;

  // Timestamps
  createdAt: Timestamp;
}

// Review with user info (for display)
export interface ReviewWithUser extends Review {
  fromUser: {
    id: string;
    displayName: string;
    avatar?: string;
  };
}

// Create review payload
export interface CreateReviewPayload {
  bookingId: string;
  toUserId: string;
  type: ReviewType;
  rating: number;
  comment: string;
  criteria?: ReviewCriteria;
}

// Review stats (aggregated)
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  criteriaAverages?: {
    punctuality: number;
    communication: number;
    friendliness: number;
    asDescribed: number;
  };
}

// Calculate review stats
export const calculateReviewStats = (reviews: Review[]): ReviewStats => {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating as keyof typeof distribution]++;
  });

  // Calculate criteria averages if available
  const reviewsWithCriteria = reviews.filter((r) => r.criteria);
  let criteriaAverages;
  if (reviewsWithCriteria.length > 0) {
    criteriaAverages = {
      punctuality:
        reviewsWithCriteria.reduce((sum, r) => sum + (r.criteria?.punctuality || 0), 0) /
        reviewsWithCriteria.length,
      communication:
        reviewsWithCriteria.reduce((sum, r) => sum + (r.criteria?.communication || 0), 0) /
        reviewsWithCriteria.length,
      friendliness:
        reviewsWithCriteria.reduce((sum, r) => sum + (r.criteria?.friendliness || 0), 0) /
        reviewsWithCriteria.length,
      asDescribed:
        reviewsWithCriteria.reduce((sum, r) => sum + (r.criteria?.asDescribed || 0), 0) /
        reviewsWithCriteria.length,
    };
  }

  return {
    averageRating: totalRating / reviews.length,
    totalReviews: reviews.length,
    ratingDistribution: distribution,
    criteriaAverages,
  };
};

// Format rating for display
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Get rating label
export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Très bien';
  if (rating >= 3.5) return 'Bien';
  if (rating >= 3.0) return 'Correct';
  if (rating >= 2.0) return 'Moyen';
  return 'À améliorer';
};
