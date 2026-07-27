import React, { useState } from 'react';
import { BotSettings, VoiceChannel, DiscordUser, FOUNDER_DISCORD_ID } from '../types';
import { Settings, Save, Key, Shield, Volume2, Database, Bell, Check, RefreshCw, Lock, Crown, UserCheck, Palette, Github, Download, Sparkles } from 'lucide-react';

interface BotSettingsPanelProps {
  settings: BotSettings;
  channels: VoiceChannel[];
  currentUser: DiscordUser;
  onSaveSettings: (newSettings: Partial<BotSettings>) => void;
  onNavigateToUpdater?: () => void;
}

export const BotSettingsPanel: React.FC<BotSettingsPanelProps> = ({
  settings,
  channels,
  currentUser,
  onSaveSettings,
  onNavigateToUpdater,
}) => {
  const [formData, setFormData] = useState<BotSettings>(settings);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const isFounder = currentUser.id === FOUNDER_DISCORD_ID || currentUser.id === (formData.founderDiscordId || FOUNDER_DISCORD_ID);

  const themeOptions = [
    { id: 'rose', name: 'Koyu Kırmızı (XQuasar Red)', colorClass: 'bg-rose-600', ringClass: 'ring-rose-500' },
    { id: 'indigo', name: 'Siber Indigo', colorClass: 'bg-indigo-600', ringClass: 'ring-indigo-500' },
    { id: 'emerald', name: 'Zümrüt Yeşil', colorClass: 'bg-emerald-600', ringClass: 'ring-emerald-500' },
    { id: 'blue', name: 'Safir Mavi', colorClass: 'bg-blue-600', ringClass: 'ring-blue-500' },
    { id: 'amber', name: 'Altın Amber', colorClass: 'bg-amber-600', ringClass: 'ring-amber-500' },
    { id: 'purple', name: 'Koyu Mor', colorClass: 'bg-purple-600', ringClass: 'ring-purple-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-500" />
            <span>Bot & Sunucu Konfigürasyon Ayarları</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discord botunuzun ses kaydetme parametrelerini, yetkilerini ve webhook entegrasyonlarını buradan yönetin.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Check className="w-4 h-4" />
            <span>Ayarlar Kaydedildi!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Accent Color Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>A. Dashboard Tema Vurgu Rengi Seçimi</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Aktif: <strong className="text-rose-500 uppercase">{formData.themeAccent || 'rose'}</strong>
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {themeOptions.map((t) => {
              const isSelected = (formData.themeAccent || 'rose') === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFormData({ ...formData, themeAccent: t.id })}
                  className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-rose-500 ring-2 ring-rose-500/40'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${t.colorClass} shadow-md`}></div>
                  <span className="text-[11px] font-bold text-slate-200 block truncate">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GitHub Auto Updater Quick Card */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>GitHub Otomatik Sistem Güncelleyici</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    v2.5.2 Hazır
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  GitHub hesabınıza yüklediğiniz son sürüm paketlerini XQuasar Dashboard'a tek tıkla entegre edin.
                </p>
              </div>
            </div>

            {onNavigateToUpdater && (
              <button
                type="button"
                onClick={onNavigateToUpdater}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Güncelleme Merkezini Aç</span>
              </button>
            )}
          </div>
        </div>

        {/* Credentials Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-rose-500" />
            <span>1. Discord Bot Kimlik & API Bilgileri</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
              <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <span>Sunucu İsmi (Dashboard Başlığında Görünür)</span>
              </label>
              <input
                type="text"
                placeholder="Örn: Moebius"
                value={formData.serverName || ''}
                onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs font-bold rounded-xl p-3 focus:outline-none focus:border-rose-500 font-mono tracking-wide"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Buraya yazdığınız isim üst menüdeki sunucu başlığında ve bot kayıtlarında güncellenir.
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Discord Bot Token
              </label>
              <input
                type="password"
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Client ID (Application ID)
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Hedef Discord Sunucu ID (Guild ID)
              </label>
              <input
                type="text"
                value={formData.guildId}
                onChange={(e) => setFormData({ ...formData, guildId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Panel API Secret Key (Bot Doğrulama)
              </label>
              <input
                type="text"
                value={formData.apiSecretKey}
                onChange={(e) => setFormData({ ...formData, apiSecretKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Recording Engine Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>2. Sesli Kayıt Motoru & Tampon (Ring Buffer) Ayarları</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Döngüsel Ses Tampon Süresi (Dakika)
              </label>
              <select
                value={formData.rollingBufferMinutes}
                onChange={(e) => setFormData({ ...formData, rollingBufferMinutes: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              >
                <option value={5}>5 Dakika (Düşük RAM)</option>
                <option value={10}>10 Dakika</option>
                <option value={15}>15 Dakika (Önerilen)</option>
                <option value={30}>30 Dakika (Yüksek RAM)</option>
                <option value={60}>60 Dakika (Maksimum Arşiv)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Bot sadece bu süre kadar geriye dönük ses verisini RAM'de saklar.
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Ses Kalitesi (Bitrate)
              </label>
              <select
                value={formData.audioQualityKbps}
                onChange={(e) => setFormData({ ...formData, audioQualityKbps: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              >
                <option value={64}>64 kbps (Standart Ses)</option>
                <option value={96}>96 kbps (Yüksek Netlik - Önerilen)</option>
                <option value={128}>128 kbps (Ultra Netlik)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoJoinPublicChannels}
                onChange={(e) => setFormData({ ...formData, autoJoinPublicChannels: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-200 font-medium">Public Kanallara Otomatik Katıl</span>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoRecordOnConnect}
                onChange={(e) => setFormData({ ...formData, autoRecordOnConnect: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-200 font-medium">Biri Girdiğinde Otomatik Kayda Başla</span>
            </label>
          </div>
        </div>

        {/* Webhooks & Moderation Roles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>3. Webhook Bildirimleri & Otomatik Temizlik</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Discord Moderatör Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Yeni bir şikayet açıldığında bu webhook üzerinden Discord yetkili kanalına anlık bildirim atılır.
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Kayıtların Otomatik Silinme Süresi (Retention Policy)
              </label>
              <select
                value={formData.autoDeleteDays}
                onChange={(e) => setFormData({ ...formData, autoDeleteDays: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              >
                <option value={1}>1 Gün Sonra Otomatik Sil</option>
                <option value={7}>7 Gün Sonra Otomatik Sil (Standart)</option>
                <option value={30}>30 Gün Sonra Otomatik Sil</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Founder & Staff Discord IDs Authorization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>4. Kurucu, Yönetici & Yetkili Discord ID Yetkilendirmeleri</span>
            </div>
            {isFounder ? (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Kurucu Yetkisi Aktif</span>
              </span>
            ) : (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Sadece Kurucu Düzenleyebilir</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Panele giriş yapacak kişilerin yetkilerini kontrol edin. Kurucu ID'si sabittir. Yönetici ve Yetkili ID listelerini sadece Kurucu (ID: <code className="text-amber-400 font-bold font-mono">{FOUNDER_DISCORD_ID}</code>) değiştirebilir.
          </p>

          {/* Founder Display Box */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs text-amber-200 font-bold block">Sistem Kurucusu (Tek Yetkili Admin)</strong>
                <span className="text-[11px] font-mono text-slate-400">ID: {FOUNDER_DISCORD_ID}</span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
              Dokunulmaz Kurucu
            </span>
          </div>

          {!isFounder && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Erişim Kısıtlı:</strong> Yönetici ve Yetkili ID ekleme/çıkarma yetkisi yalnızca Kurucu (<code className="text-amber-300 font-mono font-bold">{FOUNDER_DISCORD_ID}</code>) hesabına aittir.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Discord IDs */}
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>🛡️ Yönetici Discord ID Listesi</span>
                <span className="text-[10px] text-slate-500">Virgül (,) ile ayırın</span>
              </label>
              <textarea
                rows={2}
                disabled={!isFounder}
                placeholder="385394606145222, 1278945672981278945"
                value={formData.adminDiscordIds?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminDiscordIds: e.target.value
                      .split(',')
                      .map((id) => id.trim())
                      .filter((id) => id.length > 0),
                  })
                }
                className={`w-full bg-slate-950 border text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono ${
                  isFounder
                    ? 'border-slate-800 focus:border-rose-500'
                    : 'border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              />
              <span className="text-[10px] text-slate-500 block">
                Tam yetkili Yöneticiler (Bot script, ses arşivleri ve tüm ayarlara erişebilir).
              </span>
            </div>

            {/* Staff Discord IDs */}
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>👮 Sunucu Yetkilisi Discord ID Listesi</span>
                <span className="text-[10px] text-slate-500">Virgül (,) ile ayırın</span>
              </label>
              <textarea
                rows={2}
                disabled={!isFounder}
                placeholder="987654321098765432, 554433221100998"
                value={formData.staffDiscordIds?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    staffDiscordIds: e.target.value
                      .split(',')
                      .map((id) => id.trim())
                      .filter((id) => id.length > 0),
                  })
                }
                className={`w-full bg-slate-950 border text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono ${
                  isFounder
                    ? 'border-slate-800 focus:border-indigo-500'
                    : 'border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              />
              <span className="text-[10px] text-slate-500 block">
                Yetkili Moderatörler (Canlı ses dinleme, şikayet açma & inceleme yapabilir).
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-3 rounded-2xl transition shadow-lg shadow-rose-900/20 cursor-pointer flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Tüm Bot Konfigürasyonunu Kaydet</span>
        </button>
      </form>
    </div>
  );
};
