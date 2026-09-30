import React, { useState, useEffect } from 'react';
import { Language, Theme, TabView, Tool, LegalPage, AppTheme } from './types';
import { toolsList, categories } from './data/toolsList';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';
import { admobService } from './services/admobService';
import { AdMobRewardModal } from './components/ads/AdMobRewardModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ToolsView } from './components/views/ToolsView';
import { FavoritesView } from './components/views/FavoritesView';
import { SettingsView } from './components/views/SettingsView';
import { ToolDetailView } from './components/views/ToolDetailView';
import { LegalView } from './components/views/LegalView';
import { translations } from './data/translations';
import {
  logAppOpen,
  logToolOpened,
  logFavoriteAdded,
  logFavoriteRemoved,
  logCopyResult,
} from './services/firebaseAnalytics';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ht_language') as Language) || 'ar';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ht_theme') as Theme) || 'dark';
  });

  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('ht_app_theme') as AppTheme) || 'professional';
  });

  const [activeTab, setActiveTab] = useState<TabView>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedLegalPage, setSelectedLegalPage] = useState<LegalPage>('privacy');
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ht_favorites');
      return saved ? JSON.parse(saved) : ['password-gen', 'color-converter', 'dev-calculator'];
    } catch {
      return ['password-gen', 'color-converter'];
    }
  });

  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ht_recent');
      return saved ? JSON.parse(saved) : ['password-gen', 'json-formatter'];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const t = translations[language];

  // Sync Language & RTL direction
  useEffect(() => {
    localStorage.setItem('ht_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Sync Theme
  useEffect(() => {
    localStorage.setItem('ht_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.body.className = 'antialiased min-h-screen';
  }, [theme]);

  // Sync AppTheme (Central Theme System)
  useEffect(() => {
    localStorage.setItem('ht_app_theme', appTheme);
    document.documentElement.setAttribute('data-app-theme', appTheme);
  }, [appTheme]);

  // Log App Open via privacy-safe analytics
  useEffect(() => {
    logAppOpen();
  }, []);

  // App Open Ad on visibility change (returning to app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !showSplash) {
        admobService.showAppOpenAd();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showSplash]);

  // Save Favorites
  useEffect(() => {
    localStorage.setItem('ht_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save Recents
  useEffect(() => {
    localStorage.setItem('ht_recent', JSON.stringify(recentToolIds));
  }, [recentToolIds]);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2500);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      logCopyResult('tool_result');
      triggerToast(
        language === 'ar' ? 'تم النسخ إلى الحافظة بنجاح!' : 'Copied to clipboard successfully!',
        'success'
      );
    });
  };

  const handleClearRecents = () => {
    setRecentToolIds([]);
    triggerToast(
      language === 'ar' ? 'تم مسح سجل الأدوات المستخدمة مؤخراً بنجاح.' : 'Recent tools history cleared successfully.',
      'info'
    );
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setActiveTab('tool-detail');

    // Register user action for frequency-controlled interstitial ads
    admobService.registerAction();

    // Privacy-safe analytics tracking for tool navigation (only tool ID and title)
    logToolOpened(tool.id, tool.titleEn);

    // Update Recents
    setRecentToolIds((prev) => {
      const filtered = prev.filter((id) => id !== tool.id);
      return [tool.id, ...filtered].slice(0, 6);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLegal = (page: LegalPage) => {
    setSelectedLegalPage(page);
    setActiveTab('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRewardGranted = (amount: number, item: string) => {
    triggerToast(
      language === 'ar'
        ? `تهانينا! تم منح المكافأة: ${amount}x ${item}`
        : `Reward granted: ${amount}x ${item}!`,
      'success'
    );
  };

  const handleToggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(toolId);
      if (isFav) {
        logFavoriteRemoved(toolId);
        triggerToast(
          language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites',
          'info'
        );
        return prev.filter((id) => id !== toolId);
      } else {
        logFavoriteAdded(toolId);
        triggerToast(
          language === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites',
          'success'
        );
        return [...prev, toolId];
      }
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text)',
        backgroundImage: 'var(--theme-pattern)',
        backgroundSize: '28px 28px',
      }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
    >
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          language={language}
          theme={theme}
          onFinish={() => {
            setShowSplash(false);
            admobService.showAppOpenAd();
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      {/* AdMob Reward Modal */}
      <AdMobRewardModal
        isOpen={isRewardModalOpen}
        language={language}
        theme={theme}
        onClose={() => setIsRewardModalOpen(false)}
        onRewardGranted={handleRewardGranted}
      />

      {/* Header Bar */}
      <Header
        language={language}
        theme={theme}
        activeTab={activeTab}
        favoritesCount={favorites.length}
        onLanguageToggle={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        {activeTab === 'home' && (
          <HomeView
            tools={toolsList}
            categories={categories}
            language={language}
            theme={theme}
            favorites={favorites}
            recentToolIds={recentToolIds}
            onSelectTool={handleSelectTool}
            onToggleFavorite={handleToggleFavorite}
            onClearRecents={handleClearRecents}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsView
            tools={toolsList}
            categories={categories}
            language={language}
            theme={theme}
            favorites={favorites}
            recentToolIds={recentToolIds}
            onSelectTool={handleSelectTool}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            tools={toolsList}
            language={language}
            theme={theme}
            favorites={favorites}
            recentToolIds={recentToolIds}
            onSelectTool={handleSelectTool}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            language={language}
            theme={theme}
            appTheme={appTheme}
            onLanguageToggle={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onSelectAppTheme={(newTheme) => {
              setAppTheme(newTheme);
              triggerToast(
                language === 'ar' ? 'تم تطبيق المظهر بنجاح' : 'Theme applied successfully',
                'success'
              );
            }}
            onSelectLegal={handleSelectLegal}
            onOpenRewardModal={() => setIsRewardModalOpen(true)}
          />
        )}

        {activeTab === 'legal' && (
          <LegalView
            page={selectedLegalPage}
            language={language}
            theme={theme}
            onBack={() => setActiveTab('settings')}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'tool-detail' && selectedTool && (
          <ToolDetailView
            tool={selectedTool}
            language={language}
            theme={theme}
            isFavorite={favorites.includes(selectedTool.id)}
            onBack={() => setActiveTab('home')}
            onToggleFavorite={handleToggleFavorite}
            onCopy={handleCopy}
            onTriggerToast={triggerToast}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        language={language}
        theme={theme}
        favoritesCount={favorites.length}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
