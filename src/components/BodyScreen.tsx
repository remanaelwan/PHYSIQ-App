import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Scan,
  Info,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  Dumbbell,
  Clock,
  Zap,
  X,
  Droplet,
  Moon,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { BodyView, Gender, MuscleDetail, TimelineState, UserProfile } from '../types';
import { AnatomicalBodySvg } from './AnatomicalBodySvg';
import { BodyCompositionDashboard } from './BodyCompositionDashboard';
import { KeyMeasurementsDashboard } from './KeyMeasurementsDashboard';
import { soundManager } from '../lib/soundManager';

interface BodyScreenProps {
  gender?: Gender;
  onGenderChange?: (gender: Gender) => void;
  muscles: Record<string, MuscleDetail>;
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string) => void;
  activeView: BodyView;
  onViewChange: (view: BodyView) => void;
  activeTimeline: TimelineState;
  onTimelineChange: (timeline: TimelineState) => void;
  onScanBody?: () => void;
}

// Scientific Latin anatomical names
const LATIN_NAMES: Record<string, string> = {
  chest: 'Pectoralis Major',
  abs: 'Rectus Abdominis',
  obliques: 'Obliquus Externus Abdominis',
  shoulders: 'Deltoideus',
  biceps: 'Biceps Brachii',
  triceps: 'Triceps Brachii',
  forearms: 'Flexor & Extensor Carpi',
  quads: 'Quadriceps Femoris',
  calves: 'Gastrocnemius & Soleus',
  traps: 'Trapezius',
  lats: 'Latissimus Dorsi',
  lower_back: 'Erector Spinae',
  glutes: 'Gluteus Maximus',
  hamstrings: 'Biceps Femoris',
};

// Realistic workout history & estimated recovery times
const LAST_WORKED_DETAILS: Record<string, { time: string; session: string; estRecovery: string }> = {
  chest: { time: 'Yesterday (20h ago)', session: 'Barbell Bench & Incline Flies', estRecovery: '14h remaining' },
  abs: { time: '2 days ago', session: 'Hanging Leg Raises & Core Stability', estRecovery: 'Fully Restored' },
  obliques: { time: '2 days ago', session: 'Russian Twists & Cable Chops', estRecovery: 'Fully Restored' },
  shoulders: { time: '3 days ago', session: 'Overhead Press & Lateral Raises', estRecovery: 'Fully Restored' },
  biceps: { time: 'Yesterday (20h ago)', session: 'Incline Dumbbell Curls & Hammer Curls', estRecovery: '12h remaining' },
  triceps: { time: 'Yesterday (20h ago)', session: 'Heavy Dips & Skullcrushers', estRecovery: '16h remaining' },
  forearms: { time: '2 days ago', session: 'Farmer Carries & Wrist Curls', estRecovery: 'Fully Restored' },
  quads: { time: '4 days ago', session: 'Heavy Back Squats & Leg Press', estRecovery: 'Fully Restored' },
  calves: { time: '4 days ago', session: 'Standing Calf Raises', estRecovery: 'Fully Restored' },
  traps: { time: '3 days ago', session: 'Barbell Shrugs & Rack Pulls', estRecovery: 'Fully Restored' },
  lats: { time: '2 days ago', session: 'Weighted Pull-Ups & Barbell Rows', estRecovery: 'Fully Restored' },
  lower_back: { time: '4 days ago', session: 'Conventional Deadlifts', estRecovery: 'Fully Restored' },
  glutes: { time: '4 days ago', session: 'Barbell Hip Thrusts', estRecovery: 'Fully Restored' },
  hamstrings: { time: '4 days ago', session: 'Romanian Deadlifts & Lying Curls', estRecovery: 'Fully Restored' },
};

