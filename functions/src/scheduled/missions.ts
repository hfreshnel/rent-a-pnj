import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Mission templates
const DAILY_MISSIONS = [
  {
    type: 'first_booking',
    title: 'Première session',
    description: 'Effectue ta première réservation du jour',
    xpReward: 50,
    target: 1,
  },
  {
    type: 'send_message',
    title: 'Brise la glace',
    description: 'Envoie un message à un PNJ',
    xpReward: 20,
    target: 1,
  },
  {
    type: 'browse_profiles',
    title: 'Explorateur',
    description: 'Consulte 5 profils de PNJ',
    xpReward: 30,
    target: 5,
  },
  {
    type: 'complete_booking',
    title: 'Mission accomplie',
    description: 'Termine une session avec un PNJ',
    xpReward: 100,
    target: 1,
  },
  {
    type: 'leave_review',
    title: 'Critique constructif',
    description: 'Laisse un avis après une session',
    xpReward: 40,
    target: 1,
  },
  {
    type: 'add_favorite',
    title: 'Coup de coeur',
    description: 'Ajoute un PNJ à tes favoris',
    xpReward: 15,
    target: 1,
  },
];

const WEEKLY_MISSIONS = [
  {
    type: 'complete_bookings',
    title: 'Habitué',
    description: 'Termine 3 sessions cette semaine',
    xpReward: 300,
    target: 3,
  },
  {
    type: 'try_new_class',
    title: 'Diversité',
    description: 'Réserve avec une classe de PNJ que tu n\'as jamais essayée',
    xpReward: 200,
    target: 1,
  },
  {
    type: 'spend_amount',
    title: 'Grand mécène',
    description: 'Dépense 100€ en réservations',
    xpReward: 250,
    target: 100,
  },
  {
    type: 'leave_reviews',
    title: 'Guide Michelin',
    description: 'Laisse 3 avis cette semaine',
    xpReward: 150,
    target: 3,
  },
  {
    type: 'consecutive_days',
    title: 'Fidèle',
    description: 'Connecte-toi 5 jours consécutifs',
    xpReward: 100,
    target: 5,
  },
];

/**
 * Assign daily missions to all active users
 * Runs every day at 00:00 UTC
 */
export const assignDailyMissions = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    try {
      // Get all users who have completed onboarding
      const usersSnapshot = await db
        .collection('users')
        .where('onboardingCompleted', '==', true)
        .get();

      const batch = db.batch();
      let batchCount = 0;
      const maxBatchSize = 500;

      for (const userDoc of usersSnapshot.docs) {
        // Randomly select 3 daily missions
        const selectedMissions = shuffleArray([...DAILY_MISSIONS]).slice(0, 3);

        const missions = selectedMissions.map((mission, index) => ({
          id: `daily_${Date.now()}_${index}`,
          ...mission,
          progress: 0,
          completed: false,
          claimed: false,
          expiresAt: getEndOfDay(),
        }));

        batch.update(userDoc.ref, {
          'missions.daily': missions,
          'missions.dailyLastReset': admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        batchCount++;

        // Commit batch if it reaches max size
        if (batchCount >= maxBatchSize) {
          await batch.commit();
          batchCount = 0;
        }
      }

      // Commit remaining batch
      if (batchCount > 0) {
        await batch.commit();
      }

      functions.logger.info(`Daily missions assigned to ${usersSnapshot.size} users`);

      return null;
    } catch (error) {
      functions.logger.error('Error assigning daily missions:', error);
      throw error;
    }
  });

/**
 * Reset weekly missions for all users
 * Runs every Monday at 00:00 UTC
 */
export const resetWeeklyMissions = functions.pubsub
  .schedule('0 0 * * 1')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    try {
      // Get all users who have completed onboarding
      const usersSnapshot = await db
        .collection('users')
        .where('onboardingCompleted', '==', true)
        .get();

      const batch = db.batch();
      let batchCount = 0;
      const maxBatchSize = 500;

      for (const userDoc of usersSnapshot.docs) {
        // Randomly select 2 weekly missions
        const selectedMissions = shuffleArray([...WEEKLY_MISSIONS]).slice(0, 2);

        const missions = selectedMissions.map((mission, index) => ({
          id: `weekly_${Date.now()}_${index}`,
          ...mission,
          progress: 0,
          completed: false,
          claimed: false,
          expiresAt: getEndOfWeek(),
        }));

        batch.update(userDoc.ref, {
          'missions.weekly': missions,
          'missions.weeklyLastReset': admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        batchCount++;

        // Commit batch if it reaches max size
        if (batchCount >= maxBatchSize) {
          await batch.commit();
          batchCount = 0;
        }
      }

      // Commit remaining batch
      if (batchCount > 0) {
        await batch.commit();
      }

      functions.logger.info(`Weekly missions assigned to ${usersSnapshot.size} users`);

      return null;
    } catch (error) {
      functions.logger.error('Error assigning weekly missions:', error);
      throw error;
    }
  });

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get timestamp for end of current day (23:59:59)
 */
function getEndOfDay(): admin.firestore.Timestamp {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return admin.firestore.Timestamp.fromDate(endOfDay);
}

/**
 * Get timestamp for end of current week (Sunday 23:59:59)
 */
function getEndOfWeek(): admin.firestore.Timestamp {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilSunday,
    23,
    59,
    59,
    999
  );
  return admin.firestore.Timestamp.fromDate(endOfWeek);
}
