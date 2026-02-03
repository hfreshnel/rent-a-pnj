import { MOCK_IDS } from './ids';

// ──────────────────────────────────────
// Calendar screen (weekly view)
// ──────────────────────────────────────

export interface MockCalendarBooking {
  id: string;
  day: number;
  slot: number;
  playerName: string;
  activity: string;
}

export const MOCK_CALENDAR_BOOKINGS: MockCalendarBooking[] = [
  { id: MOCK_IDS.bookings.hiking_with_marie, day: 0, slot: 1, playerName: 'Marie', activity: 'Randonnée' },
  { id: MOCK_IDS.bookings.climbing_with_thomas, day: 1, slot: 0, playerName: 'Thomas', activity: 'Escalade' },
  { id: MOCK_IDS.bookings.vtt_with_sophie, day: 5, slot: 1, playerName: 'Sophie', activity: 'VTT' },
];

// ──────────────────────────────────────
// PNJ Dashboard screen
// ──────────────────────────────────────

export interface MockPNJDashboardStats {
  pendingRequests: number;
  upcomingBookings: number;
  monthlyEarnings: number;
  totalBookings: number;
  averageRating: number;
  responseRate: number;
}

export const MOCK_PNJ_DASHBOARD_STATS: MockPNJDashboardStats = {
  pendingRequests: 3,
  upcomingBookings: 2,
  monthlyEarnings: 450,
  totalBookings: 45,
  averageRating: 4.8,
  responseRate: 98,
};

export interface MockDashboardBooking {
  id: string;
  playerName: string;
  activity: string;
  date: string;
  time: string;
  duration: number;
  price: number;
}

export const MOCK_UPCOMING_BOOKINGS: MockDashboardBooking[] = [
  {
    id: MOCK_IDS.bookings.hiking_with_marie,
    playerName: 'Marie',
    activity: 'Randonnée',
    date: "Aujourd'hui",
    time: '14:00',
    duration: 120,
    price: 50,
  },
  {
    id: MOCK_IDS.bookings.climbing_with_thomas,
    playerName: 'Thomas',
    activity: 'Escalade',
    date: 'Demain',
    time: '10:00',
    duration: 180,
    price: 75,
  },
];

export const MOCK_PENDING_BOOKINGS: MockDashboardBooking[] = [
  {
    id: MOCK_IDS.bookings.vtt_with_sophie,
    playerName: 'Sophie',
    activity: 'VTT',
    date: 'Sam 25',
    time: '15:00',
    duration: 120,
    price: 50,
  },
];

// ──────────────────────────────────────
// Booking requests screen (PNJ side)
// ──────────────────────────────────────

export interface MockBookingRequest {
  id: string;
  playerName: string;
  playerLevel: number;
  activity: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  price: number;
  message: string;
  createdAt: string;
}

export const MOCK_BOOKING_REQUESTS: MockBookingRequest[] = [
  {
    id: '1',
    playerName: 'Sophie',
    playerLevel: 5,
    activity: 'VTT',
    date: 'Sam 25 Jan',
    time: '15:00',
    duration: 120,
    location: 'Bois de Vincennes',
    price: 50,
    message: 'Salut ! Je cherche quelqu\'un pour m\'accompagner en VTT, ça te dit ?',
    createdAt: 'Il y a 2h',
  },
  {
    id: '2',
    playerName: 'Lucas',
    playerLevel: 3,
    activity: 'Randonnée',
    date: 'Dim 26 Jan',
    time: '09:00',
    duration: 240,
    location: 'Fontainebleau',
    price: 100,
    message: 'Hello, je prépare une rando et j\'aimerais avoir de la compagnie !',
    createdAt: 'Il y a 5h',
  },
  {
    id: '3',
    playerName: 'Emma',
    playerLevel: 8,
    activity: 'Escalade',
    date: 'Lun 27 Jan',
    time: '18:00',
    duration: 120,
    location: 'Climb Up - Paris 15',
    price: 50,
    message: 'Coucou, tu serais dispo pour une session escalade ?',
    createdAt: 'Il y a 1j',
  },
];

// ──────────────────────────────────────
// Booking detail screen (shared)
// ──────────────────────────────────────

export interface MockBookingDetail {
  id: string;
  status: string;
  activity: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  price: number;
  pnj: {
    id: string;
    name: string;
    rating: number;
    class: string;
  };
  player: {
    id: string;
    name: string;
    level: number;
  };
  createdAt: string;
}

export const MOCK_BOOKING_DETAIL: MockBookingDetail = {
  id: MOCK_IDS.bookings.hiking_with_marie,
  status: 'confirmed',
  activity: 'Randonnée',
  date: 'Samedi 25 Janvier 2024',
  time: '14:00',
  duration: 120,
  location: 'Bois de Vincennes, Paris',
  price: 50,
  pnj: {
    id: MOCK_IDS.pnjs.alex,
    name: 'Alex',
    rating: 4.8,
    class: 'adventurer',
  },
  player: {
    id: MOCK_IDS.users.player_marie,
    name: 'Marie',
    level: 5,
  },
  createdAt: '20 Jan 2024',
};
