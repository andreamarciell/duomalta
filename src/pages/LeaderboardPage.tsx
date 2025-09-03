import React from 'react';

export function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Classifica
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Confronta i tuoi progressi con altri studenti e sfida i tuoi amici.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Questa pagina è in fase di sviluppo. Verrà implementata la classifica locale e la possibilità di aggiungere amici.
        </p>
      </div>
    </div>
  );
}
