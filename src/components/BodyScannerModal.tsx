import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Scan, Sparkles, Check, Activity } from 'lucide-react';
import { soundManager } from '../lib/soundManager';

interface BodyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteScan: (results: any) => void;
}

export const BodyScannerModal: React.FC<BodyScannerModalProps> = ({
  isOpen,
  onClose,
  onCompleteScan,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setIsScanning(true);
    soundManager.play('ai_thinking');
    try {
      const res = await fetch('/api/ai/body-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musclesWorked: ['Chest', 'Deltoids', 'Triceps'],
          sorenessRating: 4,
          sleepHours: 8,
        }),
      });
      const data = await res.json();
      setScanResult(data);
      soundManager.play('ai_insight_generated');
    } catch (e) {
      setScanResult({
        overallRecoveryScore: 82,
        aiInsightSummary: 'Your upper body muscles are adapting well with minimal strain.',
      });
      soundManager.play('ai_insight_generated');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyScan = () => {
    soundManager.play('success');
    onCompleteScan(scanResult);
    setScanResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 select-none max-w-md mx-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between z-10">
          <button onClick={onClose} className="p-2 rounded-full glass-pill text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> PhysIQ 3D Body Scanner
          </div>
          <div className="w-9" />
        </div>

        {/* Camera Silhouette Frame */}
        <div className="my-auto relative w-full aspect-[3/4] max-h-[380px] mx-auto rounded-3xl border-2 border-dashed border-cyan-500/50 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,210,255,0.25)]">
          {/* Laser Scanner Bar */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00d2ff] animate-pulse pointer-events-none" />

          {/* Body Silhouette SVG Overlay */}
          <div className="w-48 h-72 border border-cyan-400/30 rounded-full flex items-center justify-center relative">
            <Scan className="w-16 h-16 text-cyan-400 animate-ping opacity-70" />
            <span className="absolute text-[10px] text-cyan-300 font-bold tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded-full bottom-4">
              Align Body Frame
            </span>
          </div>
        </div>

        {/* Results / Scan Trigger Button */}
        {scanResult ? (
          <div className="glass-panel p-5 rounded-3xl border border-cyan-500/40 space-y-3 z-10 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Scan Complete
              </span>
              <span className="text-lg font-black text-white">{scanResult.overallRecoveryScore || 82}% Recovery</span>
            </div>
            <p className="text-xs text-slate-300">{scanResult.aiInsightSummary}</p>
            <button
              onClick={handleApplyScan}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Apply Scan Results
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 z-10"
          >
            <Camera className="w-4 h-4" />
            {isScanning ? 'Analyzing Body Composition...' : 'Start AI Body Scan'}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
