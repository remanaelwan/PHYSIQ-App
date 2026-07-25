import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Download,
  Heart,
  Bookmark,
  Share2,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  Dumbbell,
  Target,
  Sparkles,
  Zap,
  Play,
  Layers,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  User,
  Plus,
} from 'lucide-react';
import { CommunityProgram, CreatorProfile } from '../types';
import { soundManager } from '../lib/soundManager';

interface ProgramDetailModalProps {
  program: CommunityProgram | null;
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile | null;
  onOpenCreatorProfile: (creator: CreatorProfile) => void;
  onStartProgram: (program: CommunityProgram) => void;
  onToggleLike: (programId: string) => void;
  onToggleSave: (programId: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  isOpen,
  onClose,
  creator,
  onOpenCreatorProfile,
  onStartProgram,
  onToggleLike,
  onToggleSave,
}) => {
  if (!isOpen || !program) return null;

  const [isLiked, setIsLiked] = useState(program.isLiked || false);
  const [isSaved, setIsSaved] = useState(program.isSaved || false);
  const [likesCount, setLikesCount] = useState(program.likes);
  const [savesCount, setSavesCount] = useState(program.saves);
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(program.reviews || []);

  const handleClose = () => {
    soundManager.play('button_secondary');
    onClose();
  };

  const handleLike = () => {
    if (isLiked) {
      soundManager.play('button_secondary');
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      soundManager.play('achievement');
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    onToggleLike(program.id);
  };

  const handleSave = () => {
    if (isSaved) {
      soundManager.play('button_secondary');
      setIsSaved(false);
      setSavesCount((prev) => prev - 1);
    } else {
      soundManager.play('toggle_on');
      setIsSaved(true);
      setSavesCount((prev) => prev + 1);
    }
    onToggleSave(program.id);
  };

  const handleStart = () => {
    soundManager.play('start_workout');
    onStartProgram(program);
    onClose();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    soundManager.play('achievement');
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: 'Ahmed (You)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: userRating || 5,
      comment: reviewComment,
      date: 'Just now',
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    setUserRating(0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-xl bg-[#060a14] border border-white/15 sm:rounded-[36px] overflow-hidden shadow-2xl text-white h-full sm:h-[92vh] flex flex-col relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Image & Glass Overlay */}
          <div className="relative h-64 shrink-0 overflow-hidden bg-slate-900">
            <img
              src={program.coverImage}
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/50 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-md border border-blue-400/30">
                {program.category || program.goal}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-600/80 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-md border border-purple-400/30">
                {program.difficulty}
              </span>
            </div>

            {/* Bottom Title & Metrics on Cover Image */}
            <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
              <h2 className="text-2xl font-black text-white drop-shadow-md">{program.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {program.rating} Rating
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Download className="w-3.5 h-3.5" />
                  {(program.downloads / 1000).toFixed(1)}k Imports
                </span>
              </div>
            </div>
          </div>

          {/* Creator Profile Bar */}
          <div
            onClick={() => creator && onOpenCreatorProfile(creator)}
            className="px-5 py-3.5 bg-slate-900/80 border-y border-white/10 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-all shrink-0"
          >
            <div className="flex items-center gap-3">
              <img
                src={program.creatorAvatar}
                alt={program.creatorName}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-cyan-400"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  {program.creatorName}
                  {program.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <div className="text-[10px] text-slate-400">{program.creatorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-cyan-400 font-bold">
              <span>View Creator Profile</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Main Content */}
          <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Quick Spec Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Duration</span>
                <span className="text-sm font-black text-white mt-0.5 block">
                  {program.durationWeeks} Weeks
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Frequency</span>
                <span className="text-sm font-black text-cyan-400 mt-0.5 block">
                  {program.workoutsPerWeek} Days/Wk
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Session Time</span>
                <span className="text-sm font-black text-purple-400 mt-0.5 block">
                  ~{program.estimatedSessionMin}m
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Est. Burn</span>
                <span className="text-sm font-black text-amber-400 mt-0.5 block">
                  {program.estCaloriesBurn} kcal
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Program Overview
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {program.description}
              </p>
            </div>

            {/* Muscle Targets & Gear */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>Target Muscles</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {program.targetMuscles.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="text-xs font-extrabold text-purple-400 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" />
                  <span>Equipment Needed</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {program.equipment.map((eq) => (
                    <span key={eq} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Schedule Breakdown */}
            {program.weeklySchedule && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Weekly Schedule Breakdown
                </h3>
                <div className="space-y-2">
                  {program.weeklySchedule.map((sched, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-[10px] font-black text-cyan-400 uppercase bg-cyan-500/10 py-1 px-2 rounded-lg text-center">
                          {sched.day}
                        </span>
                        <div>
                          <div className="font-bold text-white">{sched.title}</div>
                          <div className="text-[10px] text-slate-400">{sched.focus}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-300">
                        {sched.exercisesCount} Moves
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Exercises */}
            {program.exercises && program.exercises.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Sample Routine Exercises
                </h3>
                <div className="space-y-2">
                  {program.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="font-bold text-white">{ex.name}</div>
                      <div className="text-slate-400 text-[11px]">
                        {ex.sets} sets × {ex.reps} reps
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Reviews Section */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Community Reviews ({reviewsList.length})
                </h3>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {program.rating} Overall
                </span>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Rate this program:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= userRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your review or feedback..."
                    className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Review Items */}
              <div className="space-y-2">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-white">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {rev.rating}.0
                      </div>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-snug">{rev.comment}</p>
                    <span className="text-[9px] text-slate-500 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-white/10 bg-[#060a14] shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`p-3 rounded-2xl border transition-all ${
                  isLiked
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleSave}
                className={`p-3 rounded-2xl border transition-all ${
                  isSaved
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleStart}
              className="flex-1 h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Program</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
