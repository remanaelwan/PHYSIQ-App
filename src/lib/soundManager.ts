/**
 * PhysIQ Audio & Haptics Engine
 * Inspired by Apple VisionOS, watchOS, WHOOP, Oura Ring & Tesla UI.
 * Pure Web Audio API Synthesizer with zero latency, 48kHz clarity,
 * smooth exponential envelopes, and native platform haptic feedback.
 */

export type SoundId =
  // App
  | 'app_launch'
  | 'splash_reveal'
  | 'login_success'
  | 'logout'
  | 'account_created'
  | 'error'
  | 'warning'
  | 'success'
  | 'notification'
  | 'achievement'
  | 'daily_goal_completed'
  // Navigation
  | 'tab_change'
  | 'screen_transition'
  | 'back'
  | 'open_menu'
  | 'close_menu'
  | 'bottom_sheet_open'
  | 'bottom_sheet_close'
  // Buttons
  | 'button_primary'
  | 'button_secondary'
  | 'button_glass'
  | 'button_click'
  | 'like'
  | 'save'
  | 'workout_finished'
  | 'toggle_on'
  | 'toggle_off'
  | 'switch'
  | 'checkbox'
  | 'radio_button'
  // Body Screen
  | 'muscle_selected'
  | 'recovery_updated'
  | 'heatmap_changed'
  | 'recovery_timeline_slider'
  | 'muscle_search'
  | 'category_selected'
  // Workout
  | 'start_workout'
  | 'pause'
  | 'resume'
  | 'finish_workout'
  | 'rest_timer_start'
  | 'rest_complete'
  | 'exercise_completed'
  | 'personal_record'
  | 'workout_saved'
  // Nutrition
  | 'meal_added'
  | 'food_deleted'
  | 'barcode_scanned'
  | 'calories_updated'
  | 'water_added'
  | 'nutrition_goal_reached'
  // Profile
  | 'avatar_changed'
  | 'settings_saved'
  | 'theme_changed'
  // AI
  | 'ai_thinking'
  | 'ai_response_appears'
  | 'ai_insight_generated'
  | 'recommendation_ready'
  // Notifications
  | 'reminder'
  | 'recovery_alert'
  | 'workout_reminder'
  | 'water_reminder'
  | 'sleep_reminder'
  // Animations
  | 'card_expand'
  | 'card_collapse'
  | 'liquid_morph'
  | 'glass_transition'
  | 'floating_elements'
  | 'progress_ring'
  | 'circular_progress'
  | 'recovery_ring'
  | 'number_counter'
  | 'fade_in'
  | 'fade_out';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  hapticsEnabled: boolean;
}

const SETTINGS_KEY = 'physiq_sound_settings_v1';

