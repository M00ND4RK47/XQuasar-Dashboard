import React, { useState } from 'react';
import { DiscordUser, BotSettings, FOUNDER_DISCORD_ID } from '../types';
import { ShieldCheck, Lock, ArrowRight, ExternalLink, Search, Server, Sparkles, CheckCircle2, UserCheck, LogOut } from 'lucide-react';

export interface GuildInfo {
  id: string;
  name: string;
  iconUrl?: string;
  iconBg: string;
  memberCount: number;
  onlineCount: number;
  isBotAdded: boolean;
  hasAccess: boolean;
  roleBadge: string;
  description: string;
}

interface GuildSelectorProps {
  currentUser: DiscordUser;
  settings: BotSettings;
  onSelectGuild: (guild: GuildInfo) => void;
  onLogout: () => void;
}

export const GuildSelector: React.FC<GuildSelectorProps> = ({
  currentUser,
  settings,
  onSelectGuild,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const activeServerName = settings.serverName || 'Moebius';

  const isFounder = currentUser.id === FOUNDER_DISCORD_ID || currentUser.role === 'Kurucu';
  const isAdmin = currentUser.role === 'Yönetici' || settings.adminDiscordIds?.includes(currentUser.id);
  const isStaff = currentUser.role === 'Sunucu Yetkilisi' || settings.staffDiscordIds?.includes(currentUser.id);

  const guilds: GuildInfo[] = [
    {
      id: settings.guildId || '987654321098765432',
      name: activeServerName,
      iconBg: 'from-amber-500 via-indigo-600 to-purple-600',
      memberCount: 4850,
      onlineCount: 1420,
      isBotAdded: true,
      hasAccess: isFounder || isAdmin || isStaff,
      roleBadge: isFounder ? 'Kurucu' : isAdmin ? 'Yönetici' : 'Sunucu Yetkilisi',
      description: 'Aktif XQuasar moderasyon botu bağlı, ses odaları canlı izleniyor.',
    },
    {
      id: '112233445566778899',
      name: 'Valoran TR Community',
      iconBg: 'from-rose-600 to-orange-600',
      memberCount: 12400,
      onlineCount: 3890,
      isBotAdded: true,
      hasAccess: false,
      roleBadge: 'Yetkiniz Yok',
      description: 'Bot ekli, ancak bu sunucuda yetkili ID tanımınız bulunmamaktadır.',
    },
    {
      id: '556677889900112233',
      name: 'E-Sports Türkiye Hub',
      iconBg: 'from-blue-600 to-indigo-800',
      memberCount: 8150,
      onlineCount: 2100,
      isBotAdded: true,
      hasAccess: false,
      roleBadge: 'Yetkiniz Yok',
      description: 'Bot ekli, ancak bu sunucuda yetkili ID tanımınız bulunmamaktadır.',
    },
    {
      id: '998877665544332211',
      name: 'Cyber Void Discord',
      iconBg: 'from-emerald-600 to-teal-800',
      memberCount: 2300,
      onlineCount: 840,
      isBotAdded: true,
      hasAccess: false,
      roleBadge: 'Yetkiniz Yok',
      description: 'Bot ekli, ancak bu sunucuda yetkili ID tanımınız bulunmamaktadır.',
    },
    {
      id: '334455667788990011',
      name: 'Gamer & Chat TR',
      iconBg: 'from-purple-600 to-pink-600',
      memberCount: 19200,
      onlineCount: 5410,
      isBotAdded: true,
      hasAccess: false,
      roleBadge: 'Yetkiniz Yok',
      description: 'Bot ekli, ancak bu sunucuda yetkili ID tanımınız bulunmamaktadır.',
    },
  ];

  const filteredGuilds = guilds.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-rose-600 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-950/20 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 my-auto py-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-rose-900/30">
              X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-100 tracking-tight">
                  <span className="text-rose-500 font-extrabold mr-1">XQuasar</span>
                  <span>Dashboard</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">Sunucu Yönetim & Moderasyon Portalı</p>
            </div>
          </div>

          {/* Logged In User Profile Bar */}
          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800/80 px-3.5 py-2 rounded-2xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>{currentUser.username}</span>
                <span className="text-[10px] text-slate-400 font-mono">#{currentUser.discriminator}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isFounder
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : isAdmin
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Çıkış Yap"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Search Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Yönetmek İstediğiniz Sunucuyu Seçin
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Botla ortak olduğunuz ve yetkili olduğunuz Discord sunucuları listelenmektedir. Yetkili olmadığınız sunucular devre dışıdır.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Sunucu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Guild Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuilds.map((guild) => (
            <div
              key={guild.id}
              className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                guild.hasAccess
                  ? 'bg-slate-900/90 border-indigo-500/40 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-pointer'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60 grayscale-[40%]'
              }`}
            >
              {/* Card Banner / Header */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Server Avatar / Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${guild.iconBg} flex items-center justify-center font-black text-white text-2xl shadow-md ring-2 ring-white/10 shrink-0 font-serif`}>
                      {guild.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition line-clamp-1">
                        {guild.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {guild.onlineCount.toLocaleString('tr-TR')} Çevrimiçi
                        </span>
                        <span>•</span>
                        <span>{guild.memberCount.toLocaleString('tr-TR')} Üye</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {guild.description}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0 mt-auto">
                {guild.hasAccess ? (
                  <button
                    onClick={() => onSelectGuild(guild)}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/30 cursor-pointer group-hover:scale-[1.02]"
                  >
                    <span>Dashboard'ı Yönet</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-800/60 text-slate-500 font-semibold text-xs py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-700/50"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Yönetim Yetkisi Yok</span>
                  </button>
                )}
              </div>

              {/* Status Ribbon */}
              <div className="absolute top-3 right-3">
                {guild.hasAccess ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Yetkili ({guild.roleBadge})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                    <span>Erişim Kapalı</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>XQuasar Bot toplam 5 topluluk sunucusunda aktif çalışmaktadır.</span>
          </div>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition"
          >
            <span>Botu Yeni Sunucuya Davet Et</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
