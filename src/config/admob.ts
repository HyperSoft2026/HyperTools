/**
 * Centralized Google AdMob Configuration for HyperTools (Android Platform)
 * 
 * IMPORTANT: All Ad Unit IDs are defined centrally here.
 * Do not duplicate these IDs across multiple files.
 */

export const ADMOB_CONFIG = {
  PLATFORM: 'android',
  APP_ID: 'ca-app-pub-4597781504672473~8031297514',
  
  AD_UNITS: {
    BANNER: 'ca-app-pub-4597781504672473/4889119691',
    INTERSTITIAL: 'ca-app-pub-4597781504672473/4697548001',
    REWARDED_INTERSTITIAL: 'ca-app-pub-4597781504672473/1274317476',
    REWARDED: 'ca-app-pub-4597781504672473/3164974486',
    NATIVE: 'ca-app-pub-4597781504672473/6850077787',
    APP_OPEN: 'ca-app-pub-4597781504672473/6634455363',
  },

  REWARD_SETTINGS: {
    AMOUNT: 1,
    ITEM: 'Unlock',
  },

  // Frequency Control Settings to prevent intrusive ads
  FREQUENCY: {
    INTERSTITIAL_MIN_INTERVAL_MS: 180000, // 3 minutes minimum between interstitials
    APP_OPEN_MIN_INTERVAL_MS: 300000,     // 5 minutes minimum between app open ads
    ACTION_COUNT_THRESHOLD: 4,            // Show interstitial after 4 major actions
  },
};
