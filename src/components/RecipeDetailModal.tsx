import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  Star,
  DollarSign,
  Utensils,
  Plus,
  ChevronRight,
  Flame,
  Award,
  Send,
  MessageSquare,
  Users,
} from 'lucide-react';
import { CommunityRecipe } from '../types';
import { soundManager } from '../lib/soundManager';

interface RecipeDetailModalProps {
  recipe: CommunityRecipe | null;
  onClose: () => void;
  onAddToMealPlan: (recipe: CommunityRecipe, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void;
  onToggleLike: (recipeId: string) => void;
  onToggleSave: (recipeId: string) => void;
  onOpenCreatorProfile?: (creatorId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onAddToMealPlan,
  onToggleLike,
  onToggleSave,
  onOpenCreatorProfile,
}) => {
  if (!recipe) return null;

  const [selectedMealSlot, setSelectedMealSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>(
    recipe.mealTypeRecommendation || 'Lunch'
  );
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes);
  const [savesCount, setSavesCount] = useState(recipe.saves);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(recipe.reviews || []);

  const toggleIngredient = (idx: number) => {
    soundManager.play('button_click');
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    soundManager.play('button_click');
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLike = () => {
    soundManager.play('like');
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onToggleLike(recipe.id);
  };

  const handleSave = () => {
    soundManager.play('save');
    setIsSaved((prev) => !prev);
    setSavesCount((prev) => (isSaved ? prev - 1 : prev + 1));
    onToggleSave(recipe.id);
  };

  const handleShare = () => {
    soundManager.play('button_click');
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe on PhysIQ: ${recipe.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setAddedToast('Recipe link copied to clipboard!');
      setTimeout(() => setAddedToast(null), 2500);
    }
  };

  const handleConfirmAddToMealPlan = (slot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    soundManager.play('meal_added');
    onAddToMealPlan(recipe, slot);
    setIsSlotPickerOpen(false);
    setAddedToast(`Added to ${slot}! Calories & macros updated.`);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    soundManager.play('button_click');
    const rev = {
      id: `rev-${Date.now()}`,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: newRating,
      comment: newComment,
      date: 'Just now',
    };
    setReviewsList([rev, ...reviewsList]);
    setNewComment('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden select-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md h-[92vh] sm:h-[88vh] bg-[#080d1a] border border-white/15 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl text-white"
        >
          {/* Toast Notification */}
          <AnimatePresence>
            {addedToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-4 right-4 z-50 p-3 rounded-2xl bg-emerald-500/90 text-white font-bold text-xs shadow-xl backdrop-blur-md flex items-center justify-between border border-emerald-300/40"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{addedToast}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed Top Header Controls */}
          <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <button
              onClick={() => {
                soundManager.play('button_click');
                onClose();
              }}
              className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 active:scale-95 transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-full bg-black/60 border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
                  isLiked ? 'text-rose-400 border-rose-500/40' : 'text-slate-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleSave}
                className={`p-2.5 rounded-full bg-black/60 border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
                  isSaved ? 'text-amber-400 border-amber-500/40' : 'text-slate-300'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{savesCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/60 border border-white/20 text-slate-300 hover:text-white active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pb-28 scrollbar-none">
            {/* Hero Image Section */}
            <div className="relative h-72 w-full overflow-hidden">
              <img src={recipe.coverImage} alt={recipe.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md border border-blue-400/30 text-white text-xs font-bold shadow-lg">
                  {recipe.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {recipe.prepTimeMin} min
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-[11px] font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {recipe.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 space-y-6">
              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-black text-white leading-tight mb-2">{recipe.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{recipe.description}</p>
              </div>

              {/* Creator Card */}
              <div
                onClick={() => onOpenCreatorProfile && onOpenCreatorProfile(recipe.creatorId)}
                className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between cursor-pointer hover:border-blue-500/40 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
                    <img src={recipe.creatorAvatar} alt={recipe.creatorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{recipe.creatorName}</span>
                      {recipe.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{recipe.creatorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-400">
                  <span>Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Nutritional Information Bar */}
              <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Nutritional Information
                  </span>
                  <span className="text-[11px] text-slate-400">{recipe.servingSize || 'Per Serving'}</span>
                </div>

                {/* Main Macro Cards */}
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div className="p-2 rounded-2xl bg-slate-900/80 border border-white/10">
                    <span className="text-[9px] text-slate-400 block font-bold">Calories</span>
                    <span className="text-sm font-black text-white">{recipe.calories}</span>
                    <span className="text-[8px] text-slate-500 block">kcal</span>
                  </div>

                  <div className="p-2 rounded-2xl bg-blue-950/40 border border-blue-500/30">
                    <span className="text-[9px] text-blue-300 block font-bold">Protein</span>
                    <span className="text-sm font-black text-blue-400">{recipe.proteinG}g</span>
                    <span className="text-[8px] text-blue-500 block">Muscle</span>
                  </div>

                  <div className="p-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[9px] text-emerald-300 block font-bold">Carbs</span>
                    <span className="text-sm font-black text-emerald-400">{recipe.carbsG}g</span>
                    <span className="text-[8px] text-emerald-500 block">Energy</span>
                  </div>

                  <div className="p-2 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                    <span className="text-[9px] text-amber-300 block font-bold">Fat</span>
                    <span className="text-sm font-black text-amber-400">{recipe.fatG}g</span>
                    <span className="text-[8px] text-amber-500 block">Fuel</span>
                  </div>

                  <div className="p-2 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                    <span className="text-[9px] text-purple-300 block font-bold">Fiber</span>
                    <span className="text-sm font-black text-purple-400">{recipe.fiberG}g</span>
                    <span className="text-[8px] text-purple-500 block">Gut</span>
                  </div>
                </div>

                {/* Micronutrients Pill Badges */}
                {recipe.micronutrients && recipe.micronutrients.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-2">Micronutrients & Minerals</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.micronutrients.map((micro, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-[10px] font-medium text-slate-300"
                        >
                          <strong className="text-white">{micro.name}:</strong> {micro.amount}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prep Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col items-center text-center">
                  <Clock className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="text-[10px] text-slate-400">Prep Time</span>
                  <span className="font-bold text-white">{recipe.prepTimeMin} mins</span>
                </div>

                <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col items-center text-center">
                  <Flame className="w-4 h-4 text-orange-400 mb-1" />
                  <span className="text-[10px] text-slate-400">Difficulty</span>
                  <span className="font-bold text-white">{recipe.difficulty}</span>
                </div>

                <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col items-center text-center">
                  <DollarSign className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400">Est. Cost</span>
                  <span className="font-bold text-white">{recipe.estCost || '$3.50'}</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-blue-400" />
                    Ingredients ({recipe.ingredients.length})
                  </h3>
                  <span className="text-[10px] text-slate-400">Tap to check off</span>
                </div>

                <div className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          isChecked
                            ? 'bg-blue-600/10 border-blue-500/40 text-slate-400 line-through'
                            : 'bg-slate-900/60 border-white/10 text-white hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-blue-500 border-blue-400 text-white'
                                : 'border-slate-600 bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-semibold">{ing.name}</span>
                        </div>
                        <span className="font-bold text-blue-400 shrink-0 ml-2">{ing.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cooking Steps */}
              <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Step-By-Step Preparation
                  </h3>
                  <span className="text-[10px] text-slate-400">{recipe.cookingSteps.length} Steps</span>
                </div>

                <div className="space-y-3">
                  {recipe.cookingSteps.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 text-xs ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-400'
                            : 'bg-slate-900/60 border-white/10 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isDone ? 'bg-emerald-500 text-black' : 'bg-blue-600 text-white'
                            }`}
                          >
                            Step {idx + 1}
                          </span>
                          {isDone && (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          )}
                        </div>
                        <p className={`leading-relaxed ${isDone ? 'line-through' : ''}`}>{step}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Community Reviews & Ratings */}
              <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Community Reviews ({reviewsList.length})
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{recipe.rating} / 5</span>
                  </div>
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="space-y-2 pt-1 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Leave a rating</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newRating
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
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your review or cooking tip..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="p-2 rounded-xl bg-blue-600 disabled:opacity-40 text-white font-bold text-xs hover:bg-blue-500 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-500 ml-1">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar: ADD TO MY NUTRITION PLAN */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-[#080d1a]/95 backdrop-blur-xl border-t border-white/10 z-30">
            {!isSlotPickerOpen ? (
              <button
                onClick={() => {
                  soundManager.play('button_click');
                  setIsSlotPickerOpen(true);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add To My Nutrition Plan
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Select Meal Slot:</span>
                  <button
                    onClick={() => setIsSlotPickerOpen(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleConfirmAddToMealPlan(slot)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${
                        selectedMealSlot === slot
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                          : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {slot}
                    </button>
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
