# Rent a PNJ - Spécification Technique MVP

> **Version** : 1.0  
> **Scope** : MVP "Première Quête Complète"  
> **Objectif** : Un utilisateur peut réserver un PNJ et vivre l'expérience de bout en bout.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique détaillée](#2-stack-technique-détaillée)
3. [Architecture](#3-architecture)
4. [Modules fonctionnels](#4-modules-fonctionnels)
5. [Modèle de données](#5-modèle-de-données)
6. [Sécurité & Règles Firestore](#6-sécurité--règles-firestore)
7. [Intégrations externes](#7-intégrations-externes)
8. [Structure du projet](#8-structure-du-projet)
9. [Design System](#9-design-system)
10. [Checklist de développement](#10-checklist-de-développement)

---

## 1. Vue d'ensemble

### 1.1 Objectif du MVP

Livrer une application fonctionnelle permettant :
- À un **Joueur** de trouver, réserver et payer un PNJ pour une activité
- À un **PNJ** de créer son profil, recevoir des demandes et être payé
- Aux deux de communiquer via chat et de vivre une expérience gamifiée

### 1.2 Critères de succès MVP

| Critère | Métrique |
|---------|----------|
| Flow complet | Un booking peut être créé, payé, réalisé et noté |
| Temps réel | Chat et statuts mis à jour instantanément |
| Paiement | Stripe Connect fonctionnel avec split automatique |
| Gamification | Missions daily + collection de souvenirs opérationnels |
| Sécurité | Check-in/out + bouton urgence fonctionnels |

### 1.3 Ce qui est OUT of scope MVP

- Vérification d'identité automatisée (Onfido) → validation manuelle pour le MVP
- Battle Pass complet → juste les missions daily
- Matching algorithmique avancé → recherche par filtres basique
- Multi-langue → français uniquement
- Mode offline → connexion requise

---

## 2. Stack technique détaillée

### 2.1 Frontend Mobile

| Techno | Version | Usage |
|--------|---------|-------|
| **Expo** | SDK 52+ | Framework React Native |
| **Expo Router** | v4 | Navigation file-based |
| **React Native** | 0.76+ | UI mobile |
| **TypeScript** | 5.x | Typage statique |
| **Zustand** | 4.x | State management global |
| **TanStack Query** | 5.x | Cache, sync, fetch state |
| **React Hook Form** | 7.x | Gestion formulaires |
| **Zod** | 3.x | Validation schémas |
| **date-fns** | 3.x | Manipulation dates |
| **Expo Image** | ~1.x | Chargement images optimisé |
| **React Native Reanimated** | 3.x | Animations performantes |
| **React Native Gesture Handler** | 2.x | Gestures |
| **Expo Location** | ~17.x | Géolocalisation |
| **Expo Notifications** | ~0.28.x | Push notifications |

### 2.2 Backend (Firebase)

| Service | Usage |
|---------|-------|
| **Firebase Auth** | Authentification (email, Google, Apple) |
| **Cloud Firestore** | Base de données NoSQL temps réel |
| **Firebase Storage** | Stockage photos profils/médias |
| **Cloud Functions** | Logique serveur (webhooks Stripe, notifications, etc.) |
| **Firebase Cloud Messaging** | Push notifications |
| **Firebase Analytics** | Tracking événements |

### 2.3 Services externes

| Service | Usage | Pricing MVP |
|---------|-------|-------------|
| **Stripe Connect** | Paiements marketplace | 1.4% + 0.25€/transaction |
| **Google Maps Platform** | Cartes, géocoding, places | 200$/mois gratuit |
| **Expo EAS** | Build & submit | Free tier suffisant |

### 2.4 Outils de développement

| Outil | Usage |
|-------|-------|
| **ESLint** | Linting |
| **Prettier** | Formatting |
| **Husky** | Git hooks |
| **Firebase Emulators** | Dev local |
| **Expo Dev Client** | Debug natif |

---

## 3. Architecture

### 3.1 Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Expo)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Expo Router                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │   │
│  │  │ (auth)  │  │(player) │  │  (pnj)  │  │ (shared)│     │   │
│  │  │ screens │  │ screens │  │ screens │  │ screens │     │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    State Layer                           │   │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐   │   │
│  │  │  Zustand Stores │  │  TanStack Query (cache)     │   │   │
│  │  │  - authStore    │  │  - useUser, usePNJ          │   │   │
│  │  │  - gameStore    │  │  - useBookings, useChat     │   │   │
│  │  │  - uiStore      │  │  - useMissions, useSouvenirs│   │   │
│  │  └─────────────────┘  └─────────────────────────────────┘   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Services Layer                         │   │
│  │  ┌────────┐ ┌──────────┐ ┌─────────┐ ┌───────────────┐  │   │
│  │  │  Auth  │ │Firestore │ │ Storage │ │    Stripe     │  │   │
│  │  └────────┘ └──────────┘ └─────────┘ └───────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FIREBASE                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │   Auth   │ │Firestore │ │ Storage  │ │ Cloud Functions  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                │                 │
│                          ┌─────────────────────┘                 │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Cloud Functions (Node.js)                   │   │
│  │  • onUserCreate     → Init profil + Stripe Customer      │   │
│  │  • onBookingCreate  → Notifications + validation         │   │
│  │  • stripeWebhook    → Gestion événements paiement        │   │
│  │  • dailyMissions    → Scheduled: génère missions daily   │   │
│  │  • onBookingComplete→ Crée souvenir + distribue XP       │   │
│  │  • onEmergency      → Alerte équipe + log                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES EXTERNES                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │Stripe Connect│  │ Google Maps  │  │ Firebase Cloud Msg   │   │
│  │  - Payments  │  │  - Maps SDK  │  │  - Push Notifs       │   │
│  │  - Connect   │  │  - Places    │  │                      │   │
│  │  - Webhooks  │  │  - Geocoding │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Flow de données

#### Flow d'authentification
```
User → Expo Auth Screen → Firebase Auth → onUserCreate (Function)
                                               │
                                               ├→ Crée doc /users/{uid}
                                               ├→ Crée Stripe Customer
                                               └→ Assigne missions initiales
```

#### Flow de réservation
```
Joueur sélectionne PNJ → Choisit créneau → Confirme
        │
        ▼
    Crée /bookings/{id} (status: pending)
        │
        ▼
    onBookingCreate (Function)
        ├→ Notifie PNJ (push + in-app)
        └→ Crée /chats/{id}
        
PNJ accepte → Update booking (status: confirmed)
        │
        ▼
    Joueur paie via Stripe
        │
        ▼
    stripeWebhook (Function)
        ├→ Update booking (status: paid)
        ├→ PaymentIntent → PNJ (via Connect)
        └→ Notifie les deux parties
```

#### Flow de mission
```
dailyMissions (Scheduled 00:00)
        │
        ├→ Pour chaque user actif
        │   └→ Assigne 3 missions daily dans /users/{uid}/missions
        │
        └→ Expire anciennes missions non complétées

User complète booking lié à mission
        │
        ▼
    onBookingComplete (Function)
        ├→ Check si booking match une mission active
        ├→ Si oui: update mission (completed) + distribue XP
        └→ Crée souvenir dans /users/{uid}/souvenirs
```

### 3.3 Patterns architecturaux

#### Repository Pattern (Services)
Chaque entité a un service dédié qui encapsule les appels Firestore :
```
services/
├── auth.service.ts      # Firebase Auth
├── user.service.ts      # CRUD /users
├── pnj.service.ts       # CRUD /pnjProfiles
├── booking.service.ts   # CRUD /bookings + logique métier
├── chat.service.ts      # Real-time chat
├── mission.service.ts   # Missions
└── payment.service.ts   # Stripe
```

#### Custom Hooks (Data fetching)
TanStack Query pour le cache et la synchronisation :
```
hooks/
├── queries/
│   ├── useUser.ts
│   ├── usePNJProfile.ts
│   ├── usePNJList.ts
│   ├── useBookings.ts
│   ├── useMissions.ts
│   └── useSouvenirs.ts
├── mutations/
│   ├── useCreateBooking.ts
│   ├── useUpdateBooking.ts
│   ├── useSendMessage.ts
│   └── useCompleteMission.ts
└── subscriptions/
    ├── useChatMessages.ts    # Real-time
    ├── useBookingStatus.ts   # Real-time
    └── useNotifications.ts   # Real-time
```

#### Store Pattern (Zustand)
État global pour ce qui ne vient pas du serveur :
```
stores/
├── authStore.ts    # User session, tokens
├── gameStore.ts    # XP local, animations pending
├── uiStore.ts      # Modals, toasts, loading states
└── locationStore.ts # Position actuelle, permissions
```

---

## 4. Modules fonctionnels

### 4.1 Module Auth

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Welcome | `/(auth)/` | Splash + choix Login/Register |
| Login | `/(auth)/login` | Email + password, OAuth buttons |
| Register | `/(auth)/register` | Email, password, confirm |
| Role Choice | `/(auth)/role` | Choix Joueur / PNJ / Les deux |
| Onboarding Joueur | `/(auth)/onboarding-player` | 3-4 écrans gamifiés |
| Onboarding PNJ | `/(auth)/onboarding-pnj` | Création profil guidée |
| Forgot Password | `/(auth)/forgot-password` | Reset par email |

#### Fonctionnalités
- [x] Register par email/password
- [x] Login par email/password
- [x] OAuth Google
- [x] OAuth Apple (iOS)
- [x] Reset password par email
- [x] Choix de rôle post-inscription
- [x] Onboarding adapté au rôle
- [x] Persistance session (AsyncStorage)
- [x] Auto-logout si token expiré

#### Règles métier
- Email doit être vérifié avant accès complet (envoyer email de vérification)
- Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre
- Un user peut changer de rôle plus tard (Joueur ↔ Les deux)
- PNJ nécessite validation manuelle avant d'apparaître dans la recherche

#### Flux détaillé : Register
```
1. User entre email + password
2. Client valide format (Zod)
3. Appel Firebase Auth createUserWithEmailAndPassword
4. Si succès:
   a. Firebase trigger onUserCreate
   b. Redirect vers Role Choice
5. Si erreur:
   a. email-already-in-use → Message + lien login
   b. weak-password → Message explicite
   c. Autre → Message générique + retry
```

---

### 4.2 Module Profil PNJ

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Dashboard PNJ | `/(pnj)/` | Stats, demandes en attente, gains |
| Edit Profile | `/(pnj)/profile` | Modification profil complet |
| Availability | `/(pnj)/availability` | Calendrier des dispos |
| Earnings | `/(pnj)/earnings` | Historique gains, paiements |
| Public Preview | `/(pnj)/preview` | Voir son profil côté Joueur |

#### Données du profil PNJ
```typescript
interface PNJProfile {
  // Identité
  userId: string;
  displayName: string;
  avatar: string;           // URL Storage
  photos: string[];         // Max 5 photos
  
  // Gameplay
  class: PNJClass;          // Classe principale
  secondaryClass?: PNJClass;// Classe secondaire (optionnel)
  level: number;            // Calculé selon XP
  xp: number;
  badges: string[];         // IDs des badges débloqués
  
  // Infos pratiques
  bio: string;              // Max 500 caractères
  hourlyRate: number;       // En euros, min 15€
  languages: string[];      // ['fr', 'en', ...]
  activities: string[];     // IDs activités proposées
  
  // Localisation
  city: string;
  location: GeoPoint;       // Pour recherche par proximité
  maxDistance: number;      // Km max de déplacement
  
  // Disponibilités
  availability: WeeklyAvailability;
  exceptionalDates: ExceptionalDate[]; // Blocages/ajouts ponctuels
  
  // Stats
  rating: number;           // Moyenne des reviews
  reviewCount: number;
  completedBookings: number;
  responseRate: number;     // % de réponses aux demandes
  responseTime: number;     // Temps moyen de réponse (minutes)
  
  // Admin
  verified: boolean;        // Validé par l'équipe
  active: boolean;          // Visible dans la recherche
  stripeConnectId: string;  // Pour recevoir les paiements
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type PNJClass = 
  | 'adventurer'  // 🗡️ Aventurier
  | 'sage'        // 📚 Sage
  | 'bard'        // 🎭 Barde
  | 'tank'        // 🛡️ Tank
  | 'foodie'      // 🍜 Glouton
  | 'geek'        // 🎮 Geek
  | 'artist'      // 🎨 Artiste
  | 'coach';      // 💪 Coach

interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

interface TimeSlot {
  start: string;  // "09:00"
  end: string;    // "12:00"
}

interface ExceptionalDate {
  date: string;           // "2024-03-15"
  available: boolean;     // true = dispo exceptionnelle, false = bloqué
  slots?: TimeSlot[];     // Si available, créneaux spécifiques
  reason?: string;        // Optionnel, privé
}
```

#### Fonctionnalités
- [x] Création profil guidée (wizard multi-étapes)
- [x] Upload photos avec crop/resize
- [x] Choix classe principale + secondaire
- [x] Définition tarif horaire (min 15€, max 100€)
- [x] Sélection activités proposées (depuis liste prédéfinie)
- [x] Gestion disponibilités récurrentes (calendrier semaine type)
- [x] Blocage/ajout dates exceptionnelles
- [x] Preview du profil public
- [x] Stats de performance (response rate, rating)
- [x] Historique et export des gains
- [x] Connexion compte Stripe (onboarding Connect)

#### Règles métier
- Profil doit être complet à 100% pour être visible (nom, photo, bio, 1 activité, dispo)
- Tarif minimum : 15€/h (assure qualité + rentabilité plateforme)
- Tarif maximum : 100€/h (évite dérives)
- Au moins 4h de disponibilité par semaine pour rester actif
- Si aucune connexion pendant 30 jours → profil désactivé automatiquement
- Rating minimum 3.5/5 pour rester visible (après 5 reviews)

---

### 4.3 Module Recherche & Découverte (Joueur)

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Home | `/(player)/` | Dashboard, missions, suggestions |
| Search | `/(player)/search` | Liste PNJ avec filtres |
| Map View | `/(player)/map` | Vue carte des PNJ |
| PNJ Detail | `/(player)/pnj/[id]` | Profil complet + booking |
| Filters | Modal | Filtres avancés |

#### Fonctionnalités recherche
- [x] Recherche textuelle (nom, bio, activités)
- [x] Filtres par classe
- [x] Filtre par tarif (range slider)
- [x] Filtre par disponibilité (date + créneau)
- [x] Filtre par distance (avec géoloc)
- [x] Filtre par note minimum
- [x] Filtre par activités
- [x] Tri : pertinence, prix, distance, note
- [x] Vue liste / Vue carte toggle
- [x] Pagination infinie (ou load more)
- [x] Sauvegarde de recherche (favoris)

#### Algorithme de tri "Pertinence"
Score calculé selon :
```
pertinenceScore = 
    (rating * 20) +                    // Max 100 points
    (responseRate * 0.5) +             // Max 50 points
    (completedBookings * 0.1) +        // Bonus ancienneté, plafonné 50
    (isOnline ? 30 : 0) +              // Connecté récemment
    (matchesPreferences ? 20 : 0) +    // Match avec historique joueur
    (distanceScore)                    // 50 points si <5km, décroissant
```

#### Cards PNJ (composant réutilisable)
Informations affichées :
- Avatar + badge de classe
- Nom + level
- Rating (étoiles) + nombre d'avis
- Tarif horaire
- Distance (si géoloc active)
- 2-3 tags activités
- Badge "Dispo aujourd'hui" si applicable
- Badge "Nouveau" si < 5 bookings

---

### 4.4 Module Booking

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Booking Flow | `/(player)/book/[pnjId]` | Multi-step booking |
| Step 1 | - | Choix activité |
| Step 2 | - | Choix date/créneau |
| Step 3 | - | Lieu de RDV |
| Step 4 | - | Récap + paiement |
| Confirmation | `/(player)/book/confirm/[id]` | Confirmation + prochaines étapes |
| Booking Detail | `/(shared)/booking/[id]` | Détail d'une réservation |

#### États d'un booking
```
┌──────────────────────────────────────────────────────────────────┐
│                      LIFECYCLE D'UN BOOKING                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐     ┌───────────┐     ┌────────┐     ┌─────────┐  │
│   │ PENDING │────▶│ CONFIRMED │────▶│  PAID  │────▶│ ONGOING │  │
│   └─────────┘     └───────────┘     └────────┘     └─────────┘  │
│        │               │                                │        │
│        │               │                                ▼        │
│        │               │                          ┌───────────┐  │
│        │               │                          │ COMPLETED │  │
│        │               │                          └───────────┘  │
│        │               │                                │        │
│        ▼               ▼                                ▼        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      CANCELLED                          │   │
│   │  (raison: rejected | player_cancel | pnj_cancel |       │   │
│   │   no_payment | no_show | emergency)                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Transitions :
- PENDING → CONFIRMED : PNJ accepte la demande
- PENDING → CANCELLED (rejected) : PNJ refuse
- PENDING → CANCELLED (player_cancel) : Joueur annule avant réponse
- CONFIRMED → PAID : Paiement Stripe réussi
- CONFIRMED → CANCELLED (no_payment) : Timeout paiement (24h)
- PAID → ONGOING : Check-in effectué
- PAID → CANCELLED (player_cancel) : Annulation (remboursement selon délai)
- PAID → CANCELLED (pnj_cancel) : PNJ annule (remboursement total)
- ONGOING → COMPLETED : Check-out effectué
- ONGOING → CANCELLED (no_show) : Un des deux ne se présente pas
- ONGOING → CANCELLED (emergency) : Bouton urgence déclenché
```

#### Modèle de données Booking
```typescript
interface Booking {
  id: string;
  
  // Participants
  playerId: string;
  pnjId: string;
  
  // Activité
  activity: {
    id: string;
    name: string;
    category: string;
  };
  
  // Lieu
  location: {
    name: string;           // "Café des Arts"
    address: string;        // "12 rue de la Paix, 75001 Paris"
    coordinates: GeoPoint;
    placeId?: string;       // Google Places ID
  };
  
  // Timing
  date: Timestamp;          // Date du RDV
  startTime: string;        // "14:00"
  duration: number;         // En minutes (60, 120, 180, 240)
  endTime: string;          // Calculé
  
  // Prix
  hourlyRate: number;       // Tarif PNJ au moment du booking
  totalPrice: number;       // hourlyRate * (duration/60)
  platformFee: number;      // Commission (20%)
  pnjEarnings: number;      // totalPrice - platformFee
  
  // Status
  status: BookingStatus;
  cancelReason?: CancelReason;
  cancelledBy?: 'player' | 'pnj' | 'system';
  cancelledAt?: Timestamp;
  
  // Check-in/out
  checkIn?: {
    time: Timestamp;
    location: GeoPoint;
    by: 'player' | 'pnj';
  };
  checkOut?: {
    time: Timestamp;
    by: 'player' | 'pnj';
  };
  
  // Paiement
  stripePaymentIntentId?: string;
  paidAt?: Timestamp;
  refundedAt?: Timestamp;
  refundAmount?: number;
  
  // Gamification
  missionId?: string;       // Si booking lié à une mission
  xpAwarded?: number;       // XP donné à la complétion
  
  // Chat
  chatId: string;           // Référence vers le chat
  
  // Reviews
  playerReviewId?: string;
  pnjReviewId?: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}

type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

type CancelReason =
  | 'rejected'        // PNJ a refusé
  | 'player_cancel'   // Joueur a annulé
  | 'pnj_cancel'      // PNJ a annulé
  | 'no_payment'      // Pas de paiement dans les délais
  | 'no_show'         // Absent au RDV
  | 'emergency';      // Urgence signalée
```

#### Fonctionnalités
- [x] Flow de réservation multi-étapes
- [x] Sélection activité depuis profil PNJ
- [x] Calendrier avec créneaux dispos dynamiques
- [x] Sélection lieu via Google Places Autocomplete
- [x] Récapitulatif avec breakdown prix
- [x] Paiement Stripe (cartes, Apple Pay, Google Pay)
- [x] Notification push au PNJ
- [x] Acceptation/Refus par PNJ
- [x] Annulation (selon conditions)
- [x] Check-in géolocalisé
- [x] Check-out
- [x] Système de reviews post-booking

#### Règles métier - Annulation
| Délai avant RDV | Joueur annule | PNJ annule |
|-----------------|---------------|------------|
| > 48h | Remboursement 100% | Remboursement 100%, avertissement PNJ |
| 24h - 48h | Remboursement 50% | Remboursement 100%, pénalité PNJ |
| < 24h | Pas de remboursement | Remboursement 100%, suspension possible |

---

### 4.5 Module Chat

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Chat List | `/(shared)/chats` | Liste des conversations |
| Chat Room | `/(shared)/chat/[id]` | Conversation |

#### Fonctionnalités
- [x] Messages texte temps réel
- [x] Indicateur de frappe (typing indicator)
- [x] Indicateur lu/non-lu
- [x] Messages système (booking confirmé, rappel RDV, etc.)
- [x] Envoi d'images (depuis galerie ou caméra)
- [x] Réponse rapide (suggestions contextuelles)
- [x] Notification push nouveaux messages
- [x] Scroll infini historique
- [x] Badge nombre non-lus

#### Modèle de données Chat
```typescript
// Collection: /chats/{chatId}
interface Chat {
  id: string;
  participants: string[];           // [playerId, pnjId]
  bookingId: string;
  
  lastMessage: {
    content: string;
    senderId: string;
    type: MessageType;
    timestamp: Timestamp;
  };
  
  unreadCount: {
    [userId: string]: number;       // Compteur par participant
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Sous-collection: /chats/{chatId}/messages/{messageId}
interface Message {
  id: string;
  senderId: string;                 // 'system' pour messages auto
  
  type: MessageType;
  content: string;                  // Texte ou URL image
  
  metadata?: {
    bookingStatus?: BookingStatus;  // Pour messages système
    imageSize?: { w: number; h: number };
  };
  
  readBy: string[];                 // UIDs qui ont lu
  createdAt: Timestamp;
}

type MessageType = 
  | 'text'
  | 'image'
  | 'system_booking_created'
  | 'system_booking_confirmed'
  | 'system_booking_paid'
  | 'system_booking_reminder'
  | 'system_booking_checkin'
  | 'system_booking_completed'
  | 'system_booking_cancelled';
```

#### Règles métier
- Chat créé automatiquement à la création du booking
- Chat reste accessible 7 jours après complétion/annulation
- Pas d'échange de numéros/emails (modération par mots-clés)
- Images limitées à 5MB
- Messages limités à 1000 caractères

#### Modération
Détection automatique et flag de :
- Numéros de téléphone
- Adresses email
- Liens externes
- Mots-clés inappropriés

Action : Message bloqué + avertissement à l'expéditeur.

---

### 4.6 Module Missions & Gamification

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Missions Hub | `/(player)/missions` | Liste missions actives |
| Mission Detail | `/(player)/missions/[id]` | Détail + progression |
| Level Up Modal | Modal | Animation level up |
| Rewards | `/(shared)/rewards` | Historique récompenses |

#### Types de missions MVP
```typescript
type MissionType = 'daily' | 'weekly' | 'achievement';

interface Mission {
  id: string;
  type: MissionType;
  
  // Affichage
  title: string;              // "Premier Contact"
  description: string;        // "Réserve ton premier PNJ"
  icon: string;               // Emoji ou icon name
  
  // Conditions
  requirements: MissionRequirement[];
  
  // Récompenses
  rewards: {
    xp: number;
    coins?: number;           // Monnaie interne (future)
    badge?: string;           // ID du badge débloqué
  };
  
  // Timing
  expiresAt?: Timestamp;      // Pour daily/weekly
  
  // Metadata
  category: 'social' | 'exploration' | 'loyalty' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  repeatable: boolean;
}

interface MissionRequirement {
  type: RequirementType;
  target: number;             // Objectif (ex: 1, 3, 5)
  current?: number;           // Progression actuelle
  filters?: {
    activityType?: string;
    pnjClass?: PNJClass;
    minDuration?: number;
  };
}

type RequirementType =
  | 'complete_booking'        // Terminer X bookings
  | 'book_class'              // Booker une classe spécifique
  | 'book_activity'           // Booker une activité spécifique  
  | 'book_new_pnj'            // Booker un PNJ jamais rencontré
  | 'leave_review'            // Laisser X reviews
  | 'check_in'                // Faire X check-ins
  | 'consecutive_days'        // Se connecter X jours de suite
  | 'spend_hours';            // Passer X heures avec des PNJ
```

#### Exemples de missions
```yaml
Daily Missions (3/jour, reset à minuit):
  - "Petit curieux" : Consulter 5 profils de PNJ (50 XP)
  - "Sociable" : Envoyer un message (30 XP)
  - "L'aventurier" : Réserver un PNJ classe Aventurier (100 XP)

Weekly Missions (3/semaine, reset lundi):
  - "Explorateur" : Compléter 2 bookings (200 XP)
  - "Critique culinaire" : Laisser 2 reviews (100 XP)
  - "Multiclasse" : Booker 2 classes différentes (150 XP)

Achievements (one-time):
  - "Premier pas" : Premier booking complété (200 XP + badge)
  - "Habitué" : 5 bookings complétés (500 XP + badge)
  - "Vétéran" : 20 bookings complétés (1000 XP + badge)
  - "Collectionneur" : Rencontrer 10 PNJ différents (300 XP + badge)
  - "Gourmet" : 5 bookings avec classe Glouton (200 XP + badge)
```

#### Système de niveaux (Joueur)
```typescript
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5200,   // Level 10
  // ... continue +1400, +1600, +1800...
];

// Titre par palier
const LEVEL_TITLES = {
  1: "Noob",
  5: "Apprenti Sociable",
  10: "Aventurier Confirmé",
  15: "Maître des Rencontres",
  20: "Légende Locale",
  // ...
};
```

#### Système de niveaux (PNJ)
Basé sur :
- Nombre de bookings complétés
- Rating moyen
- Taux de réponse
- Ancienneté

Avantages par niveau :
- Level 5+ : Badge "Expérimenté"
- Level 10+ : Boost de visibilité
- Level 15+ : Accès missions premium (meilleure rémunération)

---

### 4.7 Module Collection (Souvenirs)

#### Écrans
| Écran | Route | Description |
|-------|-------|-------------|
| Collection | `/(player)/collection` | Galerie souvenirs |
| Souvenir Detail | `/(player)/collection/[id]` | Détail souvenir |

#### Modèle de données
```typescript
// Sous-collection: /users/{userId}/souvenirs/{souvenirId}
interface Souvenir {
  id: string;
  bookingId: string;
  
  // Infos de la rencontre
  pnj: {
    id: string;
    displayName: string;
    avatar: string;
    class: PNJClass;
  };
  
  activity: {
    id: string;
    name: string;
    category: string;
  };
  
  location: {
    name: string;
    city: string;
  };
  
  date: Timestamp;
  duration: number;
  
  // Contenu
  cardStyle: 'classic' | 'rare' | 'epic' | 'legendary';  // Basé sur XP gagné
  quote?: string;            // Citation mémorable (ajoutée par user)
  
  // Stats de la rencontre
  xpEarned: number;
  missionCompleted?: string;
  
  // Timestamps
  createdAt: Timestamp;
}
```

#### Fonctionnalités
- [x] Génération auto après booking complété
- [x] Design carte façon trading card
- [x] Rareté visuelle selon XP gagné
- [x] Ajout de note/citation personnelle
- [x] Filtres : par classe, par activité, par période
- [x] Stats collection : nombre, classes rencontrées, heures totales

#### Rareté des cartes
| XP Gagné | Rareté | Style |
|----------|--------|-------|
| 0-100 | Classic | Bordure grise |
| 101-200 | Rare | Bordure bleue + reflet |
| 201-350 | Epic | Bordure violette + particules |
| 351+ | Legendary | Bordure dorée + animation |

---

### 4.8 Module Sécurité

#### Fonctionnalités
- [x] Check-in géolocalisé (dans un rayon de 200m du lieu)
- [x] Check-out confirmation des deux parties
- [x] Bouton urgence discret (accessible en 2 taps max)
- [x] Contact d'urgence enregistré (optionnel)
- [x] Partage de localisation live (optionnel)
- [x] Signalement post-booking
- [x] Blocage utilisateur

#### Bouton Urgence
```typescript
interface EmergencyEvent {
  id: string;
  triggeredBy: string;        // userId
  bookingId: string;
  
  location: GeoPoint;
  timestamp: Timestamp;
  
  // Contexte
  otherPartyId: string;
  otherPartyPhone?: string;   // Si renseigné
  
  // Actions prises
  actions: EmergencyAction[];
  
  // Résolution
  status: 'active' | 'resolved' | 'false_alarm';
  resolvedAt?: Timestamp;
  resolvedBy?: string;
  notes?: string;
}

interface EmergencyAction {
  type: 'notification_sent' | 'contact_emergency' | 'admin_alerted';
  timestamp: Timestamp;
  details: string;
}
```

#### Flow bouton urgence
```
1. User tap sur bouton urgence
2. Confirmation "Êtes-vous sûr ?" (évite faux positifs)
3. Si confirmé :
   a. Crée EmergencyEvent
   b. Notifie contact d'urgence (si renseigné) avec localisation
   c. Alerte équipe admin (push + email)
   d. Booking automatiquement marqué "cancelled" (emergency)
4. User voit écran "Nous avons prévenu vos contacts"
5. Option d'appeler le 17 directement
```

#### Signalement
Types de signalement :
- Comportement inapproprié
- Harcèlement
- Non-respect des règles
- Tentative de contact hors app
- Autre

Flow : Formulaire → Review par équipe → Action (avertissement, suspension, ban)

---

## 5. Modèle de données

### 5.1 Vue d'ensemble des collections Firestore

```
firestore/
├── users/                          # Tous les utilisateurs
│   └── {userId}/
│       ├── missions/               # Missions assignées
│       │   └── {missionId}
│       ├── souvenirs/              # Collection de souvenirs
│       │   └── {souvenirId}
│       └── notifications/          # Notifications in-app
│           └── {notificationId}
│
├── pnjProfiles/                    # Profils PNJ (searchable)
│   └── {pnjProfileId}
│
├── bookings/                       # Toutes les réservations
│   └── {bookingId}
│
├── chats/                          # Conversations
│   └── {chatId}/
│       └── messages/
│           └── {messageId}
│
├── reviews/                        # Avis
│   └── {reviewId}
│
├── reports/                        # Signalements
│   └── {reportId}
│
├── emergencies/                    # Urgences
│   └── {emergencyId}
│
├── missionTemplates/               # Templates de missions (admin)
│   └── {templateId}
│
└── config/                         # Configuration app
    ├── activities                  # Liste activités disponibles
    ├── badges                      # Définition badges
    └── settings                    # Paramètres globaux
```

### 5.2 Collection users

```typescript
interface User {
  // Core
  id: string;                       // = Firebase Auth UID
  email: string;
  displayName: string;
  avatar: string;                   // URL
  
  // Role
  role: 'player' | 'pnj' | 'both';
  pnjProfileId?: string;            // Si role inclut 'pnj'
  
  // Vérification
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  identityVerified: boolean;        // Vérif manuelle MVP
  
  // Gamification
  level: number;
  xp: number;
  totalXpEarned: number;            // Historique total
  badges: string[];
  
  // Préférences
  preferences: {
    notifications: {
      push: boolean;
      email: boolean;
      marketing: boolean;
    };
    privacy: {
      showLevel: boolean;
      showBadges: boolean;
    };
  };
  
  // Sécurité
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  blockedUsers: string[];
  
  // Stripe
  stripeCustomerId: string;
  
  // Stats
  stats: {
    bookingsCompleted: number;
    totalHours: number;
    uniquePnjMet: number;
    reviewsGiven: number;
  };
  
  // Admin
  status: 'active' | 'suspended' | 'banned';
  suspendedUntil?: Timestamp;
  suspensionReason?: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}
```

### 5.3 Collection reviews

```typescript
interface Review {
  id: string;
  bookingId: string;
  
  // Participants
  fromUserId: string;
  toUserId: string;
  type: 'player_to_pnj' | 'pnj_to_player';
  
  // Contenu
  rating: number;                   // 1-5
  comment: string;                  // Max 500 chars
  
  // Critères détaillés (optionnel)
  criteria?: {
    punctuality?: number;           // 1-5
    communication?: number;
    friendliness?: number;
    asDescribed?: number;           // Correspondait au profil
  };
  
  // Modération
  status: 'visible' | 'hidden' | 'flagged';
  reportCount: number;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### 5.4 Collection config/activities

```typescript
// Document: /config/activities
interface ActivitiesConfig {
  categories: ActivityCategory[];
}

interface ActivityCategory {
  id: string;
  name: string;                     // "Culture"
  icon: string;                     // "🎭"
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;                     // "Musée"
  description: string;
  suggestedDuration: number;        // Minutes
  priceRange: 'free' | 'low' | 'medium' | 'high';
  indoor: boolean;
  tags: string[];
}
```

Liste initiale des activités :
```yaml
Culture:
  - Musée
  - Expo
  - Théâtre
  - Cinéma
  - Concert
  - Visite guidée

Food & Drink:
  - Restaurant
  - Café
  - Bar (sans alcool ok)
  - Food tour
  - Cours de cuisine
  - Pique-nique

Sport & Outdoor:
  - Balade
  - Randonnée
  - Vélo
  - Course à pied
  - Escalade (salle)
  - Yoga

Gaming & Geek:
  - Jeux de société
  - Jeux vidéo (salle)
  - Convention
  - Escape game
  - Laser game
  - Bowling

Social:
  - Shopping
  - Karaoké
  - After-work
  - Événement networking
  - Repas de famille (accompagnement)
  - Mariage (accompagnement)

Créatif:
  - Atelier peinture
  - Atelier poterie
  - Cours de dessin
  - Photographie
  - Couture
```

---

## 6. Sécurité & Règles Firestore

### 6.1 Principes de sécurité

1. **Least privilege** : Accès minimum nécessaire
2. **Validate everything** : Vérification côté serveur
3. **Trust no client** : Toute donnée client est suspecte
4. **Audit trail** : Logguer les actions sensibles

### 6.2 Règles Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============ HELPERS ============
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isParticipant(participants) {
      return request.auth.uid in participants;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    function isValidUser() {
      return isAuthenticated() 
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'active';
    }
    
    // ============ USERS ============
    
    match /users/{userId} {
      // Lecture : soi-même ou admin
      allow read: if isOwner(userId) || isAdmin();
      
      // Création : soi-même, via Auth trigger
      allow create: if isOwner(userId);
      
      // Update : soi-même, champs limités
      allow update: if isOwner(userId) 
        && !request.resource.data.diff(resource.data).affectedKeys()
            .hasAny(['id', 'email', 'createdAt', 'stripeCustomerId', 'status']);
      
      // Delete : jamais côté client
      allow delete: if false;
      
      // Sous-collections
      match /missions/{missionId} {
        allow read: if isOwner(userId);
        allow write: if false; // Géré par Cloud Functions
      }
      
      match /souvenirs/{souvenirId} {
        allow read: if isOwner(userId);
        allow write: if false; // Géré par Cloud Functions
      }
      
      match /notifications/{notifId} {
        allow read: if isOwner(userId);
        allow update: if isOwner(userId); // Marquer comme lu
        allow create, delete: if false;
      }
    }
    
    // ============ PNJ PROFILES ============
    
    match /pnjProfiles/{profileId} {
      // Lecture : tout user authentifié (pour recherche)
      allow read: if isValidUser();
      
      // Création : si user a role pnj ou both
      allow create: if isValidUser()
        && request.resource.data.userId == request.auth.uid;
      
      // Update : propriétaire uniquement
      allow update: if isValidUser()
        && resource.data.userId == request.auth.uid
        && !request.resource.data.diff(resource.data).affectedKeys()
            .hasAny(['userId', 'createdAt', 'verified', 'rating', 'reviewCount', 'completedBookings']);
      
      allow delete: if false;
    }
    
    // ============ BOOKINGS ============
    
    match /bookings/{bookingId} {
      // Lecture : participant ou admin
      allow read: if isValidUser() 
        && (resource.data.playerId == request.auth.uid 
            || resource.data.pnjId == request.auth.uid
            || isAdmin());
      
      // Création : joueur authentifié
      allow create: if isValidUser()
        && request.resource.data.playerId == request.auth.uid
        && request.resource.data.status == 'pending';
      
      // Update : participant seulement
      allow update: if isValidUser()
        && (resource.data.playerId == request.auth.uid 
            || resource.data.pnjId == request.auth.uid);
      
      allow delete: if false;
    }
    
    // ============ CHATS ============
    
    match /chats/{chatId} {
      allow read: if isValidUser() 
        && isParticipant(resource.data.participants);
      
      allow create: if false; // Créé par Cloud Functions
      
      allow update: if isValidUser()
        && isParticipant(resource.data.participants);
      
      match /messages/{messageId} {
        allow read: if isValidUser()
          && isParticipant(get(/databases/$(database)/documents/chats/$(chatId)).data.participants);
        
        allow create: if isValidUser()
          && isParticipant(get(/databases/$(database)/documents/chats/$(chatId)).data.participants)
          && request.resource.data.senderId == request.auth.uid
          && request.resource.data.type in ['text', 'image'];
        
        allow update: if isValidUser()
          && isParticipant(get(/databases/$(database)/documents/chats/$(chatId)).data.participants);
        
        allow delete: if false;
      }
    }
    
    // ============ REVIEWS ============
    
    match /reviews/{reviewId} {
      allow read: if isValidUser();
      
      allow create: if isValidUser()
        && request.resource.data.fromUserId == request.auth.uid;
      
      allow update, delete: if false;
    }
    
    // ============ REPORTS ============
    
    match /reports/{reportId} {
      allow create: if isValidUser()
        && request.resource.data.reporterId == request.auth.uid;
      
      allow read, update, delete: if isAdmin();
    }
    
    // ============ EMERGENCIES ============
    
    match /emergencies/{emergencyId} {
      allow create: if isValidUser()
        && request.resource.data.triggeredBy == request.auth.uid;
      
      allow read: if isValidUser()
        && resource.data.triggeredBy == request.auth.uid;
      
      allow update, delete: if isAdmin();
    }
    
    // ============ CONFIG (read-only) ============
    
    match /config/{document=**} {
      allow read: if isValidUser();
      allow write: if isAdmin();
    }
    
    match /missionTemplates/{templateId} {
      allow read: if isValidUser();
      allow write: if isAdmin();
    }
  }
}
```

### 6.3 Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidImage() {
      return request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
    
    // Avatars utilisateurs
    match /avatars/{userId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
    }
    
    // Photos PNJ
    match /pnj-photos/{userId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
    }
    
    // Images chat
    match /chat-images/{chatId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isValidImage();
    }
  }
}
```

---

## 7. Intégrations externes

### 7.1 Stripe Connect

#### Setup
1. Créer compte Stripe
2. Activer Stripe Connect (Standard ou Express)
3. Configurer webhooks

#### Flow onboarding PNJ
```
1. PNJ clique "Recevoir mes paiements"
2. Appel Cloud Function → crée Stripe Connect Account
3. Redirect vers Stripe Onboarding
4. Stripe callback → màj pnjProfile.stripeConnectId
5. PNJ peut maintenant recevoir des paiements
```

#### Flow paiement booking
```
1. Joueur confirme booking
2. Client appel Cloud Function createPaymentIntent
3. Function crée PaymentIntent avec:
   - amount: totalPrice
   - application_fee_amount: platformFee
   - transfer_data.destination: pnj.stripeConnectId
4. Client affiche Stripe Payment Sheet
5. Paiement réussi → webhook payment_intent.succeeded
6. Function update booking (status: paid)
```

#### Webhooks à gérer
| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Màj booking → paid, notifier |
| `payment_intent.payment_failed` | Notifier joueur, retry |
| `charge.refunded` | Màj booking, notifier |
| `account.updated` | Sync statut compte PNJ |

### 7.2 Google Maps Platform

#### APIs nécessaires
- **Maps SDK** : Affichage carte
- **Places API** : Autocomplete lieux
- **Geocoding API** : Coordonnées ↔ Adresse

#### Restrictions recommandées
- Limiter aux apps iOS/Android via fingerprint
- Quotas : 10,000 requêtes/jour (largement suffisant MVP)

### 7.3 Firebase Cloud Messaging (Push)

#### Types de notifications
| Trigger | Destinataire | Contenu |
|---------|--------------|---------|
| Nouvelle demande booking | PNJ | "Nouvelle demande de [Joueur]" |
| Booking confirmé | Joueur | "[PNJ] a accepté !" |
| Booking payé | PNJ | "Paiement reçu pour [date]" |
| Rappel J-1 | Les deux | "RDV demain à [heure]" |
| Rappel H-1 | Les deux | "RDV dans 1h à [lieu]" |
| Nouveau message | Destinataire | "[Nom]: [preview message]" |
| Review reçue | PNJ | "Nouvelle évaluation !" |
| Mission complétée | Joueur | "Mission accomplie ! +[XP] XP" |
| Level up | User | "Niveau [X] atteint !" |

---

## 8. Structure du projet

### 8.1 Arborescence complète

```
pnj-premium/
├── app/                                # Expo Router
│   ├── (auth)/                         # Routes auth (non connecté)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                   # Welcome/Splash
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── role-choice.tsx
│   │   ├── onboarding-player/
│   │   │   ├── _layout.tsx
│   │   │   ├── step1.tsx
│   │   │   ├── step2.tsx
│   │   │   └── step3.tsx
│   │   └── onboarding-pnj/
│   │       ├── _layout.tsx
│   │       ├── step1.tsx
│   │       ├── step2.tsx
│   │       ├── step3.tsx
│   │       ├── step4.tsx
│   │       └── step5.tsx
│   │
│   ├── (player)/                       # Routes joueur (tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                   # Home/Dashboard
│   │   ├── search/
│   │   │   ├── index.tsx
│   │   │   └── map.tsx
│   │   ├── pnj/
│   │   │   └── [id].tsx
│   │   ├── book/
│   │   │   ├── [pnjId].tsx
│   │   │   └── confirm/[id].tsx
│   │   ├── missions/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── collection/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile.tsx
│   │
│   ├── (pnj)/                          # Routes PNJ (tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                   # Dashboard
│   │   ├── requests.tsx
│   │   ├── calendar.tsx
│   │   ├── earnings.tsx
│   │   ├── profile/
│   │   │   ├── index.tsx
│   │   │   ├── edit.tsx
│   │   │   └── preview.tsx
│   │   └── stats.tsx
│   │
│   ├── (shared)/                       # Routes communes
│   │   ├── _layout.tsx
│   │   ├── booking/[id].tsx
│   │   ├── chats/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── settings/
│   │   │   ├── index.tsx
│   │   │   ├── account.tsx
│   │   │   ├── notifications.tsx
│   │   │   ├── security.tsx
│   │   │   └── help.tsx
│   │   ├── report.tsx
│   │   └── emergency.tsx
│   │
│   ├── _layout.tsx
│   └── +not-found.tsx
│
├── components/
│   ├── ui/                             # Composants UI génériques
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingState.tsx
│   │
│   ├── game/                           # Composants gamification
│   │   ├── XPBar.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── MissionCard.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── ClassIcon.tsx
│   │   ├── LevelUpModal.tsx
│   │   └── RewardAnimation.tsx
│   │
│   ├── cards/                          # Cards spécialisées
│   │   ├── PNJCard.tsx
│   │   ├── PNJCardCompact.tsx
│   │   ├── BookingCard.tsx
│   │   ├── SouvenirCard.tsx
│   │   ├── ChatPreviewCard.tsx
│   │   └── ReviewCard.tsx
│   │
│   ├── forms/                          # Formulaires
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── PNJProfileForm.tsx
│   │   ├── BookingForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReportForm.tsx
│   │
│   ├── maps/                           # Composants carte
│   │   ├── MapView.tsx
│   │   ├── PNJMarker.tsx
│   │   └── PlacePicker.tsx
│   │
│   ├── chat/                           # Composants chat
│   │   ├── MessageBubble.tsx
│   │   ├── SystemMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── ImageMessage.tsx
│   │
│   └── layout/                         # Layout components
│       ├── Header.tsx
│       ├── TabBar.tsx
│       ├── SafeArea.tsx
│       └── KeyboardAvoid.tsx
│
├── hooks/
│   ├── queries/                        # TanStack Query
│   │   ├── useUser.ts
│   │   ├── usePNJProfile.ts
│   │   ├── usePNJList.ts
│   │   ├── useBooking.ts
│   │   ├── useBookings.ts
│   │   ├── useMissions.ts
│   │   ├── useSouvenirs.ts
│   │   ├── useReviews.ts
│   │   └── useChats.ts
│   │
│   ├── mutations/                      # Mutations
│   │   ├── useCreateBooking.ts
│   │   ├── useUpdateBooking.ts
│   │   ├── useUpdateProfile.ts
│   │   ├── useSendMessage.ts
│   │   ├── useCreateReview.ts
│   │   └── useCreateReport.ts
│   │
│   ├── subscriptions/                  # Real-time
│   │   ├── useChatMessages.ts
│   │   ├── useBookingUpdates.ts
│   │   └── useNotifications.ts
│   │
│   └── utils/                          # Utility hooks
│       ├── useAuth.ts
│       ├── useLocation.ts
│       ├── useImagePicker.ts
│       ├── useDebounce.ts
│       └── useKeyboard.ts
│
├── services/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── storage.ts
│   │
│   ├── api/
│   │   ├── users.ts
│   │   ├── pnj.ts
│   │   ├── bookings.ts
│   │   ├── chats.ts
│   │   ├── missions.ts
│   │   └── payments.ts
│   │
│   └── external/
│       ├── stripe.ts
│       ├── maps.ts
│       └── notifications.ts
│
├── stores/                             # Zustand
│   ├── authStore.ts
│   ├── gameStore.ts
│   ├── uiStore.ts
│   ├── locationStore.ts
│   └── filterStore.ts
│
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── analytics.ts
│
├── types/
│   ├── user.ts
│   ├── pnj.ts
│   ├── booking.ts
│   ├── chat.ts
│   ├── mission.ts
│   ├── review.ts
│   └── navigation.ts
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── index.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── animations/                     # Lottie
│   └── fonts/
│
├── functions/                          # Cloud Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── auth/
│   │   │   └── onUserCreate.ts
│   │   ├── bookings/
│   │   │   ├── onCreate.ts
│   │   │   ├── onUpdate.ts
│   │   │   └── onComplete.ts
│   │   ├── missions/
│   │   │   ├── daily.ts
│   │   │   └── complete.ts
│   │   ├── payments/
│   │   │   └── stripeWebhook.ts
│   │   ├── notifications/
│   │   │   └── send.ts
│   │   └── emergency/
│   │       └── trigger.ts
│   ├── package.json
│   └── tsconfig.json
│
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 9. Design System

### 9.1 Couleurs

```typescript
export const colors = {
  // Primary - Violet gaming
  primary: {
    50: '#f3f0ff',
    100: '#e5dbff',
    200: '#d0bfff',
    300: '#b197fc',
    400: '#9775fa',
    500: '#845ef7',  // Main
    600: '#7950f2',
    700: '#7048e8',
    800: '#6741d9',
    900: '#5f3dc4',
  },
  
  // Secondary - Cyan/Teal
  secondary: {
    50: '#e6fcf5',
    100: '#c3fae8',
    200: '#96f2d7',
    300: '#63e6be',
    400: '#38d9a9',
    500: '#20c997',  // Main
    600: '#12b886',
    700: '#0ca678',
    800: '#099268',
    900: '#087f5b',
  },
  
  // Background - Dark theme
  bg: {
    primary: '#0f0f1a',
    secondary: '#1a1a2e',
    tertiary: '#252542',
    elevated: '#2d2d4a',
  },
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a0a0b8',
    tertiary: '#6c6c80',
    inverse: '#0f0f1a',
  },
  
  // Status
  success: '#51cf66',
  warning: '#fcc419',
  error: '#ff6b6b',
  info: '#339af0',
  
  // Classes PNJ
  classes: {
    adventurer: '#ff6b6b',
    sage: '#339af0',
    bard: '#fcc419',
    tank: '#868e96',
    foodie: '#ff922b',
    geek: '#845ef7',
    artist: '#f06595',
    coach: '#51cf66',
  },
  
  // Rarity
  rarity: {
    classic: '#868e96',
    rare: '#339af0',
    epic: '#845ef7',
    legendary: '#fcc419',
  },
};
```

### 9.2 Typography

```typescript
export const typography = {
  fonts: {
    heading: 'SpaceGrotesk-Bold',
    body: 'Inter-Regular',
    bodyMedium: 'Inter-Medium',
    bodySemiBold: 'Inter-SemiBold',
    mono: 'JetBrainsMono-Regular',
  },
  
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
};

export const textStyles = {
  h1: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 36, lineHeight: 43 },
  h2: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 30, lineHeight: 36 },
  h3: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, lineHeight: 29 },
  h4: { fontFamily: 'Inter-SemiBold', fontSize: 20, lineHeight: 24 },
  body: { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: 'Inter-Medium', fontSize: 12, lineHeight: 16 },
  button: { fontFamily: 'Inter-SemiBold', fontSize: 16, lineHeight: 24 },
};
```

### 9.3 Spacing & Layout

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
```

### 9.4 Iconographie

Utiliser **Lucide Icons** (lucide-react-native).

```typescript
export const classIcons = {
  adventurer: 'sword',
  sage: 'book-open',
  bard: 'music',
  tank: 'shield',
  foodie: 'utensils',
  geek: 'gamepad-2',
  artist: 'palette',
  coach: 'dumbbell',
};
```

---

## 10. Checklist de développement

### Phase 0 : Setup (Semaine 1)

#### Environnement
- [ ] Créer repo Git
- [ ] Init projet Expo (`npx create-expo-app`)
- [ ] Configurer TypeScript strict
- [ ] Setup ESLint + Prettier
- [ ] Configurer Husky (pre-commit hooks)
- [ ] Créer structure de dossiers

#### Firebase
- [ ] Créer projet Firebase Console
- [ ] Activer Authentication (Email, Google, Apple)
- [ ] Créer base Firestore (mode test)
- [ ] Créer bucket Storage (mode test)
- [ ] Installer SDK Firebase
- [ ] Configurer `google-services.json` (Android)
- [ ] Configurer `GoogleService-Info.plist` (iOS)
- [ ] Tester connexion Firebase

#### Stripe
- [ ] Créer compte Stripe
- [ ] Activer Stripe Connect
- [ ] Récupérer clés API (test)
- [ ] Installer `@stripe/stripe-react-native`

#### EAS Build
- [ ] Créer compte Expo
- [ ] Configurer `eas.json`
- [ ] Premier build development

---

### Phase 1 : Auth & Base (Semaine 2-3)

#### Authentication
- [ ] Écran Welcome
- [ ] Écran Login (email/password + OAuth)
- [ ] Écran Register
- [ ] Écran Forgot Password
- [ ] Écran Role Choice
- [ ] Persistance session
- [ ] Auth guard
- [ ] Cloud Function `onUserCreate`

#### Store & State
- [ ] Setup Zustand stores (auth, ui)
- [ ] Setup TanStack Query + useUser hook

#### Design System Base
- [ ] Configurer theme
- [ ] Composant Button
- [ ] Composant Input
- [ ] Composant Avatar
- [ ] Composant LoadingState / ErrorState

---

### Phase 2 : Profil PNJ (Semaine 4-5)

#### Onboarding PNJ
- [ ] Step 1 : Infos de base
- [ ] Step 2 : Classe & Activités
- [ ] Step 3 : Tarif & Localisation
- [ ] Step 4 : Photos
- [ ] Step 5 : Disponibilités
- [ ] Step 6 : Stripe Connect
- [ ] Création document `/pnjProfiles/{id}`

#### Dashboard & Gestion PNJ
- [ ] Dashboard stats
- [ ] Vue/édition profil
- [ ] Gestion disponibilités
- [ ] Preview mode

---

### Phase 3 : Recherche (Semaine 6-7)

#### Home Joueur
- [ ] Dashboard gamifié
- [ ] Missions preview
- [ ] PNJ suggérés

#### Recherche
- [ ] Liste PNJ + PNJCard
- [ ] Filtres complets
- [ ] Tri
- [ ] Vue carte (Google Maps)
- [ ] Profil PNJ détaillé

---

### Phase 4 : Booking (Semaine 8-10)

#### Flow Réservation
- [ ] Step 1 : Choix activité
- [ ] Step 2 : Choix date/créneau
- [ ] Step 3 : Lieu (Places Autocomplete)
- [ ] Step 4 : Récap + paiement

#### Paiement
- [ ] Intégration Stripe Payment Sheet
- [ ] Apple Pay / Google Pay
- [ ] Écran confirmation

#### Cloud Functions Booking
- [ ] `onBookingCreate`
- [ ] `stripeWebhook`
- [ ] `onBookingUpdate`

#### Gestion Booking
- [ ] Liste (PNJ + Joueur)
- [ ] Accepter/Refuser (PNJ)
- [ ] Annuler
- [ ] Check-in/out
- [ ] Reviews

---

### Phase 5 : Chat (Semaine 11)

- [ ] Chat List
- [ ] Chat Room (temps réel)
- [ ] Messages système
- [ ] Envoi images
- [ ] Modération mots-clés
- [ ] Push notifications

---

### Phase 6 : Gamification (Semaine 12-13)

#### Missions
- [ ] Écran liste missions
- [ ] MissionCard + détail
- [ ] Cloud Function `dailyMissions`
- [ ] Cloud Function `onMissionComplete`

#### Progression
- [ ] XPBar + LevelBadge
- [ ] LevelUpModal

#### Collection
- [ ] Galerie souvenirs
- [ ] SouvenirCard (trading card style)
- [ ] Cloud Function génération auto

---

### Phase 7 : Sécurité (Semaine 14)

- [ ] Bouton urgence + flow
- [ ] Contact d'urgence (settings)
- [ ] Signalement
- [ ] Règles Firestore (production)
- [ ] Storage Rules

---

### Phase 8 : Polish (Semaine 15-16)

- [ ] Loading/Error/Empty states partout
- [ ] Animations transitions
- [ ] Tests unitaires
- [ ] Tests E2E (auth, booking)
- [ ] Audit performance
- [ ] Accessibilité

---

### Phase 9 : Pre-launch (Semaine 17)

- [ ] Projet Firebase prod
- [ ] Stripe live
- [ ] Règles Firestore strictes
- [ ] Screenshots App Store
- [ ] Build production
- [ ] Soumission TestFlight + Play Store
- [ ] CGU / Politique confidentialité
- [ ] Beta testeurs (50-100)

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| **Joueur** | Utilisateur qui réserve des PNJ |
| **PNJ** | Prestataire de compagnie |
| **Booking** | Réservation d'une session |
| **Souvenir** | Carte collection post-booking |
| **Mission** | Objectif pour gagner de l'XP |
| **Classe** | Spécialité d'un PNJ |

### B. Estimation timeline

| Phase | Durée |
|-------|-------|
| Setup | 1 semaine |
| Auth & Base | 2 semaines |
| Profil PNJ | 2 semaines |
| Recherche | 2 semaines |
| Booking | 3 semaines |
| Chat | 1 semaine |
| Gamification | 2 semaines |
| Sécurité | 1 semaine |
| Polish | 2 semaines |
| Pre-launch | 1 semaine |
| **Total** | **~17 semaines (~4 mois)** |

### C. Risques identifiés

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Stripe Connect complexité | Haut | Commencer tôt |
| Modération chat | Moyen | Règles simples MVP |
| Acquisition PNJ | Haut | Incentives early adopters |
| Rejet App Store | Moyen | CGU claires |

---

*Document généré le 21/01/2026 - Version 1.0*
