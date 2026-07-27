import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Layout, 
  Github, 
  Download, 
  Check, 
  Sparkles, 
  Trash2,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { BotSettings, DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface DashboardSettingsPanelProps {
  currentUser?: DiscordUser | null;
  settings: BotSettings;
  onSaveSettings: (updated: Partial<BotSettings>) => void;
  onNavigateToUpdater: () => void;
}

export const DashboardSettingsPanel: React.FC<DashboardSettingsPanelProps> = ({
  currentUser,
  settings,
  onSaveSettings,
  onNavigateToUpdater,
}) => {
  // Theme Mode: dark, light, system
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>(
    (localStorage.getItem('xquasar_theme_mode') as 'dark' | 'light' | 'system') || 'dark'
  );

  // Accent Color
  const [accentColor, setAccentColor] = useState<string>(
    settings.themeAccent || 'rose'
  );

  // Auto Refresh Interval
  const [refreshInterval, setRefreshInterval] = useState<number>(
    Number(localStorage.getItem('xquasar_refresh_rate')) || 5
  );

  // Compact View
  const [isCompactMode, setIsCompactMode] = useState<boolean>(
    localStorage.getItem('xquasar_compact_mode') === 'true'
  );

  // Sound Alerts
  const [soundAlerts, setSoundAlerts] = useState<boolean>(
    localStorage.getItem('xquasar_sound_alerts') !== 'false'
  );

  // High Contrast
  const [highContrast, setHighContrast] = useState<boolean>(
    localStorage.getItem('xquasar_high_contrast') === 'true'
  );

  // Language
  const [language, setLanguage] = useState<'tr' | 'en'>(
    (localStorage.getItem('xquasar_lang') as 'tr' | 'en') || 'tr'
  );

  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Apply Theme Mode & Settings
  useEffect(() => {
    localStorage.setItem('xquasar_theme_mode', themeMode);
    localStorage.setItem('xquasar_refresh_rate', refreshInterval.toString());
    localStorage.setItem('xquasar_compact_mode', isCompactMode.toString());
    localStorage.setItem('xquasar_sound_alerts', soundAlerts.toString());
    localStorage.setItem('xquasar_high_contrast', highContrast.toString());
    localStorage.setItem('xquasar_lang', language);

    // Apply attribute to body
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    }
  }, [themeMode, refreshInterval, isCompactMode, soundAlerts, highContrast, language]);

  const handleSaveThemeAccent = (colorId: string) => {
    setAccentColor(colorId);
    onSaveSettings({ themeAccent: colorId });
    showToast('Dashboard tema rengi kaydedildi');
  };

  const showToast = (msg: string) => {
    setSavedSuccessMessage(msg);
    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 2500);
  };

  const handleClearCache = () => {
    if (confirm('Dashboard önbelleği ve yerel tercihler sıfırlanacak. Devam edilsin mi?')) {
      localStorage.clear();
      showToast('Dashboard önbelleği başarıyla temizlendi');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const themeAccentOptions = [
    { id: 'rose', name: 'XQuasar Kırmızı', colorClass: 'bg-rose-600', ringClass: 'ring-rose-500' },
    { id: 'indigo', name: 'Siber Indigo', colorClass: 'bg-indigo-600', ringClass: 'ring-indigo-500' },
    { id: 'emerald', name: 'Zümrüt Yeşil', colorClass: 'bg-emerald-600', ringClass: 'ring-emerald-500' },
    { id: 'blue', name: 'Safir Mavi', colorClass: 'bg-blue-600', ringClass: 'ring-blue-500' },
    { id: 'amber', name: 'Altın Amber', colorClass: 'bg-amber-600', ringClass: 'ring-amber-500' },
    { id: 'purple', name: 'Koyu Mor', colorClass: 'bg-purple-600', ringClass: 'ring-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-rose-500/50 text-slate-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-rose-500" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-500" />
            <span>Dashboard Genel Ayarları</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Görünüm, tema modları, bildirim sesleri ve arayüz kişiselleştirmelerini yönetin.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
            Sürüm: v2.5.2-RELEASE
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Theme & Appearance Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sun className="w-4 h-4 text-rose-500" />
            <span>Tema Modu & Arayüz Stil Tercihi</span>
          </h3>

          {/* Light / Dark Mode Selectors */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Arayüz Parlaklık Modu
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-3 rounded-2xl border transition text-center flex flex-col items-center space-y-2 cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-slate-800 border-rose-500 text-slate-100 font-bold ring-2 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-5 h-5 text-rose-400" />
                <span className="text-xs">Koyu Mod</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-3 rounded-2xl border transition text-center flex flex-col items-center space-y-2 cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-800 border-rose-500 text-slate-100 font-bold ring-2 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-xs">Açık Mod</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('system')}
                className={`p-3 rounded-2xl border transition text-center flex flex-col items-center space-y-2 cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-slate-800 border-rose-500 text-slate-100 font-bold ring-2 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Sistem</span>
              </button>
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Vurgu Rengi (Accent Palette)</span>
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">{accentColor}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {themeAccentOptions.map((opt) => {
                const isSelected = accentColor === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleSaveThemeAccent(opt.id)}
                    className={`p-2.5 rounded-2xl border transition flex items-center space-x-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-rose-500 ring-2 ring-rose-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${opt.colorClass} shrink-0`}></div>
                    <span className="text-xs font-medium text-slate-200 truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Dashboard View & Density */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-rose-500" />
            <span>Görünüm Yoğunluğu & Yenileme Hızı</span>
          </h3>

          {/* Auto Refresh Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Canlı Veri Yenileme Sıklığı
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => {
                setRefreshInterval(Number(e.target.value));
                showToast('Yenileme sıklığı güncellendi');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
            >
              <option value={3}>Her 3 saniyede bir (Çok Hızlı)</option>
              <option value={5}>Her 5 saniyede bir (Önerilen)</option>
              <option value={10}>Her 10 saniyede bir (Normal)</option>
              <option value={30}>Her 30 saniyede bir (Düşük Trafik)</option>
              <option value={0}>Otomatik Yenilemeyi Kapat</option>
            </select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-200">Kompakt Satır Düzeni</div>
                <div className="text-[11px] text-slate-400">Listeleri ve tabloları daha dar alanda gösterir</div>
              </div>
              <input
                type="checkbox"
                checked={isCompactMode}
                onChange={(e) => {
                  setIsCompactMode(e.target.checked);
                  showToast(e.target.checked ? 'Kompakt mod açıldı' : 'Normal mod açıldı');
                }}
                className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-200">Sesli Olay Bildirimleri</div>
                <div className="text-[11px] text-slate-400">Yeni ihlal ve kritik uyarılarda bipler</div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => {
                  setSoundAlerts(e.target.checked);
                  showToast(e.target.checked ? 'Sesli uyarılar aktif' : 'Sesli uyarılar kapatıldı');
                }}
                className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-200">Yüksek Kontrast Modu</div>
                <div className="text-[11px] text-slate-400">Metin ve kenarlık netliğini artırır</div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => {
                  setHighContrast(e.target.checked);
                  showToast(e.target.checked ? 'Yüksek kontrast açıldı' : 'Yüksek kontrast kapatıldı');
                }}
                className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. System Updater Quick Integrated Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>GitHub Otomatik Güncelleme Motoru</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  v2.5.2 Hazır
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deponuzdaki en güncel koda harici tarayıcı veya indirme penceresi açmadan yerinde (in-place) yükseltin.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToUpdater}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer shrink-0 shadow-lg shadow-rose-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Güncelleme Merkezini Aç</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Çalışan Sürüm:</span>
            <span className="font-mono font-bold text-slate-200">v2.5.0</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Son Yayın:</span>
            <span className="font-mono font-bold text-rose-400">v2.5.2-RELEASE</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Güncelleme Tipi:</span>
            <span className="font-mono font-bold text-emerald-400">In-Place Hot Reload</span>
          </div>
        </div>
      </div>

      {/* 4. Cache & Maintenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            Dashboard Önbellek ve Yerel Tercih Temizliği
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tarayıcınızdaki yerel ayarları ve önbelleğe alınmış oturum verilerini sıfırlar.
          </p>
        </div>

        <button
          onClick={handleClearCache}
          className="bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Yerel Önbelleği Sıfırla</span>
        </button>
      </div>
    </div>
  );
};
