import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, Notification, ModalState } from '@/types';

interface UIStore extends UIState {
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  
  // Notifiche
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Modal
  openModal: (id: string, props?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Sidebar
  openSidebar: () => void;
  
  // Utility
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      sidebarOpen: false,
      notifications: [],
      modals: [],

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme });
        applyTheme(theme);
      },

      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      closeSidebar: () => {
        set({ sidebarOpen: false });
      },

      openSidebar: () => {
        set({ sidebarOpen: true });
      },

      addNotification: (notificationData) => {
        const notification: Notification = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          ...notificationData,
        };
        
        set(state => ({
          notifications: [...state.notifications, notification],
        }));
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      markNotificationAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      openModal: (id: string, props?: Record<string, any>) => {
        set(state => ({
          modals: [...state.modals, { id, isOpen: true, props }],
        }));
      },

      closeModal: (id: string) => {
        set(state => ({
          modals: state.modals.map(m =>
            m.id === id ? { ...m, isOpen: false } : m
          ),
        }));
      },

      closeAllModals: () => {
        set({ modals: [] });
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'kellu-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Funzione per applicare il tema al DOM
function applyTheme(theme: 'light' | 'dark' | 'auto') {
  const effectiveTheme = theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  
  const root = document.documentElement;
  
  // Rimuovi classi esistenti
  root.classList.remove('light', 'dark');
  
  // Aggiungi la nuova classe
  root.classList.add(effectiveTheme);
  
  // Aggiorna l'attributo data-theme per compatibilità
  root.setAttribute('data-theme', effectiveTheme);
}

// Hook per accedere facilmente ai dati UI
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useModals = () => useUIStore((state) => state.modals);
export const useEffectiveTheme = () => useUIStore((state) => state.getEffectiveTheme());

// Hook per le azioni UI
export const useUIActions = () => useUIStore((state) => ({
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  closeSidebar: state.closeSidebar,
  openSidebar: state.openSidebar,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  clearNotifications: state.clearNotifications,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals,
}));

// Hook per notifiche non lette
export const useUnreadNotifications = () => 
  useUIStore((state) => state.notifications.filter(n => !n.isRead));

// Hook per notifiche di un tipo specifico
export const useNotificationsByType = (type: Notification['type']) =>
  useUIStore((state) => state.notifications.filter(n => n.type === type));

// Hook per modal aperti
export const useOpenModals = () =>
  useUIStore((state) => state.modals.filter(m => m.isOpen));

// Hook per un modal specifico
export const useModal = (id: string) =>
  useUIStore((state) => state.modals.find(m => m.id === id));

// Hook per verificare se un modal è aperto
export const useIsModalOpen = (id: string) =>
  useUIStore((state) => state.modals.some(m => m.id === id && m.isOpen));

// Hook per ottenere le props di un modal
export const useModalProps = (id: string) =>
  useUIStore((state) => state.modals.find(m => m.id === id)?.props);

// Hook per il conteggio delle notifiche
export const useNotificationCount = () =>
  useUIStore((state) => state.notifications.length);

// Hook per il conteggio delle notifiche non lette
export const useUnreadNotificationCount = () =>
  useUIStore((state) => state.notifications.filter(n => !n.isRead).length);

// Hook per il conteggio dei modal aperti
export const useOpenModalCount = () =>
  useUIStore((state) => state.modals.filter(m => m.isOpen).length);

// Hook per la gestione del tema con effetti collaterali
export const useThemeManager = () => {
  const { setTheme, getEffectiveTheme } = useUIActions();
  const currentTheme = useTheme();
  const effectiveTheme = useEffectiveTheme();

  // Effetto per applicare il tema quando cambia
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Effetto per ascoltare i cambiamenti del sistema
  React.useEffect(() => {
    if (currentTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [currentTheme]);

  return {
    currentTheme,
    effectiveTheme,
    setTheme,
    isAuto: currentTheme === 'auto',
    isLight: effectiveTheme === 'light',
    isDark: effectiveTheme === 'dark',
  };
};

// Hook per la gestione delle notifiche con auto-removal
export const useNotificationManager = () => {
  const { addNotification, removeNotification } = useUIActions();
  const notifications = useNotifications();

  const showNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    autoRemove: boolean = true,
    duration: number = 5000
  ) => {
    const notification = addNotification({ type, title, message });
    
    if (autoRemove) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
    
    return notification;
  };

  const showSuccess = (title: string, message: string) =>
    showNotification('success', title, message);

  const showError = (title: string, message: string) =>
    showNotification('error', title, message);

  const showWarning = (title: string, message: string) =>
    showNotification('warning', title, message);

  const showInfo = (title: string, message: string) =>
    showNotification('info', title, message);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};

// Hook per la gestione dei modal con props tipizzate
export const useModalManager = () => {
  const { openModal, closeModal, closeAllModals } = useUIActions();
  const modals = useModals();
  const openModals = useOpenModals();

  const openTypedModal = <T extends Record<string, any>>(
    id: string,
    props?: T
  ) => {
    openModal(id, props);
  };

  const closeTypedModal = (id: string) => {
    closeModal(id);
  };

  return {
    modals,
    openModals,
    openModal: openTypedModal,
    closeModal: closeTypedModal,
    closeAllModals,
  };
};
