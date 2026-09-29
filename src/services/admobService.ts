import { ADMOB_CONFIG } from '../config/admob';

/**
 * Centralized AdMob Manager Service for HyperTools (Android)
 * Manages ad lifecycles, frequency capping, state tracking, and offline resilience.
 */
class AdMobService {
  private lastInterstitialTime = 0;
  private lastAppOpenTime = 0;
  private actionCounter = 0;
  private isAdShowing = false;
  private isInToolDetail = false;

  /**
   * Checks if device is currently online
   */
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  /**
   * Updates whether the user is currently inside a tool detail view.
   * App Open Ads will be suppressed while inside active tool detail views.
   */
  public setIsInToolDetail(inTool: boolean): void {
    this.isInToolDetail = inTool;
  }

  /**
   * Returns whether an ad is currently displaying to prevent overlapping ads.
   */
  public isShowingAd(): boolean {
    return this.isAdShowing;
  }

  /**
   * Preloads ads in the background without blocking app execution.
   */
  public preloadAds(): void {
    if (!this.isOnline()) return;

    // @ts-ignore
    if (window.AndroidAdMob?.preloadAds) {
      try {
        // @ts-ignore
        window.AndroidAdMob.preloadAds(ADMOB_CONFIG.AD_UNITS);
      } catch (err) {
        console.warn('[AdMob] Preload error:', err);
      }
    }
  }

  /**
   * Tracks user actions to trigger frequency-capped interstitial ads at natural break points.
   */
  public registerAction(onTriggerAd?: () => void): void {
    if (!this.isOnline() || this.isAdShowing) return;

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
   * Shows Interstitial Ad with frequency control and offline resilience.
   */
  public showInterstitial(onDismiss?: () => void): void {
    // If offline or another ad is currently showing, dismiss immediately without delay
    if (!this.isOnline() || this.isAdShowing) {
      if (onDismiss) onDismiss();
      return;
    }

    this.isAdShowing = true;
    this.lastInterstitialTime = Date.now();
    this.actionCounter = 0;

    const handleDismiss = () => {
      this.isAdShowing = false;
      if (onDismiss) onDismiss();
    };

    // Check if Native Android AdMob bridge exists
    // @ts-ignore
    if (window.AndroidAdMob?.showInterstitial) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showInterstitial(
          ADMOB_CONFIG.AD_UNITS.INTERSTITIAL,
          () => handleDismiss()
        );
      } catch (err) {
        console.warn('[AdMob] AndroidAdMob interstitial error:', err);
        handleDismiss();
      }
      return;
    }

    // Web / Developer preview fallback simulator
    console.log('[AdMob] Interstitial Ad Shown:', ADMOB_CONFIG.AD_UNITS.INTERSTITIAL);
    handleDismiss();
  }

  /**
   * Shows Rewarded Ad. Reward is ONLY granted if completed successfully (onUserEarnedReward).
   */
  public showRewardedAd(
    onRewardGranted: (amount: number, item: string) => void,
    onDismiss?: () => void,
    onError?: (msg: string) => void
  ): void {
    if (!this.isOnline()) {
      if (onError) onError('No internet connection. Please try again when online.');
      if (onDismiss) onDismiss();
      return;
    }

    if (this.isAdShowing) {
      if (onDismiss) onDismiss();
      return;
    }

    this.isAdShowing = true;

    const handleDismiss = () => {
      this.isAdShowing = false;
      if (onDismiss) onDismiss();
    };

    // Check if Native Android AdMob bridge exists
    // @ts-ignore
    if (window.AndroidAdMob?.showRewardedAd) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showRewardedAd(
          ADMOB_CONFIG.AD_UNITS.REWARDED,
          (amount: number, item: string) => {
            // Reward ONLY granted upon verified onUserEarnedReward event
            onRewardGranted(
              amount || ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
              item || ADMOB_CONFIG.REWARD_SETTINGS.ITEM
            );
          },
          () => handleDismiss(),
          (err: any) => {
            console.warn('[AdMob] Rewarded Ad failed:', err);
            if (onError) onError('Failed to load ad. Please try again.');
            handleDismiss();
          }
        );
      } catch (err) {
        console.warn('[AdMob] AndroidAdMob rewarded error:', err);
        if (onError) onError('Rewarded ad error occurred.');
        handleDismiss();
      }
      return;
    }

    // Web / Developer preview simulated Rewarded Ad
    console.log('[AdMob] Rewarded Ad Triggered:', ADMOB_CONFIG.AD_UNITS.REWARDED);
    onRewardGranted(
      ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
      ADMOB_CONFIG.REWARD_SETTINGS.ITEM
    );
    handleDismiss();
  }

  /**
   * Shows Rewarded Interstitial Ad
   */
  public showRewardedInterstitial(
    onRewardGranted: (amount: number, item: string) => void,
    onDismiss?: () => void,
    onError?: (msg: string) => void
  ): void {
    if (!this.isOnline()) {
      if (onError) onError('No internet connection. Please try again when online.');
      if (onDismiss) onDismiss();
      return;
    }

    if (this.isAdShowing) {
      if (onDismiss) onDismiss();
      return;
    }

    this.isAdShowing = true;

    const handleDismiss = () => {
      this.isAdShowing = false;
      if (onDismiss) onDismiss();
    };

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
          },
          () => handleDismiss(),
          (err: any) => {
            console.warn('[AdMob] Rewarded Interstitial failed:', err);
            if (onError) onError('Failed to load ad.');
            handleDismiss();
          }
        );
      } catch (err) {
        console.warn('[AdMob] AndroidAdMob rewarded interstitial error:', err);
        if (onError) onError('Rewarded interstitial error occurred.');
        handleDismiss();
      }
      return;
    }

    console.log('[AdMob] Rewarded Interstitial Shown:', ADMOB_CONFIG.AD_UNITS.REWARDED_INTERSTITIAL);
    onRewardGranted(
      ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT,
      ADMOB_CONFIG.REWARD_SETTINGS.ITEM
    );
    handleDismiss();
  }

  /**
   * Shows App Open Ad on launch or return from background.
   * Strictly frequency capped and suppressed if user is in tool or another ad is active.
   */
  public showAppOpenAd(): void {
    // 1. Must be online
    if (!this.isOnline()) return;

    // 2. Do not show if another ad is active or user is currently inside a tool
    if (this.isAdShowing || this.isInToolDetail) return;

    // 3. Frequency capping check
    const now = Date.now();
    if (now - this.lastAppOpenTime < ADMOB_CONFIG.FREQUENCY.APP_OPEN_MIN_INTERVAL_MS) {
      return;
    }

    this.lastAppOpenTime = now;
    this.isAdShowing = true;

    const handleDismiss = () => {
      this.isAdShowing = false;
    };

    // @ts-ignore
    if (window.AndroidAdMob?.showAppOpenAd) {
      try {
        // @ts-ignore
        window.AndroidAdMob.showAppOpenAd(
          ADMOB_CONFIG.AD_UNITS.APP_OPEN,
          () => handleDismiss()
        );
      } catch (err) {
        console.warn('[AdMob] AndroidAdMob App Open error:', err);
        handleDismiss();
      }
      return;
    }

    console.log('[AdMob] App Open Ad Shown:', ADMOB_CONFIG.AD_UNITS.APP_OPEN);
    handleDismiss();
  }
}

export const admobService = new AdMobService();
