// User types
export type {
  User,
  UserRole,
  UserStatus,
  EmergencyContact,
  NotificationPreferences,
  PrivacyPreferences,
  UserPreferences,
  UserStats,
  CreateUserPayload,
  UpdateUserPayload,
} from './user';

// PNJ types
export type {
  PNJProfile,
  PNJListItem,
  TimeSlot,
  WeeklyAvailability,
  ExceptionalDate,
  CreatePNJProfilePayload,
  UpdatePNJProfilePayload,
} from './pnj';
export { PNJ_CLASS_INFO } from './pnj';

// Booking types
export type {
  Booking,
  BookingStatus,
  CancelReason,
  BookingActivity,
  BookingLocation,
  CheckInOut,
  CreateBookingPayload,
} from './booking';
export {
  BOOKING_DURATIONS,
  PLATFORM_FEE_PERCENTAGE,
  calculateBookingPrice,
  BOOKING_STATUS_INFO,
} from './booking';

// Chat types
export type {
  Chat,
  Message,
  MessageType,
  MessageMetadata,
  ChatLastMessage,
  ChatUnreadCount,
  ChatListItem,
  SendMessagePayload,
} from './chat';
export {
  SYSTEM_MESSAGE_TEMPLATES,
  isSystemMessage,
  formatMessagePreview,
} from './chat';

// Mission types
export type {
  Mission,
  MissionTemplate,
  MissionType,
  MissionCategory,
  MissionDifficulty,
  MissionStatus,
  MissionRequirement,
  RequirementType,
  MissionRewards,
  MissionProgress,
} from './mission';
export {
  calculateMissionProgress,
  isMissionCompleted,
  DAILY_MISSIONS_EXAMPLES,
  ACHIEVEMENT_MISSIONS_EXAMPLES,
} from './mission';

// Review types
export type {
  Review,
  ReviewType,
  ReviewStatus,
  ReviewCriteria,
  ReviewWithUser,
  CreateReviewPayload,
  ReviewStats,
} from './review';
export { calculateReviewStats, formatRating, getRatingLabel } from './review';

// Souvenir types
export type {
  Souvenir,
  SouvenirPNJ,
  SouvenirActivity,
  SouvenirLocation,
  CollectionStats,
  UpdateSouvenirPayload,
} from './souvenir';
export {
  getSouvenirRarity,
  calculateCollectionStats,
} from './souvenir';
