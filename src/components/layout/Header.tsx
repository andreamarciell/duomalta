import React from 'react';
import { Menu, Bell, Sun, Moon, Monitor } from 'lucide-react';
import { useUIActions, useTheme, useUnreadNotificationCount } from '@/store/useUi';
import { useUserPreferences } from '@/store/useUser';

export function Header() {
  const { toggleSidebar, setTheme } = useUIActions();
  const currentTheme = useTheme();
  const unreadCount = useUnreadNotificationCount();
  const preferences = useUserPreferences();

  const handleThemeToggle = () => {
    if (currentTheme === 'light') {
      setTheme('dark');
    } else if (currentTheme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getThemeTooltip = () => {
    switch (currentTheme) {
      case 'light':
        return 'Passa a tema scuro';
      case 'dark':
        return 'Passa a tema automatico';
      default:
        return 'Passa a tema chiaro';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Kellu
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Impara il maltese, sul serio
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifiche */}
          <button className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Toggle tema */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={getThemeTooltip()}
          >
            {getThemeIcon()}
          </button>

          {/* User menu placeholder */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-maltese-100 dark:bg-maltese-900 rounded-full flex items-center justify-center">
              <span className="text-maltese-600 dark:text-maltese-400 font-semibold text-sm">
                {preferences?.language === 'it' ? 'IT' : 'EN'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
