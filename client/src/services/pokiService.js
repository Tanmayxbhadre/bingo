import { sounds } from './soundEffects.js';

class PokiService {
  constructor() {
    this.isInitialized = false;
    this.hasAdblock = false;
    this.isPokiEnvironment = false;
  }

  init() {
    if (typeof window === 'undefined') return Promise.resolve();

    if (window.PokiSDK) {
      this.isPokiEnvironment = true;
      try {
        window.PokiSDK.gameLoadingStart();
      } catch (e) {}

      return window.PokiSDK.init()
        .then(() => {
          this.isInitialized = true;
          this.hasAdblock = false;
          try {
            window.PokiSDK.gameLoadingFinished();
          } catch (e) {}
        })
        .catch(() => {
          this.isInitialized = true;
          this.hasAdblock = true;
          try {
            window.PokiSDK.gameLoadingFinished();
          } catch (e) {}
        });
    }

    return Promise.resolve();
  }

  gameplayStart() {
    if (this.isPokiEnvironment && window.PokiSDK && this.isInitialized) {
      try {
        window.PokiSDK.gameplayStart();
      } catch (e) {}
    }
  }

  gameplayStop() {
    if (this.isPokiEnvironment && window.PokiSDK && this.isInitialized) {
      try {
        window.PokiSDK.gameplayStop();
      } catch (e) {}
    }
  }

  commercialBreak() {
    return new Promise((resolve) => {
      if (!this.isPokiEnvironment || !window.PokiSDK || !this.isInitialized) {
        return resolve();
      }

      const wasMuted = sounds.isMuted;
      sounds.setMuted(true);

      window.PokiSDK.commercialBreak()
        .then(() => {
          if (!wasMuted) sounds.setMuted(false);
          resolve();
        })
        .catch(() => {
          if (!wasMuted) sounds.setMuted(false);
          resolve();
        });
    });
  }

  rewardedBreak() {
    return new Promise((resolve) => {
      if (!this.isPokiEnvironment || !window.PokiSDK || !this.isInitialized) {
        return resolve(false);
      }

      const wasMuted = sounds.isMuted;
      sounds.setMuted(true);

      window.PokiSDK.rewardedBreak()
        .then((success) => {
          if (!wasMuted) sounds.setMuted(false);
          resolve(Boolean(success));
        })
        .catch(() => {
          if (!wasMuted) sounds.setMuted(false);
          resolve(false);
        });
    });
  }
}

export const poki = new PokiService();
