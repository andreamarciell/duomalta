# Kellu - Impara il maltese, sul serio

Una piattaforma completa per l'apprendimento della lingua maltese, progettata per rendere l'apprendimento efficace, divertente e accessibile a tutti.

## 🚀 Caratteristiche

### Core Features
- **Lezioni Interattive**: Esercizi dinamici e coinvolgenti per imparare il maltese
- **Sistema SRS**: Ripetizione spaziata basata su SM-2 per un apprendimento duraturo
- **Pratica Mirata**: Esercizi personalizzati per migliorare abilità specifiche
- **Grammar Lab**: Approfondimenti grammaticali con esempi pratici
- **Giochi Educativi**: Mini-giochi per rendere l'apprendimento divertente

### Tipi di Esercizi
- Multiple Choice (singola/multipla)
- Match Pairs (parola ↔ traduzione)
- Type What You Hear (ascolto → input testo)
- Speak The Phrase (STT per pronuncia)
- Fill The Gap (cloze)
- Order The Tokens (costruzione frasi)
- Root Pattern Builder (specifico maltese)
- Listening Discrimination (discriminazione fonemica)

### Gamification
- Sistema XP e livelli
- Streak giornalieri
- Badge e achievement
- Obiettivi giornalieri personalizzabili
- Classifica e social features

### Tecnologie Avanzate
- **Web Speech API**: TTS e STT per pronuncia e ascolto
- **Normalizzazione Maltese**: Gestione diacritici e fonemi speciali
- **Offline-first**: Cache locale per lezioni e audio
- **Responsive Design**: Mobile-first con UI moderna

## 🛠️ Stack Tecnologico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier

## 📁 Struttura del Progetto

```
src/
├── app/
│   └── router.tsx          # Configurazione routing
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── exercises/           # Componenti esercizi
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   ├── ui/                  # Componenti UI riutilizzabili
│   └── widgets/
│       └── DailyGoalWidget.tsx
├── content/                 # Dati seed
│   ├── units.json
│   ├── grammar.json
│   └── badges.json
├── lib/
│   ├── maltese/
│   │   └── normalize.ts     # Utility normalizzazione maltese
│   ├── srs/
│   │   └── schedule.ts      # Sistema SRS
│   └── speech/
│       ├── tts.ts          # Adapter sintesi vocale
│       └── stt.ts          # Adapter riconoscimento vocale
├── pages/                   # Pagine dell'applicazione
├── store/                   # Store Zustand
│   ├── useUser.ts
│   ├── useSrs.ts
│   └── useUi.ts
├── styles/
│   └── index.css           # Stili TailwindCSS
└── types/
    └── index.ts            # Definizioni TypeScript
```

## 🚀 Installazione e Setup

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Installazione

