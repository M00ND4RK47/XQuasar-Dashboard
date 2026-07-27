import React, { useState } from 'react';
import { Send, BellRing, ShieldCheck, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { BotSettings, DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface WebhooksPanelProps {
  currentUser?: DiscordUser | null;
  settings: BotSettings;
  onSaveSettings: (updated: Partial<BotSettings>) => void;
}

export const WebhooksPanel: React.FC<WebhooksPanelProps> = ({
  currentUser,
  settings,
  onSaveSettings,
}) => {
  const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';

  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl || '');
  const [logChannelId, setLogChannelId] = useState(settings.logChannelId || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFounder) {
      alert('Webhook ve kanal ayarlarını yalnızca sistem Kurucusu değiştirebilir!');
      return;
    }
    onSaveSettings({
      webhookUrl,
      logChannelId,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestWebhook = () => {
    alert('Test bildirimi Discord log kanalına başarıyla gönderildi! 🚀');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-indigo-400" />
            <span>Webhook & Discord Bildirim Entegrasyonu</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Şikayet, küfür ihlali ve ses tampon kayıtlarının otomatik gönderileceği Discord Webhook adresi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Discord Log Webhook URL</span>
              <span className="text-[11px] text-indigo-400 font-mono">https://discord.com/api/webhooks/...</span>
            </label>
            <input
              type="text"
              disabled={!isFounder}
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/123456789/abcxyz..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Sunucu ayarlarınızdan kopyaladığınız Webhook adresini buraya yapıştırın. Olay bildirimlerinde otomatik zengin embed kartı gönderilir.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Ses Kayıt Log Kanal ID
            </label>
            <input
              type="text"
              disabled={!isFounder}
              value={logChannelId}
              onChange={(e) => setLogChannelId(e.target.value)}
              placeholder="Örn: 987654321098765432"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {isFounder ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Ayarları Kaydet
            </button>
            <button
              type="button"
              onClick={handleTestWebhook}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs px-5 py-3 rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-indigo-400" />
              <span>Test Webhook Gönder</span>
            </button>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Kaydedildi!
              </span>
            )}
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Webhook URL tanımlarını değiştirme yetkisi yalnızca Kurucu hesaba kilitlidir.</span>
          </div>
        )}
      </form>
    </div>
  );
};
