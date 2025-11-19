import { Howl } from 'howler';

// Sound effects using Howler.js
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    
    // Using data URIs for simple sound effects (beep tones)
    // In a production app, you'd use actual audio files
    
    this.sounds = {
      // Simple beep for shot
      shot: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume,
        rate: 1.5
      }),
      
      // Hit sound (higher pitch)
      hit: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume * 1.2,
        rate: 2.0
      }),
      
      // Miss sound (lower pitch)
      miss: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume * 0.8,
        rate: 0.8
      }),
      
      // Victory sound
      victory: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume * 1.5,
        rate: 1.2,
        loop: false
      }),
      
      // Defeat sound
      defeat: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume * 1.2,
        rate: 0.5
      }),
      
      // Ship sunk sound
      sunk: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77eeeTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrga=='],
        volume: this.volume * 1.3,
        rate: 1.8
      })
    };
  }

  play(soundName) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
