import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Flame,
  Award,
  Activity,
  Edit3,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Dumbbell,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Eye,
  Trophy,
  Zap,
  CheckCircle2,
  Watch,
  X,
  FileText,
  Sliders,
  Target,
  Scale,
  Droplet,
  Settings as GearIcon,
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  Smartphone,
  Globe,
  Lock,
  ArrowUpRight,
  BarChart2,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, UserGoal } from '../types';
import { soundManager } from '../lib/soundManager';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onReopenOnboarding: () => void;
  onSignOut: () => void;
}

// Achievements / Badges Data Interface
interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedDate?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  color: string;
}

const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: '100 Workouts',
    description: 'Complete 100 full workout sessions on PhysIQ.',
    icon: '🏆',
    category: 'Consistency',
    unlocked: true,
    unlockedDate: 'July 10, 2024',
    currentValue: 100,
    targetValue: 100,
    unit: 'workouts',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'ach-2',
    title: '30 Day Streak',
    description: 'Maintain an active daily workout & logging streak for 30 consecutive days.',
    icon: '🔥',
    category: 'Streak',
    unlocked: true,
    unlockedDate: 'June 28, 2024',
    currentValue: 30,
    targetValue: 30,
    unit: 'days',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'ach-3',
    title: 'First Muscle Gain',
    description: 'Successfully gain 2+ kg of lean muscular tissue confirmed by AI body tracking.',
    icon: '💪',
    category: 'Hypertrophy',
    unlocked: true,
    unlockedDate: 'May 12, 2024',
    currentValue: 2.8,
    targetValue: 2.0,
    unit: 'kg',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'ach-4',
    title: 'Elite Recovery',
    description: 'Achieve a 90%+ WHOOP-style physical readiness recovery score for 5 days.',
    icon: '⚡',
    category: 'Recovery',
    unlocked: true,
    unlockedDate: 'June 04, 2024',
    currentValue: 92,
    targetValue: 90,
    unit: '%',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ach-5',
    title: 'Nutrition Master',
    description: 'Hit your exact macro targets for 14 straight days.',
    icon: '🥗',
    category: 'Nutrition',
    unlocked: true,
    unlockedDate: 'July 01, 2024',
    currentValue: 14,
    targetValue: 14,
    unit: 'days',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'ach-6',
    title: 'Heavy Lifter',
    description: 'Surpass a 100kg Bench Press or 140kg Squat 1RM benchmark.',
    icon: '🏋️',
    category: 'Strength',
    unlocked: true,
    unlockedDate: 'July 18, 2024',
    currentValue: 120,
    targetValue: 100,
    unit: 'kg',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'ach-7',
    title: 'Cardio King',
    description: 'Log 50,000 steps and 200+ active minutes in a single week.',
    icon: '🚴',
    category: 'Endurance',
    unlocked: false,
    currentValue: 42000,
    targetValue: 50000,
    unit: 'steps',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'ach-8',
    title: 'Level 18 Athlete',
    description: 'Accumulate 4,800+ XP in the PhysIQ ecosystem.',
    icon: '🥇',
    category: 'XP Level',
    unlocked: true,
    unlockedDate: 'Yesterday',
    currentValue: 4850,
    targetValue: 4800,
    unit: 'XP',
    color: 'from-amber-400 to-amber-600',
  },
];

