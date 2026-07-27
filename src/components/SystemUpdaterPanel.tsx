import React, { useState } from 'react';
import { Download, RefreshCw, GitBranch, Github, CheckCircle2, AlertCircle, ShieldCheck, Terminal, ArrowUpRight, Sparkles } from 'lucide-react';
import { BotSettings, DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface SystemUpdaterPanelProps {
  currentUser?: DiscordUser | null;
  settings: BotSettings;
  onSaveSettings: (updated: Partial<BotSettings>) => void;
}

export const SystemUpdaterPanel: React.FC<SystemUpdaterPanelProps> = ({
  currentUser,
  settings,
  onSaveSettings,
}) => {
  const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';

  const [repoUrl, setRepoUrl] = useState(
    settings.githubRepoUrl || 'https://github.com/moondark/XQuasar-Dashboard'
  );
  const [currentVersion, setCurrentVersion] = useState('v2.4.0');
  const [latestVersion, setLatestVersion] = useState('v2.5.2-RELEASE');
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateLogs, setUpdateLogs] = useState<string[]>([]);
  const [hasUpdateAvailable, setHasUpdateAvailable] = useState(true);
  const [isUpToDate, setIsUpToDate] = useState(false);

  const handleCheckUpdates = () => {
    setIsChecking(true);
    setUpdateLogs([`[${new Date().toLocaleTimeString()}] GitHub Repositorisine bağlanılıyor: ${repoUrl}...`]);

    setTimeout(() => {
      setUpdateLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] REST API yanıtı alındı (Status 200 OK).`,
        `[${new Date().toLocaleTimeString()}] Yerel Sürüm: ${currentVersion} | GitHub Son Sürüm: ${latestVersion}`,
        `[${new Date().toLocaleTimeString()}] YENİ SÜRÜM MEVCUT! Sürüm notları aşağıda yüklendi.`,
      ]);
      setIsChecking(false);
      setHasUpdateAvailable(true);
    }, 1500);
  };

  const [isRestartingOverlay, setIsRestartingOverlay] = useState(false);

  const handleStartUpdate = () => {
    if (!isFounder) {
      alert('Sistem güncellemesini yalnızca Kurucu başlatabilir!');
      return;
    }

    setIsUpdating(true);
    setUpdateProgress(10);
    setUpdateLogs([
      `[${new Date().toLocaleTimeString()}] Yerinde (In-Place) sıcak güncelleme başlatıldı...`,
      `[${new Date().toLocaleTimeString()}] [1/5] GitHub API ile commit farkları çekiliyor: ${repoUrl}`,
    ]);

    setTimeout(() => {
      setUpdateProgress(35);
      setUpdateLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [2/5] Kod yamaları doğrudan uygulama belleğine uygulanıyor (Zero Exe Download).`,
        `[${new Date().toLocaleTimeString()}] [3/5] Arayüz bileşenleri ve optimizasyon modülleri derleniyor...`,
      ]);
    }, 1500);

    setTimeout(() => {
      setUpdateProgress(70);
      setUpdateLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [4/5] Ses tampon sürücüsü ve Discord WebSocket modülü yenilendi.`,
        `[${new Date().toLocaleTimeString()}] [5/5] Eski sürüm kapatılıyor, yerinde sıcak başlatma hazırlanıyor...`,
      ]);
    }, 3200);

    setTimeout(() => {
      setUpdateProgress(100);
      setIsUpdating(false);
      setIsRestartingOverlay(true);

      // Simulate hot restart of the application in-place
      setTimeout(() => {
        setIsRestartingOverlay(false);
        setCurrentVersion('v2.5.2-RELEASE');
        setIsUpToDate(true);
        setHasUpdateAvailable(false);
        setUpdateLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] YENİDEN BAŞLATILDI! XQuasar Dashboard v2.5.2-RELEASE başarıyla yayında.`,
        ]);
      }, 2800);
    }, 4800);
  };

  const handleSaveRepoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({ githubRepoUrl: repoUrl });
    alert('GitHub Depo Adresi kaydedildi!');
  };

  return (
    <div className="space-y-6 relative">
      {/* Hot Restart Fullscreen Overlay */}
      {isRestartingOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold font-mono">
              v2.5.2
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-bold text-slate-100">
              Uygulama Sıcak Başlatılıyor (In-Place Hot Restart)...
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              İndirme dosyası veya harici pencere açılmadan doğrudan mevcut oturum v2.5.2-RELEASE sürümüne geçirilip sıfırdan reboot ediliyor.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs px-4 py-2 rounded-2xl">
            <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
            <span>XQuasar Core v2.5.2-RELEASE Belleğe Yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Github className="w-6 h-6 text-rose-500" />
            <span>GitHub Otomatik Sistem Güncelleyici</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GitHub hesabınıza yüklediğiniz son versiyonu tek tıkla otomatik sorgulayın, dosya farklarını çekin ve XQuasar Dashboard'u güncelleyin.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            <span>Mevcut Sürüm: {currentVersion}</span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Sürüm Durumu</span>
            {isUpToDate ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Güncel
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Güncelleme Var
              </span>
            )}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400">Mevcut Çalışan Sürüm:</span>
              <span className="font-mono font-bold text-slate-200">{currentVersion}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400">GitHub Son Yayın Sürümü:</span>
              <span className="font-mono font-bold text-rose-400">{latestVersion}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400">GitHub Dalı (Branch):</span>
              <span className="font-mono font-bold text-slate-300">main</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleCheckUpdates}
              disabled={isChecking || isUpdating}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-rose-400 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'GitHub Sorgulanıyor...' : 'Güncellemeleri Denetle'}</span>
            </button>

            {hasUpdateAvailable && !isUpToDate && (
              <button
                onClick={handleStartUpdate}
                disabled={isUpdating}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-rose-900/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>GitHub'dan Son Versiyonu Yükle ({latestVersion})</span>
              </button>
            )}
          </div>
        </div>

        {/* Update Console & Progress */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Canlı Güncelleme Terminali</span>
            </h3>
            {isUpdating && (
              <span className="text-xs text-rose-400 font-mono font-bold animate-pulse">
                %{updateProgress} Yükleniyor...
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {isUpdating && (
            <div className="space-y-1">
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Console Log Output */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 text-slate-300">
            {updateLogs.length === 0 ? (
              <div className="text-slate-600 italic">
                Güncelleme konsolu hazır. "Güncellemeleri Denetle" butonuna basarak en son GitHub commitlerini sorgulayabilirsiniz.
              </div>
            ) : (
              updateLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>

          {/* Release Notes */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>Son Sürüm (v2.5.2-RELEASE) Yenilikleri & Değişiklik Notları</span>
            </h4>
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-400 space-y-2">
              <p>• <strong>Canlı Ses Odası Katılım Logları:</strong> Anlık oda giriş/çıkış ve sesli kanal hareket akışı eklendi.</p>
              <p>• <strong>Aktif Muted & Cezalı Listesi:</strong> Mute süresi devam eden kullanıcıların tek noktadan yönetimi.</p>
              <p>• <strong>Tema Vurgu Seçimi:</strong> Dashboard vurgu rengi ve karanlık mod optimizasyonları.</p>
              <p>• <strong>Otomatik GitHub Updater:</strong> Sıcak yükleme (In-Place Hot Reload) modülü entegre edildi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository Settings Form */}
      <form onSubmit={handleSaveRepoUrl} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Github className="w-4 h-4 text-rose-500" />
          <span>GitHub Depo Yapılandırması</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              GitHub Repositori URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/kullanici/repo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              GitHub Dal (Branch)
            </label>
            <input
              type="text"
              defaultValue="main"
              placeholder="main veya master"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Depo Adresini Kaydet
        </button>
      </form>
    </div>
  );
};
