import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BodyView, Gender, MuscleDetail } from '../types';
import { Sparkles, Eye, Layers, RotateCw, ZoomIn, Info, Activity } from 'lucide-react';
import { soundManager } from '../lib/soundManager';

// Import high-resolution 3D anatomical body models (Clean Transparent PNGs)
import maleFrontImg from '../assets/images/body_male_front_1784986971725_transparent.png';
import maleBackImg from '../assets/images/body_male_back_1784986984665_transparent.png';
import maleSideImg from '../assets/images/body_male_side_1784986997098_transparent.png';
import maleThreeQuarterImg from '../assets/images/body_male_three_quarter_1784987009074_transparent.png';
import femaleFrontImg from '../assets/images/body_female_front_1784987022762_transparent.png';
import femaleBackImg from '../assets/images/body_female_back_1784987058370_transparent.png';
import femaleSideImg from '../assets/images/body_female_side_1784987071676_transparent.png';

interface AnatomicalBodySvgProps {
  view: BodyView;
  gender?: Gender;
  muscles: Record<string, MuscleDetail>;
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
  timelineMultiplier?: number;
}

export type DisplayMode = '3d_studio' | 'heatmap' | 'xray';

// Scientific Latin names for muscles
const LATIN_NAMES: Record<string, string> = {
  chest: 'Pectoralis Major',
  abs: 'Rectus Abdominis',
  obliques: 'Obliquus Externus',
  shoulders: 'Deltoideus',
  biceps: 'Biceps Brachii',
  triceps: 'Triceps Brachii',
  forearms: 'Flexor Carpi',
  quads: 'Quadriceps Femoris',
  calves: 'Gastrocnemius & Soleus',
  traps: 'Trapezius',
  lats: 'Latissimus Dorsi',
  lower_back: 'Erector Spinae',
  glutes: 'Gluteus Maximus',
  hamstrings: 'Biceps Femoris',
};

// Muscle centroids for callout leader lines (x, y coordinates in 0-320 x 0-520 viewBox)
const MUSCLE_CENTROIDS: Record<string, { x: number; y: number; labelX: number; labelY: number }> = {
  chest: { x: 160, y: 132, labelX: 40, labelY: 120 },
  abs: { x: 160, y: 185, labelX: 40, labelY: 190 },
  obliques: { x: 125, y: 180, labelX: 30, labelY: 220 },
  shoulders: { x: 112, y: 115, labelX: 35, labelY: 90 },
  biceps: { x: 102, y: 155, labelX: 30, labelY: 150 },
  triceps: { x: 218, y: 155, labelX: 280, labelY: 150 },
  forearms: { x: 92, y: 215, labelX: 30, labelY: 250 },
  quads: { x: 135, y: 295, labelX: 40, labelY: 310 },
  calves: { x: 130, y: 415, labelX: 35, labelY: 420 },
  traps: { x: 160, y: 92, labelX: 280, labelY: 85 },
  lats: { x: 135, y: 170, labelX: 35, labelY: 170 },
  glutes: { x: 160, y: 255, labelX: 280, labelY: 260 },
  hamstrings: { x: 135, y: 315, labelX: 35, labelY: 340 },
  lower_back: { x: 160, y: 200, labelX: 280, labelY: 200 },
};

