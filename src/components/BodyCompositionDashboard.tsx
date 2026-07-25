import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Activity,
  Flame,
  Droplet,
  Zap,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Info,
  Layers,
  HeartPulse,
  Scale,
} from 'lucide-react';
import { soundManager } from '../lib/soundManager';

interface BodyCompositionMetric {
  id: string;
  name: string;
  currentValue: number | string;
  unit: string;
  healthyRange: string;
  status: 'Excellent' | 'Normal' | 'Improving' | 'Needs Attention';
  statusColor: string;
  icon: React.ReactNode;
  trendData: number[]; // 5-point sparkline
  changePct: string;
  minRangeVal?: number;
  maxRangeVal?: number;
  currentNumVal?: number;
}

export const BodyCompositionDashboard: React.FC = () => {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);

  const overallScore = 92;

  const metrics: BodyCompositionMetric[] = [
    {
      id: 'body-fat',
      name: 'Body Fat %',
      currentValue: '14.2',
      unit: '%',
      healthyRange: '10.0 - 18.0%',
      status: 'Excellent',
      statusColor: 'emerald',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      trendData: [16.5, 15.8, 15.2, 14.7, 14.2],
      changePct: '-2.3% last month',
      minRangeVal: 8,
      maxRangeVal: 22,
      currentNumVal: 14.2,
    },
    {
      id: 'lean-muscle',
      name: 'Lean Muscle Mass',
      currentValue: '62.8',
      unit: 'kg',
      healthyRange: '58.0 - 66.0 kg',
      status: 'Improving',
      statusColor: 'cyan',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      trendData: [61.0, 61.4, 61.9, 62.2, 62.8],
      changePct: '+1.8 kg last month',
      minRangeVal: 50,
      maxRangeVal: 70,
      currentNumVal: 62.8,
    },
    {
      id: 'muscle-mass',
      name: 'Muscle Mass',
      currentValue: '38.6',
      unit: 'kg',
      healthyRange: '34.0 - 42.0 kg',
      status: 'Excellent',
      statusColor: 'emerald',
      icon: <Activity className="w-4 h-4 text-blue-400" />,
      trendData: [37.2, 37.6, 38.0, 38.3, 38.6],
      changePct: '+1.4 kg last month',
      minRangeVal: 30,
      maxRangeVal: 45,
      currentNumVal: 38.6,
    },
    {
      id: 'body-water',
      name: 'Body Water %',
      currentValue: '58.5',
      unit: '%',
      healthyRange: '50.0 - 65.0%',
      status: 'Normal',
      statusColor: 'blue',
      icon: <Droplet className="w-4 h-4 text-blue-400" />,
      trendData: [57.0, 57.5, 58.0, 58.2, 58.5],
      changePct: '+1.5% hydration',
      minRangeVal: 45,
      maxRangeVal: 70,
      currentNumVal: 58.5,
    },
    {
      id: 'bone-mass',
      name: 'Bone Mass',
      currentValue: '3.2',
      unit: 'kg',
      healthyRange: '2.8 - 3.8 kg',
      status: 'Normal',
      statusColor: 'emerald',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      trendData: [3.2, 3.2, 3.2, 3.2, 3.2],
      changePct: 'Stable',
      minRangeVal: 2.0,
      maxRangeVal: 4.5,
      currentNumVal: 3.2,
    },
    {
      id: 'bmi',
      name: 'Body Mass Index (BMI)',
      currentValue: '23.6',
      unit: 'kg/m²',
      healthyRange: '18.5 - 24.9',
      status: 'Normal',
      statusColor: 'emerald',
      icon: <Scale className="w-4 h-4 text-emerald-400" />,
      trendData: [24.1, 23.9, 23.8, 23.7, 23.6],
      changePct: 'Optimal Zone',
      minRangeVal: 16,
      maxRangeVal: 30,
      currentNumVal: 23.6,
    },
    {
      id: 'visceral-fat',
      name: 'Visceral Fat',
      currentValue: 'Level 3',
      unit: '',
      healthyRange: 'Level 1 - 9',
      status: 'Excellent',
      statusColor: 'emerald',
      icon: <HeartPulse className="w-4 h-4 text-rose-400" />,
      trendData: [4, 4, 3, 3, 3],
      changePct: '-1 Level lower risk',
      minRangeVal: 1,
      maxRangeVal: 12,
      currentNumVal: 3,
    },
    {
      id: 'bmr',
      name: 'Basal Metabolic Rate',
      currentValue: '1,840',
      unit: 'kcal',
      healthyRange: '1,600 - 2,100 kcal',
      status: 'Improving',
      statusColor: 'cyan',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      trendData: [1780, 1800, 1815, 1830, 1840],
      changePct: '+60 kcal/day burn',
      minRangeVal: 1400,
      maxRangeVal: 2200,
      currentNumVal: 1840,
    },
  ];

  // Helper function to render a mini SVG sparkline graph
  const renderSparkline = (data: number[], colorStr: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * 50;
        const y = 20 - ((val - min) / range) * 16;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-14 h-6 overflow-visible" viewBox="0 0 50 20">
        <polyline
          fill="none"
          stroke={colorStr}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Glow point on current end */}
        <circle
          cx="50"
          cy={20 - ((data[data.length - 1] - min) / range) * 16}
          r="2.5"
          fill={colorStr}
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div className="glass-panel p-5 rounded-[32px] border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-blue-950/40 space-y-5">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Body Composition</h2>
            <p className="text-[10px] text-slate-400 font-medium">Apple Health & Bio-Impression Diagnostics</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5" /> Optimal
        </span>
      </div>

      {/* OVERALL HEALTH SCORE & AI SUMMARY HERO BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md items-center">
        {/* Circular Health Score Ring */}
        <div className="flex flex-col items-center justify-center text-center p-1 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Ambient ring glow */}
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg animate-pulse" />
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{overallScore}</span>
              <span className="text-[8px] font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[10px] border border-cyan-500/30">
              Excellent Score
            </span>
          </div>
        </div>

        {/* AI Analysis Summary Text */}
        <div className="sm:col-span-2 space-y-1.5 pl-0 sm:pl-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Composition Insights</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "Your body composition is improving. Lean muscle has increased by <strong className="text-cyan-300">1.8 kg</strong> during the last month while body fat has decreased by <strong className="text-emerald-300">2.3%</strong>. Recovery and hydration are both supporting healthy progress."
          </p>
        </div>
      </div>

      {/* METRICS GRID (8 Detailed Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const isSelected = selectedMetricId === m.id;

          // Color stroke for sparkline
          const sparklineColor =
            m.statusColor === 'emerald'
              ? '#22c55e'
              : m.statusColor === 'cyan'
              ? '#06b6d4'
              : m.statusColor === 'blue'
              ? '#3b82f6'
              : '#f59e0b';

          // Range slider position calculation
          let rangePosPct = 50;
          if (m.currentNumVal && m.minRangeVal && m.maxRangeVal) {
            rangePosPct = Math.min(
              100,
              Math.max(0, ((m.currentNumVal - m.minRangeVal) / (m.maxRangeVal - m.minRangeVal)) * 100)
            );
          }

          return (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => {
                soundManager.play('glass_transition');
                setSelectedMetricId(isSelected ? null : m.id);
              }}
              className={`p-3.5 rounded-2xl glass-card border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/20'
              }`}
            >
              {/* Top Row: Icon + Title + Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/10 shrink-0">
                    {m.icon}
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">{m.name}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    m.status === 'Excellent'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : m.status === 'Improving'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : m.status === 'Normal'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Middle Row: Value + Sparkline */}
              <div className="flex items-baseline justify-between my-1">
                <div>
                  <span className="text-xl font-black text-white tracking-tight">
                    {m.currentValue}
                  </span>
                  {m.unit && <span className="text-xs font-semibold text-slate-400 ml-1">{m.unit}</span>}
                  <div className="text-[10px] font-medium text-cyan-400 mt-0.5 flex items-center gap-1">
                    {m.changePct.includes('-') ? (
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                    )}
                    {m.changePct}
                  </div>
                </div>

                {/* Sparkline Graph */}
                <div className="flex flex-col items-end">
                  {renderSparkline(m.trendData, sparklineColor)}
                  <span className="text-[8px] text-slate-500 mt-1 font-semibold uppercase">30-day trend</span>
                </div>
              </div>

              {/* Bottom Row: Range Progress Indicator Bar */}
              <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1">
                <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                  <span>Healthy Range</span>
                  <span className="text-slate-200">{m.healthyRange}</span>
                </div>

                {/* Range Bar */}
                <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div className="absolute inset-y-0 left-[20%] right-[20%] bg-blue-500/30" />
                  {/* Marker Dot */}
                  <div
                    className="absolute top-0 bottom-0 w-2 bg-cyan-400 rounded-full -translate-x-1/2 shadow-[0_0_8px_rgba(6,182,212,1)]"
                    style={{ left: `${rangePosPct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
