import { PNJClass } from '../theme/types';
import { MOCK_IDS } from './ids';

/** PNJ list item shape used by search and list screens */
export interface MockPNJListItem {
  id: string;
  name: string;
  class: PNJClass;
  rating: number;
  price: number;
  city: string;
  bio: string;
}

/** Detailed PNJ profile shape used by detail and profile screens */
export interface MockPNJProfile {
  id: string;
  name: string;
  class: PNJClass;
  level: number;
  rating: number;
  reviewCount: number;
  price: number;
  hourlyRate: number;
  city: string;
  bio: string;
  languages: string[];
  activities: string[];
  completedBookings: number;
  responseRate: number;
  responseTime: number;
  verified: boolean;
}

// Shared base data for Alex (used by both list and detail views)
const PNJ_ALEX_BASE = {
  id: MOCK_IDS.pnjs.alex,
  name: 'Alex',
  class: 'adventurer' as PNJClass,
  rating: 4.8,
  price: 25,
  city: 'Paris',
  bio: "Passionné de randonnée et d'escalade, je suis toujours partant pour une nouvelle aventure ! J'adore découvrir de nouveaux endroits et partager ces moments avec des gens sympas.",
};

/** PNJ list for search screen */
export const MOCK_PNJ_LIST: MockPNJListItem[] = [
  { ...PNJ_ALEX_BASE, bio: "Passionné de randonnée et d'escalade" },
  { id: MOCK_IDS.pnjs.marie_sage, name: 'Marie', class: 'sage', rating: 4.9, price: 30, city: 'Paris', bio: 'Guide culturelle, amatrice de musées' },
  { id: MOCK_IDS.pnjs.lucas_geek, name: 'Lucas', class: 'geek', rating: 4.7, price: 20, city: 'Lyon', bio: 'Gamer invétéré, tous types de jeux' },
  { id: MOCK_IDS.pnjs.emma_foodie, name: 'Emma', class: 'foodie', rating: 4.6, price: 35, city: 'Paris', bio: 'Foodie passionnée, je connais les meilleures adresses' },
  { id: MOCK_IDS.pnjs.thomas_bard, name: 'Thomas', class: 'bard', rating: 4.5, price: 28, city: 'Marseille', bio: 'Ambiance garantie, karaoké et concerts' },
];

/** Full PNJ profile for detail view (player-side pnj/[id].tsx) */
export const MOCK_PNJ_DETAIL: MockPNJProfile = {
  ...PNJ_ALEX_BASE,
  level: 8,
  reviewCount: 24,
  hourlyRate: 25,
  languages: ['Français', 'Anglais'],
  activities: ['Randonnée', 'Escalade', 'VTT', 'Course à pied'],
  completedBookings: 45,
  responseRate: 98,
  responseTime: 15,
  verified: true,
};

/** PNJ's own profile (PNJ-side profile.tsx) */
export const MOCK_CURRENT_PNJ_PROFILE: Omit<MockPNJProfile, 'id' | 'name' | 'price'> = {
  class: 'adventurer' as PNJClass,
  level: 8,
  rating: 4.8,
  reviewCount: 24,
  hourlyRate: 25,
  bio: "Passionné de randonnée et d'escalade, je suis toujours partant pour une nouvelle aventure !",
  activities: ['Randonnée', 'Escalade', 'VTT', 'Course à pied'],
  languages: ['Français', 'Anglais'],
  city: 'Paris',
  completedBookings: 45,
  responseRate: 98,
  responseTime: 15,
  verified: true,
};
