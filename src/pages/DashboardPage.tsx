import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  Award,
  Clock,
  Star
} from 'lucide-react';
import { useUser, useUserXP, useUserStreak, useDailyGoal } from '@/store/useUser';
import { useSRSStats, useSRSActions } from '@/store/useSrs';
import { useUIActions } from '@/store/useUi';
import { DailyGoalWidget } from '@/components/widgets/DailyGoalWidget';

export function DashboardPage() {
  const user = useUser();
  const xp = useUserXP();
  const streak = useUserStreak();
  const dailyGoal = useDailyGoal();
  const srsStats = useSRSStats();
  const { generateDailyQueue } = useSRSActions();
  const { addNotification } = useUIActions();

  useEffect(() => {
    generateDailyQueue();
  }, [generateDailyQueue]);

  // Mock data per le prossime lezioni
  const upcomingLessons = [
    {
      id: 'l1-greetings',
      title: 'Tislijiet - Saluti',
      unit: 'Bażi - Le Basi',
      estimatedDuration: 8,
      difficulty: 'Principiante',
      progress: 0,
    },
    {
      id: 'l2-intros',
      title: 'Introduzzjonijiet - Presentazioni',
      unit: 'Bażi - Le Basi',
      estimatedDuration: 10,
      difficulty: 'Principiante',
      progress: 0,
    },
  ];

  // Mock data per i badge recenti
  const recentBadges = [
    {
      id: 'badge-01',
      name: 'Bongu Starter',
      description: 'Hai completato la tua prima lezione',
      icon: '🌅',
      unlockedAt: new Date(),
    },
  ];

  // Mock data per le statistiche
  const stats = [
    {
      label: 'Lezioni Completate',
      value: '0',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'XP Totali',
      value: xp.toLocaleString(),
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      label: 'Streak Attuale',
      value: `${streak} giorni`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      label: 'Item SRS',
      value: `${srsStats.dueItems} da ripassare`,
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  const handleStartLesson = (lessonId: string) => {
    addNotification({
      type: 'info',
      title: 'Lezione Iniziata',
      message: 'Buona fortuna con la tua lezione!',
    });
    // TODO: Navigate to lesson
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-maltese-500 to-maltese-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bongu, {user?.username}! 👋
            </h1>
            <p className="text-maltese-100 text-lg">
              Pronto per un'altra sessione di apprendimento?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl font-bold">{xp.toLocaleString()} XP</div>
              <div className="text-maltese-100">Totale</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Daily Goal & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Daily Goal Widget */}
          <DailyGoalWidget />

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Azioni Rapide
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-maltese-500 hover:bg-maltese-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Prossima Lezione</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Pratica Mirata</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Grammar Lab</span>
              </button>
            </div>
          </div>

          {/* Recent Badges */}
          {recentBadges.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Badge Recenti
              </h3>
              <div className="space-y-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {badge.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Upcoming Lessons & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Prossime Lezioni
              </h3>
              <Link
                to="/app/learn"
                className="text-maltese-600 dark:text-maltese-400 hover:text-maltese-700 dark:hover:text-maltese-300 text-sm font-medium"
              >
                Vedi tutte
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lesson.unit}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.estimatedDuration} min</span>
                      </span>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStartLesson(lesson.id)}
                    className="ml-4 bg-maltese-500 hover:bg-maltese-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Panoramica Progresso
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Questa Settimana
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lezioni</span>
                    <span className="font-medium text-gray-900 dark:text-white">0/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">XP Guadagnati</span>
                    <span className="font-medium text-gray-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                    <span className="font-medium text-gray-900 dark:text-white">{streak} giorni</span>
                  </div>
                </div>
              </div>

              {/* SRS Stats */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Sistema SRS
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Item in Coda</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {srsStats.dueItems}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(srsStats.retentionRate * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Qualità Media</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {srsStats.avgQuality}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
