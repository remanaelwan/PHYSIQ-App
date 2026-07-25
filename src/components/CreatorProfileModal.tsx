import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Trophy,
  Star,
  Users,
  Download,
  Heart,
  Sparkles,
  Zap,
  Globe,
  Calendar,
  Instagram,
  Youtube,
  ExternalLink,
  Plus,
  UserCheck,
  Award,
  TrendingUp,
  Activity,
  Dumbbell,
  Target,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { CreatorProfile, CommunityProgram } from '../types';
import { soundManager } from '../lib/soundManager';

interface CreatorProfileModalProps {
  creator: CreatorProfile | null;
  isOpen: boolean;
  onClose: () => void;
  creatorPrograms: CommunityProgram[];
  onSelectProgram: (program: CommunityProgram) => void;
  allCreators: CreatorProfile[];
  onSelectCreator: (creator: CreatorProfile) => void;
  onStartProgramDirectly?: (program: CommunityProgram) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  creatorPrograms,
  onSelectProgram,
  allCreators,
  onSelectCreator,
  onStartProgramDirectly,
}) => {
  if (!isOpen || !creator) return null;

  const [isFollowing, setIsFollowing] = useState(creator.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(creator.followers);
  const [activeTab, setActiveTab] = useState<'programs' | 'about' | 'achievements'>('programs');

  const handleToggleFollow = () => {
    if (isFollowing) {
      soundManager.play('button_secondary');
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      soundManager.play('achievement');
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    soundManager.play('button_secondary');
    onClose();
  };

  const otherCreators = allCreators.filter((c) => c.id !== creator.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-xl bg-[#060a14] border border-white/15 sm:rounded-[36px] overflow-hidden shadow-2xl text-white h-full sm:h-[92vh] flex flex-col relative"
        >
          {/* Top Floating Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner & Profile Header */}
          <div className="relative shrink-0 overflow-hidden">
            {/* Cover Image */}
            <div className="h-44 w-full relative overflow-hidden bg-slate-900">
              <img
                src={creator.coverUrl}
                alt={creator.displayName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/40 to-transparent" />
            </div>

            {/* Profile Avatar & Actions row */}
            <div className="px-5 -mt-16 flex items-end justify-between relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#060a14] bg-slate-900 shadow-2xl">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-blue-600 text-white border-2 border-[#060a14]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Follow Button */}
              <button
                onClick={handleToggleFollow}
                className={`h-11 px-5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Follow Creator</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Name & Meta */}
            <div className="px-5 pt-3 space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">{creator.displayName}</h2>
                  <span className="text-base">{creator.flagEmoji}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-cyan-400">@{creator.username}</span>
                  <span>•</span>
                  <span>{creator.roleTitle}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                {creator.bio}
              </p>

              {/* Meta pills: Country & Joined Date */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{creator.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {creator.joinDate}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{creator.creatorLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="p-5 grid grid-cols-4 gap-2 text-center shrink-0 border-y border-white/10 my-4 bg-slate-900/40">
            <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Followers</span>
              <span className="text-sm font-black text-white mt-0.5 block">
                {followerCount.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Downloads</span>
              <span className="text-sm font-black text-cyan-400 mt-0.5 block">
                {(creator.totalDownloads / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Avg Rating</span>
              <span className="text-sm font-black text-amber-400 mt-0.5 block flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {creator.averageRating}
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Programs</span>
              <span className="text-sm font-black text-purple-400 mt-0.5 block">
                {creator.programsPublished}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 flex border-b border-white/10 shrink-0 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('programs')}
              className={`pb-3 relative transition-all ${
                activeTab === 'programs' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published Programs ({creatorPrograms.length})
              {activeTab === 'programs' && (
                <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 relative transition-all ${
                activeTab === 'about' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fitness Info
              {activeTab === 'about' && (
                <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-3 relative transition-all ${
                activeTab === 'achievements' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Achievements & Badges
              {activeTab === 'achievements' && (
                <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {activeTab === 'programs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Master Programs by {creator.displayName}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-semibold">Tap card to inspect</span>
                </div>

                <div className="space-y-3">
                  {creatorPrograms.map((prog) => (
                    <motion.div
                      key={prog.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelectProgram(prog)}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex gap-3 items-center shadow-lg"
                    >
                      <img
                        src={prog.coverImage}
                        alt={prog.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[9px] font-bold">
                            {prog.difficulty} • {prog.durationWeeks} Wks
                          </span>
                          <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {prog.rating}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white truncate">{prog.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{prog.description}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3 text-cyan-400" />
                            {(prog.downloads / 1000).toFixed(1)}k imports
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            {prog.likes}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-5">
                {/* Fitness Specs Grid */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Dumbbell className="w-4 h-4" />
                    Fitness & Training Methodology
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Primary Goal</span>
                      <div className="font-extrabold text-white">{creator.primaryGoal}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Experience Level</span>
                      <div className="font-extrabold text-purple-300">{creator.experienceLevel}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Training Style</span>
                      <div className="font-extrabold text-cyan-300">{creator.trainingStyle}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Favorite Split</span>
                      <div className="font-extrabold text-amber-300">{creator.favoriteSplit}</div>
                    </div>
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Specializations & Muscle Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-cyan-200 text-xs font-extrabold border border-cyan-500/30"
                      >
                        ⚡ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Community Timeline
                  </h3>
                  <div className="space-y-2 pl-3 border-l-2 border-slate-800 ml-1">
                    {creator.recentActivity.map((act) => (
                      <div key={act.id} className="text-xs relative pl-3">
                        <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                        <p className="text-slate-200 font-medium">{act.text}</p>
                        <span className="text-[10px] text-slate-400">{act.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                {creator.socialLinks && (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Verified External Channels
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${creator.socialLinks.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-300 text-xs font-bold border border-pink-500/30 flex items-center gap-1.5 hover:bg-pink-500/20"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>@{creator.socialLinks.instagram}</span>
                        </a>
                      )}
                      {creator.socialLinks.youtube && (
                        <a
                          href={`https://youtube.com`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 hover:bg-red-500/20"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>{creator.socialLinks.youtube}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Creator Trophies & Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {creator.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-slate-800/80 border border-amber-500/30 flex gap-3 items-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{ach.title}</h4>
                        <p className="text-[10px] text-slate-300 leading-snug">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Creator Recommendation Section */}
            {otherCreators.length > 0 && (
              <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>AI Recommended Creators For You</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                  {otherCreators.map((other) => (
                    <div
                      key={other.id}
                      onClick={() => onSelectCreator(other)}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 cursor-pointer min-w-[180px] shrink-0 space-y-2 text-center"
                    >
                      <img
                        src={other.avatarUrl}
                        alt={other.displayName}
                        className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-cyan-400"
                      />
                      <div>
                        <div className="text-xs font-black text-white truncate">{other.displayName}</div>
                        <div className="text-[9px] text-slate-400 truncate">{other.roleTitle}</div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 font-bold block">
                        {(other.totalDownloads / 1000).toFixed(0)}k imports
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
