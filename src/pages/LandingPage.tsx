import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  GraduationCap, 
  Gamepad2, 
  Star, 
  Users, 
  Globe,
  ArrowRight,
  Play
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function LandingPage() {
  const { isDark } = useTheme();

  const features = [
    {
      icon: BookOpen,
      title: 'Lezioni Interattive',
      description: 'Impara il maltese con esercizi dinamici e coinvolgenti',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Target,
      title: 'Pratica Mirata',
      description: 'Esercizi personalizzati per migliorare le tue abilità',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: GraduationCap,
      title: 'Grammar Lab',
      description: 'Approfondisci la grammatica maltese con esempi pratici',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Gamepad2,
      title: 'Giochi Educativi',
      description: 'Divertiti imparando con mini-giochi e sfide',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const stats = [
    { label: 'Lezioni Disponibili', value: '25+' },
    { label: 'Esercizi Interattivi', value: '150+' },
    { label: 'Utenti Attivi', value: '1K+' },
    { label: 'Lingue Supportate', value: '3' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-maltese-50 via-white to-maltese-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-maltese-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Kellu</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/onboarding"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Inizia
              </Link>
              <Link
                to="/app/dashboard"
                className="bg-maltese-500 hover:bg-maltese-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Accedi
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Impara il maltese,
            <br />
            <span className="text-maltese-600 dark:text-maltese-400">sul serio</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            La piattaforma più completa per imparare la lingua maltese. 
            Lezioni interattive, esercizi pratici e un sistema di ripetizione 
            spaziata per un apprendimento efficace e duraturo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/onboarding"
              className="bg-maltese-500 hover:bg-maltese-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Inizia Gratis</span>
            </Link>
            
            <Link
              to="/app/dashboard"
              className="border-2 border-maltese-500 text-maltese-600 dark:text-maltese-400 hover:bg-maltese-50 dark:hover:bg-maltese-900/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <span>Prova Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Perché scegliere Kellu?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Una piattaforma completa progettata per rendere l'apprendimento 
            del maltese efficace, divertente e accessibile a tutti.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-maltese-600 dark:text-maltese-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-maltese-500 to-maltese-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto a iniziare il tuo viaggio nel maltese?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Unisciti a migliaia di studenti che stanno già imparando con Kellu
          </p>
          <Link
            to="/onboarding"
            className="bg-white text-maltese-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Inizia Ora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-maltese-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold">Kellu</span>
              </div>
              <p className="text-gray-400">
                Impara il maltese, sul serio
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Prodotto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/app/learn" className="hover:text-white transition-colors">Lezioni</Link></li>
                <li><Link to="/app/practice" className="hover:text-white transition-colors">Pratica</Link></li>
                <li><Link to="/app/grammar-lab" className="hover:text-white transition-colors">Grammar Lab</Link></li>
                <li><Link to="/app/games" className="hover:text-white transition-colors">Giochi</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Supporto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/app/profile" className="hover:text-white transition-colors">Profilo</Link></li>
                <li><Link to="/app/leaderboard" className="hover:text-white transition-colors">Classifica</Link></li>
                <li><Link to="/app/admin" className="hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kellu. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
