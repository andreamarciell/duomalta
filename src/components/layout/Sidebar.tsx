import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Target, 
  GraduationCap, 
  Gamepad2, 
  User, 
  Trophy, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useSidebarOpen, useUIActions } from '@/store/useUi';
import { useUser, useUserXP, useUserStreak } from '@/store/useUser';
import { DailyGoalWidget } from '@/components/widgets/DailyGoalWidget';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: Home },
  { name: 'Impara', href: '/app/learn', icon: BookOpen },
  { name: 'Pratica', href: '/app/practice', icon: Target },
  { name: 'Grammar Lab', href: '/app/grammar-lab', icon: GraduationCap },
  { name: 'Giochi', href: '/app/games', icon: Gamepad2 },
  { name: 'Profilo', href: '/app/profile', icon: User },
  { name: 'Classifica', href: '/app/leaderboard', icon: Trophy },
  { name: 'Admin', href: '/app/admin', icon: Settings },
];

export function Sidebar() {
  const sidebarOpen = useSidebarOpen();
  const { closeSidebar } = useUIActions();
  const location = useLocation();
  const user = useUser();
  const xp = useUserXP();
  const streak = useUserStreak();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent 
          user={user} 
          xp={xp} 
          streak={streak} 
          location={location}
          onClose={closeSidebar}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-white lg:dark:bg-gray-800 lg:shadow-lg">
        <SidebarContent 
          user={user} 
          xp={xp} 
          streak={streak} 
          location={location}
        />
      </div>
    </>
  );
}

interface SidebarContentProps {
  user: any;
  xp: number;
  streak: number;
  location: any;
  onClose?: () => void;
}

function SidebarContent({ user, xp, streak, location, onClose }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-maltese-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Kellu</span>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-maltese-100 dark:bg-maltese-900 rounded-full flex items-center justify-center">
            <span className="text-maltese-600 dark:text-maltese-400 font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Livello {user?.level}
            </p>
          </div>
        </div>
        
        {/* XP e Streak */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">XP</span>
            <span className="font-semibold text-maltese-600 dark:text-maltese-400">
              {xp.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Streak</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              🔥 {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Goal Widget */}
      <div className="px-6 py-4">
        <DailyGoalWidget />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-maltese-100 text-maltese-700 dark:bg-maltese-900 dark:text-maltese-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive
                    ? 'text-maltese-500 dark:text-maltese-400'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Impara il maltese, sul serio
        </div>
      </div>
    </div>
  );
}
