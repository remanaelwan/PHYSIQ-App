import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Calendar,
  Play,
  MoreVertical,
  Timer,
  Layers,
  FileText,
  Flame,
  TrendingUp,
  Dumbbell,
  Heart,
  Bookmark,
  Share2,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Target,
  ChevronRight,
  ShieldCheck,
  Clock,
  Award,
  Info,
} from 'lucide-react';
import { WorkoutProgram, CommunityWorkout, Exercise, CommunityProgram } from '../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { CommunityMarketplace } from './CommunityMarketplace';
import { mockCommunityPrograms, mockCreators } from '../data/mockCommunityData';
import { soundManager } from '../lib/soundManager';

interface WorkoutScreenProps {
  todayWorkout: WorkoutProgram;
  communityWorkouts: CommunityWorkout[];
  onStartWorkout: () => void;
  onToggleLikeCommunity: (id: string) => void;
  onToggleSaveCommunity: (id: string) => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  todayWorkout,
  communityWorkouts,
  onStartWorkout,
  onToggleLikeCommunity,
  onToggleSaveCommunity,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'Program' | 'Community'>('Program');
  const [selectedDay, setSelectedDay] = useState<number>(21);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);

  const handleStartWorkoutWithSound = () => {
    soundManager.play('start_workout');
    onStartWorkout();
  };

  const handleDaySelectWithSound = (dateNum: number) => {
    soundManager.play('button_secondary');
    setSelectedDay(dateNum);
  };

  const handleSubTabChangeWithSound = (tab: 'Program' | 'Community') => {
    soundManager.play('toggle_on');
    setActiveSubTab(tab);
  };

  const handleExerciseClick = (ex: Exercise) => {
    soundManager.play('button_primary');
    setSelectedExerciseForModal(ex);
  };

  const weekDays = [
    { day: 'Mon', date: 20 },
    { day: 'Tue', date: 21 },
    { day: 'Wed', date: 22 },
    { day: 'Thu', date: 23 },
    { day: 'Fri', date: 24 },
    { day: 'Sat', date: 25 },
    { day: 'Sun', date: 26 },
  ];

  // Workout Timeline Flow items
  const timelineSteps = [
    { type: 'warmup', title: 'Dynamic Warm-Up & Mobility', duration: '5 min', isCompleted: true },
    ...todayWorkout.exercises.map((ex, idx) => ({
      type: 'exercise',
      title: ex.name,
      subtitle: `${ex.sets} Sets × ${ex.reps} • ${ex.weightKg || 0} kg`,
      targetMuscle: ex.targetMuscle,
      isCompleted: false,
      exerciseObj: ex,
    })),
    { type: 'cooldown', title: 'Post-Workout Decompression & Stretch', duration: '5 min', isCompleted: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#04060c] text-white pt-12 pb-28 px-4 max-w-md mx-auto space-y-6 select-none">
      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onStartWorkout={onStartWorkout}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Workout Studio</h1>
          <p className="text-xs text-slate-400 font-medium">Apple Fitness+ & Nike Training Club Intelligence</p>
        </div>

        <button className="relative p-2.5 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </button>
      </div>

      {/* Sub-Tab Navigation Toggle */}
      <div className="flex glass-pill p-1 rounded-2xl">
        <button
          onClick={() => handleSubTabChangeWithSound('Program')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'Program'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Today's Plan
        </button>
        <button
          onClick={() => handleSubTabChangeWithSound('Community')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'Community'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Community Programs
        </button>
      </div>

      {activeSubTab === 'Program' ? (
        <>
          {/* Day Ribbon Selector */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {weekDays.map((w) => {
              const isSelected = selectedDay === w.date;
              return (
                <button
                  key={w.date}
                  onClick={() => handleDaySelectWithSound(w.date)}
                  className={`flex-1 py-2 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-400'
                      : 'glass-card text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">{w.day}</span>
                  <span className="text-sm font-black mt-0.5">{w.date}</span>
                </button>
              );
            })}
            <button className="p-2.5 rounded-2xl glass-card text-slate-400 hover:text-white shrink-0">
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          {/* SECTION 1: HERO WORKOUT CARD */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
            {/* Background Image with Ambient Gradient Overlay */}
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000"
                alt="Workout Hero"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-[#04060c]/60 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-md border border-blue-400/30">
                  {todayWorkout.focusArea}
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {todayWorkout.readinessPercentage}% Recovery
                </div>
              </div>

              {/* Title & Target Muscle Tags overlay */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                <h2 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">
                  {todayWorkout.title}
                </h2>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">
                  {todayWorkout.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {todayWorkout.musclesTargeted.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 backdrop-blur-md"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Controls inside Hero Card */}
            <div className="p-4 bg-[#080d1a] border-t border-white/10 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Duration</div>
                  <div className="font-extrabold text-white mt-0.5">{todayWorkout.durationMin} min</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Est. Burn</div>
                  <div className="font-extrabold text-amber-400 mt-0.5">{todayWorkout.estCaloriesBurn} kcal</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Difficulty</div>
                  <div className="font-extrabold text-purple-400 mt-0.5">
                    {todayWorkout.difficulty || 'Advanced'}
                  </div>
                </div>
              </div>

              {/* Big Start Workout Button */}
              <button
                onClick={handleStartWorkoutWithSound}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Workout
              </button>
            </div>
          </div>

          {/* SECTION 2: WORKOUT STATISTICS CARDS */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Session Metrics
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center">
                <Dumbbell className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{todayWorkout.exerciseCount}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Exercises</div>
              </div>
              <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center">
                <Layers className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{todayWorkout.totalSets || 18}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Total Sets</div>
              </div>
              <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-black text-amber-400">8,450</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Volume (kg)</div>
              </div>
            </div>
          </div>

          {/* SECTION 3: WORKOUT TIMELINE */}
          <div className="glass-panel p-4 rounded-[28px] border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Workout Timeline Flow
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Ordered Flow</span>
            </div>

            <div className="relative pl-4 space-y-3 border-l-2 border-slate-800 ml-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between text-xs">
                  {/* Circle Marker on Timeline */}
                  <div
                    className={`absolute -left-[21px] w-3.5 h-3.5 rounded-full border-2 ${
                      step.type === 'warmup'
                        ? 'bg-amber-400 border-amber-300'
                        : step.type === 'cooldown'
                        ? 'bg-purple-400 border-purple-300'
                        : 'bg-blue-500 border-blue-400'
                    }`}
                  />

                  <div
                    onClick={() => step.exerciseObj && handleExerciseClick(step.exerciseObj)}
                    className="flex-1 ml-2 cursor-pointer hover:text-cyan-300 transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {step.title}
                      {step.type === 'warmup' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold">
                          Warm-up
                        </span>
                      )}
                      {step.type === 'cooldown' && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[8px] font-bold">
                          Stretch
                        </span>
                      )}
                    </div>
                    {'subtitle' in step && (
                      <div className="text-[10px] text-slate-400">{step.subtitle}</div>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    {'duration' in step ? step.duration : `${idx}º Move`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: EXERCISE CARDS WITH RICH IMAGES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Exercise Breakdown ({todayWorkout.exercises.length})
              </h3>
              <span className="text-xs text-cyan-400 font-bold cursor-pointer hover:underline">
                Tap card for details
              </span>
            </div>

            <div className="space-y-3">
              {todayWorkout.exercises.map((ex, idx) => (
                <motion.div
                  key={ex.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleExerciseClick(ex)}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all shadow-lg flex flex-col sm:flex-row"
                >
                  {/* Left Exercise Image */}
                  <div className="relative w-full sm:w-32 h-32 shrink-0 bg-slate-900">
                    <img
                      src={
                        ex.imageUrl ||
                        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
                      }
                      alt={ex.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-950/80 text-cyan-400 font-black text-xs flex items-center justify-center border border-white/20">
                      {idx + 1}
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-purple-300 font-bold text-[9px]">
                      {ex.equipment || 'Equipment'}
                    </span>
                  </div>

                  {/* Right Exercise Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-black text-white">{ex.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">
                              {ex.targetMuscle}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                              {ex.estimatedFatigue || 'Moderate'} Fatigue
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          {ex.estimatedCalories || 110} kcal
                        </span>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-white/5">
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 block text-[8px]">Sets x Reps</span>
                        <span className="font-bold text-white">{ex.sets} × {ex.reps}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 block text-[8px]">Suggested Weight</span>
                        <span className="font-bold text-cyan-400">{ex.weightKg ? `${ex.weightKg} kg` : 'BW'}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 block text-[8px]">Rest</span>
                        <span className="font-bold text-purple-400">{ex.restSeconds}s</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECTION 5: WORKOUT TOOLS & PERFORMANCE PROGRESS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Progressive Overload</span>
                <span className="text-[9px] font-bold text-emerald-400">+2.5% Strength</span>
              </div>
              <p className="text-[10px] text-slate-400">Optimal adaptation curve detected.</p>
              <div className="w-full h-8 relative flex items-center">
                <svg className="w-full h-full" viewBox="0 0 100 30">
                  <path d="M 5 25 Q 30 18, 60 10 T 95 3" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Monthly Volume</span>
                <span className="text-[9px] font-bold text-cyan-400">48 Sessions</span>
              </div>
              <p className="text-[10px] text-slate-400">Total 12,540 kg lifted this month.</p>
              <div className="text-xs font-black text-cyan-300 pt-1">Top 5% Consistency 🔥</div>
            </div>
          </div>
        </>
      ) : (
        /* Community Workout Marketplace */
        <CommunityMarketplace
          programs={mockCommunityPrograms}
          creators={mockCreators}
          onStartProgram={(prog) => {
            soundManager.play('start_workout');
            onStartWorkout();
          }}
          onToggleLike={(progId) => {
            onToggleLikeCommunity(progId);
          }}
          onToggleSave={(progId) => {
            onToggleSaveCommunity(progId);
          }}
        />
      )}
    </div>
  );
};
