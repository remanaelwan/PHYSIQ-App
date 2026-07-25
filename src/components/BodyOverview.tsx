import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sparkles, ArrowRight, RotateCw, Eye, Info, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { UserProfile, MuscleDetail, Gender } from '../types';
import { soundManager } from '../lib/soundManager';

// Import high-res anatomical model renders (Clean Transparent PNGs)
import maleFrontImg from '../assets/images/body_male_front_1784986971725_transparent.png';
import maleBackImg from '../assets/images/body_male_back_1784986984665_transparent.png';
import maleSideImg from '../assets/images/body_male_side_1784986997098_transparent.png';
import femaleFrontImg from '../assets/images/body_female_front_1784987022762_transparent.png';
import femaleBackImg from '../assets/images/body_female_back_1784987058370_transparent.png';

interface BodyOverviewProps {
  profile: UserProfile;
  muscles: Record<string, MuscleDetail>;
  onNavigate: (tab: 'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile') => void;
  onSelectMuscle?: (muscleId: string) => void;
}

// Color scheme mapping based on recovery status percentage
export const getRecoveryColorConfig = (pct: number) => {
  if (pct >= 80) {
    return {
      color: '#00d2ff', // Electric Blue - Fully Recovered
      tailClass: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      label: 'Fully Recovered',
      dotBg: 'bg-[#00d2ff]',
      glowColor: 'rgba(0, 210, 255, 0.6)',
      icon: CheckCircle2,
    };
  } else if (pct >= 60) {
    return {
      color: '#22c55e', // Emerald Green - Ready
      tailClass: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      label: 'Ready for Work',
      dotBg: 'bg-[#22c55e]',
      glowColor: 'rgba(34, 197, 94, 0.6)',
      icon: ShieldCheck,
    };
  } else if (pct >= 40) {
    return {
      color: '#eab308', // Amber Yellow - Recovering
      tailClass: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40',
      label: 'Recovering',
      dotBg: 'bg-[#eab308]',
      glowColor: 'rgba(234, 179, 8, 0.6)',
      icon: Activity,
    };
  } else if (pct >= 20) {
    return {
      color: '#f97316', // Orange - Fatigued
      tailClass: 'text-orange-400 bg-orange-500/20 border-orange-500/40',
      label: 'Fatigued',
      dotBg: 'bg-[#f97316]',
      glowColor: 'rgba(249, 115, 22, 0.6)',
      icon: Zap,
    };
  } else if (pct > 0) {
    return {
      color: '#ef4444', // Red - Rest Needed
      tailClass: 'text-red-400 bg-red-500/20 border-red-500/40',
      label: 'Rest Needed',
      dotBg: 'bg-[#ef4444]',
      glowColor: 'rgba(239, 68, 68, 0.6)',
      icon: AlertTriangle,
    };
  } else {
    return {
      color: '#64748b', // Slate Gray - Inactive / No Data
      tailClass: 'text-slate-400 bg-slate-500/20 border-slate-500/40',
      label: 'Inactive',
      dotBg: 'bg-[#64748b]',
      glowColor: 'rgba(100, 116, 139, 0.4)',
      icon: Info,
    };
  }
};

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

