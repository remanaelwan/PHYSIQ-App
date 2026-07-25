import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Scan, Sparkles, Check, Flame, Upload } from 'lucide-react';
import { FoodItem } from '../types';
import { soundManager } from '../lib/soundManager';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [foodQuery, setFoodQuery] = useState('');
  const [detectedFood, setDetectedFood] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = async () => {
    setIsScanning(true);
    soundManager.play('barcode_scanned');
    soundManager.play('ai_thinking');
    try {
      const res = await fetch('/api/ai/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: foodQuery || 'Protein Power Bowl with Avocado & Salmon' }),
      });
      const data = await res.json();
      setDetectedFood(data);
      soundManager.play('ai_insight_generated');
    } catch (e) {
      setDetectedFood({
        name: 'Avocado Salmon Bowl',
        calories: 540,
        proteinG: 42,
        carbsG: 48,
        fatG: 18,
        mealType: 'Lunch',
        aiNote: 'High protein and healthy Omega-3 fats detected.',
      });
      soundManager.play('ai_insight_generated');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!detectedFood) return;
    soundManager.play('meal_added');
    onAddFood({
      name: detectedFood.name || 'AI Scanned Meal',
      calories: detectedFood.calories || 500,
      proteinG: detectedFood.proteinG || 40,
      carbsG: detectedFood.carbsG || 45,
      fatG: detectedFood.fatG || 15,
      time: 'Just Now',
      mealType: detectedFood.mealType || 'Lunch',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
    });
    setDetectedFood(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-6 select-none"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full glass-pill text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> PhysIQ AI Food Scanner
          </div>
          <div className="w-9" />
        </div>

        {/* Camera Scanner Simulation Frame */}
        <div className="my-auto relative max-w-sm mx-auto w-full aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center p-6 text-center shadow-[0_0_50px_rgba(0,210,255,0.2)]">
          {/* Laser Scanner Animation Bar */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00d2ff] animate-bounce pointer-events-none" />

          {/* Background Camera Image Preview */}
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
            alt="Food Scanner"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />

          {/* Barcode Rectangle Overlay */}
          <div className="relative z-10 w-48 h-32 border-2 border-cyan-400 rounded-2xl flex items-center justify-center p-4 bg-cyan-950/20 backdrop-blur-xs">
            <Scan className="w-12 h-12 text-cyan-400 animate-pulse" />
          </div>

          <p className="relative z-10 text-xs text-slate-300 font-semibold mt-4 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
            Position food or barcode inside the box
          </p>
        </div>

        {/* Detected Food Results Panel */}
        {detectedFood ? (
          <div className="glass-panel p-5 rounded-3xl border border-cyan-500/40 space-y-3 z-10 animate-fade-in max-w-sm mx-auto w-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  AI Detected Meal
                </span>
                <h3 className="text-base font-bold text-white">{detectedFood.name}</h3>
              </div>
              <span className="text-sm font-extrabold text-blue-400">{detectedFood.calories} kcal</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/80">
                <span className="text-[10px] text-slate-400 block">Protein</span>
                <span className="font-bold text-white">{detectedFood.proteinG}g</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80">
                <span className="text-[10px] text-slate-400 block">Carbs</span>
                <span className="font-bold text-white">{detectedFood.carbsG}g</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80">
                <span className="text-[10px] text-slate-400 block">Fats</span>
                <span className="font-bold text-white">{detectedFood.fatG}g</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAdd}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Add to Meal Diary
            </button>
          </div>
        ) : (
          /* Search / Manual Capture Trigger */
          <div className="space-y-3 max-w-sm mx-auto w-full z-10">
            <input
              type="text"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="Or type food item (e.g. 200g Grilled Steak)..."
              className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {isScanning ? 'Analyzing with Gemini AI...' : 'Scan & Analyze Food'}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
