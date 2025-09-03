import React from 'react';
import { useParams } from 'react-router-dom';

export function LearnPage() {
  const { unitId, lessonId } = useParams();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Lezione: {lessonId}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unità: {unitId}
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Questa pagina è in fase di sviluppo. Verrà implementato il motore degli esercizi.
        </p>
      </div>
    </div>
  );
}
