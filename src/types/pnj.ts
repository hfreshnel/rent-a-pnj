import { Timestamp, GeoPoint } from 'firebase/firestore';
import { PNJClass } from '../theme/types';

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "12:00"
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface ExceptionalDate {
  date: string;           // "2024-03-15"
  available: boolean;     // true = dispo exceptionnelle, false = bloqué
  slots?: TimeSlot[];     // Si available, créneaux spécifiques
  reason?: string;        // Optionnel, privé
}

export interface PNJProfile {
  // Identité
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  photos: string[];         // Max 5 photos

  // Gameplay
  class: PNJClass;
  secondaryClass?: PNJClass;
  level: number;
  xp: number;
  badges: string[];

  // Infos pratiques
  bio: string;              // Max 500 caractères
  hourlyRate: number;       // En euros, min 15€, max 100€
  languages: string[];      // ['fr', 'en', ...]
  activities: string[];     // IDs activités proposées

  // Localisation
  city: string;
  location: GeoPoint;       // Pour recherche par proximité
  maxDistance: number;      // Km max de déplacement

  // Disponibilités
  availability: WeeklyAvailability;
  exceptionalDates: ExceptionalDate[];

  // Stats
  rating: number;           // Moyenne des reviews
  reviewCount: number;
  completedBookings: number;
  responseRate: number;     // % de réponses aux demandes
  responseTime: number;     // Temps moyen de réponse (minutes)

  // Admin
  verified: boolean;        // Validé par l'équipe
  active: boolean;          // Visible dans la recherche
  stripeConnectId?: string; // Pour recevoir les paiements

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// PNJ Profile creation payload (onboarding)
export interface CreatePNJProfilePayload {
  displayName: string;
  bio: string;
  class: PNJClass;
  secondaryClass?: PNJClass;
  hourlyRate: number;
  languages: string[];
  activities: string[];
  city: string;
  location: { latitude: number; longitude: number };
  maxDistance: number;
  availability: WeeklyAvailability;
}

// PNJ Profile update payload
export interface UpdatePNJProfilePayload {
  displayName?: string;
  avatar?: string;
  photos?: string[];
  bio?: string;
  class?: PNJClass;
  secondaryClass?: PNJClass | null;
  hourlyRate?: number;
  languages?: string[];
  activities?: string[];
  city?: string;
  location?: { latitude: number; longitude: number };
  maxDistance?: number;
  availability?: WeeklyAvailability;
  exceptionalDates?: ExceptionalDate[];
  active?: boolean;
}

// PNJ List item (for search results)
export interface PNJListItem {
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  class: PNJClass;
  secondaryClass?: PNJClass;
  level: number;
  bio: string;
  hourlyRate: number;
  city: string;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  activities: string[];
  verified: boolean;
  distance?: number; // Calculated based on user location
  availableToday?: boolean;
}

// Class display info
export const PNJ_CLASS_INFO: Record<PNJClass, { emoji: string; label: string; description: string }> = {
  adventurer: {
    emoji: '🗡️',
    label: 'Aventurier',
    description: 'Pour les activités outdoor et sportives',
  },
  sage: {
    emoji: '📚',
    label: 'Sage',
    description: 'Pour les discussions intellectuelles et culturelles',
  },
  bard: {
    emoji: '🎭',
    label: 'Barde',
    description: 'Pour les sorties festives et artistiques',
  },
  tank: {
    emoji: '🛡️',
    label: 'Tank',
    description: 'Pour un accompagnement rassurant et protecteur',
  },
  foodie: {
    emoji: '🍜',
    label: 'Glouton',
    description: 'Pour les expériences culinaires',
  },
  geek: {
    emoji: '🎮',
    label: 'Geek',
    description: 'Pour les jeux et la culture pop',
  },
  artist: {
    emoji: '🎨',
    label: 'Artiste',
    description: 'Pour les activités créatives',
  },
  coach: {
    emoji: '💪',
    label: 'Coach',
    description: 'Pour la motivation et le développement personnel',
  },
};