// Activity Timeline Mock Items
const TIMELINE_ITEMS = [
  {
    id: 'act-1',
    type: 'workout',
    title: 'Completed Push Day Workout',
    details: '65 min • 520 kcal • 18 sets completed',
    time: 'Yesterday at 5:30 PM',
    icon: Dumbbell,
    iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  },
  {
    id: 'act-2',
    type: 'publish',
    title: 'Published New Program "V-Taper Hypertrophy"',
    details: 'Received 120 downloads and 45 likes in 24 hours',
    time: '2 days ago',
    icon: Award,
    iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  },
  {
    id: 'act-3',
    type: 'level',
    title: 'Reached Level 18 Pro Athlete',
    details: 'Unlocked Elite Recovery Analytics & VisionOS HUD theme',
    time: '3 days ago',
    icon: Trophy,
    iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  },
  {
    id: 'act-4',
    type: 'badge',
    title: 'Unlocked "Heavy Lifter" Badge',
    details: '120kg Barbell Back Squat recorded in workout log',
    time: '4 days ago',
    icon: Zap,
    iconColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
  },
  {
    id: 'act-5',
    type: 'challenge',
    title: 'Joined Weekly Hydration Challenge',
    details: 'Drank 3.0L water daily for 7 days (+250 XP claimed)',
    time: '5 days ago',
    icon: Droplet,
    iconColor: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onReopenOnboarding,
  onSignOut,
}) => {
  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPublicViewOpen, setIsPublicViewOpen] = useState(false);
  const [socialModalType, setSocialModalType] = useState<'followers' | 'following' | 'programs' | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Settings Toggles
  const [unitSystem, setUnitSystem] = useState<'Metric' | 'Imperial'>('Metric');
  const [notifications, setNotifications] = useState(true);
  const [isMuted, setIsMuted] = useState(soundManager.isMutedState());
  const [appearance, setAppearance] = useState<'Dark' | 'VisionOS'>('VisionOS');
  const [language, setLanguage] = useState('English');
  const [connectedDevices, setConnectedDevices] = useState({
    appleWatch: true,
    whoop: true,
    garmin: false,
    oura: false,
  });

  // Achievements Filter
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(true);

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    soundManager.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  // Export Data
  const handleExportData = () => {
    soundManager.play('button_click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PhysIQ_Athlete_Profile_${profile.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleDevice = (key: keyof typeof connectedDevices) => {
    soundManager.play('switch');
    setConnectedDevices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Overall Health Score
  const overallHealthScore = Math.min(
    100,
    Math.round(profile.overallRecoveryScore * 0.4 + 88 * 0.3 + 95 * 0.3)
  );

  const displayedBadges = INITIAL_ACHIEVEMENTS.filter((b) => (showOnlyUnlocked ? b.unlocked : true));

  return (
    <div className="w-full min-h-screen bg-[#04060c] text-white pt-10 pb-28 px-4 max-w-md mx-auto space-y-5 select-none font-sans">
      
      {/* TOP HEADER: ATHLETE LEVEL BAR & GEAR SETTINGS BUTTON */}
      <div className="flex items-center justify-between gap-3">
        {/* XP Level Badge */}
        <div className="flex-1 glass-panel p-2.5 rounded-2xl border border-white/15 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white uppercase tracking-wider">Level 18</span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[8px] font-extrabold border border-blue-400/30">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full w-[94%]" />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold">4,850 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small Premium Gear Settings Icon */}
        <button
          onClick={() => {
            soundManager.play('button_click');
            setIsSettingsOpen(true);
          }}
          className="p-3 rounded-2xl glass-panel border border-white/15 text-slate-300 hover:text-white hover:border-blue-500/40 active:scale-95 transition-all shadow-lg shrink-0"
          title="Open Settings"
        >
          <GearIcon className="w-5 h-5 text-slate-300 hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* 1. INSTAGRAM/STRAVA STYLE SOCIAL PROFILE HEADER */}
      <div className="glass-panel p-6 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl text-center bg-gradient-to-b from-blue-950/30 via-slate-900/90 to-slate-950">
        {/* Halo Backlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 blur-sm opacity-80 animate-pulse" />
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full rounded-full object-cover relative z-10 border-2 border-white/30 shadow-2xl"
          />
          <div className="absolute bottom-0 right-0 z-20 p-1 rounded-full bg-blue-600 border-2 border-slate-950 text-white shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-cyan-300 fill-cyan-400/30" />
          </div>
        </div>

        {/* Display Name & Username */}
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
          <span>{profile.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
            VERIFIED
          </span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          @{profile.name.toLowerCase().replace(/\s+/g, '')}.physiq
        </p>

        {/* Primary Goal Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-xs font-extrabold shadow-inner">
          <span className="text-slate-400 text-[10px]">GOAL:</span>
          <span className="text-cyan-400 font-black">
            {profile.goal === 'Lose Fat' && '🔥 Lose Fat'}
            {profile.goal === 'Build Muscle' && '💪 Build Muscle'}
            {profile.goal === 'Increase Strength' && '🏋 Increase Strength'}
            {profile.goal === 'Stay Healthy' && '❤️ Stay Healthy'}
            {!['Lose Fat', 'Build Muscle', 'Increase Strength', 'Stay Healthy'].includes(profile.goal) && `✨ ${profile.goal}`}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 font-semibold">
          PhysIQ Member since Jan 2024
        </p>

        {/* SOCIAL COUNTERS ROW (Followers, Following, Programs Published) */}
        <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-center">
          <button
            onClick={() => {
              soundManager.play('button_click');
              setSocialModalType('followers');
            }}
            className="p-1 hover:bg-white/5 rounded-xl transition-all"
          >
            <span className="text-lg font-black text-white block">1,284</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Followers</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_click');
              setSocialModalType('following');
            }}
            className="p-1 hover:bg-white/5 rounded-xl transition-all border-x border-white/10"
          >
            <span className="text-lg font-black text-white block">317</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Following</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_click');
              setSocialModalType('programs');
            }}
            className="p-1 hover:bg-white/5 rounded-xl transition-all"
          >
            <span className="text-lg font-black text-cyan-400 block">26</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Programs</span>
          </button>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-bold">
          <button
            onClick={() => {
              soundManager.play('button_click');
              setIsEditProfileOpen(true);
            }}
            className="py-2.5 px-2 rounded-2xl glass-panel border border-blue-500/30 hover:border-blue-400 text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_click');
              setIsShareModalOpen(true);
            }}
            className="py-2.5 px-2 rounded-2xl glass-panel border border-white/15 hover:border-white/30 text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_click');
              setIsPublicViewOpen(true);
            }}
            className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Profile</span>
          </button>
        </div>
      </div>

      {/* 2. KEY FITNESS STATISTICS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Key Statistics</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Lifetime Stats</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-blue-500/30 transition-all">
            <Dumbbell className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">48</div>
            <div className="text-[9px] font-semibold text-slate-400">Total Workouts</div>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 transition-all">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black text-amber-400">14 Days</div>
            <div className="text-[9px] font-semibold text-slate-400">Workout Streak</div>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all">
            <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-black text-emerald-400">{profile.overallRecoveryScore}%</div>
            <div className="text-[9px] font-semibold text-slate-400">Recovery Score</div>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-orange-500/30 transition-all col-span-1.5">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">34,200</div>
            <div className="text-[9px] font-semibold text-slate-400">Calories Burned</div>
          </div>

          <div className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all col-span-1.5">
            <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">56.4 Hours</div>
            <div className="text-[9px] font-semibold text-slate-400">Total Hours Trained</div>
          </div>
        </div>
      </div>

      {/* 3. GOAL PROGRESS & JOURNEY TRENDS */}
      <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Goal Journey Progress</h2>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold">On Track</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Weight Progress */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-400" /> Weight Progress
              </span>
              <span className="text-blue-300 font-bold">
                {profile.weightKg} kg <span className="text-slate-500 font-normal">→ {profile.targetWeightKg} kg</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[72%]" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
              <span>Start: 82.0 kg</span>
              <span>72% Completed</span>
              <span>Target: {profile.targetWeightKg} kg</span>
            </div>
          </div>

          {/* Muscle Growth */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-purple-400" /> Muscle Growth (Lean Mass)
              </span>
              <span className="text-purple-300 font-bold">+2.8 kg Lean Mass</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[85%]" />
            </div>
          </div>

          {/* Strength Progress */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Strength Overload
              </span>
              <span className="text-amber-300 font-bold">+18% Avg 1RM Increase</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[80%]" />
            </div>
          </div>

          {/* Recovery Trend Graph */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Weekly Recovery Trend
              </span>
              <span className="text-emerald-400 font-bold">88% Avg</span>
            </div>
            <div className="flex items-end justify-between h-10 pt-2 gap-1 text-[8px] text-slate-400">
              {[
                { day: 'M', val: 82 },
                { day: 'T', val: 92 },
                { day: 'W', val: 78 },
                { day: 'T', val: 95 },
                { day: 'F', val: 88 },
                { day: 'S', val: 90 },
                { day: 'S', val: 94 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-slate-800 rounded-t-md overflow-hidden flex items-end h-8">
                    <div
                      className="w-full bg-emerald-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACHIEVEMENTS & UNLOCKED BADGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Achievements & Badges</h2>
          </div>
          <button
            onClick={() => {
              soundManager.play('button_click');
              setShowOnlyUnlocked(!showOnlyUnlocked);
            }}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
          >
            {showOnlyUnlocked ? 'Show All' : 'Unlocked First'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {displayedBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                soundManager.play('button_click');
                setSelectedBadge(badge);
              }}
              className={`p-3 rounded-2xl glass-panel border transition-all cursor-pointer relative overflow-hidden group ${
                badge.unlocked ? 'border-amber-500/30 hover:border-amber-400' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg bg-gradient-to-br ${badge.color}`}
                >
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                  <span className="text-[9px] text-slate-400 block truncate">{badge.category}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-1 mb-1.5">{badge.description}</p>

              <div className="flex items-center justify-between text-[9px] font-bold">
                {badge.unlocked ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" /> Unlocked
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {badge.currentValue}/{badge.targetValue} {badge.unit}
                  </span>
                )}
                <span className="text-slate-500 group-hover:text-white transition-colors">Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECENT ACTIVITY TIMELINE */}
      <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Activity Timeline</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Recent Log</span>
        </div>

        <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {TIMELINE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-3 relative pl-1">
                <div className={`p-2 rounded-xl border shrink-0 z-10 ${item.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 bg-slate-900/60 p-2.5 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.details}</p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-1">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEDICATED SETTINGS PAGE MODAL (OPENED VIA TOP GEAR ICON) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsPageModal
            profile={profile}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            notifications={notifications}
            setNotifications={setNotifications}
            isMuted={isMuted}
            handleToggleMute={handleToggleMute}
            appearance={appearance}
            setAppearance={setAppearance}
            language={language}
            setLanguage={setLanguage}
            connectedDevices={connectedDevices}
            toggleDevice={toggleDevice}
            handleExportData={handleExportData}
            onReopenOnboarding={onReopenOnboarding}
            onSignOut={onSignOut}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <EditProfileModal
            profile={profile}
            onClose={() => setIsEditProfileOpen(false)}
            onSave={(updated) => {
              onUpdateProfile(updated);
              setIsEditProfileOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* SHARE PROFILE MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <ShareProfileModal profile={profile} onClose={() => setIsShareModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* PUBLIC PROFILE MODAL */}
      <AnimatePresence>
        {isPublicViewOpen && (
          <PublicProfileModal profile={profile} onClose={() => setIsPublicViewOpen(false)} />
        )}
      </AnimatePresence>

      {/* SOCIAL LIST MODAL (FOLLOWERS / FOLLOWING / PROGRAMS) */}
      <AnimatePresence>
        {socialModalType && (
          <SocialListModal type={socialModalType} onClose={() => setSocialModalType(null)} />
        )}
      </AnimatePresence>

      {/* BADGE DETAIL MODAL */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* DEDICATED SETTINGS PAGE MODAL */
/* -------------------------------------------------------------------------- */
interface SettingsPageModalProps {
  profile: UserProfile;
  unitSystem: 'Metric' | 'Imperial';
  setUnitSystem: (u: 'Metric' | 'Imperial') => void;
  notifications: boolean;
  setNotifications: (n: boolean) => void;
  isMuted: boolean;
  handleToggleMute: () => void;
  appearance: 'Dark' | 'VisionOS';
  setAppearance: (a: 'Dark' | 'VisionOS') => void;
  language: string;
  setLanguage: (l: string) => void;
  connectedDevices: Record<string, boolean>;
  toggleDevice: (k: any) => void;
  handleExportData: () => void;
  onReopenOnboarding: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

const SettingsPageModal: React.FC<SettingsPageModalProps> = ({
  profile,
  unitSystem,
  setUnitSystem,
  notifications,
  setNotifications,
  isMuted,
  handleToggleMute,
  appearance,
  setAppearance,
  language,
  setLanguage,
  connectedDevices,
  toggleDevice,
  handleExportData,
  onReopenOnboarding,
  onSignOut,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <GearIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Settings</h3>
              <p className="text-[10px] text-slate-400">Account, preferences & integrations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Categories */}
        <div className="space-y-4 text-xs">
          {/* Account Overview */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account</span>
            <div className="flex items-center justify-between text-white font-semibold">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>{profile.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">Primary Pro Account</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-blue-400" />
              <div>
                <span className="font-semibold text-white block">Notifications</span>
                <span className="text-[10px] text-slate-400">Push reminders for workouts & hydration</span>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !notifications;
                soundManager.play(nextVal ? 'toggle_on' : 'toggle_off');
                setNotifications(nextVal);
              }}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Privacy & Security */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-white block">Privacy Settings</span>
                <span className="text-[10px] text-slate-400">Public profile & leaderboard visibility</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              Public
            </span>
          </div>

          {/* Units */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Units System</span>
                <span className="text-[10px] text-slate-400">Weight & measurement standards</span>
              </div>
            </div>
            <div className="flex glass-pill p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => {
                  soundManager.play('switch');
                  setUnitSystem('Metric');
                }}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  unitSystem === 'Metric' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Metric (kg)
              </button>
              <button
                onClick={() => {
                  soundManager.play('switch');
                  setUnitSystem('Imperial');
                }}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  unitSystem === 'Imperial' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Imperial (lbs)
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-semibold text-white block">Appearance Theme</span>
                <span className="text-[10px] text-slate-400">Glassmorphism HUD style</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.play('switch');
                setAppearance(appearance === 'Dark' ? 'VisionOS' : 'Dark');
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-cyan-300 font-bold text-[10px]"
            >
              {appearance === 'VisionOS' ? '✨ VisionOS' : '🌙 Premium Dark'}
            </button>
          </div>

          {/* Language */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Language</span>
                <span className="text-[10px] text-slate-400">App interface language</span>
              </div>
            </div>
            <span className="text-slate-300 font-bold">English (US)</span>
          </div>

          {/* Connected Devices */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
            <span className="font-semibold text-slate-300 block text-[11px]">Connected Devices</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleDevice('appleWatch')}
                className={`p-2 rounded-xl border flex items-center justify-between text-[10px] font-bold ${
                  connectedDevices.appleWatch
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-950 border-white/5 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Watch className="w-3.5 h-3.5" /> Apple Watch
                </span>
                <span>{connectedDevices.appleWatch ? 'Connected' : 'Connect'}</span>
              </button>

              <button
                onClick={() => toggleDevice('whoop')}
                className={`p-2 rounded-xl border flex items-center justify-between text-[10px] font-bold ${
                  connectedDevices.whoop
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-white/5 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> WHOOP 4.0
                </span>
                <span>{connectedDevices.whoop ? 'Connected' : 'Connect'}</span>
              </button>
            </div>
          </div>

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white">Export Data (.JSON)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Support */}
          <a
            href="mailto:support@physiq.app"
            className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span className="font-semibold text-white">Support & Help Center</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>

          {/* About PhysIQ */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">About PhysIQ</span>
            </div>
            <span className="text-slate-400 font-bold text-[10px]">v3.4.0 (VisionOS Edition)</span>
          </div>

          {/* Re-run AI Onboarding */}
          <button
            onClick={() => {
              soundManager.play('screen_transition');
              onClose();
              onReopenOnboarding();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between hover:bg-slate-800/80 transition-colors text-purple-300"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span className="font-semibold">Re-run AI Onboarding Assessment</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            soundManager.play('logout');
            onClose();
            onSignOut();
          }}
          className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs hover:bg-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PhysIQ</span>
        </button>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* EDIT PROFILE MODAL */
/* -------------------------------------------------------------------------- */
interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    goal: profile.goal,
    weightKg: profile.weightKg,
    targetWeightKg: profile.targetWeightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    gender: profile.gender,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.play('workout_finished');
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Edit Athlete Profile</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 text-[10px] font-bold block mb-1">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 text-[10px] font-bold block mb-1">Primary Fitness Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as UserGoal })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Lose Fat">🔥 Lose Fat</option>
              <option value="Build Muscle">💪 Build Muscle</option>
              <option value="Increase Strength">🏋 Increase Strength</option>
              <option value="Stay Healthy">❤️ Stay Healthy</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[10px] font-bold block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: parseFloat(e.target.value) || 70 })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/30"
            >
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SHARE PROFILE MODAL */
/* -------------------------------------------------------------------------- */
interface ShareProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ profile, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://physiq.app/athlete/@${profile.name.toLowerCase().replace(/\s+/g, '')}`;

  const handleCopy = () => {
    soundManager.play('button_click');
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 text-center"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Share Athlete Profile</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-500/30 space-y-2">
          <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full mx-auto border-2 border-cyan-400" />
          <h4 className="text-base font-black text-white">{profile.name}</h4>
          <p className="text-xs text-cyan-400 font-bold">Level 18 Pro Athlete • 14 Day Streak 🔥</p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs">
          <span className="flex-1 truncate text-slate-300 font-mono text-[10px]">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] shrink-0"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PUBLIC PROFILE MODAL */
/* -------------------------------------------------------------------------- */
interface PublicProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ profile, onClose }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 my-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Public Athlete View
          </span>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Header Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-900 border border-blue-500/30 text-center space-y-3">
          <img src={profile.avatarUrl} alt={profile.name} className="w-20 h-20 rounded-full mx-auto border-2 border-cyan-400 shadow-xl" />
          <div>
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-1">
              {profile.name} <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">@{profile.name.toLowerCase().replace(/\s+/g, '')}.physiq</p>
          </div>

          <button
            onClick={() => {
              soundManager.play('button_click');
              setIsFollowing(!isFollowing);
            }}
            className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all shadow-lg ${
              isFollowing
                ? 'bg-slate-800 text-slate-300 border border-white/10'
                : 'bg-blue-600 text-white shadow-blue-500/20'
            }`}
          >
            {isFollowing ? '✓ Following Athlete' : '+ Follow Athlete'}
          </button>
        </div>

        {/* Public Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
            <span className="text-slate-400 text-[9px] block font-bold">WORKOUTS</span>
            <span className="font-black text-white text-base">48</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
            <span className="text-slate-400 text-[9px] block font-bold">STREAK</span>
            <span className="font-black text-amber-400 text-base">14 Days</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
            <span className="text-slate-400 text-[9px] block font-bold">RECOVERY</span>
            <span className="font-black text-emerald-400 text-base">{profile.overallRecoveryScore}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SOCIAL LIST MODAL */
/* -------------------------------------------------------------------------- */
interface SocialListModalProps {
  type: 'followers' | 'following' | 'programs';
  onClose: () => void;
}

const SocialListModal: React.FC<SocialListModalProps> = ({ type, onClose }) => {
  const title = type === 'followers' ? 'Followers (1,284)' : type === 'following' ? 'Following (317)' : 'Programs Published (26)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold text-white">
                  A{i}
                </div>
                <div>
                  <h4 className="font-bold text-white">Athlete_{i * 14}</h4>
                  <span className="text-[10px] text-slate-400">Level 1{i} Athlete</span>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold text-[10px]">
                View
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* BADGE DETAIL MODAL */
/* -------------------------------------------------------------------------- */
interface BadgeDetailModalProps {
  badge: AchievementBadge;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xs glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl text-center space-y-3"
      >
        <div
          className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br ${badge.color}`}
        >
          {badge.icon}
        </div>

        <h3 className="text-lg font-black text-white">{badge.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{badge.description}</p>

        {badge.unlocked ? (
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
            🏆 Unlocked on {badge.unlockedDate || 'Recently'}
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-bold">
            Progress: {badge.currentValue} / {badge.targetValue} {badge.unit}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};
