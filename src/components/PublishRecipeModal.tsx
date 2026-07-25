import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Utensils,
  Clock,
  Sparkles,
  Flame,
  Camera,
  Layers,
  Check,
} from 'lucide-react';
import { CommunityRecipe, RecipeIngredient } from '../types';
import { soundManager } from '../lib/soundManager';

interface PublishRecipeModalProps {
  onClose: () => void;
  onPublish: (recipe: Omit<CommunityRecipe, 'id'>) => void;
}

const CATEGORY_OPTIONS = [
  '🥗 High Protein',
  '🔥 Fat Loss Meals',
  '💪 Muscle Gain Meals',
  '⚖ Weight Gain Meals',
  '🥑 Healthy Recipes',
  '🍳 Breakfast',
  '🥩 Lunch',
  '🍝 Dinner',
  '🥤 Smoothies',
  '🍪 Healthy Snacks',
  '🌱 Vegetarian',
  '🌿 Vegan',
];

export const PublishRecipeModal: React.FC<PublishRecipeModalProps> = ({ onClose, onPublish }) => {
  const [isPreview, setIsPreview] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'
  );
  const [category, setCategory] = useState('🥗 High Protein');
  const [calories, setCalories] = useState<number>(550);
  const [proteinG, setProteinG] = useState<number>(45);
  const [carbsG, setCarbsG] = useState<number>(50);
  const [fatG, setFatG] = useState<number>(12);
  const [fiberG, setFiberG] = useState<number>(7);
  const [prepTimeMin, setPrepTimeMin] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>('Easy');
  const [servingSize, setServingSize] = useState('1 Serving');
  const [estCost, setEstCost] = useState('$4.00 / serving');

  // Dynamic Lists
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: 'Lean Chicken Breast', amount: '200g' },
    { name: 'Jasmine Rice', amount: '150g' },
  ]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngAmount, setNewIngAmount] = useState('');

  const [cookingSteps, setCookingSteps] = useState<string[]>([
    'Season raw ingredients with chosen spices and herbs.',
    'Cook on high heat until tender and golden.',
  ]);
  const [newStep, setNewStep] = useState('');

  const [tagsInput, setTagsInput] = useState('High Protein, Meal Prep, Anabolic');

  const handleAddIngredient = () => {
    if (!newIngName.trim() || !newIngAmount.trim()) return;
    soundManager.play('button_click');
    setIngredients([...ingredients, { name: newIngName.trim(), amount: newIngAmount.trim() }]);
    setNewIngName('');
    setNewIngAmount('');
  };

  const handleRemoveIngredient = (idx: number) => {
    soundManager.play('button_click');
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    soundManager.play('button_click');
    setCookingSteps([...cookingSteps, newStep.trim()]);
    setNewStep('');
  };

  const handleRemoveStep = (idx: number) => {
    soundManager.play('button_click');
    setCookingSteps(cookingSteps.filter((_, i) => i !== idx));
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.play('workout_finished');

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onPublish({
      title,
      description: description || 'Healthy anabolic recipe for optimal body recomposition.',
      coverImage,
      creatorId: 'user-me',
      creatorName: 'You (Creator)',
      creatorUsername: 'you_physiq',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      creatorRole: 'Nutrition Community Member',
      verified: true,
      category,
      calories,
      proteinG,
      carbsG,
      fatG,
      fiberG,
      prepTimeMin,
      difficulty,
      likes: 1,
      downloads: 0,
      saves: 1,
      rating: 5.0,
      tags: tagsArr,
      ingredients,
      cookingSteps,
      servingSize,
      estCost,
      isLiked: true,
      isSaved: true,
      isPublishedByMe: true,
      mealTypeRecommendation: 'Lunch',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden select-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md h-[92vh] sm:h-[88vh] bg-[#080d1a] border border-white/15 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl text-white"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0">
            <div>
              <h2 className="text-base font-black text-white">Publish New Recipe</h2>
              <p className="text-[11px] text-slate-400">Share your nutritional creation with the community</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.play('button_click');
                  setIsPreview(!isPreview);
                }}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  isPreview
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800 text-slate-300 border-white/10 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isPreview ? 'Edit Form' : 'Preview'}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('button_click');
                  onClose();
                }}
                className="p-2 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content / Live Preview */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-none space-y-5">
            {!isPreview ? (
              <form id="publish-recipe-form" onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
                {/* Cover Image Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Cover Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-2 h-28 rounded-2xl overflow-hidden relative border border-white/10">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Recipe Title & Description */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Anabolic Garlic Butter Steak Bowl"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe taste, macros, and why it fits your fitness goals..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Meal Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nutritional Information Inputs */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <span className="text-[11px] font-black uppercase text-blue-400 block tracking-wider">
                    Macros & Calories
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Calories (kcal)</label>
                      <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-blue-400 mb-0.5">Protein (g)</label>
                      <input
                        type="number"
                        value={proteinG}
                        onChange={(e) => setProteinG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-0.5">Carbs (g)</label>
                      <input
                        type="number"
                        value={carbsG}
                        onChange={(e) => setCarbsG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-amber-400 mb-0.5">Fat (g)</label>
                      <input
                        type="number"
                        value={fatG}
                        onChange={(e) => setFatG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-purple-400 mb-0.5">Fiber (g)</label>
                      <input
                        type="number"
                        value={fiberG}
                        onChange={(e) => setFiberG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-purple-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-cyan-400 mb-0.5">Prep (min)</label>
                      <input
                        type="number"
                        value={prepTimeMin}
                        onChange={(e) => setPrepTimeMin(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-1.5 py-1.5 text-white text-xs font-bold"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ingredients Builder */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <span className="text-[11px] font-black uppercase text-blue-400 block tracking-wider">
                    Ingredients List
                  </span>

                  <div className="space-y-1.5">
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-800 text-xs">
                        <span className="font-semibold text-white">{ing.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">{ing.amount}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={newIngName}
                      onChange={(e) => setNewIngName(e.target.value)}
                      className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Amount (e.g. 150g)"
                      value={newIngAmount}
                      onChange={(e) => setNewIngAmount(e.target.value)}
                      className="w-24 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preparation Steps Builder */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <span className="text-[11px] font-black uppercase text-amber-400 block tracking-wider">
                    Cooking Steps
                  </span>

                  <div className="space-y-1.5">
                    {cookingSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start justify-between p-2 rounded-xl bg-slate-800 text-xs gap-2">
                        <span className="text-slate-300 flex-1">
                          <strong className="text-blue-400">{idx + 1}.</strong> {step}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-slate-500 hover:text-rose-400 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add next cooking instruction step..."
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="p-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Search Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="High Protein, Air Fryer, Meal Prep"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </form>
            ) : (
              /* Live Recipe Preview */
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>This is how your recipe will appear to the PhysIQ community.</span>
                </div>

                <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden relative">
                    <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      {category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{title || 'Untitled Recipe'}</h3>
                    <p className="text-xs text-slate-300">{description || 'No description provided.'}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[9px] text-slate-400 block">Calories</span>
                      <span className="font-bold text-white">{calories}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[9px] text-blue-400 block">Protein</span>
                      <span className="font-bold text-blue-400">{proteinG}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[9px] text-emerald-400 block">Carbs</span>
                      <span className="font-bold text-emerald-400">{carbsG}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[9px] text-amber-400 block">Fat</span>
                      <span className="font-bold text-amber-400">{fatG}g</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white mb-2">Ingredients ({ingredients.length})</h4>
                    <div className="space-y-1">
                      {ingredients.map((ing, i) => (
                        <div key={i} className="flex justify-between text-xs text-slate-300">
                          <span>{ing.name}</span>
                          <span className="font-bold text-blue-400">{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-slate-900/90 border-t border-white/10 shrink-0">
            <button
              type="submit"
              form="publish-recipe-form"
              onClick={(e) => {
                if (isPreview) {
                  handlePublishSubmit(e);
                }
              }}
              disabled={!title.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Publish Recipe To Community
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
