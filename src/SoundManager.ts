export class SoundManager {
  private soundEnabled: boolean;

  constructor() {
    this.soundEnabled = false;
  }

  public setSoundEnabled(value: boolean): void {
    this.soundEnabled = value;
  }

  public getSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}
