import React from 'react';
import { Bot, Shield, PlusCircle, ShieldCheck, LogOut, Crown, Server } from 'lucide-react';
import { BotSettings, DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface NavbarProps {
  settings: BotSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewIncident: () => void;
  currentUser: DiscordUser;
  onOpenDiscordAuth: () => void;
  onLogout?: () => void;
  onSwitchGuild?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  setActiveTab,
  onOpenNewIncident,
  currentUser,
  onOpenDiscordAuth,
  onLogout,
  onSwitchGuild,
}) => {
  const isFounder = currentUser.id === FOUNDER_DISCORD_ID || currentUser.role === 'Kurucu';
  const isAuthorizedAdmin = isFounder || settings.adminDiscordIds?.includes(currentUser.id) || currentUser.role === 'Yönetici';

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-6 py-3 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-2">
                <span className="text-rose-500 font-extrabold tracking-wider">
                  XQuasar
                </span>
                <span className="text-slate-200">Dashboard</span>
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="text-slate-400">Sunucu:</span>
                <strong className="font-bold text-slate-200 font-mono text-xs px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                  {settings.serverName || 'Moebius'}
                </strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Bulut Botu Otomatik Aktif ({settings.activeListenersCount} Kanal Dinleniyor)
              </span>
            </p>
          </div>
        </div>

        {/* Staff Authorization & Action Controls */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {/* Discord Account Sync Box */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenDiscordAuth}
              className="flex items-center space-x-2.5 bg-slate-950 hover:bg-slate-800/80 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs transition cursor-pointer group"
              title="Discord hesabınızı değiştirmek veya yetkiyi güncellemek için tıklayın"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-7 h-7 rounded-full border border-[#5865F2]"
              />
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-200 group-hover:text-white">@{currentUser.username}</span>
                  {isFounder ? (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 text-amber-400" /> Kurucu
                    </span>
                  ) : isAuthorizedAdmin ? (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold">
                      🛡️ Yönetici
                    </span>
                  ) : (
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-semibold">
                      👮 Yetkili
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span>ID: {currentUser.id}</span>
                  <ShieldCheck className="w-3 h-3 text-[#5865F2]" />
                </div>
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 bg-slate-950 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 rounded-2xl border border-slate-800 hover:border-rose-500/40 text-xs transition cursor-pointer flex items-center gap-1"
                title="Çıkış Yap ve Discord Login Ekranına Dön"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
              </button>
            )}
          </div>

          {onSwitchGuild && (
            <button
              onClick={onSwitchGuild}
              className="flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-medium text-xs px-3.5 py-2 rounded-2xl transition cursor-pointer shadow-sm"
              title="Başka bir Discord sunucusunun yönetim paneline geçiş yap"
            >
              <Server className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Sunucu Değiştir</span>
            </button>
          )}

          <button
            onClick={onOpenNewIncident}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-3.5 py-2 rounded-2xl transition shadow-md shadow-rose-900/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Olay Bildir / Şikayet Et</span>
          </button>
        </div>
      </div>
    </header>
  );
};
