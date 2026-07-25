import React from 'react';
import { motion } from 'motion/react';
import { Home, Accessibility, Utensils, Dumbbell, User } from 'lucide-react';
import { soundManager } from '../lib/soundManager';

interface BottomNavProps {
  activeTab: 'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile';
  onTabChange: (tab: 'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Body', label: 'Body', icon: Accessibility },
    { id: 'Nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'Workout', label: 'Workout', icon: Dumbbell },
    { id: 'Profile', label: 'Profile', icon: User },
  ] as const;

  const handleSelect = (tabId: 'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile') => {
    if (activeTab !== tabId) {
      soundManager.play('tab_change');
    }
    onTabChange(tabId);
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-4 max-w-md mx-auto pointer-events-auto select-none">
      <div className="relative glass-panel rounded-full p-1.5 flex items-center justify-around border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-[#090d19]/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="relative flex-1 py-2 flex flex-col items-center justify-center transition-all group"
            >
              {/* Active Pill Highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-white/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