export const BodyScreen: React.FC<BodyScreenProps> = ({
  gender = 'Male',
  onGenderChange,
  muscles,
  selectedMuscleId,
  onSelectMuscle,
  activeView,
  onViewChange,
  activeTimeline,
  onTimelineChange,
  onScanBody,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const views: BodyView[] = ['Front', 'Back', 'Left', 'Right', '3/4', '360°'];
  const categories = ['All', 'Chest', 'Back', 'Arms', 'Shoulders', 'Core', 'Legs'];

  const timelineStates: { state: TimelineState; label: string; multiplier: number }[] = [
    { state: 'Before Workout', label: 'Before', multiplier: 1.0 },
    { state: 'After Workout', label: 'After', multiplier: 0.5 },
    { state: '24h', label: '24h', multiplier: 0.7 },
    { state: '48h', label: '48h', multiplier: 0.85 },
    { state: '72h', label: '72h', multiplier: 0.95 },
    { state: '1 Week', label: '1 Week', multiplier: 1.0 },
  ];

  const currentTimelineObj = timelineStates.find((t) => t.state === activeTimeline) || timelineStates[1];

  // Filtered muscles list based on category and search query
  const filteredMusclesList = (Object.values(muscles) as MuscleDetail[]).filter((m) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Chest' && m.category === 'Chest') ||
      (selectedCategory === 'Back' && m.category === 'Back') ||
      (selectedCategory === 'Arms' && m.category === 'Arms') ||
      (selectedCategory === 'Shoulders' && m.category === 'Shoulders') ||
      (selectedCategory === 'Core' && m.category === 'Core') ||
      (selectedCategory === 'Legs' && (m.category === 'Legs' || m.category === 'Glutes'));

    const query = searchQuery.trim().toLowerCase();
    const latin = (LATIN_NAMES[m.id] || '').toLowerCase();
    const matchesQuery = !query || m.name.toLowerCase().includes(query) || latin.includes(query) || m.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const selectedMuscleKey = selectedMuscleId || null;
  const selectedMuscle = selectedMuscleKey ? muscles[selectedMuscleKey] : null;
  const latinName = selectedMuscleKey ? (LATIN_NAMES[selectedMuscleKey] || 'Anatomical Group') : '';
  const workoutInfo = selectedMuscleKey
    ? LAST_WORKED_DETAILS[selectedMuscleKey] || {
        time: '2 days ago',
        session: 'Standard Hypertrophy Session',
        estRecovery: 'Fully Restored',
      }
    : null;

  const calcRecoveryPct = selectedMuscle ? Math.round(selectedMuscle.recoveryPercentage * currentTimelineObj.multiplier) : 0;

  // Status Badge Styling Helper
  const getStatusBadgeConfig = (pct: number) => {
    if (pct >= 80) {
      return {
        label: 'Fully Recovered',
        color: '#39D0FF',
        bg: 'bg-[#39D0FF]/15',
        border: 'border-[#39D0FF]/40',
        text: 'text-[#39D0FF]',
        glow: 'shadow-[0_0_12px_rgba(57,208,255,0.4)]',
      };
    } else if (pct >= 60) {
      return {
        label: 'Ready for Work',
        color: '#22c55e',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_12px_rgba(34,197,94,0.4)]',
      };
    } else if (pct >= 40) {
      return {
        label: 'Recovering',
        color: '#eab308',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_12px_rgba(234,179,8,0.4)]',
      };
    } else if (pct >= 20) {
      return {
        label: 'Fatigued',
        color: '#f97316',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/40',
        text: 'text-orange-400',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]',
      };
    } else {
      return {
        label: 'Rest Needed',
        color: '#ef4444',
        bg: 'bg-red-500/15',
        border: 'border-red-500/40',
        text: 'text-red-400',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
      };
    }
  };

  const statusConfig = getStatusBadgeConfig(calcRecoveryPct);

  const handleGenderSelect = (newGender: Gender) => {
    soundManager.play('switch');
    if (onGenderChange) {
      onGenderChange(newGender);
    }
  };

  const handleSelectMuscleWithSound = (id: string) => {
    soundManager.play('muscle_selected');
    onSelectMuscle(id);
  };

  const handleViewChangeWithSound = (v: BodyView) => {
    soundManager.play('glass_transition');
    onViewChange(v);
  };

  const handleTimelineChangeWithSound = (t: TimelineState) => {
    soundManager.play('recovery_timeline_slider');
    onTimelineChange(t);
  };

  const handleCategorySelectWithSound = (cat: string) => {
    soundManager.play('category_selected');
    setSelectedCategory(cat);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B1220] text-white pt-12 pb-28 px-4 max-w-md mx-auto space-y-5 select-none relative overflow-hidden font-sans">
      {/* DYNAMIC ATMOSPHERIC BACKGROUND MESH & PARTICLES */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0B1220] via-[#080E1B] to-[#040812] pointer-events-none z-0" />
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#4F6BFF]/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-20 w-80 h-80 rounded-full bg-[#39D0FF]/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 rounded-full bg-[#7A5CFF]/10 blur-[110px] pointer-events-none z-0" />
      
      {/* DOTTED GRID HUD OVERLAY */}
      <div className="fixed inset-0 bg-[radial-gradient(#39D0FF_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none z-0" />

      {/* AMBIENT LOW-OPACITY DRIFTING PARTICLES (5-10% OPACITY) */}
      <div className="fixed top-20 left-10 w-2 h-2 rounded-full bg-[#39D0FF] opacity-[0.08] blur-[1px] animate-particle-float pointer-events-none z-0" />
      <div className="fixed top-44 right-12 w-1.5 h-1.5 rounded-full bg-[#4F6BFF] opacity-[0.09] blur-[1px] animate-particle-float pointer-events-none z-0 [animation-delay:2s]" />
      <div className="fixed bottom-60 left-16 w-2 h-2 rounded-full bg-[#7A5CFF] opacity-[0.07] blur-[1px] animate-particle-float pointer-events-none z-0 [animation-delay:4s]" />

      <div className="relative z-10 space-y-5">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Anatomy Scanner</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#39D0FF]/20 text-[#39D0FF] border border-[#39D0FF]/30 shadow-[0_0_8px_rgba(57,208,255,0.25)]">
                AI v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Full-Body Neuromuscular Thermography</p>
          </div>

          <button
            onClick={onScanBody}
            className="px-3.5 py-2 rounded-xl glass-panel flex items-center gap-1.5 text-xs font-bold text-[#39D0FF] bg-[#0B1220]/80 border border-[#39D0FF]/40 shadow-[0_0_18px_rgba(57,208,255,0.25)] hover:bg-[#39D0FF]/10 active:scale-95 transition-all backdrop-blur-md"
          >
            <Scan className="w-4 h-4 text-[#39D0FF]" />
            Scan Body
          </button>
        </div>

        {/* GENDER MODEL SWITCHER BAR (Apple Segmented Control Style) */}
        <div className="p-1.5 rounded-2xl bg-[#0B1220]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 pl-3">
            <User className="w-4 h-4 text-[#39D0FF]" />
            <span className="text-xs font-bold text-slate-300">Target Model</span>
          </div>
          <div className="flex p-0.5 rounded-xl bg-slate-900/80 border border-white/5 relative">
            <button
              onClick={() => handleGenderSelect('Male')}
              className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                gender === 'Male' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {gender === 'Male' && (
                <motion.div
                  layoutId="genderPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#4F6BFF] to-[#39D0FF] rounded-lg shadow-[0_0_12px_rgba(79,107,255,0.5)] z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span>♂</span> Male
            </button>
            <button
              onClick={() => handleGenderSelect('Female')}
              className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                gender === 'Female' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {gender === 'Female' && (
                <motion.div
                  layoutId="genderPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#7A5CFF] to-[#39D0FF] rounded-lg shadow-[0_0_12px_rgba(122,92,255,0.5)] z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span>♀</span> Female
            </button>
          </div>
        </div>

        {/* SEARCH & CATEGORY CHIPS */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search muscle group (e.g. Pectorals, Lats, Quads)..."
              className="w-full h-10 pl-10 pr-9 rounded-2xl bg-[#080E1B]/90 border border-slate-800 focus:border-[#39D0FF] focus:outline-none text-xs text-white placeholder-slate-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelectWithSound(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4F6BFF] text-white shadow-[0_0_12px_rgba(79,107,255,0.5)] border border-[#39D0FF]/40'
                    : 'bg-[#080E1B]/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN MEDICAL SCANNER CONTAINER */}
        <div className="rounded-[32px] bg-[#080E1B]/90 border border-[#39D0FF]/30 p-4 relative shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-3">
          {/* SCANNER CONTAINER HEADER: Title + View Switcher */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#39D0FF] animate-pulse shadow-[0_0_8px_#39D0FF]" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  {gender} Neuromuscular View
                </h2>
              </div>
              <p className="text-[10px] text-slate-400">Interactive 3D Thermographic Scan</p>
            </div>

            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Info className="w-3 h-3 text-[#39D0FF]" />
              <span>Legend</span>
            </button>
          </div>

          {/* APPLE SEGMENTED CONTROL TABS (Front, Back, Left, Right, 3/4, 360°) */}
          <div className="p-1 rounded-2xl bg-[#0B1220]/90 border border-white/10 backdrop-blur-md grid grid-cols-6 gap-1 relative">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => handleViewChangeWithSound(v)}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold text-center relative z-10 transition-colors truncate ${
                  activeView === v ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeView === v && (
                  <motion.div
                    layoutId="segmentedViewPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#4F6BFF] to-[#39D0FF] rounded-xl shadow-[0_0_12px_rgba(57,208,255,0.4)] z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                {v}
              </button>
            ))}
          </div>

          {/* EXPANDABLE COLOR STATUS LEGEND STRIP */}
          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-[#39D0FF]/20 text-[10px] font-medium grid grid-cols-3 gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
                    <span>Blue: 80%+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                    <span>Green: 60%+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_8px_#eab308]" />
                    <span>Yellow: 40%+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />
                    <span>Orange: 20%+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                    <span>Red: &lt;20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span>Gray: Rest</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D BODY STAGE: ENLARGED 25-35%, CENTERED, ZERO CARD OVERLAP */}
          <div className="relative w-full flex items-center justify-center">
            <AnatomicalBodySvg
              view={activeView}
              gender={gender}
              muscles={muscles}
              selectedMuscleId={selectedMuscleId}
              onSelectMuscle={handleSelectMuscleWithSound}
              timelineMultiplier={currentTimelineObj.multiplier}
            />
          </div>

          {/* RECOVERY TIMELINE BAR CONTROL */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#39D0FF]" /> Recovery Simulation Timeline
              </span>
              <span className="text-[#39D0FF] font-mono text-[10px]">{activeTimeline}</span>
            </div>
            <div className="flex justify-between gap-1 p-1 rounded-2xl bg-[#0B1220]/90 border border-white/10">
              {timelineStates.map((t) => (
                <button
                  key={t.state}
                  onClick={() => handleTimelineChangeWithSound(t.state)}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    activeTimeline === t.state
                      ? 'bg-gradient-to-r from-[#4F6BFF] to-[#39D0FF] text-white shadow-[0_0_10px_rgba(57,208,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FLOATING MUSCLE INFORMATION PANEL (PLACED STRICTLY BELOW THE BODY SCANNER, NEVER OVERLAPPING) */}
        <AnimatePresence mode="wait">
          {selectedMuscle && (
            <motion.div
              key={selectedMuscleKey}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="p-5 rounded-[32px] bg-[#080E1B]/95 border border-[#39D0FF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-4 relative overflow-hidden"
            >
              {/* ACCENT AMBIENT GLOW CORNER */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: statusConfig.color }}
              />

              {/* PANEL HEADER: Muscle Names + Recovery Badge */}
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#39D0FF]">
                      {selectedMuscle.category}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] font-mono italic text-slate-300">{latinName}</span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mt-0.5">{selectedMuscle.name}</h3>
                </div>

                <div
                  className={`px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} ${statusConfig.glow} border text-xs font-black flex items-center gap-1`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </div>
              </div>

              {/* RECOVERY SCORE & METRICS GRID */}
              <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
                {/* RECOVERY SCORE RING CARD */}
                <div className="p-3.5 rounded-2xl bg-[#0B1220]/90 border border-white/10 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold block">Recovery Score</span>
                    <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-1">
                      <span style={{ color: statusConfig.color }}>{calcRecoveryPct}%</span>
                    </div>
                  </div>
                  <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        style={{ stroke: statusConfig.color }}
                        strokeDasharray={`${calcRecoveryPct}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>

                {/* ESTIMATED FULL RECOVERY CARD */}
                <div className="p-3.5 rounded-2xl bg-[#0B1220]/90 border border-white/10 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold block">Est. Full Recovery</span>
                    <div className="text-sm font-black text-white mt-1">{workoutInfo?.estRecovery || 'Fully Restored'}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#7A5CFF]/20 text-[#7A5CFF]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* LAST WORKOUT DETAILED INFO */}
              <div className="p-3.5 rounded-2xl bg-[#0B1220]/90 border border-white/10 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#4F6BFF]/20 text-[#39D0FF] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Worked</span>
                    <div className="font-extrabold text-white">{workoutInfo?.session || 'Hypertrophy Session'}</div>
                    <div className="text-[10px] text-slate-400">{workoutInfo?.time || '2 days ago'}</div>
                  </div>
                </div>
              </div>

              {/* AI RECOVERY TIP BOX */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#4F6BFF]/15 via-[#39D0FF]/10 to-[#7A5CFF]/15 border border-[#39D0FF]/30 flex items-start gap-3 relative z-10 shadow-md">
                <Sparkles className="w-5 h-5 text-[#39D0FF] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#39D0FF] block mb-0.5">
                    PhysIQ AI Recommendation
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedMuscle.aiTip}</p>
                </div>
              </div>

              {/* RECOMMENDED EXERCISES LIST */}
              <div className="relative z-10 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-wider">Recommended Exercises</div>
                <div className="space-y-2">
                  {selectedMuscle.recommendedExercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-2xl bg-[#0B1220]/90 border border-white/10 flex items-center justify-between text-xs hover:border-[#39D0FF]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#4F6BFF]/20 text-[#39D0FF]">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-white">{ex.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {ex.sets} Sets × {ex.reps} Reps
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 font-bold border border-white/10">
                        {ex.estimatedFatigue} Fatigue
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BODY COMPOSITION DASHBOARD */}
        <BodyCompositionDashboard />

        {/* KEY MEASUREMENTS DASHBOARD */}
        <KeyMeasurementsDashboard
          selectedMuscleId={selectedMuscleId}
          onHighlightMuscleRegion={(muscleRegionId) => {
            handleSelectMuscleWithSound(muscleRegionId);
          }}
        />

        {/* AI INSIGHTS BOTTOM BANNER */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0B1220] via-[#101B35] to-[#0B1220] border border-[#39D0FF]/30 flex items-center gap-3 shadow-lg">
          <Sparkles className="w-7 h-7 text-[#39D0FF] shrink-0" />
          <div className="text-xs text-slate-200">
            <span className="font-bold text-white block">PhysIQ Precision Scanning</span>
            3D Anatomical Heatmap synchronized with neuromuscular fatigue algorithms.
          </div>
        </div>
      </div>
    </div>
  );
};

