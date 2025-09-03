import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useUIActions } from '@/store/useUi';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { addNotification } = useUIActions();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    level: 'beginner',
    dailyGoal: 15,
    goalType: 'minutes',
    language: 'it',
    theme: 'auto',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Completa onboarding
      addNotification({
        type: 'success',
        title: 'Benvenuto su Kellu!',
        message: 'Il tuo profilo è stato configurato con successo.',
      });
      navigate('/app/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maltese-50 via-white to-maltese-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-maltese-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Kellu</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configura il tuo profilo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalizza la tua esperienza di apprendimento
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step
                    ? 'bg-maltese-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {stepNumber < step ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    stepNumber < step ? 'bg-maltese-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Qual è il tuo livello di maltese?
              </h2>
              
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Principiante', description: 'Non ho mai studiato maltese' },
                  { value: 'intermediate', label: 'Intermedio', description: 'Conosco le basi' },
                  { value: 'advanced', label: 'Avanzato', description: 'Posso conversare fluentemente' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      preferences.level === option.value
                        ? 'border-maltese-500 bg-maltese-50 dark:bg-maltese-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={option.value}
                      checked={preferences.level === option.value}
                      onChange={(e) => updatePreference('level', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    {preferences.level === option.value && (
                      <div className="w-5 h-5 bg-maltese-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Qual è il tuo obiettivo giornaliero?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo di obiettivo
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'minutes', label: 'Minuti di studio' },
                      { value: 'xp', label: 'Punti XP' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          preferences.goalType === option.value
                            ? 'text-maltese-600 dark:text-maltese-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="goalType"
                          value={option.value}
                          checked={preferences.goalType === option.value}
                          onChange={(e) => updatePreference('goalType', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full ${
                          preferences.goalType === option.value
                            ? 'border-maltese-500 bg-maltese-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {preferences.goalType === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Obiettivo giornaliero: {preferences.dailyGoal} {preferences.goalType === 'minutes' ? 'minuti' : 'XP'}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={preferences.dailyGoal}
                    onChange={(e) => updatePreference('dailyGoal', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5</span>
                    <span>30</span>
                    <span>60</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Personalizza la tua esperienza
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lingua dell\'interfaccia
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => updatePreference('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-maltese-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="it">Italiano</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tema
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'light', label: 'Chiaro' },
                      { value: 'dark', label: 'Scuro' },
                      { value: 'auto', label: 'Automatico' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          preferences.theme === option.value
                            ? 'text-maltese-600 dark:text-maltese-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="theme"
                          value={option.value}
                          checked={preferences.theme === option.value}
                          onChange={(e) => updatePreference('theme', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full ${
                          preferences.theme === option.value
                            ? 'border-maltese-500 bg-maltese-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {preferences.theme === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Indietro
            </button>
            
            <button
              onClick={handleNext}
              className="bg-maltese-500 hover:bg-maltese-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>{step === 3 ? 'Completa' : 'Avanti'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <Link
            to="/app/dashboard"
            className="text-maltese-600 dark:text-maltese-400 hover:text-maltese-700 dark:hover:text-maltese-300 text-sm"
          >
            Salta e configura dopo
          </Link>
        </div>
      </div>
    </div>
  );
}
