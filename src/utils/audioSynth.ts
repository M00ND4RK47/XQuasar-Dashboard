// Web Audio API Speech Synthesizer & Waveform Player for Moderation Panel

let audioCtx: AudioContext | null = null;
let currentOsc: OscillatorNode | null = null;
let currentGain: GainNode | null = null;
let isPlaying = false;
let animationFrameId: number | null = null;

export interface AudioSynthController {
  play: (durationSeconds: number, onProgress: (currentTime: number) => void, onEnded: () => void) => void;
  pause: () => void;
  stop: () => void;
  seek: (timeSeconds: number) => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
}

export function createSynthesizedVoicePlayer(
  onTimeUpdate: (time: number) => void,
  onEnd: () => void
) {
  let startTime = 0;
  let pausedAt = 0;
  let totalDuration = 30;
  let playbackRate = 1.0;
  let volume = 0.8;
  let playingState = false;

  const initCtx = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSynthBurst = () => {
    if (!audioCtx || !playingState) return;

    try {
      const now = audioCtx.currentTime;
      // Speech Formant Oscillators
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Alternate voice pitch (low male / high female voice formants)
      const pitches = [130, 160, 220, 280, 190, 140];
      const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(randomPitch, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 1200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12 * volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {
      // Audio context error fallback
    }
  };

  const tick = () => {
    if (!playingState) return;

    const elapsed = (Date.now() - startTime) / 1000 * playbackRate + pausedAt;
    if (elapsed >= totalDuration) {
      playingState = false;
      onTimeUpdate(totalDuration);
      onEnd();
      return;
    }

    onTimeUpdate(elapsed);

    // Random speech cadences
    if (Math.random() < 0.25) {
      playSynthBurst();
    }

    animationFrameId = requestAnimationFrame(tick);
  };

  return {
    play: (duration: number, currentTime = 0) => {
      initCtx();
      totalDuration = duration;
      pausedAt = currentTime;
      startTime = Date.now();
      playingState = true;
      tick();
    },
    pause: () => {
      playingState = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    },
    stop: () => {
      playingState = false;
      pausedAt = 0;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      onTimeUpdate(0);
    },
    seek: (timeSeconds: number) => {
      pausedAt = Math.max(0, Math.min(timeSeconds, totalDuration));
      startTime = Date.now();
      onTimeUpdate(pausedAt);
    },
    setPlaybackRate: (rate: number) => {
      playbackRate = rate;
    },
    setVolumeLevel: (vol: number) => {
      volume = vol;
    },
  };
}
