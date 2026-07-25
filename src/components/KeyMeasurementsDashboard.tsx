import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Ruler,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { soundManager } from '../lib/soundManager';

interface MeasurementItem {
  id: string;
  name: string;
  currentCm: number;
  previousCm: number;
  targetCm?: number;
  muscleRegionId: string; // ID to highlight on anatomical body model
  unitCategory?: 'length' | 'weight';
}

interface KeyMeasurementsDashboardProps {
  onHighlightMuscleRegion?: (muscleId: string) => void;
  selectedMuscleId?: string | null;
}

export const KeyMeasurementsDashboard: React.FC<KeyMeasurementsDashboardProps> = ({
  onHighlightMuscleRegion,
  selectedMuscleId,
}) => {
  const [unitSystem, setUnitSystem] = useState<'cm' | 'in'>('cm');
  const [selectedTileId, setSelectedTileId] = useState<string>('chest');

  const measurements: MeasurementItem[] = [
    {
      id: 'weight',
      name: 'Weight',
      currentCm: 76.5, // stored as kg
      previousCm: 77.8,
      targetCm: 80.0,
      muscleRegionId: 'chest',
      unitCategory: 'weight',
    },
    {
      id: 'height',
      name: 'Height',
      currentCm: 180,
      previousCm: 180,
      muscleRegionId: 'chest',
    },
    {
      id: 'neck',
      name: 'Neck',
      currentCm: 39.0,
      previousCm: 38.5,
      muscleRegionId: 'traps',
    },
    {
      id: 'chest',
      name: 'Chest',
      currentCm: 108.0,
      previousCm: 106.0,
      targetCm: 112.0,
      muscleRegionId: 'chest',
    },
    {
      id: 'waist',
      name: 'Waist',
      currentCm: 78.0,
      previousCm: 80.0,
      targetCm: 75.0,
      muscleRegionId: 'abs',
    },
    {
      id: 'hips',
      name: 'Hips',
      currentCm: 96.0,
      previousCm: 97.0,
      targetCm: 94.0,
      muscleRegionId: 'glutes',
    },
    {
      id: 'left-arm',
      name: 'Left Arm',
      currentCm: 38.5,
      previousCm: 37.8,
      targetCm: 41.0,
      muscleRegionId: 'biceps',
    },
    {
      id: 'right-arm',
      name: 'Right Arm',
      currentCm: 39.0,
      previousCm: 38.2,
      targetCm: 41.0,
      muscleRegionId: 'biceps',
    },
    {
      id: 'left-forearm',
      name: 'Left Forearm',
      currentCm: 30.5,
      previousCm: 30.0,
      muscleRegionId: 'biceps',
    },
    {
      id: 'right-forearm',
      name: 'Right Forearm',
      currentCm: 31.0,
      previousCm: 30.4,
      muscleRegionId: 'biceps',
    },
    {
      id: 'left-thigh',
      name: 'Left Thigh',
      currentCm: 58.0,
      previousCm: 57.0,
      targetCm: 62.0,
      muscleRegionId: 'quads',
    },
    {
      id: 'right-thigh',
      name: 'Right Thigh',
      currentCm: 58.5,
      previousCm: 57.5,
      targetCm: 62.0,
      muscleRegionId: 'quads',
    },
    {
      id: 'left-calf',
      name: 'Left Calf',
      currentCm: 38.0,
      previousCm: 37.5,
      muscleRegionId: 'calves',
    },
    {
      id: 'right-calf',
      name: 'Right Calf',
      currentCm: 38.2,
      previousCm: 37.7,
      muscleRegionId: 'calves',
    },
  ];

  const convertVal = (val: number, isWeight = false) => {
    if (isWeight) {
      return unitSystem === 'in' ? (val * 2.20462).toFixed(1) : val.toFixed(1);
    }
    return unitSystem === 'in' ? (val * 0.393701).toFixed(1) : val.toFixed(1);
  };

  const getUnitStr = (isWeight = false) => {
    if (isWeight) {
      return unitSystem === 'in' ? 'lbs' : 'kg';
    }
    return unitSystem === 'in' ? 'in' : 'cm';
  };

  const handleTileClick = (item: MeasurementItem) => {
    soundManager.play('muscle_selected');
    setSelectedTileId(item.id);
    if (onHighlightMuscleRegion) {
      onHighlightMuscleRegion(item.muscleRegionId);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-[32px] border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-purple-950/30 space-y-4">
      {/* HEADER & UNIT TOGGLE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Key Measurements</h2>
            <p className="text-[10px] text-slate-400 font-medium">Tap tile to highlight region on body</p>
          </div>
        </div>

        {/* Unit Toggle Switcher */}
        <div className="flex glass-pill p-1 rounded-xl gap-1">
          <button
            onClick={() => {
              soundManager.play('switch');
              setUnitSystem('cm');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
              unitSystem === 'cm'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Metric (cm/kg)
          </button>
          <button
            onClick={() => {
              soundManager.play('switch');
              setUnitSystem('in');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
              unitSystem === 'in'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Imperial (in/lbs)
          </button>
        </div>
      </div>

      {/* 14 GLASS TILES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {measurements.map((item) => {
          const isWeight = item.unitCategory === 'weight';
          const curr = convertVal(item.currentCm, isWeight);
          const prev = convertVal(item.previousCm, isWeight);
          const diffNum = (item.currentCm - item.previousCm);
          const diffStr = isWeight
            ? (unitSystem === 'in' ? (diffNum * 2.20462).toFixed(1) : diffNum.toFixed(1))
            : (unitSystem === 'in' ? (diffNum * 0.393701).toFixed(1) : diffNum.toFixed(1));

          const isIncreased = diffNum > 0;
          const isDecreased = diffNum < 0;
          const isSelected = selectedTileId === item.id;

          // Goal tracking progress
          let progressPct = 0;
          if (item.targetCm) {
            progressPct = Math.min(100, Math.round((item.currentCm / item.targetCm) * 100));
          }

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTileClick(item)}
              className={`p-3 rounded-2xl glass-card border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/20'
              }`}
            >
              {/* Highlight Glow Effect */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
              )}

              {/* Title & Trend Badge */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">{item.name}</span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    isIncreased
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isDecreased
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isIncreased ? (
                    <>
                      <TrendingUp className="w-2.5 h-2.5" /> +{diffStr}
                    </>
                  ) : isDecreased ? (
                    <>
                      <TrendingDown className="w-2.5 h-2.5" /> {diffStr}
                    </>
                  ) : (
                    <>
                      <Minus className="w-2.5 h-2.5" /> Stable
                    </>
                  )}
                </span>
              </div>

              {/* Current Value */}
              <div className="my-1">
                <span className="text-lg font-black text-white">{curr}</span>
                <span className="text-[10px] font-semibold text-slate-400 ml-1">
                  {getUnitStr(isWeight)}
                </span>
                <div className="text-[9px] text-slate-400">Prev: {prev} {getUnitStr(isWeight)}</div>
              </div>

              {/* Goal Progress Bar if target exists */}
              {item.targetCm ? (
                <div className="mt-2 pt-1.5 border-t border-white/5 space-y-1">
                  <div className="flex justify-between text-[8px] font-bold text-slate-400">
                    <span>Target: {convertVal(item.targetCm, isWeight)} {getUnitStr(isWeight)}</span>
                    <span className="text-purple-300">{progressPct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 pt-1 border-t border-white/5 text-[8px] text-slate-500 font-semibold flex items-center justify-between">
                  <span>3D Highlight Active</span>
                  <ChevronRight className="w-2.5 h-2.5 text-purple-400" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