export const AnatomicalBodySvg: React.FC<AnatomicalBodySvgProps> = ({
  view,
  gender = 'Male',
  muscles,
  selectedMuscleId,
  onSelectMuscle,
  timelineMultiplier = 1.0,
}) => {
  const isFemale = gender === 'Female';
  const [displayMode, setDisplayMode] = useState<DisplayMode>('3d_studio');
  const [isHoveredMuscle, setIsHoveredMuscle] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [turntableAngle, setTurntableAngle] = useState<number>(0);

  // Auto 360 rotation effect if view is 360° or autoRotate enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === '360°' || autoRotate) {
      interval = setInterval(() => {
        setTurntableAngle((prev) => (prev + 1) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [view, autoRotate]);

  // Determine current image based on view, gender, and turntable angle
  const getCurrentImage = () => {
    if (isFemale) {
      if (view === 'Back') return femaleBackImg;
      if (view === 'Left' || view === 'Right') return femaleSideImg;
      return femaleFrontImg;
    } else {
      if (view === 'Back') return maleBackImg;
      if (view === 'Left' || view === 'Right') return maleSideImg;
      if (view === '3/4' || view === 'Top') return maleThreeQuarterImg;
      if (view === '360°') {
        // Map 360 angle to closest render
        const angle = turntableAngle % 360;
        if (angle >= 45 && angle < 135) return maleSideImg;
        if (angle >= 135 && angle < 225) return maleBackImg;
        if (angle >= 225 && angle < 315) return maleSideImg;
        return maleFrontImg;
      }
      return maleFrontImg;
    }
  };

  // Map recovery % to heatmap color
  const getMuscleColor = (muscleId: string) => {
    const m = muscles[muscleId];
    if (!m) return '#64748b'; // default slate

    const rawPct = Math.min(100, Math.max(0, m.recoveryPercentage * timelineMultiplier));

    if (rawPct >= 80) return '#00d2ff'; // Recovered - Electric Blue/Cyan
    if (rawPct >= 60) return '#22c55e'; // Ready - Emerald Green
    if (rawPct >= 40) return '#eab308'; // Recovering - Warm Amber
    if (rawPct >= 20) return '#f97316'; // Fatigued - Vibrant Orange
    return '#ef4444'; // Overtrained - Crimson Red
  };

  const isSelected = (id: string) => selectedMuscleId === id;
  const isHovered = (id: string) => isHoveredMuscle === id;

  const handleMuscleClick = (id: string) => {
    soundManager.play('muscle_selected');
    onSelectMuscle(id);
  };

  const getPathProps = (muscleId: string) => {
    const isSelected = selectedMuscleId === muscleId;
    const isHovered = isHoveredMuscle === muscleId;

    // Clean body by default: invisible muscle paths until interacted
    let fill = 'transparent';
    let fillOpacity = 0;
    let stroke = 'transparent';
    let strokeWidth = '0';
    let filter = undefined;

    if (isSelected) {
      fill = '#4F6BFF';
      fillOpacity = 0.75;
      stroke = '#39D0FF';
      strokeWidth = '0.5';
      filter = 'url(#muscleSelectGlow)';
    } else if (isHovered) {
      fill = '#39D0FF';
      fillOpacity = 0.35;
      stroke = '#39D0FF';
      strokeWidth = '0.5';
      filter = 'url(#muscleHoverGlow)';
    } else if (displayMode === 'heatmap') {
      fill = getMuscleColor(muscleId);
      fillOpacity = 0.55;
      stroke = getMuscleColor(muscleId);
      strokeWidth = '0.5';
      filter = 'url(#muscleHoverGlow)';
    } else if (displayMode === 'xray') {
      fill = 'rgba(57, 208, 255, 0.2)';
      fillOpacity = 0.3;
      stroke = '#39D0FF';
      strokeWidth = '0.5';
    }

    return {
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      filter,
      className: 'cursor-pointer select-none origin-center',
      style: {
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.01)' : 'scale(1)',
        transformOrigin: 'center',
      },
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent stage click from deselecting
        handleMuscleClick(muscleId);
      },
      onMouseEnter: () => setIsHoveredMuscle(muscleId),
      onMouseLeave: () => setIsHoveredMuscle(null),
    };
  };

  const handleStageClick = () => {
    if (selectedMuscleId) {
      soundManager.play('button_click');
      onSelectMuscle('');
    }
  };

  const currentMuscle = selectedMuscleId ? muscles[selectedMuscleId] : null;
  const centroid = selectedMuscleId ? MUSCLE_CENTROIDS[selectedMuscleId] : null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#090e21] via-[#040815] to-[#01030a] border border-cyan-500/30 p-3 select-none flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
      {/* Top Floating Render Controls */}
      <div className="w-full flex items-center justify-between mb-2 px-1 z-20">
        <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={() => {
              soundManager.play('button_click');
              setDisplayMode('3d_studio');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
              displayMode === '3d_studio'
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" /> 3D Studio
          </button>
          <button
            onClick={() => {
              soundManager.play('button_click');
              setDisplayMode('heatmap');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
              displayMode === 'heatmap'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,210,255,0.8)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Heatmap
          </button>
          <button
            onClick={() => {
              soundManager.play('button_click');
              setDisplayMode('xray');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
              displayMode === 'xray'
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" /> X-Ray
          </button>
        </div>

        <button
          onClick={() => {
            soundManager.play('button_click');
            setAutoRotate(!autoRotate);
          }}
          className={`p-2 rounded-xl glass-panel border border-white/10 transition-all bg-slate-950/80 ${
            autoRotate ? 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle 360 Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Studio View Container (Futuristic Dark Blue Medical Stage) */}
      <div
        onClick={handleStageClick}
        className="relative w-full h-[500px] sm:h-[550px] flex items-center justify-center rounded-[32px] overflow-hidden bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#080d20] border border-[#39D0FF]/30 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] bg-cyber-grid group my-1 cursor-pointer select-none"
      >
        {/* Soft Ambient Core Aura */}
        <div className="absolute w-[280px] h-[380px] bg-[#39D0FF]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] bg-[#4F6BFF]/20 rounded-full blur-[60px] pointer-events-none" />

        {/* Dynamic Pulsing Radar Rings */}
        <div className="absolute w-[260px] h-[260px] border border-[#39D0FF]/20 rounded-full animate-radar-ring pointer-events-none" />
        <div className="absolute w-[340px] h-[340px] border border-[#39D0FF]/10 rounded-full animate-radar-ring pointer-events-none" style={{ animationDelay: '1.8s' }} />

        {/* Ambient Animated Micro-Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-cyan-400/50 rounded-full blur-[1px] animate-particle-float" />
          <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-blue-500/40 rounded-full blur-[1px] animate-particle-float" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300/60 rounded-full blur-[0.5px] animate-particle-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Dynamic Biometric Laser Scanning Beam */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#39D0FF] to-transparent pointer-events-none z-20 animate-heatmap-scanner opacity-70 shadow-[0_0_15px_#39D0FF]" />

        {/* Corner HUD Telemetry Reticles */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none z-20">
          <div className="w-3 h-3 border-t-2 border-l-2 border-[#39D0FF]" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI BIOMETRIC SCANNER
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 flex items-center gap-2 pointer-events-none z-20">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
            {view} VIEW // 3D HUD
          </span>
          <div className="w-3 h-3 border-t-2 border-r-2 border-[#39D0FF]" />
        </div>

        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 pointer-events-none z-20">
          <div className="w-3 h-3 border-b-2 border-l-2 border-[#39D0FF]" />
          <span className="text-[10px] font-mono text-cyan-400/70 font-medium">
            HYPERTROPHY STATUS: OPTIMAL
          </span>
        </div>

        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 pointer-events-none z-20">
          <span className="text-[10px] font-mono text-slate-400 font-medium">
            MODE: {displayMode.toUpperCase()}
          </span>
          <div className="w-3 h-3 border-b-2 border-r-2 border-[#39D0FF]" />
        </div>

        {/* CENTERED 3D BODY MODEL & VECTOR SVG LAYER */}
        <div className="relative w-[300px] sm:w-[340px] h-[460px] sm:h-[500px] flex items-center justify-center transition-all duration-500 z-10">
          {/* 3D Model Image Render - Clean Transparent Asset without black boxes */}
          <motion.img
            key={`${gender}-${view}-${getCurrentImage()}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.12 }}
            transition={{ duration: 0.35 }}
            src={getCurrentImage()}
            alt={`${gender} Anatomical Body Model - ${view}`}
            className={`w-full h-full object-contain pointer-events-none select-none transition-all duration-300 p-1 ${
              view === 'Right' ? 'scale-x-[-1]' : ''
            } ${
              displayMode === 'xray'
                ? 'filter invert contrast-200 hue-rotate-180 opacity-80'
                : 'contrast-[1.08] brightness-[1.02] drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
            }`}
          />

          {/* SVG Hotspot & Heatmap Vector Layer */}
          <svg
            viewBox="0 0 320 520"
            onClick={handleStageClick}
            className={`absolute inset-0 w-full h-full max-w-[320px] sm:max-w-[360px] mx-auto pointer-events-auto z-10 scale-[1.12] sm:scale-[1.16] ${
              view === 'Right' ? 'scale-x-[-1]' : ''
            }`}
          >
          <defs>
            {/* Selected Muscle Soft Neon Glow Filter (#4F6BFF / #39D0FF) */}
            <filter id="muscleSelectGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Hover Muscle Subtle Glow Filter */}
            <filter id="muscleHoverGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="leaderLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39D0FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#4F6BFF" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* FRONT VIEW MUSCLE OVERLAYS */}
          {(view === 'Front' || view === '360°' || view === '3/4') && (
            <g>
              {/* Traps */}
              <path
                d="M138 82 Q160 92 182 82 L198 102 Q160 110 122 102 Z"
                {...getPathProps('traps')}
              />

              {/* Shoulders / Deltoids */}
              <path
                d="M112 102 Q122 102 126 122 Q112 145 102 130 Q98 112 112 102 Z"
                {...getPathProps('shoulders')}
              />
              <path
                d="M208 102 Q198 102 194 122 Q208 145 218 130 Q222 112 208 102 Z"
                {...getPathProps('shoulders')}
              />

              {/* Pectorals / Chest */}
              <path
                d="M126 110 Q160 116 160 148 C140 158 120 152 118 130 Z"
                {...getPathProps('chest')}
              />
              <path
                d="M194 110 Q160 116 160 148 C180 158 200 152 202 130 Z"
                {...getPathProps('chest')}
              />

              {/* Biceps */}
              <path
                d="M102 135 C112 142 114 165 104 180 C94 175 92 150 102 135 Z"
                {...getPathProps('biceps')}
              />
              <path
                d="M218 135 C208 142 206 165 216 180 C226 175 228 150 218 135 Z"
                {...getPathProps('biceps')}
              />

              {/* Forearms */}
              <path
                d="M100 185 C108 200 106 235 94 245 C86 240 88 205 100 185 Z"
                {...getPathProps('forearms')}
              />
              <path
                d="M220 185 C212 200 214 235 226 245 C234 240 232 205 220 185 Z"
                {...getPathProps('forearms')}
              />

              {/* Rectus Abdominis / Abs */}
              <g onClick={() => handleMuscleClick('abs')}>
                <rect x="142" y="158" width="16" height="18" rx="4" {...getPathProps('abs')} />
                <rect x="162" y="158" width="16" height="18" rx="4" {...getPathProps('abs')} />
                <rect x="142" y="180" width="16" height="18" rx="4" {...getPathProps('abs')} />
                <rect x="162" y="180" width="16" height="18" rx="4" {...getPathProps('abs')} />
                <rect x="144" y="202" width="14" height="20" rx="4" {...getPathProps('abs')} />
                <rect x="162" y="202" width="14" height="20" rx="4" {...getPathProps('abs')} />
              </g>

              {/* Obliques */}
              <path
                d="M120 155 Q138 180 138 210 Q122 220 115 180 Z"
                {...getPathProps('obliques')}
              />
              <path
                d="M200 155 Q182 180 182 210 Q198 220 205 180 Z"
                {...getPathProps('obliques')}
              />

              {/* Quadriceps */}
              <path
                d="M125 240 C145 242 152 260 152 350 C135 352 118 310 115 260 Z"
                {...getPathProps('quads')}
              />
              <path
                d="M195 240 C175 242 168 260 168 350 C185 352 202 310 205 260 Z"
                {...getPathProps('quads')}
              />

              {/* Calves */}
              <path
                d="M124 380 Q142 390 144 450 Q122 460 118 410 Z"
                {...getPathProps('calves')}
              />
              <path
                d="M196 380 Q178 390 176 450 Q198 460 202 410 Z"
                {...getPathProps('calves')}
              />
            </g>
          )}

          {/* BACK VIEW MUSCLE OVERLAYS */}
          {view === 'Back' && (
            <g>
              {/* Traps Upper */}
              <path
                d="M138 82 Q160 92 182 82 L198 120 Q160 150 122 120 Z"
                {...getPathProps('traps')}
              />

              {/* Rear Delts */}
              <path
                d="M112 102 Q122 110 126 130 C110 135 100 120 112 102 Z"
                {...getPathProps('shoulders')}
              />
              <path
                d="M208 102 Q198 110 194 130 C210 135 220 120 208 102 Z"
                {...getPathProps('shoulders')}
              />

              {/* Latissimus Dorsi */}
              <path
                d="M124 125 C160 145 160 210 142 225 C122 190 112 155 124 125 Z"
                {...getPathProps('lats')}
              />
              <path
                d="M196 125 C160 145 160 210 178 225 C198 190 208 155 196 125 Z"
                {...getPathProps('lats')}
              />

              {/* Triceps */}
              <path
                d="M102 135 C112 145 114 175 104 180 C92 170 94 145 102 135 Z"
                {...getPathProps('triceps')}
              />
              <path
                d="M218 135 C208 145 206 175 216 180 C228 170 226 145 218 135 Z"
                {...getPathProps('triceps')}
              />

              {/* Glutes */}
              <path
                d="M122 230 C160 220 160 280 120 280 C110 260 112 245 122 230 Z"
                {...getPathProps('glutes')}
              />
              <path
                d="M198 230 C160 220 160 280 200 280 C210 260 208 245 198 230 Z"
                {...getPathProps('glutes')}
              />

              {/* Hamstrings */}
              <path
                d="M122 285 C152 285 152 350 124 350 C116 330 114 305 122 285 Z"
                {...getPathProps('hamstrings')}
              />
              <path
                d="M198 285 C168 285 168 350 196 350 C204 330 206 305 198 285 Z"
                {...getPathProps('hamstrings')}
              />

              {/* Calves Back */}
              <path
                d="M120 380 Q145 390 142 450 Q118 450 116 410 Z"
                {...getPathProps('calves')}
              />
              <path
                d="M200 380 Q175 390 178 450 Q202 450 204 410 Z"
                {...getPathProps('calves')}
              />
            </g>
          )}

          {/* LEFT / RIGHT SIDE VIEW OVERLAYS */}
          {(view === 'Left' || view === 'Right') && (
            <g>
              <path
                d="M140 98 C165 98 175 125 150 135 C135 130 130 110 140 98 Z"
                {...getPathProps('shoulders')}
              />
              <path
                d="M150 125 C185 130 180 165 145 165 C140 145 142 132 150 125 Z"
                {...getPathProps('chest')}
              />
              <path
                d="M130 132 C145 138 142 185 125 185 C118 165 120 142 130 132 Z"
                {...getPathProps('biceps')}
              />
              <path
                d="M118 135 C130 140 125 180 110 180 C105 160 108 142 118 135 Z"
                {...getPathProps('triceps')}
              />
              <path
                d="M122 135 C140 145 135 210 118 215 C110 185 112 150 122 135 Z"
                {...getPathProps('lats')}
              />
              <path
                d="M145 168 Q172 195 142 232 Q130 200 145 168 Z"
                {...getPathProps('abs')}
              />
              <path
                d="M115 225 C145 225 140 285 110 285 C100 260 105 240 115 225 Z"
                {...getPathProps('glutes')}
              />
              <path
                d="M140 235 C180 250 172 345 135 352 C125 310 128 265 140 235 Z"
                {...getPathProps('quads')}
              />
              <path
                d="M132 375 Q158 390 152 455 Q125 460 122 410 Z"
                {...getPathProps('calves')}
              />
            </g>
          )}
        </svg>
        </div>
      </div>
    </div>
  );
};
