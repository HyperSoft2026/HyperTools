import { ADMOB_CONFIG } from '../config/admob';

class AdMobService {
  private lastInterstitialTime = 0;
  private lastAppOpenTime = 0;
  private actionCounter = 0;

  /**
   * Checks if device is currently online
   */
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  /**
   * Tracks user actions to trigger frequency-capped interstitial ads
   */
  public registerAction(onTriggerAd?: () => void): void {
    this.actionCounter++;
    const now = Date.now();
    const timeElapsed = now - this.lastInterstitialTime;

    if (
      this.actionCounter >= ADMOB_CONFIG.FREQUENCY.ACTION_COUNT_THRESHOLD &&
      timeElapsed >= ADMOB_CONFIG.FREQUENCY.INTERSTITIAL_MIN_INTERVAL_MS
    ) {
      this.showInterstitial(onTriggerAd);
    }
  }

  /**
   * Shows Interstitial Ad with frequency control
   */
  public showInterstitial(onDismiss?: () => void): void {
    if (!this.isOnline()) {
      if (onDismiss) onDismiss();
      return;
    }

    this.lastInterstitialTime = Date.now();
    this.actionCounter = 0;

    // Check if Native Android AdMob bridge exists
    // @ts-ignore
    if (window.AndroidAdMob?.showInterstitial) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showInterstitial(ADMOB_CONFIG.AD_UNITS.INTERSTITIAL);
      } catch (err) {
        console.warn('AndroidAdMob interstitial error:', err);
      }
      if (onDismiss) onDismiss();
      return;
    }

    // In web preview / PWA context: simulate graceful modal / toast callback
    console.log('[AdMob] Interstitial Ad Shown:', ADMOB_CONFIG.AD_UNITS.INTERSTITIAL);
    if (onDismiss) onDismiss();
  }

  /**
   * Shows Rewarded Ad. Reward is ONLY granted if completed successfully.
   */
  public showRewardedAd(
    onRewardGranted: (amount: number, item: string) => void,
    onDismiss?: () => void
  ): void {
    if (!this.isOnline()) {
      if (onDismiss) onDismiss();
      return;
    }

    // Check if Native Android AdMob bridge exists
    // @ts-ignore
    if (window.AndroidAdMob?.showRewardedAd) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showRewardedAd(
          ADMOB_CONFIG.AD_UNITS.REWARDED,
          (amount: number, item: string) => {
            onRewardGranted(
              amount || ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
              item || ADMOB_CONFIG.REWARD_SETTINGS.ITEM
            );
          }
        );
      } catch (err) {
        console.warn('AndroidAdMob rewarded error:', err);
        if (onDismiss) onDismiss();
      }
      return;
    }

    // Simulated Rewarded Ad for Web / Developer preview
    console.log('[AdMob] Rewarded Ad Triggered:', ADMOB_CONFIG.AD_UNITS.REWARDED);
    // Grant reward upon completion
    onRewardGranted(
      ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
      ADMOB_CONFIG.REWARD_SETTINGS.ITEM
    );
    if (onDismiss) onDismiss();
  }

  /**
   * Shows Rewarded Interstitial Ad
   */
  public showRewardedInterstitial(
    onRewardGranted: (amount: number, item: string) => void,
    onDismiss?: () => void
  ): void {
    if (!this.isOnline()) {
      if (onDismiss) onDismiss();
      return;
    }

    // @ts-ignore
    if (window.AndroidAdMob?.showRewardedInterstitial) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showRewardedInterstitial(
          ADMOB_CONFIG.AD_UNITS.REWARDED_INTERSTITIAL,
          (amount: number, item: string) => {
            onRewardGranted(
              amount || ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
              item || ADMOB_CONFIG.REWARD_SETTINGS.ITEM
            );
          }
        );
      } catch (err) {
        console.warn('AndroidAdMob rewarded interstitial error:', err);
        if (onDismiss) onDismiss();
      }
      return;
    }

    console.log('[AdMob] Rewarded Interstitial Shown:', ADMOB_CONFIG.AD_UNITS.REWARDED_INTERSTITIAL);
    onRewardGranted(
      ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
      ADMOB_CONFIG.REWARD_SETTINGS.ITEM
    );
    if (onDismiss) onDismiss();
  }

  /**
   * Shows App Open Ad on launch or return from background
   */
  public showAppOpenAd(): void {
    if (!this.isOnline()) return;

    const now = Date.now();
    if (now - this.lastAppOpenTime < ADMOB_CONFIG.FREQUENCY.APP_OPEN_MIN_INTERVAL_MS) {
      return;
    }

    this.lastAppOpenTime = now;

    // @ts-ignore
    if (window.AndroidAdMob?.showAppOpenAd) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showAppOpenAd(ADMOB_CONFIG.AD_UNITS.APP_OPEN);
      } catch (err) {
        console.warn('AndroidAdMob App Open error:', err);
      }
      return;
    }

    console.log('[AdMob] App Open Ad Shown:', ADMOB_CONFIG.AD_UNITS.APP_OPEN);
  }
}

export const admobService = new AdMobService();
