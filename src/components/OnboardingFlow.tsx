import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Dumbbell,
  Target,
  Flame,
  Activity,
  Award,
  Zap,
  Droplets,
  Moon,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, UserGoal, Gender, ActivityLevel, ExperienceLevel, WorkoutLocation, EquipmentType, MuscleGroup, InjuryArea, DietType, AllergyType } from '../types';
import { soundManager } from '../lib/soundManager';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onCompleteOnboarding?: (updatedProfile: UserProfile) => void;
  onComplete?: (updatedProfile: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onCompleteOnboarding,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Form State initialized with initialProfile values
  const [form, setForm] = useState<UserProfile>(initialProfile);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  const totalSteps = 20;

  const handleNext = () => {
    soundManager.play('screen_transition');
    if (step === 19) {
      // Step 20 is AI Analysis
      setStep(20);
      runAiAnalysis();
    } else if (step < 20) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    soundManager.play('back');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    if (arr.includes(item)) {
      return arr.filter((i) => i !== item);
    } else {
      return [...arr, item];
    }
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    soundManager.play('ai_thinking');
    try {
      const response = await fetch('/api/ai/onboarding-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setForm((prev) => ({
        ...prev,
        estimatedCalories: data.estimatedCalories || 2400,
        proteinTargetG: data.proteinTargetG || 180,
        carbsTargetG: data.carbsTargetG || 250,
        fatsTargetG: data.fatsTargetG || 70,
        overallRecoveryScore: data.recoveryScore || 82,
        recommendedSplit: data.split || '5-Day Hypertrophy Split',
      }));
    } catch (e) {
      console.error('AI Analysis failed, using baseline:', e);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsFinished(true);
        soundManager.play('ai_insight_generated');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d2ff', '#3b82f6', '#8b5cf6'],
        });
      }, 2000);
    }
  };

  const handleFinish = () => {
    soundManager.play('account_created');
    const callback = onCompleteOnboarding || onComplete;
    if (callback) {
      callback({
        ...form,
        isOnboarded: true,
      });
    }
  };

  // Render Step Content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Welcome to PhysIQ</h2>
            <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Let's personalize your fitness journey in less than 2 minutes.
            </p>
          </div>
        );

      case 2:
        const goals: UserGoal[] = [
          'Lose Fat',
          'Build Muscle',
          'Gain Weight',
          'Increase Strength',
          'Improve Fitness',
          'Improve Endurance',
          'Stay Healthy',
        ];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">What is your main goal?</h3>
            <p className="text-xs text-slate-400 mb-6">Select your primary focus area.</p>
            <div className="space-y-2.5">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setForm({ ...form, goal: g })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.goal === g
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {g}
                  {form.goal === g && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        const genderOptions: { value: Gender; label: string; symbol: string; desc: string }[] = [
          { value: 'Male', label: 'Male', symbol: '♂', desc: 'Automatically loads Male Anatomical Body Map' },
          { value: 'Female', label: 'Female', symbol: '♀', desc: 'Automatically loads Female Anatomical Body Map' },
        ];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Select your gender</h3>
            <p className="text-xs text-slate-400 mb-6">Determines your anatomical body map & metabolic formula.</p>
            <div className="space-y-3">
              {genderOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setForm({ ...form, gender: g.value })}
                  className={`w-full p-4 rounded-2xl glass-card flex items-center justify-between text-left transition-all ${
                    form.gender === g.value
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                      : 'text-slate-300 hover:bg-slate-800/50 border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl ${
                      g.value === 'Male' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {g.symbol}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{g.label}</div>
                      <div className="text-[11px] text-slate-400">{g.desc}</div>
                    </div>
                  </div>
                  {form.gender === g.value && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">How old are you?</h3>
            <p className="text-xs text-slate-400 mb-8">Used to determine metabolism & recovery speeds.</p>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
              {form.age} <span className="text-xl font-normal text-slate-400">years</span>
            </div>
            <input
              type="range"
              min="13"
              max="90"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 5:
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Your Height</h3>
              <div className="flex glass-pill p-1 rounded-xl">
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    heightUnit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit('ft')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    heightUnit === 'ft' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ft/in
                </button>
              </div>
            </div>
            <div className="text-center my-8">
              <div className="text-5xl font-black text-white">
                {heightUnit === 'cm'
                  ? `${form.heightCm} cm`
                  : `${Math.floor(form.heightCm / 30.48)}' ${Math.round((form.heightCm % 30.48) / 2.54)}"`}
              </div>
            </div>
            <input
              type="range"
              min="130"
              max="220"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: parseInt(e.target.value) })}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 6:
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Current Weight</h3>
              <div className="flex glass-pill p-1 rounded-xl">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    weightUnit === 'kg' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lb')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    weightUnit === 'lb' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  lb
                </button>
              </div>
            </div>
            <div className="text-center my-8">
              <div className="text-5xl font-black text-white">
                {weightUnit === 'kg' ? `${form.weightKg} kg` : `${Math.round(form.weightKg * 2.20462)} lb`}
              </div>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              step="0.5"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 7:
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Target Weight</h3>
            <p className="text-xs text-slate-400 mb-6">What is your physique destination?</p>
            <div className="text-center my-8">
              <div className="text-5xl font-black text-cyan-400">
                {weightUnit === 'kg' ? `${form.targetWeightKg} kg` : `${Math.round(form.targetWeightKg * 2.20462)} lb`}
              </div>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              step="0.5"
              value={form.targetWeightKg}
              onChange={(e) => setForm({ ...form, targetWeightKg: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 8:
        const activities: ActivityLevel[] = [
          'Sedentary',
          'Lightly Active',
          'Moderately Active',
          'Very Active',
          'Athlete',
        ];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">How active are you?</h3>
            <p className="text-xs text-slate-400 mb-6">Excluding your workout sessions.</p>
            <div className="space-y-2.5">
              {activities.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm({ ...form, activityLevel: a })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.activityLevel === a
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {a}
                  {form.activityLevel === a && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 9:
        const experiences: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Training Experience</h3>
            <p className="text-xs text-slate-400 mb-6">How long have you been lifting?</p>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setForm({ ...form, experienceLevel: exp })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.experienceLevel === exp
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {exp}
                  {form.experienceLevel === exp && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 10:
        const locations: WorkoutLocation[] = ['Gym', 'Home', 'Both'];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Workout Location</h3>
            <p className="text-xs text-slate-400 mb-6">Where do you usually train?</p>
            <div className="space-y-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setForm({ ...form, workoutLocation: loc })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.workoutLocation === loc
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {loc}
                  {form.workoutLocation === loc && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 11:
        const allEquipment: EquipmentType[] = [
          'Dumbbells',
          'Barbell',
          'Bench',
          'Cable Machine',
          'Pull-up Bar',
          'Resistance Bands',
          'Smith Machine',
          'Machines',
          'None',
        ];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Select Available Equipment</h3>
            <p className="text-xs text-slate-400 mb-4">Select all that apply.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {allEquipment.map((eq) => {
                const isSelected = form.equipment.includes(eq);
                return (
                  <button
                    key={eq}
                    onClick={() => setForm({ ...form, equipment: toggleArrayItem(form.equipment, eq) })}
                    className={`p-3 rounded-xl glass-card text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {eq}
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 12:
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Workout Days</h3>
            <p className="text-xs text-slate-400 mb-8">How many days per week can you train?</p>
            <div className="text-6xl font-black text-blue-400 mb-8">
              {form.workoutDaysPerWeek} <span className="text-xl font-medium text-slate-400">days/week</span>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, workoutDaysPerWeek: d })}
                  className={`w-10 h-12 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                    form.workoutDaysPerWeek === d
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                      : 'glass-pill text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        );

      case 13:
        const durations = [20, 30, 45, 60, 90];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Preferred Workout Duration</h3>
            <p className="text-xs text-slate-400 mb-6">How long do you want to train per session?</p>
            <div className="space-y-3">
              {durations.map((dur) => (
                <button
                  key={dur}
                  onClick={() => setForm({ ...form, workoutDurationMin: dur })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.workoutDurationMin === dur
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {dur === 90 ? '90+ minutes' : `${dur} minutes`}
                  {form.workoutDurationMin === dur && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 14:
        const priorityMusclesList: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Glutes'];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Priority Muscle Groups</h3>
            <p className="text-xs text-slate-400 mb-4">Select muscles you want to grow most.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {priorityMusclesList.map((m) => {
                const isSelected = form.priorityMuscles.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => setForm({ ...form, priorityMuscles: toggleArrayItem(form.priorityMuscles, m) })}
                    className={`p-3.5 rounded-xl glass-card text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {m}
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 15:
        const injuriesList: InjuryArea[] = ['Shoulder', 'Knee', 'Lower Back', 'Neck', 'Wrist', 'None'];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Do you have any injuries?</h3>
            <p className="text-xs text-slate-400 mb-4">We will adjust exercise selection accordingly.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {injuriesList.map((inj) => {
                const isSelected = form.injuries.includes(inj);
                return (
                  <button
                    key={inj}
                    onClick={() => {
                      if (inj === 'None') {
                        setForm({ ...form, injuries: ['None'] });
                      } else {
                        const newInjuries = form.injuries.filter((i) => i !== 'None');
                        setForm({ ...form, injuries: toggleArrayItem(newInjuries, inj) });
                      }
                    }}
                    className={`p-3.5 rounded-xl glass-card text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {inj}
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 16:
        const diets: DietType[] = [
          'No Preference',
          'High Protein',
          'Vegetarian',
          'Vegan',
          'Keto',
          'Mediterranean',
        ];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Choose your diet preference</h3>
            <p className="text-xs text-slate-400 mb-6">Shapes your macro recommendations.</p>
            <div className="space-y-2.5">
              {diets.map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, diet: d })}
                  className={`w-full p-4 rounded-xl glass-card flex items-center justify-between text-left text-sm font-semibold transition-all ${
                    form.diet === d
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {d}
                  {form.diet === d && <Check className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 17:
        const allergiesList: AllergyType[] = ['Nuts', 'Dairy', 'Eggs', 'Seafood', 'Gluten', 'None'];
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Food Allergies</h3>
            <p className="text-xs text-slate-400 mb-4">Select any food intolerances.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {allergiesList.map((a) => {
                const isSelected = form.allergies.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => {
                      if (a === 'None') {
                        setForm({ ...form, allergies: ['None'] });
                      } else {
                        const next = form.allergies.filter((i) => i !== 'None');
                        setForm({ ...form, allergies: toggleArrayItem(next, a) });
                      }
                    }}
                    className={`p-3.5 rounded-xl glass-card text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {a}
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 18:
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Daily Water Intake</h3>
            <p className="text-xs text-slate-400 mb-8">How much water do you drink daily?</p>
            <div className="text-5xl font-black text-cyan-400 mb-8 flex items-center justify-center gap-2">
              <Droplets className="w-8 h-8 text-cyan-400" />
              {form.dailyWaterTargetL} <span className="text-xl font-normal text-slate-400">Liters</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.25"
              value={form.dailyWaterTargetL}
              onChange={(e) => setForm({ ...form, dailyWaterTargetL: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 19:
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Average Sleep Duration</h3>
            <p className="text-xs text-slate-400 mb-8">Crucial for muscle recovery score.</p>
            <div className="text-5xl font-black text-purple-400 mb-8 flex items-center justify-center gap-2">
              <Moon className="w-8 h-8 text-purple-400" />
              {form.avgSleepHours} <span className="text-xl font-normal text-slate-400">hours / night</span>
            </div>
            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={form.avgSleepHours}
              onChange={(e) => setForm({ ...form, avgSleepHours: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        );

      case 20:
        return (
          <div className="text-center py-8">
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              <Zap className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Final AI Analysis</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto animate-pulse">
              Creating your personalized PhysIQ experience...
            </p>
            <div className="mt-6 space-y-2 text-left max-w-xs mx-auto text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Analyzing body profile & BMI
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Calibrating recovery baseline
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Calculating protein & macro targets
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#04060c] text-white flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Finished Summary Screen */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-[#04060c] p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="max-w-md mx-auto w-full my-auto py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> AI Profile Ready
                </div>
                <h2 className="text-3xl font-black text-white">Welcome, {form.name}!</h2>
                <p className="text-xs text-slate-400 mt-1">Your AI fitness profile is initialized.</p>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Target className="w-4 h-4 text-blue-400" /> Goal
                  </div>
                  <div className="text-sm font-bold text-white truncate">{form.goal}</div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Flame className="w-4 h-4 text-orange-400" /> Est. Calories
                  </div>
                  <div className="text-sm font-bold text-white">{form.estimatedCalories} kcal</div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Dumbbell className="w-4 h-4 text-emerald-400" /> Protein Target
                  </div>
                  <div className="text-sm font-bold text-white">{form.proteinTargetG} g/day</div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Activity className="w-4 h-4 text-cyan-400" /> Recovery Score
                  </div>
                  <div className="text-sm font-bold text-cyan-400">{form.overallRecoveryScore}%</div>
                </div>

                <div className="col-span-2 glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Award className="w-4 h-4 text-purple-400" /> Workout Split
                  </div>
                  <div className="text-sm font-bold text-white">{form.recommendedSplit}</div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Start My Journey
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Progress Bar */}
      <div className="w-full max-w-md mx-auto pt-2">
        <div className="flex items-center justify-between mb-4">
          {step > 1 && step < 20 ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-xl glass-pill text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}

          <div className="text-xs font-semibold text-slate-400">
            Step {step} <span className="text-slate-600">/ {totalSteps}</span>
          </div>

          <button
            onClick={() => {
              setStep(20);
              runAiAnalysis();
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            Skip
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      {step < 20 && (
        <div className="w-full max-w-md mx-auto pb-4">
          <button
            onClick={handleNext}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
