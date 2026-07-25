import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Sparkles,
  Heart,
  Bookmark,
  Star,
  Clock,
  Download,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Filter,
  Users,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { CommunityRecipe, CreatorProfile, UserProfile } from '../types';
import { mockRecipes, mockNutritionCreators } from '../data/mockCommunityData';
import { soundManager } from '../lib/soundManager';
import { RecipeDetailModal } from './RecipeDetailModal';
import { PublishRecipeModal } from './PublishRecipeModal';

interface NutritionCommunityProps {
  profile: UserProfile;
  caloriesRemaining: number;
  proteinRemaining: number;
  onAddRecipeToMealPlan: (recipe: CommunityRecipe, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void;
  onOpenCreatorProfile?: (creator: CreatorProfile) => void;
}

const COMMUNITY_CATEGORIES = [
  'All',
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

export const NutritionCommunity: React.FC<NutritionCommunityProps> = ({
  profile,
  caloriesRemaining,
  proteinRemaining,
  onAddRecipeToMealPlan,
  onOpenCreatorProfile,
}) => {
  // State
  const [recipesList, setRecipesList] = useState<CommunityRecipe[]>(mockRecipes);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [communityTab, setCommunityTab] = useState<'Discover' | 'Saved' | 'MyRecipes' | 'Creators'>('Discover');

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState<CommunityRecipe | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // My Recipes tab state
  const [myRecipesFilter, setMyRecipesFilter] = useState<'Published' | 'Drafts'>('Published');

  // Toggle Like
  const handleToggleLike = (recipeId: string) => {
    setRecipesList((prev) =>
      prev.map((r) => {
        if (r.id === recipeId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: isLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  };

  // Toggle Save
  const handleToggleSave = (recipeId: string) => {
    setRecipesList((prev) =>
      prev.map((r) => {
        if (r.id === recipeId) {
          const isSaved = !r.isSaved;
          return {
            ...r,
            isSaved,
            saves: isSaved ? r.saves + 1 : r.saves - 1,
          };
        }
        return r;
      })
    );
  };

  // Publish New Recipe Handler
  const handlePublishRecipe = (newRecipeData: Omit<CommunityRecipe, 'id'>) => {
    const created: CommunityRecipe = {
      ...newRecipeData,
      id: `recipe-custom-${Date.now()}`,
    };
    setRecipesList([created, ...recipesList]);
    setSelectedRecipe(created);
  };

  // Filtering recipes
  const filteredRecipes = recipesList.filter((r) => {
    // Tab filter
    if (communityTab === 'Saved' && !r.isSaved) return false;
    if (communityTab === 'MyRecipes') {
      if (myRecipesFilter === 'Published' && !r.isPublishedByMe) return false;
      if (myRecipesFilter === 'Drafts' && (!r.isDraft || r.isPublishedByMe)) return false;
    }

    // Category filter
    if (activeCategory !== 'All' && r.category !== activeCategory) {
      // Allow partial string match for category names like 'High Protein'
      const catClean = activeCategory.replace(/[^a-zA-Z ]/g, '').trim().toLowerCase();
      const rCatClean = r.category.replace(/[^a-zA-Z ]/g, '').trim().toLowerCase();
      if (!rCatClean.includes(catClean) && !r.tags.some((t) => t.toLowerCase().includes(catClean))) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchCreator = r.creatorName.toLowerCase().includes(q);
      const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCreator && !matchTags) return false;
    }

    return true;
  });

  // AI Meal Recommendation logic
  const aiRecommendedRecipe = recipesList.find((r) => {
    if (profile.goal === 'Lose Fat') return r.calories <= caloriesRemaining && r.proteinG >= 40;
    if (profile.goal === 'Build Muscle' || profile.goal === 'Gain Weight') return r.proteinG >= 45;
    return r.calories <= caloriesRemaining;
  }) || recipesList[0];

  // Weekly Featured categories
  const editorsChoice = recipesList.find((r) => r.rating >= 4.95) || recipesList[0];
  const mostDownloaded = [...recipesList].sort((a, b) => b.downloads - a.downloads)[0];
  const highestRated = [...recipesList].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="space-y-5 select-none">
      {/* Community Sub-Nav Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-extrabold">
        {[
          { id: 'Discover', label: '🔥 Discover', icon: Flame },
          { id: 'Saved', label: '📥 Saved', icon: Bookmark },
          { id: 'MyRecipes', label: '✍ My Recipes', icon: BookOpen },
          { id: 'Creators', label: '👥 Creators', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = communityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.play('button_click');
                setCommunityTab(tab.id as any);
              }}
              className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Publish Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search high protein meals, recipes, creators..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={() => {
            soundManager.play('button_click');
            setIsPublishModalOpen(true);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish</span>
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {COMMUNITY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                soundManager.play('button_click');
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400/40 text-white shadow-lg shadow-blue-500/20'
                  : 'glass-panel border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* DISCOVER TAB CONTENT */}
      {communityTab === 'Discover' && (
        <div className="space-y-6">
          {/* AI Meal Recommendation Card */}
          <div className="glass-panel p-4.5 rounded-3xl border border-blue-500/30 relative overflow-hidden shadow-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-slate-950/90">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-400/30 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">AI Meal Recommendation</h3>
                  <p className="text-[10px] text-slate-400">
                    Tailored for {profile.goal} • {caloriesRemaining} kcal & {proteinRemaining}g protein left
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-extrabold">
                Optimal Fit
              </span>
            </div>

            {/* Recommended Recipe Showcase */}
            {aiRecommendedRecipe && (
              <div
                onClick={() => {
                  soundManager.play('button_click');
                  setSelectedRecipe(aiRecommendedRecipe);
                }}
                className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between cursor-pointer hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={aiRecommendedRecipe.coverImage}
                    alt={aiRecommendedRecipe.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div>
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                      {aiRecommendedRecipe.category}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {aiRecommendedRecipe.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                      <span>🔥 {aiRecommendedRecipe.calories} kcal</span>
                      <span>💪 {aiRecommendedRecipe.proteinG}g protein</span>
                      <span>⏱ {aiRecommendedRecipe.prepTimeMin}m</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-full bg-blue-600/20 text-cyan-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Weekly Featured Recipes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Weekly Featured Recipes
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Top Community Picks</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Editor's Choice */}
              {editorsChoice && (
                <div
                  onClick={() => {
                    soundManager.play('button_click');
                    setSelectedRecipe(editorsChoice);
                  }}
                  className="glass-card p-3 rounded-2xl border border-white/10 relative overflow-hidden cursor-pointer hover:border-amber-500/40 transition-all group"
                >
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[8px] font-black uppercase tracking-wider shadow-md">
                    ⭐ Editor's Choice
                  </span>
                  <div className="h-28 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={editorsChoice.coverImage}
                      alt={editorsChoice.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{editorsChoice.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span className="text-blue-400">{editorsChoice.calories} kcal</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {editorsChoice.rating}
                    </span>
                  </div>
                </div>
              )}

              {/* Most Downloaded */}
              {mostDownloaded && (
                <div
                  onClick={() => {
                    soundManager.play('button_click');
                    setSelectedRecipe(mostDownloaded);
                  }}
                  className="glass-card p-3 rounded-2xl border border-white/10 relative overflow-hidden cursor-pointer hover:border-cyan-500/40 transition-all group"
                >
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[8px] font-black uppercase tracking-wider shadow-md">
                    📥 Most Downloaded
                  </span>
                  <div className="h-28 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={mostDownloaded.coverImage}
                      alt={mostDownloaded.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{mostDownloaded.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span className="text-blue-400">{mostDownloaded.calories} kcal</span>
                    <span className="flex items-center gap-0.5 text-cyan-400">
                      <Download className="w-3 h-3" /> {(mostDownloaded.downloads / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recipes Stream Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Healthy Recipe Library ({filteredRecipes.length})
              </h3>
            </div>

            <div className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCardItem
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={() => {
                    soundManager.play('button_click');
                    setSelectedRecipe(recipe);
                  }}
                  onToggleLike={() => handleToggleLike(recipe.id)}
                  onToggleSave={() => handleToggleSave(recipe.id)}
                  onOpenCreator={() => {
                    if (onOpenCreatorProfile) {
                      const found = mockNutritionCreators.find((c) => c.id === recipe.creatorId);
                      if (found) onOpenCreatorProfile(found);
                    }
                  }}
                />
              ))}

              {filteredRecipes.length === 0 && (
                <div className="text-center py-10 glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
                  <Utensils className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">No recipes found matching your filter.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SAVED RECIPES TAB */}
      {communityTab === 'Saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Your Saved Recipes ({filteredRecipes.length})
            </h3>
          </div>

          <div className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCardItem
                key={recipe.id}
                recipe={recipe}
                onOpen={() => setSelectedRecipe(recipe)}
                onToggleLike={() => handleToggleLike(recipe.id)}
                onToggleSave={() => handleToggleSave(recipe.id)}
              />
            ))}

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12 glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">You haven't saved any recipes yet.</p>
                <p className="text-[11px] text-slate-500">Tap the bookmark icon on any recipe card to save it here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MY RECIPES TAB */}
      {communityTab === 'MyRecipes' && (
        <div className="space-y-5">
          {/* Stats Bar */}
          <div className="glass-panel p-4 rounded-3xl border border-white/15 grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Published</span>
              <span className="text-lg font-black text-white">
                {recipesList.filter((r) => r.isPublishedByMe).length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Likes</span>
              <span className="text-lg font-black text-rose-400">14.2k</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Downloads</span>
              <span className="text-lg font-black text-cyan-400">38.9k</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Followers</span>
              <span className="text-lg font-black text-blue-400">1,240</span>
            </div>
          </div>

          {/* Published vs Drafts Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMyRecipesFilter('Published')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                myRecipesFilter === 'Published'
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              Published Recipes
            </button>
            <button
              onClick={() => setMyRecipesFilter('Drafts')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                myRecipesFilter === 'Drafts'
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              Drafts
            </button>
          </div>

          <div className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCardItem
                key={recipe.id}
                recipe={recipe}
                onOpen={() => setSelectedRecipe(recipe)}
                onToggleLike={() => handleToggleLike(recipe.id)}
                onToggleSave={() => handleToggleSave(recipe.id)}
              />
            ))}

            {filteredRecipes.length === 0 && (
              <div className="text-center py-10 glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No {myRecipesFilter.toLowerCase()} recipes yet.</p>
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATORS DIRECTORY TAB */}
      {communityTab === 'Creators' && (
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Top Nutrition Creators ({mockNutritionCreators.length})
          </h3>

          <div className="space-y-3">
            {mockNutritionCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => {
                  soundManager.play('button_click');
                  if (onOpenCreatorProfile) onOpenCreatorProfile(creator);
                }}
                className="glass-panel p-4 rounded-3xl border border-white/15 flex items-center justify-between cursor-pointer hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
                    <img src={creator.avatarUrl} alt={creator.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{creator.displayName}</span>
                      {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{creator.roleTitle}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-semibold">
                      <span>👥 {(creator.followers / 1000).toFixed(1)}k followers</span>
                      <span>⭐ {creator.averageRating}</span>
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToMealPlan={(recipe, slot) => {
          onAddRecipeToMealPlan(recipe, slot);
        }}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
        onOpenCreatorProfile={(creatorId) => {
          const found = mockNutritionCreators.find((c) => c.id === creatorId);
          if (found && onOpenCreatorProfile) {
            setSelectedRecipe(null);
            onOpenCreatorProfile(found);
          }
        }}
      />

      {/* PUBLISH RECIPE MODAL */}
      {isPublishModalOpen && (
        <PublishRecipeModal
          onClose={() => setIsPublishModalOpen(false)}
          onPublish={handlePublishRecipe}
        />
      )}
    </div>
  );
};

/* Sub-component: Individual Recipe Card Item */
interface RecipeCardItemProps {
  recipe: CommunityRecipe;
  onOpen: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onOpenCreator?: () => void;
}

const RecipeCardItem: React.FC<RecipeCardItemProps> = ({
  recipe,
  onOpen,
  onToggleLike,
  onToggleSave,
  onOpenCreator,
}) => {
  return (
    <div className="glass-panel p-4 rounded-3xl border border-white/15 space-y-3 hover:border-blue-500/30 transition-all shadow-xl relative overflow-hidden group">
      {/* Cover Image Header */}
      <div className="relative h-44 rounded-2xl overflow-hidden cursor-pointer" onClick={onOpen}>
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
            {recipe.category}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike();
              }}
              className={`p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all active:scale-90 ${
                recipe.isLiked ? 'text-rose-500' : 'text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${recipe.isLiked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className={`p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all active:scale-90 ${
                recipe.isSaved ? 'text-amber-400' : 'text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${recipe.isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-black text-white line-clamp-1 drop-shadow-md">{recipe.title}</h3>
        </div>
      </div>

      {/* Creator Info Bar */}
      <div className="flex items-center justify-between">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenCreator) onOpenCreator();
          }}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src={recipe.creatorAvatar} alt={recipe.creatorName} className="w-7 h-7 rounded-full object-cover border border-blue-400/30" />
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white">{recipe.creatorName}</span>
            {recipe.verified && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{recipe.rating}</span>
        </div>
      </div>

      {/* Nutritional Macros Row */}
      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
        <div className="p-1.5 rounded-xl bg-slate-900/90 border border-white/5">
          <span className="text-slate-400 block font-semibold">Calories</span>
          <span className="font-extrabold text-white">{recipe.calories}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-blue-950/40 border border-blue-500/20">
          <span className="text-blue-300 block font-semibold">Protein</span>
          <span className="font-extrabold text-blue-400">{recipe.proteinG}g</span>
        </div>
        <div className="p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
          <span className="text-emerald-300 block font-semibold">Carbs</span>
          <span className="font-extrabold text-emerald-400">{recipe.carbsG}g</span>
        </div>
        <div className="p-1.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
          <span className="text-amber-300 block font-semibold">Fat</span>
          <span className="font-extrabold text-amber-400">{recipe.fatG}g</span>
        </div>
        <div className="p-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
          <span className="text-purple-300 block font-semibold">Fiber</span>
          <span className="font-extrabold text-purple-400">{recipe.fiberG}g</span>
        </div>
      </div>

      {/* Footer Stats & Open Button */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> {recipe.prepTimeMin}m
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> {recipe.likes}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Download className="w-3.5 h-3.5 text-blue-400" /> {(recipe.downloads / 1000).toFixed(1)}k
          </span>
        </div>

        <button
          onClick={onOpen}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <span>View Recipe</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