1. **Clona il repository**
```bash
git clone <repository-url>
cd kellu
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Avvia l'ambiente di sviluppo**
```bash
npm run dev
```

4. **Apri nel browser**
```
http://localhost:5173
```

### Script Disponibili

- `npm run dev` - Avvia l'ambiente di sviluppo
- `npm run build` - Build per produzione
- `npm run preview` - Anteprima build produzione
- `npm run test` - Esegue i test
- `npm run test:ui` - Interfaccia test
- `npm run test:run` - Test una tantum
- `npm run lint` - Controlla il codice
- `npm run lint:fix` - Corregge automaticamente
- `npm run format` - Formatta il codice
- `npm run type-check` - Controlla i tipi TypeScript

## 🌍 Lingue Supportate

- **Interfaccia**: Italiano, Inglese
- **Contenuti**: Maltese, Inglese, Italiano
- **TTS/STT**: Maltese (mt-MT), Inglese (en-GB), Italiano (it-IT)

## 🎯 Sistema SRS (Spaced Repetition)

Il sistema implementa l'algoritmo SM-2 semplificato:

- **Qualità 0-2**: Reset a 1 giorno
- **Qualità 3-5**: Aumento progressivo dell'intervallo
- **Easiness Factor**: Adattivo basato sulle performance
- **Coda Giornaliera**: Item prioritari per la revisione

## 🔤 Normalizzazione Maltese

Gestione intelligente dei fonemi speciali:

- **Ħ ħ**: H aspirata
- **Ġ ġ**: G palatale  
- **Ż ż**: Z sonora
- **għ**: Suono gutturale
- **q**: Occlusiva glottale
- **x**: Fricativa palatale (pronunciata "sh")

Modalità di valutazione:
- **Lenient**: Tollerante a diacritici e varianti
- **Strict**: Richiede ortografia esatta

## 🎮 Giochi e Gamification

### Badge Disponibili
- 🌅 Bongu Starter - Prima lezione completata
- 🤝 Ħabib tal-Malti - 5 lezioni completate
- 🔥 Streak Master - 7 giorni consecutivi
- ⭐ XP Hunter - 1000 XP raggiunti
- 📚 Grammar Guru - 10 esercizi grammatica
- 🎤 Pronunciation Pro - 20 esercizi pronuncia
- ⚡ Speed Demon - Lezione in <5 minuti
- 🏆 Perfect Score - 100% in una lezione

### Sistema XP
- **Risposta corretta**: 10 XP
- **Combo**: Bonus per risposte consecutive
- **Streak**: Bonus giornaliero progressivo
- **Obiettivi**: Bonus per milestone raggiunti

## 📱 Responsive Design

- **Mobile-first**: Ottimizzato per dispositivi mobili
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Interfacce ottimizzate per touch
- **Accessibilità**: ARIA labels, focus states, tasti rapidi

## 🧪 Testing

### Struttura Test
```
tests/
├── srs.test.ts             # Test sistema SRS
├── normalize.test.ts        # Test normalizzazione maltese
└── evaluate.test.tsx        # Test valutazione esercizi
```

### Esecuzione Test
```bash
# Test completi
npm run test

# Test con UI
npm run test:ui

# Test una tantum
npm run test:run
```

## 🔧 Configurazione

### Variabili Ambiente
```bash
# TTS/STT (opzionali)
VITE_ENABLE_TTS=true
VITE_ENABLE_STT=true

# API Keys (future implementazioni)
VITE_API_URL=
VITE_API_KEY=
```

### Tema
- **Light**: Tema chiaro
- **Dark**: Tema scuro  
- **Auto**: Segue preferenze sistema

## 📊 Performance

- **Bundle Size**: Ottimizzato con Vite
- **Code Splitting**: Routing lazy-loaded
- **Caching**: TanStack Query per dati
- **Offline**: Cache locale con IndexedDB
- **PWA Ready**: Service worker ready

## 🚧 Roadmap

### Fase 1 (Completata)
- ✅ Setup progetto base
- ✅ Routing e layout
- ✅ Store e state management
- ✅ Sistema SRS base
- ✅ Normalizzazione maltese
- ✅ TTS/STT adapter
- ✅ UI components base

### Fase 2 (In Sviluppo)
- 🔄 Motore esercizi completo
- 🔄 Grammar Lab funzionale
- 🔄 Sistema giochi
- 🔄 Progress tracking avanzato

### Fase 3 (Pianificata)
- 📋 Social features
- 📋 Analytics avanzate
- 📋 Mobile app
- 📋 API backend
- 📋 Multi-utente

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### Linee Guida
- Segui le convenzioni TypeScript
- Aggiungi test per nuove funzionalità
- Mantieni la coerenza con il design system
- Documenta le nuove API

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi `LICENSE` per i dettagli.

## 🙏 Ringraziamenti

- **Maltese Language Council** per la guida linguistica
- **React Team** per l'ecosistema React
- **TailwindCSS** per il framework CSS
- **Zustand** per la gestione dello stato
- **Vite** per il build tool

## 📞 Supporto

- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@kellu.app

---

**Kellu** - Impara il maltese, sul serio 🇲🇹

*Sviluppato con ❤️ per la comunità maltese*
