import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Dumbbell,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Zap,
} from 'lucide-react';
import { CommunityProgram, Exercise, EquipmentType, MuscleGroup } from '../types';
import { soundManager } from '../lib/soundManager';

interface PublishProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (program: CommunityProgram) => void;
}

export const PublishProgramModal: React.FC<PublishProgramModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'preview'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000');
  const [goal, setGoal] = useState<'Muscle Building' | 'Fat Loss' | 'Strength' | 'Endurance'>('Muscle Building');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(4);
  const [estimatedSessionMin, setEstimatedSessionMin] = useState(55);
  const [category, setCategory] = useState('🔥 Trending');
  const [tagsInput, setTagsInput] = useState('Custom, Hypertrophy, Mass');

  // Exercises State
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([
    {
      id: 'ex-1',
      name: 'Incline Dumbbell Press',
      targetMuscle: 'Upper Chest' as MuscleGroup,
      sets: 4,
      reps: '10-12',
      restSeconds: 75,
      equipment: 'Dumbbells',
    },
    {
      id: 'ex-2',
      name: 'Cable Lateral Raise',
      targetMuscle: 'Side Delts' as MuscleGroup,
      sets: 4,
      reps: '12-15',
      restSeconds: 60,
      equipment: 'Cable Machine',
    },
  ]);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1000',
  ];

  const handleAddExercise = () => {
    soundManager.play('button_primary');
    setExercises([
      ...exercises,
      {
        id: `ex-${Date.now()}`,
        name: 'New Custom Movement',
        targetMuscle: 'Chest' as MuscleGroup,
        sets: 3,
        reps: '10',
        restSeconds: 60,
        equipment: 'Dumbbells',
      },
    ]);
  };

  const handleRemoveExercise = (idx: number) => {
    soundManager.play('button_secondary');
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handlePublishSubmit = () => {
    if (!title.trim()) return;
    soundManager.play('achievement');

    const createdProgram: CommunityProgram = {
      id: `prog-${Date.now()}`,
      title: title || 'My Custom Master Program',
      description: description || 'Designed by an elite PhysIQ athlete.',
      coverImage,
      creatorId: 'user-me',
      creatorName: 'Ahmed (You)',
      creatorUsername: 'ahmed_physiq',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      creatorRole: 'PhysIQ Master Creator',
      verified: true,
      difficulty,
      durationWeeks,
      workoutsPerWeek,
      estimatedSessionMin,
      estCaloriesBurn: estimatedSessionMin * 8,
      goal,
      location: 'Gym',
      category,
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      equipment: ['Dumbbells', 'Barbell', 'Bench'],
      rating: 5.0,
      downloads: 1,
      saves: 1,
      likes: 1,
      tags: tagsInput.split(',').map((t) => t.trim()),
      isLiked: true,
      isSaved: true,
      isPublishedByMe: true,
      weeklySchedule: [
        { day: 'Day 1', title: title, exercisesCount: exercises.length, focus: 'Primary Hypertrophy' },
        { day: 'Day 2', title: 'Rest & Recovery', exercisesCount: 0, focus: 'Active Regeneration' },
      ],
      exercises: exercises as Exercise[],
    };

    onPublish(createdProgram);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#060a14] border border-white/15 sm:rounded-[36px] overflow-hidden shadow-2xl text-white h-full sm:h-[92vh] flex flex-col relative"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Publish Your Master Program</h2>
                <p className="text-[10px] text-slate-400">Share your workout routine with the global PhysIQ community</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-5">
            {step === 'form' ? (
              <>
                {/* Cover Image Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Select Program Cover Image</label>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleCovers.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCoverImage(imgUrl)}
                        className={`h-20 rounded-xl overflow-hidden border-2 relative transition-all ${
                          coverImage === imgUrl ? 'border-cyan-400 scale-105' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={imgUrl} alt="Cover" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Program Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 8-Week Upper Body Explosive Hypertrophy"
                      className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Description & Philosophy</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain the science, volume targets, and target outcome of your routine..."
                      className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Program Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Fitness Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-white text-xs"
                    >
                      <option value="Muscle Building">Muscle Building</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Strength">Strength</option>
                      <option value="Endurance">Endurance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-white text-xs"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Duration (Weeks)</label>
                    <input
                      type="number"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Exercises Builder */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-cyan-400" />
                      Program Exercises ({exercises.length})
                    </label>

                    <button
                      type="button"
                      onClick={handleAddExercise}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Exercise
                    </button>
                  </div>

                  <div className="space-y-2">
                    {exercises.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => {
                              const updated = [...exercises];
                              updated[idx].name = e.target.value;
                              setExercises(updated);
                            }}
                            placeholder="Exercise Name"
                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(idx)}
                            className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-400 block">Sets</span>
                            <input
                              type="number"
                              value={ex.sets}
                              onChange={(e) => {
                                const updated = [...exercises];
                                updated[idx].sets = Number(e.target.value);
                                setExercises(updated);
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded p-1 text-white text-center"
                            />
                          </div>
                          <div>
                            <span className="text-slate-400 block">Reps</span>
                            <input
                              type="text"
                              value={ex.reps}
                              onChange={(e) => {
                                const updated = [...exercises];
                                updated[idx].reps = e.target.value;
                                setExercises(updated);
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded p-1 text-white text-center"
                            />
                          </div>
                          <div>
                            <span className="text-slate-400 block">Rest (s)</span>
                            <input
                              type="number"
                              value={ex.restSeconds}
                              onChange={(e) => {
                                const updated = [...exercises];
                                updated[idx].restSeconds = Number(e.target.value);
                                setExercises(updated);
                              }}
                              className="w-full bg-slate-950 border border-white/10 rounded p-1 text-white text-center"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/20">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                      {goal}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">{title || 'Untitled Program'}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{description}</p>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5 text-xs">
                  <div className="font-bold text-cyan-400">Program Summary</div>
                  <div>Duration: {durationWeeks} Weeks • {workoutsPerWeek} Days/Wk</div>
                  <div>Exercises Count: {exercises.length} Exercises</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-white/10 bg-slate-950 shrink-0 flex gap-3">
            {step === 'form' ? (
              <button
                type="button"
                onClick={() => setStep('preview')}
                disabled={!title.trim()}
                className="w-full h-12 rounded-2xl bg-slate-900 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                Preview Program
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 h-12 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs"
              >
                Back to Edit
              </button>
            )}

            <button
              type="button"
              onClick={handlePublishSubmit}
              disabled={!title.trim()}
              className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Publish Program Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
