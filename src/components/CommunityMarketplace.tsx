import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Flame,
  Star,
  Sparkles,
  Plus,
  Bookmark,
  CheckCircle2,
  Download,
  Heart,
  Dumbbell,
  Clock,
  Target,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import { CommunityProgram, CreatorProfile, WorkoutProgram } from '../types';
import { ProgramDetailModal } from './ProgramDetailModal';
import { CreatorProfileModal } from './CreatorProfileModal';
import { PublishProgramModal } from './PublishProgramModal';
import { soundManager } from '../lib/soundManager';

interface CommunityMarketplaceProps {
  programs: CommunityProgram[];
  creators: CreatorProfile[];
  onStartProgram: (program: CommunityProgram) => void;
  onToggleLike: (programId: string) => void;
  onToggleSave: (programId: string) => void;
}

export const CommunityMarketplace: React.FC<CommunityMarketplaceProps> = ({
  programs,
  creators,
  onStartProgram,
  onToggleLike,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('🔥 Trending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMarketTab, setActiveMarketTab] = useState<'Discover' | 'Saved' | 'Published' | 'Creators'>('Discover');

  // Modals
  const [selectedProgramForModal, setSelectedProgramForModal] = useState<CommunityProgram | null>(null);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState<CreatorProfile | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Local state for user's published programs
  const [userPublishedPrograms, setUserPublishedPrograms] = useState<CommunityProgram[]>([]);

  const categories = [
    '🔥 Trending',
    '⭐ Most Popular',
    '🆕 New Programs',
    '💪 Muscle Building',
    '🔥 Fat Loss',
    '⚖ Weight Gain',
    '🏋 Strength',
    '🏃 Endurance',
    '🏠 Home Workouts',
    '🏋 Gym Workouts',
  ];

  const handleCategorySelect = (cat: string) => {
    soundManager.play('button_secondary');
    setSelectedCategory(cat);
  };

  const handleOpenCreator = (creator: CreatorProfile) => {
    soundManager.play('button_primary');
    setSelectedCreatorForModal(creator);
  };

  const handleOpenProgram = (program: CommunityProgram) => {
    soundManager.play('button_primary');
    setSelectedProgramForModal(program);
  };

  const handlePublishNewProgram = (newProg: CommunityProgram) => {
    setUserPublishedPrograms([newProg, ...userPublishedPrograms]);
  };

  // Filter programs based on tab, category, search
  const filteredPrograms = programs.filter((p) => {
    if (activeMarketTab === 'Saved') {
      if (!p.isSaved) return false;
    }
    if (activeMarketTab === 'Published') {
      if (!p.isPublishedByMe) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCreator = p.creatorName.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCreator && !matchTag) return false;
    }
    if (selectedCategory && activeMarketTab === 'Discover') {
      if (selectedCategory === '🔥 Trending') return p.rating >= 4.9;
      if (selectedCategory === '⭐ Most Popular') return p.downloads >= 30000;
      if (selectedCategory === '💪 Muscle Building') return p.goal === 'Muscle Building';
      if (selectedCategory === '🔥 Fat Loss') return p.goal === 'Fat Loss';
      if (selectedCategory === '🏋 Strength') return p.goal === 'Strength';
      if (selectedCategory === '🏠 Home Workouts') return p.location === 'Home';
      if (selectedCategory === '🏋 Gym Workouts') return p.location === 'Gym';
    }
    return true;
  });

  // Find creator for selected program
  const currentProgramCreator = selectedProgramForModal
    ? creators.find((c) => c.id === selectedProgramForModal.creatorId) || creators[0]
    : null;

  // Find programs created by selected creator
  const currentCreatorPrograms = selectedCreatorForModal
    ? programs.filter((p) => p.creatorId === selectedCreatorForModal.id)
    : [];

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Modals */}
      <ProgramDetailModal
        program={selectedProgramForModal}
        isOpen={!!selectedProgramForModal}
        onClose={() => setSelectedProgramForModal(null)}
        creator={currentProgramCreator}
        onOpenCreatorProfile={(creator) => {
          setSelectedProgramForModal(null);
          setSelectedCreatorForModal(creator);
        }}
        onStartProgram={onStartProgram}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
      />

      <CreatorProfileModal
        creator={selectedCreatorForModal}
        isOpen={!!selectedCreatorForModal}
        onClose={() => setSelectedCreatorForModal(null)}
        creatorPrograms={currentCreatorPrograms}
        onSelectProgram={(prog) => {
          setSelectedCreatorForModal(null);
          setSelectedProgramForModal(prog);
        }}
        allCreators={creators}
        onSelectCreator={(c) => setSelectedCreatorForModal(c)}
      />

      <PublishProgramModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishNewProgram}
      />

      {/* Top Search & Create Bar */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, creators, muscles..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
          />
        </div>

        <button
          onClick={() => {
            soundManager.play('button_primary');
            setIsPublishModalOpen(true);
          }}
          className="h-10 px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish</span>
        </button>
      </div>

      {/* Marketplace Tab Switcher */}
      <div className="flex border-b border-white/10 text-xs font-bold gap-4">
        {(['Discover', 'Saved', 'Published', 'Creators'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              soundManager.play('toggle_on');
              setActiveMarketTab(tab);
            }}
            className={`pb-2.5 relative transition-all ${
              activeMarketTab === tab ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'Discover' && '🔥 Discover'}
            {tab === 'Saved' && `📥 Saved Library (${programs.filter((p) => p.isSaved).length})`}
            {tab === 'Published' && `✍ My Programs (${userPublishedPrograms.length})`}
            {tab === 'Creators' && '👥 Master Creators'}
            {activeMarketTab === tab && (
              <motion.div layoutId="marketTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeMarketTab === 'Discover' && (
        <>
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] border border-blue-400'
                      : 'glass-card text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/60 via-purple-950/50 to-slate-950 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Targeted Recommendation</span>
              </div>
              <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full">
                98% Match
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              Based on your goal (<strong className="text-cyan-300">Muscle Hypertrophy</strong>) and recovery readiness (<strong className="text-emerald-400">92% High</strong>), we recommend starting <strong>Pro Hypertrophy Chest & Shoulders</strong> by Coach Marcus Vance today.
            </p>
          </div>

          {/* Top Master Creators Bar */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Top Verified Master Coaches
              </h3>
              <span
                onClick={() => setActiveMarketTab('Creators')}
                className="text-xs text-cyan-400 font-bold cursor-pointer hover:underline"
              >
                View All
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {creators.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpenCreator(c)}
                  className="p-3 rounded-2xl glass-card border border-white/10 hover:border-cyan-400/50 cursor-pointer w-36 shrink-0 space-y-2 text-center transition-all"
                >
                  <div className="relative w-12 h-12 mx-auto">
                    <img
                      src={c.avatarUrl}
                      alt={c.displayName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
                    />
                    {c.verified && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-600 text-white">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-white truncate">{c.displayName}</div>
                    <div className="text-[9px] text-slate-400 truncate">{c.roleTitle}</div>
                  </div>
                  <div className="text-[9px] font-bold text-amber-400 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {c.averageRating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Available Master Programs ({filteredPrograms.length})
              </h3>
              <span className="text-xs text-slate-400">{selectedCategory}</span>
            </div>

            {filteredPrograms.map((prog) => (
              <motion.div
                key={prog.id}
                whileHover={{ scale: 1.01 }}
                className="rounded-[28px] glass-panel border border-white/15 overflow-hidden shadow-2xl space-y-0 relative group cursor-pointer"
              >
                {/* Hero Cover Image */}
                <div
                  onClick={() => handleOpenProgram(prog)}
                  className="relative h-48 w-full overflow-hidden bg-slate-900"
                >
                  <img
                    src={prog.coverImage}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 font-extrabold text-[10px] border border-cyan-500/30 backdrop-blur-md">
                      {prog.goal}
                    </span>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 font-black text-[10px] border border-amber-500/30 backdrop-blur-md">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {prog.rating}
                    </div>
                  </div>

                  {/* Title & Creator on Cover */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="text-lg font-black text-white drop-shadow-md leading-tight">
                      {prog.title}
                    </h4>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        const creatorObj = creators.find((c) => c.id === prog.creatorId) || creators[0];
                        handleOpenCreator(creatorObj);
                      }}
                      className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 hover:text-cyan-300"
                    >
                      <img
                        src={prog.creatorAvatar}
                        alt={prog.creatorName}
                        className="w-5 h-5 rounded-full object-cover border border-cyan-400"
                      />
                      <span className="font-bold">{prog.creatorName}</span>
                      {prog.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </div>
                </div>

                {/* Info Footer on Card */}
                <div className="p-4 bg-[#080d1a] space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-slate-400 block font-bold">Duration</span>
                      <span className="font-black text-white">{prog.durationWeeks} Weeks</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-slate-400 block font-bold">Frequency</span>
                      <span className="font-black text-cyan-400">{prog.workoutsPerWeek} Days/Wk</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-slate-400 block font-bold">Imports</span>
                      <span className="font-black text-purple-300">{(prog.downloads / 1000).toFixed(1)}k</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          soundManager.play('achievement');
                          onToggleLike(prog.id);
                        }}
                        className={`flex items-center gap-1 font-bold ${
                          prog.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${prog.isLiked ? 'fill-current' : ''}`} />
                        <span>{prog.likes}</span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.play('toggle_on');
                          onToggleSave(prog.id);
                        }}
                        className={`flex items-center gap-1 font-bold ${
                          prog.isSaved ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${prog.isSaved ? 'fill-current' : ''}`} />
                        <span>{prog.saves}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenProgram(prog)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all flex items-center gap-1"
                    >
                      <span>Inspect Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeMarketTab === 'Saved' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Saved Program Library ({programs.filter((p) => p.isSaved).length})
          </h3>

          {programs.filter((p) => p.isSaved).length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-3xl space-y-2">
              <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No saved programs yet</div>
              <p className="text-xs text-slate-400">Tap the bookmark icon on any program card to save it for offline access.</p>
            </div>
          ) : (
            programs
              .filter((p) => p.isSaved)
              .map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => handleOpenProgram(prog)}
                  className="p-3.5 rounded-2xl glass-card border border-white/10 flex gap-3 items-center cursor-pointer hover:border-cyan-400/40"
                >
                  <img src={prog.coverImage} alt={prog.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{prog.title}</h4>
                    <p className="text-[11px] text-slate-400">{prog.creatorName} • {prog.durationWeeks} Wks</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              ))
          )}
        </div>
      )}

      {activeMarketTab === 'Published' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl glass-panel border border-white/15 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-white">Your Creator Stats</h3>
                <p className="text-[10px] text-slate-400">Metrics across all your published programs</p>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                + New Program
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60">
                <span className="text-[9px] text-slate-400 font-bold block">Published</span>
                <span className="font-black text-white">{userPublishedPrograms.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60">
                <span className="text-[9px] text-slate-400 font-bold block">Downloads</span>
                <span className="font-black text-cyan-400">1.2k</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60">
                <span className="text-[9px] text-slate-400 font-bold block">Rating</span>
                <span className="font-black text-amber-400">5.0 ★</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60">
                <span className="text-[9px] text-slate-400 font-bold block">Level</span>
                <span className="font-black text-purple-300">Creator L2</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Published Workouts ({userPublishedPrograms.length})
            </h4>

            {userPublishedPrograms.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-3xl space-y-2">
                <Dumbbell className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-sm font-bold text-white">You haven't published any programs yet</div>
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold mt-2"
                >
                  Create & Publish First Program
                </button>
              </div>
            ) : (
              userPublishedPrograms.map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => handleOpenProgram(prog)}
                  className="p-3.5 rounded-2xl glass-card border border-white/10 flex gap-3 items-center cursor-pointer"
                >
                  <img src={prog.coverImage} alt={prog.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{prog.title}</h4>
                    <p className="text-[11px] text-slate-400">{prog.durationWeeks} Weeks • {prog.goal}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeMarketTab === 'Creators' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Verified Master Fitness Coaches ({creators.length})
          </h3>

          <div className="space-y-3">
            {creators.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenCreator(c)}
                className="p-4 rounded-3xl glass-panel border border-white/10 hover:border-cyan-400/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={c.avatarUrl}
                      alt={c.displayName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-400"
                    />
                    {c.verified && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-600 text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 font-black text-sm text-white">
                      {c.displayName}
                      <span>{c.flagEmoji}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{c.roleTitle}</div>
                    <div className="text-[10px] text-cyan-400 font-bold mt-0.5">
                      {(c.totalDownloads / 1000).toFixed(0)}k downloads • {c.averageRating} ★
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCreator(c);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold hover:text-white"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