export const BodyOverview: React.FC<BodyOverviewProps> = ({
  profile,
  muscles,
  onNavigate,
  onSelectMuscle,
}) => {
  const [viewAngle, setViewAngle] = useState<'Front' | 'Back'>('Front');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(null);
  const [hoveredMuscleId, setHoveredMuscleId] = useState<string | null>(null);

  const isFemale = profile.gender === 'Female';
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'];

  // Filtered muscles array
  const muscleList = (Object.values(muscles) as MuscleDetail[]).filter((m) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Chest') return m.category === 'Chest';
    if (activeCategory === 'Back') return m.category === 'Back';
    if (activeCategory === 'Shoulders') return m.category === 'Shoulders';
    if (activeCategory === 'Arms') return m.category === 'Arms';
    if (activeCategory === 'Core') return m.category === 'Core';
    if (activeCategory === 'Legs') return m.category === 'Legs' || m.category === 'Glutes';
    return true;
  });

  // Toggle view angle
  const handleToggleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.play('tab_change');
    setViewAngle((prev) => (prev === 'Front' ? 'Back' : 'Front'));
  };

  // Select muscle
  const handleMuscleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.play('muscle_selected');
    setSelectedMuscleId(selectedMuscleId === id ? null : id);
    if (onSelectMuscle) {
      onSelectMuscle(id);
    }
  };

  // Selected muscle details
  const activeMuscleKey = selectedMuscleId || hoveredMuscleId;
  const activeMuscle = activeMuscleKey ? muscles[activeMuscleKey] : null;
  const activeConfig = activeMuscle ? getRecoveryColorConfig(activeMuscle.recoveryPercentage) : null;

  // Render current model image
  const getModelImage = () => {
    if (isFemale) {
      return viewAngle === 'Back' ? femaleBackImg : femaleFrontImg;
    }
    return viewAngle === 'Back' ? maleBackImg : maleFrontImg;
  };

  // Get SVG path props with realistic thermal gradients and glow filters
  const getPathProps = (muscleId: string) => {
    const isSelected = selectedMuscleId === muscleId;
    const isHovered = hoveredMuscleId === muscleId;

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
      filter = 'url(#activeThermalGlow)';
    } else if (isHovered) {
      fill = '#39D0FF';
      fillOpacity = 0.35;
      stroke = '#39D0FF';
      strokeWidth = '0.5';
      filter = 'url(#softThermalGlow)';
    }

    return {
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      filter,
      className: 'muscle-svg-path cursor-pointer transition-all duration-300 origin-center',
      style: {
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.01)' : 'scale(1)',
        transformOrigin: 'center',
      },
      onClick: (e: React.MouseEvent) => handleMuscleClick(muscleId, e),
      onMouseEnter: () => setHoveredMuscleId(muscleId),
      onMouseLeave: () => setHoveredMuscleId(null),
    };
  };

  // AI Recommendation text
  const getAiMessage = () => {
    if (profile.overallRecoveryScore >= 85) {
      return "Central Nervous System & primary muscle groups are fully restored (90%+). Peak performance window for heavy compound training.";
    } else if (profile.overallRecoveryScore >= 70) {
      return "Optimal recovery balance achieved. Ready for target hypertrophy split and progressive overload.";
    } else if (profile.overallRecoveryScore >= 50) {
      return "Moderate muscle fatigue detected in lower body. Recommended: Active mobility, upper body focus, or steady cardio.";
    } else {
      return "Systemic recovery is low today. Focus on light active recovery, high protein intake, and optimal rest.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-5 rounded-[32px] border border-cyan-500/30 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#0a1128] via-[#050a18] to-[#02050e] font-sans select-none"
    >
      {/* HIGH-END LUXURY AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-subtle-glow" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full bg-blue-600/15 blur-[80px] pointer-events-none animate-body-breathing" />
      
      {/* HUD CYBER GRID BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

      {/* HEADER BAR: Title + Perfectly Positioned Recovery Score Tab */}
      <div className="flex items-center justify-between gap-2 relative z-20 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.4)] shrink-0">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 tracking-tight truncate">
              <span>Body Overview</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                IR Heatmap
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium truncate">Infrared Neuromuscular Heatmap</p>
          </div>
        </div>

        {/* NEAT & ALIGNED RECOVERY SCORE 85% TAB */}
        <div className="px-3 py-1.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md flex items-center gap-2.5 shadow-lg shrink-0">
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]"
                strokeDasharray={`${profile.overallRecoveryScore}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-cyan-300">{profile.overallRecoveryScore}%</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Recovery</span>
            <span className="text-xs font-black text-cyan-400 leading-none">{profile.overallRecoveryScore}% Optimal</span>
          </div>
        </div>
      </div>

      {/* VIEW ANGLE SEGMENTED CONTROL BAR */}
      <div className="w-full relative z-20 mb-2">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex items-center gap-1.5 pl-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-300">Anatomical View:</span>
          </div>
          <div className="flex p-0.5 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.play('tab_change');
                setViewAngle('Front');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewAngle === 'Front'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.play('tab_change');
                setViewAngle('Back');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewAngle === 'Back'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* RECOVERY COLOR SCHEME LEGEND GRID */}
      <div className="w-full relative z-20 mb-2">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-2 rounded-2xl glass-panel bg-slate-950/80 border border-cyan-500/20 text-[9px] font-bold text-slate-200 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
            <span>80%+ Blue</span>
          </div>
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]" />
            <span>60%+ Green</span>
          </div>
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_6px_#eab308]" />
            <span>40%+ Yellow</span>
          </div>
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316]" />
            <span>20%+ Orange</span>
          </div>
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]" />
            <span>&lt;20% Red</span>
          </div>
          <div className="flex items-center gap-1 justify-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#64748b]" />
            <span>Gray Rest</span>
          </div>
        </div>
      </div>

      {/* CENTRAL SVG-BASED HUMAN BODY HEATMAP STAGE */}
      <div className="relative w-full aspect-[3/4] max-h-[380px] flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-b from-[#01040d] via-[#030919] to-[#010207] border border-cyan-500/30 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] my-2 group">
        
        {/* HUD CORNER RETICLES */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none z-20" />
        <div className="absolute top-3 right-14 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none z-20" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none z-20" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none z-20" />

        {/* VIEW FLIP BUTTON */}
        <button
          onClick={handleToggleView}
          className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-xl glass-panel bg-slate-900/90 border border-cyan-500/40 text-xs font-bold text-white flex items-center gap-1.5 hover:border-cyan-400 active:scale-95 transition-all shadow-lg"
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>{viewAngle} View</span>
        </button>

        {/* THERMAL SCANNER OVERLAY LINE */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-xs pointer-events-none z-20 animate-heatmap-scanner opacity-50" />

        {/* AMBIENT REFLECTION BASE */}
        <div className="absolute bottom-2 w-2/3 h-8 bg-black/60 rounded-[100%] blur-md pointer-events-none" />

        {/* ALIVE BREATHING WRAPPER FOR SVG + 3D MODEL */}
        <div className="w-full h-full relative flex items-center justify-center animate-body-breathing p-2 bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#080d20] bg-cyber-grid rounded-[28px] overflow-hidden border border-[#39D0FF]/20 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          {/* Soft Ambient Core Aura */}
          <div className="absolute w-[220px] h-[300px] bg-[#39D0FF]/15 rounded-full blur-[70px] pointer-events-none" />

          {/* Dynamic Radar Ring */}
          <div className="absolute w-[220px] h-[220px] border border-[#39D0FF]/20 rounded-full animate-radar-ring pointer-events-none" />

          {/* 3D Anatomical Render Background - Clean Transparent PNG */}
          <div className="relative w-[260px] sm:w-[290px] h-[340px] sm:h-[370px] flex items-center justify-center overflow-hidden">
            <motion.img
              key={`${profile.gender}-${viewAngle}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={getModelImage()}
              alt={`3D Anatomical Model - ${viewAngle}`}
              className={`w-full h-full object-contain pointer-events-none select-none contrast-[1.08] brightness-[1.02] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] p-1 ${
                viewAngle === 'Right' ? 'scale-x-[-1]' : ''
              }`}
            />
          </div>

          {/* SVG Heatmap Vector Overlays with High-Def Thermal Filters */}
          <svg
            viewBox="0 0 320 520"
            className={`absolute inset-0 w-full h-full max-w-[340px] mx-auto pointer-events-auto z-10 ${
              viewAngle === 'Right' ? 'scale-x-[-1]' : ''
            }`}
          >
            <defs>
              {/* Soft Infrared Thermal Blur Filter */}
              <filter id="softThermalGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComponentTransfer in="blur" result="boost">
                  <feFuncA type="linear" slope="1.4" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="boost" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Active Selected Thermal Flare Filter */}
              <filter id="activeThermalGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {viewAngle === 'Front' ? (
              <g>
                {/* Traps */}
                <path d="M138 82 Q160 92 182 82 L198 102 Q160 110 122 102 Z" {...getPathProps('traps')} />

                {/* Shoulders / Deltoids */}
                <path d="M112 102 Q122 102 126 122 Q112 145 102 130 Q98 112 112 102 Z" {...getPathProps('shoulders')} />
                <path d="M208 102 Q198 102 194 122 Q208 145 218 130 Q222 112 208 102 Z" {...getPathProps('shoulders')} />

                {/* Chest / Pectorals */}
                <path d="M126 110 Q160 116 160 148 C140 158 120 152 118 130 Z" {...getPathProps('chest')} />
                <path d="M194 110 Q160 116 160 148 C180 158 200 152 202 130 Z" {...getPathProps('chest')} />

                {/* Biceps */}
                <path d="M102 135 C112 142 114 165 104 180 C94 175 92 150 102 135 Z" {...getPathProps('biceps')} />
                <path d="M218 135 C208 142 206 165 216 180 C226 175 228 150 218 135 Z" {...getPathProps('biceps')} />

                {/* Forearms */}
                <path d="M100 185 C108 200 106 235 94 245 C86 240 88 205 100 185 Z" {...getPathProps('forearms')} />
                <path d="M220 185 C212 200 214 235 226 245 C234 240 232 205 220 185 Z" {...getPathProps('forearms')} />

                {/* Rectus Abdominis / Abs */}
                <g className="cursor-pointer" onClick={(e) => handleMuscleClick('abs', e)}>
                  <rect x="142" y="158" width="16" height="18" rx="4" {...getPathProps('abs')} />
                  <rect x="162" y="158" width="16" height="18" rx="4" {...getPathProps('abs')} />
                  <rect x="142" y="180" width="16" height="18" rx="4" {...getPathProps('abs')} />
                  <rect x="162" y="180" width="16" height="18" rx="4" {...getPathProps('abs')} />
                  <rect x="144" y="202" width="14" height="20" rx="4" {...getPathProps('abs')} />
                  <rect x="162" y="202" width="14" height="20" rx="4" {...getPathProps('abs')} />
                </g>

                {/* Obliques */}
                <path d="M120 155 Q138 180 138 210 Q122 220 115 180 Z" {...getPathProps('obliques')} />
                <path d="M200 155 Q182 180 182 210 Q198 220 205 180 Z" {...getPathProps('obliques')} />

                {/* Quads */}
                <path d="M125 240 C145 242 152 260 152 350 C135 352 118 310 115 260 Z" {...getPathProps('quads')} />
                <path d="M195 240 C175 242 168 260 168 350 C185 352 202 310 205 260 Z" {...getPathProps('quads')} />

                {/* Calves */}
                <path d="M124 380 Q142 390 144 450 Q122 460 118 410 Z" {...getPathProps('calves')} />
                <path d="M196 380 Q178 390 176 450 Q198 460 202 410 Z" {...getPathProps('calves')} />
              </g>
            ) : (
              <g>
                {/* Traps Back */}
                <path d="M138 82 Q160 92 182 82 L198 120 Q160 150 122 120 Z" {...getPathProps('traps')} />

                {/* Rear Delts */}
                <path d="M112 102 Q122 110 126 130 C110 135 100 120 112 102 Z" {...getPathProps('shoulders')} />
                <path d="M208 102 Q198 110 194 130 C210 135 220 120 208 102 Z" {...getPathProps('shoulders')} />

                {/* Lats */}
                <path d="M124 125 C160 145 160 210 142 225 C122 190 112 155 124 125 Z" {...getPathProps('lats')} />
                <path d="M196 125 C160 145 160 210 178 225 C198 190 208 155 196 125 Z" {...getPathProps('lats')} />

                {/* Triceps */}
                <path d="M102 135 C112 145 114 175 104 180 C92 170 94 145 102 135 Z" {...getPathProps('triceps')} />
                <path d="M218 135 C208 145 206 175 216 180 C228 170 226 145 218 135 Z" {...getPathProps('triceps')} />

                {/* Glutes */}
                <path d="M122 230 C160 220 160 280 120 280 C110 260 112 245 122 230 Z" {...getPathProps('glutes')} />
                <path d="M198 230 C160 220 160 280 200 280 C210 260 208 245 198 230 Z" {...getPathProps('glutes')} />

                {/* Hamstrings */}
                <path d="M122 285 C152 285 152 350 124 350 C116 330 114 305 122 285 Z" {...getPathProps('hamstrings')} />
                <path d="M198 285 C168 285 168 350 196 350 C204 330 206 305 198 285 Z" {...getPathProps('hamstrings')} />

                {/* Calves Back */}
                <path d="M120 380 Q145 390 142 450 Q118 450 116 410 Z" {...getPathProps('calves')} />
                <path d="M200 380 Q175 390 178 450 Q202 450 204 410 Z" {...getPathProps('calves')} />
              </g>
            )}
          </svg>
        </div>

        {/* INTERACTIVE MUSCLE INFO POPUP BADGE */}
        <AnimatePresence>
          {activeMuscle && activeConfig && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl glass-panel bg-[#050b18]/95 border border-cyan-500/50 shadow-[0_10px_35px_rgba(0,210,255,0.3)] z-30 flex items-center justify-between backdrop-blur-md"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                    {LATIN_NAMES[activeMuscleKey || ''] || activeMuscle.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${activeConfig.tailClass}`}>
                    {activeConfig.label}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white">{activeMuscle.name}</h4>
              </div>

              <div className="text-right">
                <div className="text-sm font-black drop-shadow-[0_0_8px_currentColor]" style={{ color: activeConfig.color }}>
                  {activeMuscle.recoveryPercentage}%
                </div>
                <div className="text-[9px] font-bold text-slate-400">Recovery Score</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI READINESS INSIGHT FOOTER */}
      <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md flex items-start gap-2.5 shadow-lg my-2 z-20 relative">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-slate-200 leading-snug">
          "{getAiMessage()}"
        </p>
      </div>

      {/* ACTION BUTTON TO FULL BODY ANALYSIS PAGE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          soundManager.play('tab_change');
          onNavigate('Body');
        }}
        className="w-full h-11 rounded-2xl glass-pill bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg relative z-20"
      >
        <span>Full Body Analysis & 3D Viewer</span>
        <ArrowRight className="w-4 h-4 text-cyan-400" />
      </button>
    </motion.div>
  );
};
