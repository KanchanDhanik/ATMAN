export type Emotion = 'calm' | 'happy' | 'sad' | 'anxious' | 'excited' | 'neutral';

export interface EmotionAnalysis {
  emotion: Emotion;
  confidence: number;
  features: {
    pitch: number;
    energy: number;
    speechRate: number;
  };
}

export class EmotionDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private pitchHistory: number[] = [];
  private energyHistory: number[] = [];

  async initialize(stream: MediaStream): Promise<void> {
    this.stream = stream;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
  }

  analyzeEmotion(): EmotionAnalysis {
    if (!this.analyser) {
      return {
        emotion: 'neutral',
        confidence: 0,
        features: { pitch: 0, energy: 0, speechRate: 0 }
      };
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeArray = new Uint8Array(bufferLength);
    
    this.analyser.getByteFrequencyData(dataArray);
    this.analyser.getByteTimeDomainData(timeArray);

    // Calculate energy (volume)
    const energy = this.calculateEnergy(dataArray);
    this.energyHistory.push(energy);
    if (this.energyHistory.length > 10) this.energyHistory.shift();

    // Estimate pitch
    const pitch = this.estimatePitch(timeArray);
    this.pitchHistory.push(pitch);
    if (this.pitchHistory.length > 10) this.pitchHistory.shift();

    // Calculate speech rate based on energy variations
    const speechRate = this.calculateSpeechRate();

    // Detect emotion based on features
    const emotion = this.detectEmotion(pitch, energy, speechRate);

    return {
      emotion,
      confidence: this.calculateConfidence(pitch, energy, speechRate),
      features: { pitch, energy, speechRate }
    };
  }

  private calculateEnergy(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / dataArray.length;
  }

  private estimatePitch(timeArray: Uint8Array): number {
    // Simple autocorrelation method for pitch detection
    let max = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < timeArray.length / 2; i++) {
      let sum = 0;
      for (let j = 0; j < timeArray.length / 2; j++) {
        sum += Math.abs(timeArray[j] - timeArray[j + i]);
      }
      if (sum > max) {
        max = sum;
        maxIndex = i;
      }
    }

    const sampleRate = this.audioContext?.sampleRate || 44100;
    return maxIndex > 0 ? sampleRate / maxIndex : 0;
  }

  private calculateSpeechRate(): number {
    if (this.energyHistory.length < 2) return 0;
    
    // Count energy peaks to estimate speech rate
    let peaks = 0;
    const threshold = this.getAverageEnergy() * 1.2;
    
    for (let i = 1; i < this.energyHistory.length - 1; i++) {
      if (this.energyHistory[i] > threshold &&
          this.energyHistory[i] > this.energyHistory[i - 1] &&
          this.energyHistory[i] > this.energyHistory[i + 1]) {
        peaks++;
      }
    }
    
    return peaks;
  }

  private getAverageEnergy(): number {
    if (this.energyHistory.length === 0) return 0;
    return this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
  }

  private getAveragePitch(): number {
    if (this.pitchHistory.length === 0) return 0;
    return this.pitchHistory.reduce((a, b) => a + b, 0) / this.pitchHistory.length;
  }

  private detectEmotion(pitch: number, energy: number, speechRate: number): Emotion {
    const avgPitch = this.getAveragePitch();
    const avgEnergy = this.getAverageEnergy();

    // Emotion detection based on acoustic features
    // High pitch + high energy + fast speech rate = excited
    if (pitch > avgPitch * 1.2 && energy > avgEnergy * 1.3 && speechRate > 3) {
      return 'excited';
    }
    
    // High pitch + moderate energy = happy
    if (pitch > avgPitch * 1.15 && energy > avgEnergy * 1.1) {
      return 'happy';
    }
    
    // Low pitch + low energy + slow speech rate = sad
    if (pitch < avgPitch * 0.85 && energy < avgEnergy * 0.8 && speechRate < 2) {
      return 'sad';
    }
    
    // High pitch variation + high energy = anxious
    if (this.getPitchVariation() > 50 && energy > avgEnergy * 1.2) {
      return 'anxious';
    }
    
    // Low energy + stable pitch = calm
    if (energy < avgEnergy * 0.9 && this.getPitchVariation() < 30) {
      return 'calm';
    }

    return 'neutral';
  }

  private getPitchVariation(): number {
    if (this.pitchHistory.length < 2) return 0;
    
    let sum = 0;
    for (let i = 1; i < this.pitchHistory.length; i++) {
      sum += Math.abs(this.pitchHistory[i] - this.pitchHistory[i - 1]);
    }
    
    return sum / (this.pitchHistory.length - 1);
  }

  private calculateConfidence(pitch: number, energy: number, speechRate: number): number {
    // Simple confidence calculation based on signal quality
    const hasGoodSignal = energy > 20 && pitch > 50;
    return hasGoodSignal ? 0.75 : 0.5;
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.pitchHistory = [];
    this.energyHistory = [];
  }
}

export const getEmotionEmoji = (emotion: Emotion): string => {
  const emojiMap: Record<Emotion, string> = {
    calm: '😌',
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    excited: '🤗',
    neutral: '😐'
  };
  return emojiMap[emotion];
};

export const getEmotionLabel = (emotion: Emotion, language: 'en-US' | 'hi-IN'): string => {
  const labels: Record<Emotion, { 'en-US': string; 'hi-IN': string }> = {
    calm: { 'en-US': 'Calm', 'hi-IN': 'शांत' },
    happy: { 'en-US': 'Happy', 'hi-IN': 'खुश' },
    sad: { 'en-US': 'Sad', 'hi-IN': 'उदास' },
    anxious: { 'en-US': 'Anxious', 'hi-IN': 'चिंतित' },
    excited: { 'en-US': 'Excited', 'hi-IN': 'उत्साहित' },
    neutral: { 'en-US': 'Neutral', 'hi-IN': 'सामान्य' }
  };
  return labels[emotion][language];
};
