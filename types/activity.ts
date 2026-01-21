export type PriceRange = 'free' | 'low' | 'medium' | 'high';

export interface Activity {
  id: string;
  name: string;
  description: string;
  suggestedDuration: number; // Minutes
  priceRange: PriceRange;
  indoor: boolean;
  tags: string[];
}

export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  activities: Activity[];
}

export interface ActivitiesConfig {
  categories: ActivityCategory[];
}

// Default activities data
export const DEFAULT_ACTIVITIES: ActivitiesConfig = {
  categories: [
    {
      id: 'culture',
      name: 'Culture',
      icon: '🎭',
      activities: [
        { id: 'museum', name: 'Musée', description: 'Visite de musée', suggestedDuration: 120, priceRange: 'low', indoor: true, tags: ['art', 'histoire'] },
        { id: 'expo', name: 'Expo', description: 'Exposition temporaire', suggestedDuration: 90, priceRange: 'low', indoor: true, tags: ['art'] },
        { id: 'theatre', name: 'Théâtre', description: 'Spectacle de théâtre', suggestedDuration: 150, priceRange: 'medium', indoor: true, tags: ['spectacle'] },
        { id: 'cinema', name: 'Cinéma', description: 'Séance de cinéma', suggestedDuration: 150, priceRange: 'low', indoor: true, tags: ['film'] },
        { id: 'concert', name: 'Concert', description: 'Concert live', suggestedDuration: 180, priceRange: 'medium', indoor: true, tags: ['musique'] },
        { id: 'guided-tour', name: 'Visite guidée', description: 'Visite guidée de la ville', suggestedDuration: 120, priceRange: 'low', indoor: false, tags: ['tourisme'] },
      ],
    },
    {
      id: 'food',
      name: 'Food & Drink',
      icon: '🍽️',
      activities: [
        { id: 'restaurant', name: 'Restaurant', description: 'Repas au restaurant', suggestedDuration: 90, priceRange: 'medium', indoor: true, tags: ['gastronomie'] },
        { id: 'cafe', name: 'Café', description: 'Pause café', suggestedDuration: 60, priceRange: 'low', indoor: true, tags: ['détente'] },
        { id: 'bar', name: 'Bar', description: 'Verre en terrasse', suggestedDuration: 90, priceRange: 'low', indoor: true, tags: ['social'] },
        { id: 'food-tour', name: 'Food tour', description: 'Découverte culinaire', suggestedDuration: 180, priceRange: 'medium', indoor: false, tags: ['gastronomie', 'tourisme'] },
        { id: 'cooking-class', name: 'Cours de cuisine', description: 'Atelier culinaire', suggestedDuration: 180, priceRange: 'high', indoor: true, tags: ['apprentissage'] },
        { id: 'picnic', name: 'Pique-nique', description: 'Pique-nique au parc', suggestedDuration: 120, priceRange: 'free', indoor: false, tags: ['nature', 'détente'] },
      ],
    },
    {
      id: 'sport',
      name: 'Sport & Outdoor',
      icon: '🏃',
      activities: [
        { id: 'walk', name: 'Balade', description: 'Promenade tranquille', suggestedDuration: 90, priceRange: 'free', indoor: false, tags: ['nature'] },
        { id: 'hike', name: 'Randonnée', description: 'Randonnée nature', suggestedDuration: 240, priceRange: 'free', indoor: false, tags: ['nature', 'sport'] },
        { id: 'bike', name: 'Vélo', description: 'Balade à vélo', suggestedDuration: 120, priceRange: 'low', indoor: false, tags: ['sport'] },
        { id: 'running', name: 'Course à pied', description: 'Jogging accompagné', suggestedDuration: 60, priceRange: 'free', indoor: false, tags: ['sport'] },
        { id: 'climbing', name: 'Escalade', description: 'Session escalade en salle', suggestedDuration: 120, priceRange: 'medium', indoor: true, tags: ['sport'] },
        { id: 'yoga', name: 'Yoga', description: 'Session de yoga', suggestedDuration: 60, priceRange: 'low', indoor: true, tags: ['bien-être'] },
      ],
    },
    {
      id: 'gaming',
      name: 'Gaming & Geek',
      icon: '🎮',
      activities: [
        { id: 'board-games', name: 'Jeux de société', description: 'Partie de jeux de société', suggestedDuration: 180, priceRange: 'low', indoor: true, tags: ['jeux'] },
        { id: 'video-games', name: 'Jeux vidéo', description: 'Session gaming', suggestedDuration: 120, priceRange: 'low', indoor: true, tags: ['jeux'] },
        { id: 'convention', name: 'Convention', description: 'Convention geek', suggestedDuration: 240, priceRange: 'medium', indoor: true, tags: ['événement'] },
        { id: 'escape-game', name: 'Escape game', description: 'Escape game en équipe', suggestedDuration: 90, priceRange: 'medium', indoor: true, tags: ['jeux'] },
        { id: 'laser-game', name: 'Laser game', description: 'Partie de laser game', suggestedDuration: 60, priceRange: 'medium', indoor: true, tags: ['jeux', 'sport'] },
        { id: 'bowling', name: 'Bowling', description: 'Partie de bowling', suggestedDuration: 90, priceRange: 'low', indoor: true, tags: ['jeux'] },
      ],
    },
    {
      id: 'social',
      name: 'Social',
      icon: '🤝',
      activities: [
        { id: 'shopping', name: 'Shopping', description: 'Session shopping', suggestedDuration: 180, priceRange: 'free', indoor: true, tags: ['loisirs'] },
        { id: 'karaoke', name: 'Karaoké', description: 'Soirée karaoké', suggestedDuration: 120, priceRange: 'low', indoor: true, tags: ['musique', 'social'] },
        { id: 'afterwork', name: 'After-work', description: 'Détente après le travail', suggestedDuration: 120, priceRange: 'low', indoor: true, tags: ['social'] },
        { id: 'networking', name: 'Networking', description: 'Événement networking', suggestedDuration: 180, priceRange: 'low', indoor: true, tags: ['professionnel'] },
        { id: 'family-dinner', name: 'Repas de famille', description: 'Accompagnement repas de famille', suggestedDuration: 180, priceRange: 'medium', indoor: true, tags: ['accompagnement'] },
        { id: 'wedding', name: 'Mariage', description: 'Accompagnement à un mariage', suggestedDuration: 300, priceRange: 'high', indoor: false, tags: ['événement', 'accompagnement'] },
      ],
    },
    {
      id: 'creative',
      name: 'Créatif',
      icon: '🎨',
      activities: [
        { id: 'painting', name: 'Atelier peinture', description: 'Session peinture créative', suggestedDuration: 180, priceRange: 'medium', indoor: true, tags: ['art'] },
        { id: 'pottery', name: 'Atelier poterie', description: 'Session poterie', suggestedDuration: 180, priceRange: 'medium', indoor: true, tags: ['art'] },
        { id: 'drawing', name: 'Cours de dessin', description: 'Apprentissage du dessin', suggestedDuration: 120, priceRange: 'medium', indoor: true, tags: ['art'] },
        { id: 'photography', name: 'Photographie', description: 'Session photo en ville', suggestedDuration: 180, priceRange: 'free', indoor: false, tags: ['art'] },
        { id: 'sewing', name: 'Couture', description: 'Atelier couture', suggestedDuration: 180, priceRange: 'medium', indoor: true, tags: ['artisanat'] },
      ],
    },
  ],
};

// Helper to get all activities as flat list
export function getAllActivities(): Activity[] {
  return DEFAULT_ACTIVITIES.categories.flatMap(cat => cat.activities);
}

// Helper to find activity by ID
export function getActivityById(id: string): Activity | undefined {
  return getAllActivities().find(a => a.id === id);
}

// Helper to find category by activity ID
export function getCategoryByActivityId(activityId: string): ActivityCategory | undefined {
  return DEFAULT_ACTIVITIES.categories.find(cat =>
    cat.activities.some(a => a.id === activityId)
  );
}
