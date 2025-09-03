import React from 'react';
import { Target, Clock, Star } from 'lucide-react';
import { useDailyGoal } from '@/store/useUser';

export function DailyGoalWidget() {
  const dailyGoal = useDailyGoal();

  if (!dailyGoal) return null;

  const { type, target, current } = dailyGoal;
  const progress = Math.min((current / target) * 100, 100);
  const isCompleted = current >= target;

  const getIcon = () => {
    if (type === 'minutes') return <Clock className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getLabel = () => {
    if (type === 'minutes') return 'minuti';
    return 'XP';
  };

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (progress >= 75) return 'bg-maltese-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-gradient-to-br from-maltese-50 to-maltese-100 dark:from-maltese-900 dark:to-maltese-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-maltese-600 dark:text-maltese-400" />
          <h3 className="text-sm font-medium text-maltese-800 dark:text-maltese-200">
            Obiettivo Giornaliero
          </h3>
        </div>
        {isCompleted && (
          <span className="text-green-600 dark:text-green-400 text-xs font-medium">
            ✓ Completato
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            {getIcon()}
            <span className="text-maltese-700 dark:text-maltese-300">
              {current} / {target} {getLabel()}
            </span>
          </div>
          <span className="font-semibold text-maltese-800 dark:text-maltese-200">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Motivational message */}
        {!isCompleted && (
          <div className="text-xs text-maltese-600 dark:text-maltese-400 text-center">
            {progress >= 75 && 'Quasi fatto! Continua così!'}
            {progress >= 50 && progress < 75 && 'Metà strada! Sei sulla buona strada!'}
            {progress >= 25 && progress < 50 && 'Inizia bene! Mantieni il ritmo!'}
            {progress < 25 && 'Ogni piccolo passo conta! Inizia oggi!'}
          </div>
        )}

        {isCompleted && (
          <div className="text-xs text-green-600 dark:text-green-400 text-center font-medium">
            🎉 Obiettivo raggiunto! Fantastico lavoro!
          </div>
        )}
      </div>
    </div>
  );
}