const defaultSettings: SoundSettings = {
  enabled: true,
  volume: 0.8,
  hapticsEnabled: true,
};

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private settings: SoundSettings;
  private lastPlayTime: Map<string, number> = new Map();

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): SoundSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return defaultSettings;
  }

  public saveSettings(newSettings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  public isMutedState(): boolean {
    return !this.settings.enabled;
  }

  public setMuted(muted: boolean) {
    this.saveSettings({ enabled: !muted });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Pre-warm AudioContext on first user interaction
   */
  public initOnInteraction() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Play native haptic feedback
   */
  public triggerHaptic(type: HapticType = 'selection') {
    if (!this.settings.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }
    try {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(6);
          break;
        case 'medium':
          navigator.vibrate(14);
          break;
        case 'heavy':
          navigator.vibrate(24);
          break;
        case 'success':
          navigator.vibrate([8, 40, 12]);
          break;
        case 'warning':
          navigator.vibrate([16, 50, 16]);
          break;
        case 'error':
          navigator.vibrate([24, 40, 24, 40, 24]);
          break;
      }
    } catch {
      // ignore
    }
  }

  /**
   * Core Audio Player using Web Audio API synthesis
   */
  public play(id: SoundId, options?: { pitchMultiplier?: number; customHaptic?: HapticType }) {
    if (!this.settings.enabled || this.settings.volume <= 0) return;

    // Prevent excessive rapid overlapping of identical sound (throttle 25ms)
    const now = Date.now();
    const last = this.lastPlayTime.get(id) || 0;
    if (now - last < 20 && id !== 'number_counter') {
      return;
    }
    this.lastPlayTime.set(id, now);

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const masterVol = this.settings.volume;
    const pitch = options?.pitchMultiplier || 1;

    // Play corresponding synthesized sound curve
    try {
      switch (id) {
        // --- BUTTONS ---
        case 'button_primary':
          this.synthesizeVisionOSTap(ctx, masterVol * 0.45, 820 * pitch, 0.035);
          this.triggerHaptic(options?.customHaptic || 'medium');
          break;

        case 'button_secondary':
          this.synthesizeSoftClick(ctx, masterVol * 0.3, 620 * pitch, 0.025);
          this.triggerHaptic(options?.customHaptic || 'light');
          break;

        case 'button_glass':
          this.synthesizeGlassPing(ctx, masterVol * 0.35, 2400 * pitch, 0.04);
          this.triggerHaptic(options?.customHaptic || 'selection');
          break;

        case 'toggle_on':
          this.synthesizeDualRise(ctx, masterVol * 0.35, 520 * pitch, 980 * pitch, 0.05);
          this.triggerHaptic(options?.customHaptic || 'medium');
          break;

        case 'toggle_off':
          this.synthesizeDualFall(ctx, masterVol * 0.35, 980 * pitch, 520 * pitch, 0.05);
          this.triggerHaptic(options?.customHaptic || 'light');
          break;

        case 'switch':
        case 'checkbox':
        case 'radio_button':
          this.synthesizeSoftClick(ctx, masterVol * 0.35, 1200 * pitch, 0.02);
          this.triggerHaptic(options?.customHaptic || 'selection');
          break;

        // --- NAVIGATION ---
        case 'tab_change':
          this.synthesizeVisionOSTap(ctx, masterVol * 0.35, 1100 * pitch, 0.03);
          this.triggerHaptic(options?.customHaptic || 'selection');
          break;

        case 'screen_transition':
          this.synthesizeAirSwell(ctx, masterVol * 0.2, 400 * pitch, 800 * pitch, 0.08);
          this.triggerHaptic(options?.customHaptic || 'light');
          break;

        case 'back':
          this.synthesizeSoftClick(ctx, masterVol * 0.25, 450 * pitch, 0.03);
          this.triggerHaptic(options?.customHaptic || 'light');
          break;

        case 'open_menu':
        case 'bottom_sheet_open':
          this.synthesizePitchSlide(ctx, masterVol * 0.3, 320 * pitch, 720 * pitch, 0.07);
          this.triggerHaptic(options?.customHaptic || 'medium');
          break;

        case 'close_menu':
        case 'bottom_sheet_close':
          this.synthesizePitchSlide(ctx, masterVol * 0.25, 680 * pitch, 280 * pitch, 0.06);
          this.triggerHaptic(options?.customHaptic || 'light');
          break;

        // --- BODY SCREEN ---
        case 'muscle_selected':
          this.synthesizeWhoopPulse(ctx, masterVol * 0.4, 523.25 * pitch); // C5
          this.triggerHaptic(options?.customHaptic || 'medium');
          break;

        case 'recovery_updated':
        case 'heatmap_changed':
          this.synthesizeChimeChord(ctx, masterVol * 0.35, [440, 554.37, 659.25], 0.15); // A major triad
          this.triggerHaptic(options?.customHaptic || 'success');
          break;

        case 'recovery_timeline_slider':
          this.synthesizeSoftClick(ctx, masterVol * 0.2, 800 * pitch, 0.015);
          this.triggerHaptic('selection');
          break;

        case 'muscle_search':
        case 'category_selected':
          this.synthesizeVisionOSTap(ctx, masterVol * 0.3, 950 * pitch, 0.025);
          this.triggerHaptic('selection');
          break;

        // --- WORKOUT ---
        case 'start_workout':
          this.synthesizeDeepEmpowerment(ctx, masterVol * 0.5);
          this.triggerHaptic(options?.customHaptic || 'heavy');
          break;

        case 'pause':
          this.synthesizeDualPop(ctx, masterVol * 0.35, 600, 600, 0.08);
          this.triggerHaptic('medium');
          break;

        case 'resume':
          this.synthesizeDualRise(ctx, masterVol * 0.35, 400, 800, 0.08);
          this.triggerHaptic('medium');
          break;

        case 'finish_workout':
        case 'achievement':
        case 'personal_record':
          this.synthesizeGrandChime(ctx, masterVol * 0.5);
          this.triggerHaptic(options?.customHaptic || 'success');
          break;

        case 'rest_timer_start':
          this.synthesizeGlassPing(ctx, masterVol * 0.35, 1200 * pitch, 0.06);
          this.triggerHaptic('light');
          break;

        case 'rest_complete':
          this.synthesizeChimeChord(ctx, masterVol * 0.45, [523.25, 659.25, 783.99, 1046.5], 0.3);
          this.triggerHaptic('heavy');
          break;

        case 'exercise_completed':
        case 'workout_saved':
          this.synthesizeChimeChord(ctx, masterVol * 0.4, [523.25, 659.25, 783.99], 0.2);
          this.triggerHaptic('success');
          break;

        // --- NUTRITION ---
        case 'meal_added':
          this.synthesizeGlassPing(ctx, masterVol * 0.35, 1600 * pitch, 0.08);
          this.triggerHaptic('medium');
          break;

        case 'food_deleted':
          this.synthesizeSoftClick(ctx, masterVol * 0.25, 380 * pitch, 0.04);
          this.triggerHaptic('light');
          break;

        case 'barcode_scanned':
          this.synthesizeGlassPing(ctx, masterVol * 0.4, 2200 * pitch, 0.03);
          this.triggerHaptic('medium');
          break;

        case 'calories_updated':
        case 'number_counter':
          this.synthesizeSoftClick(ctx, masterVol * 0.15, 1200 * pitch, 0.012);
          this.triggerHaptic('selection');
          break;

        case 'water_added':
          this.synthesizeDroplet(ctx, masterVol * 0.45);
          this.triggerHaptic('medium');
          break;

        case 'nutrition_goal_reached':
        case 'daily_goal_completed':
          this.synthesizeGrandChime(ctx, masterVol * 0.45);
          this.triggerHaptic('success');
          break;

        // --- PROFILE ---
        case 'avatar_changed':
          this.synthesizeVisionOSTap(ctx, masterVol * 0.35, 1400 * pitch, 0.04);
          this.triggerHaptic('medium');
          break;

        case 'settings_saved':
          this.synthesizeChimeChord(ctx, masterVol * 0.35, [587.33, 880], 0.12);
          this.triggerHaptic('success');
          break;

        case 'theme_changed':
          this.synthesizeAirSwell(ctx, masterVol * 0.25, 300, 900, 0.15);
          this.triggerHaptic('medium');
          break;

        // --- AI & NOTIFICATIONS ---
        case 'ai_thinking':
          this.synthesizeAirSwell(ctx, masterVol * 0.15, 600, 1200, 0.2);
          break;

        case 'ai_response_appears':
        case 'ai_insight_generated':
        case 'recommendation_ready':
          this.synthesizeChimeChord(ctx, masterVol * 0.4, [659.25, 830.61, 987.77, 1318.51], 0.25); // E major 7th shimmer
          this.triggerHaptic('success');
          break;

        case 'reminder':
        case 'workout_reminder':
        case 'water_reminder':
        case 'recovery_alert':
          this.synthesizeChimeChord(ctx, masterVol * 0.35, [659.25, 987.77], 0.18);
          this.triggerHaptic('medium');
          break;

        case 'sleep_reminder':
          this.synthesizeChimeChord(ctx, masterVol * 0.3, [261.63, 329.63, 392.00], 0.4); // Warm calm C major
          this.triggerHaptic('light');
          break;

        // --- APP & ANIMATIONS ---
        case 'app_launch':
        case 'splash_reveal':
          this.synthesizeAppLaunchSwell(ctx, masterVol * 0.5);
          this.triggerHaptic('heavy');
          break;

        case 'login_success':
        case 'account_created':
          this.synthesizeGrandChime(ctx, masterVol * 0.45);
          this.triggerHaptic('success');
          break;

        case 'logout':
          this.synthesizePitchSlide(ctx, masterVol * 0.25, 800, 300, 0.1);
          this.triggerHaptic('light');
          break;

        case 'error':
          this.synthesizeDualPop(ctx, masterVol * 0.4, 180, 140, 0.12);
          this.triggerHaptic('error');
          break;

        case 'warning':
          this.synthesizeDualPop(ctx, masterVol * 0.35, 440, 349.23, 0.1);
          this.triggerHaptic('warning');
          break;

        case 'success':
          this.synthesizeChimeChord(ctx, masterVol * 0.38, [523.25, 659.25, 783.99], 0.18);
          this.triggerHaptic('success');
          break;

        case 'card_expand':
        case 'liquid_morph':
        case 'glass_transition':
        case 'floating_elements':
          this.synthesizePitchSlide(ctx, masterVol * 0.2, 400, 650, 0.05);
          this.triggerHaptic('light');
          break;

        case 'card_collapse':
        case 'fade_out':
          this.synthesizePitchSlide(ctx, masterVol * 0.2, 600, 380, 0.05);
          this.triggerHaptic('light');
          break;

        case 'progress_ring':
        case 'circular_progress':
        case 'recovery_ring':
          this.synthesizeSoftClick(ctx, masterVol * 0.2, 1000 * pitch, 0.02);
          this.triggerHaptic('selection');
          break;

        default:
          this.synthesizeVisionOSTap(ctx, masterVol * 0.3, 800, 0.03);
          this.triggerHaptic('selection');
          break;
      }
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // ==========================================
  // SYNTHESIS BUILDING BLOCKS (Pure Web Audio)
  // ==========================================

  /**
   * VisionOS Organic Glass Tap (Sine + gentle lowpass + fast decay)
   */
  private synthesizeVisionOSTap(ctx: AudioContext, vol: number, freq: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Soft lowpass warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.8, ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.003); // Soft 3ms attack
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  /**
   * Soft Micro Click
   */
  private synthesizeSoftClick(ctx: AudioContext, vol: number, freq: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.005);
  }

  /**
   * Glass Ping (Crystal High Resonance)
   */
  private synthesizeGlassPing(ctx: AudioContext, vol: number, freq: number, duration: number) {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, ctx.currentTime); // Subtle harmonic detune

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
    osc2.stop(ctx.currentTime + duration + 0.01);
  }

  /**
   * WHOOP/Tesla Sub-Bass + High Ring Pulse
   */
  private synthesizeWhoopPulse(ctx: AudioContext, vol: number, mainFreq: number) {
    const now = ctx.currentTime;

    // Sub thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

    subGain.gain.setValueAtTime(vol * 0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.09);

    // High crystal ring
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(mainFreq, now);

    ringGain.gain.setValueAtTime(0.001, now);
    ringGain.gain.linearRampToValueAtTime(vol * 0.5, now + 0.005);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    ringOsc.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringOsc.start(now);
    ringOsc.stop(now + 0.13);
  }

  /**
   * Pitch Slide / Morph
   */
  private synthesizePitchSlide(ctx: AudioContext, vol: number, startFreq: number, endFreq: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 20), ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  /**
   * Dual Step Rise
   */
  private synthesizeDualRise(
    ctx: AudioContext,
    vol: number,
    f1: number,
    f2: number,
    durationPerStep: number
  ) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f1, now);
    osc.frequency.setValueAtTime(f2, now + durationPerStep);

    gain.gain.setValueAtTime(vol * 0.8, now);
    gain.gain.setValueAtTime(vol, now + durationPerStep);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationPerStep * 2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationPerStep * 2 + 0.01);
  }

  /**
   * Dual Step Fall
   */
  private synthesizeDualFall(
    ctx: AudioContext,
    vol: number,
    f1: number,
    f2: number,
    durationPerStep: number
  ) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f1, now);
    osc.frequency.setValueAtTime(f2, now + durationPerStep);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.setValueAtTime(vol * 0.7, now + durationPerStep);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationPerStep * 2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationPerStep * 2 + 0.01);
  }

  /**
   * Dual Pop
   */
  private synthesizeDualPop(ctx: AudioContext, vol: number, f1: number, f2: number, totalDur: number) {
    const now = ctx.currentTime;
    const half = totalDur * 0.5;

    this.synthesizeSoftClick(ctx, vol, f1, half);
    setTimeout(() => {
      if (this.audioCtx) {
        this.synthesizeSoftClick(this.audioCtx, vol * 0.8, f2, half);
      }
    }, half * 1000);
  }

  /**
   * Harmonic Chime Chord (Harmonic Bloom)
   */
  private synthesizeChimeChord(ctx: AudioContext, vol: number, frequencies: number[], duration: number) {
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035); // Arpeggiated micro-delay

      gain.gain.setValueAtTime(0.001, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(vol / frequencies.length, now + idx * 0.035 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + duration + 0.01);
    });
  }

  /**
   * Water Droplet Sound
   */
  private synthesizeDroplet(ctx: AudioContext, vol: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Air Swell
   */
  private synthesizeAirSwell(ctx: AudioContext, vol: number, fStart: number, fEnd: number, duration: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(fStart, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(fEnd * 2, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /**
   * Deep Empowerment (Workout Start)
   */
  private synthesizeDeepEmpowerment(ctx: AudioContext, vol: number) {
    const now = ctx.currentTime;

    // Sub rumble
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.5);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(vol * 0.8, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.52);

    // Warm chord bloom: C4 -> G4 -> C5
    this.synthesizeChimeChord(ctx, vol * 0.7, [261.63, 392.00, 523.25], 0.45);
  }

  /**
   * Grand Chime (Achievement / Finish Workout / Goal Reached)
   */
  private synthesizeGrandChime(ctx: AudioContext, vol: number) {
    // Rich Apple VisionOS celebratory shimmer chord: C5 - E5 - G5 - B5 - D6
    this.synthesizeChimeChord(ctx, vol, [523.25, 659.25, 783.99, 987.77, 1174.66], 0.55);
  }

  /**
   * App Launch Swell
   */
  private synthesizeAppLaunchSwell(ctx: AudioContext, vol: number) {
    this.synthesizeAirSwell(ctx, vol * 0.4, 220, 880, 0.3);
    this.synthesizeChimeChord(ctx, vol * 0.6, [440, 554.37, 659.25, 880], 0.5);
  }
}

// Global Singleton Instance
export const soundManager = new SoundManager();

/**
 * React Hook for playing sounds easily in components
 */
export function useSoundEffect() {
  const playSound = (id: SoundId, options?: { pitchMultiplier?: number; customHaptic?: HapticType }) => {
    soundManager.play(id, options);
  };

  const triggerHaptic = (type: HapticType = 'selection') => {
    soundManager.triggerHaptic(type);
  };

  return {
    playSound,
    triggerHaptic,
    soundManager,
  };
}
