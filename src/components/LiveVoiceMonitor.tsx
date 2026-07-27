import React, { useState } from 'react';
import { VoiceChannel, ConnectedUser, DiscordUser, BotSettings, FOUNDER_DISCORD_ID } from '../types';
import { Headphones, Mic, MicOff, Volume2, ShieldAlert, Radio, Activity, UserPlus, Play, Lock } from 'lucide-react';

interface LiveVoiceMonitorProps {
  channels: VoiceChannel[];
  currentUser?: DiscordUser | null;
  settings?: BotSettings | null;
  onToggleMonitor: (channelId: string) => void;
  onOpenReportForUser: (channel: VoiceChannel, user: ConnectedUser) => void;
  onSimulateSpeaking: (channelId: string, userId: string) => void;
}

export const LiveVoiceMonitor: React.FC<LiveVoiceMonitorProps> = ({
  channels,
  currentUser,
  settings,
  onToggleMonitor,
  onOpenReportForUser,
  onSimulateSpeaking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';
  const isAdmin = currentUser?.role === 'Yönetici' || settings?.adminDiscordIds?.includes(currentUser?.id || '');
  const canManageVoice = isFounder || isAdmin;

  const categories = Array.from(new Set(channels.map((c) => c.category)));

  const filteredChannels = selectedCategory === 'all'
    ? channels
    : channels.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-rose-500" />
              <span>Canlı Ses Odaları İzleme Dashboard'u</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Topluluk sunucunuzdaki aktif ses kanallarını anlık izleyin.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              Tüm Odalar ({channels.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Automatic Voice Join Feature Banner */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center space-x-2.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <span>
              <strong className="text-white">Otomatik Giriş Modu Aktif:</strong> Herhangi bir kullanıcı sesli kanala katıldığında bot otomatik kanala giriş yapar ve arka planda 15 dakikalık döner ses kaydı (ring buffer) almaya başlar.
            </span>
          </div>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px] border border-emerald-500/30 shrink-0">
            AUTO-JOIN ENABLED
          </span>
        </div>
      </div>

      {/* Voice Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredChannels.map((channel) => {
          const speakingCount = channel.connectedUsers.filter((u) => u.isSpeaking).length;

          return (
            <div
              key={channel.id}
              className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-sm ${
                channel.isMonitored
                  ? 'border-indigo-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/20'
                  : 'border-slate-800 opacity-80'
              }`}
            >
              {/* Channel Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-base">{channel.name}</span>
                    {channel.isMonitored ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        Olay Kaydı Aktif
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        İzlemede Değil
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{channel.category}</p>
                </div>

                {canManageVoice ? (
                  <button
                    onClick={() => onToggleMonitor(channel.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
                      channel.isMonitored
                        ? 'bg-slate-800 text-rose-300 border-rose-500/30 hover:bg-rose-950/40'
                        : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-sm'
                    }`}
                  >
                    {channel.isMonitored ? 'İzlemeyi Durdur' : 'Botu Odaya Çağır'}
                  </button>
                ) : (
                  <button
                    disabled
                    title="İzlemeyi başlatma ve durdurma yetkisi yalnızca Yönetici ve Kurucu yetkilerine aittir"
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>{channel.isMonitored ? 'İzleme (Açık)' : 'İzleme (Kapalı)'}</span>
                  </button>
                )}
              </div>

              {/* Buffer & Noise Meter */}
              {channel.isMonitored && (
                <div className="my-3 py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>Halka Açık Tampon: <strong className="text-slate-100">{Math.floor(channel.bufferedSeconds / 60)} dk {channel.bufferedSeconds % 60} sn</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ses DB: <strong className="text-slate-200">{channel.dbLevel} dB</strong></span>
                  </div>
                </div>
              )}

              {/* Connected Users List */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
                  <span>Odadaki Kullanıcılar ({channel.connectedUsers.length})</span>
                  {speakingCount > 0 && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {speakingCount} Kişi Konuşuyor
                    </span>
                  )}
                </div>

                {channel.connectedUsers.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Bu kanalda şu an aktif kullanıcı bulunmuyor.
                  </div>
                ) : (
                  channel.connectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                        user.isSpeaking
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/80'
                      }`}
                    >
                      {/* Avatar & Username */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className={`w-9 h-9 rounded-full object-cover border-2 ${
                              user.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-slate-700'
                            }`}
                          />
                          {user.isSpeaking && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-black font-bold shadow-sm">
                              <Volume2 className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-semibold text-slate-200 text-xs truncate">{user.username}</span>
                            <span className="text-[10px] text-slate-500">#{user.discriminator}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Katılım: {user.joinedAt}</span>
                            {user.micMuted && (
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <MicOff className="w-3 h-3" /> Mute
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSimulateSpeaking(channel.id, user.id)}
                          title="Test Konuşma Eventi Tetikle"
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer flex items-center space-x-1 border border-slate-700"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span className="hidden sm:inline">Konuşma Sinyali</span>
                        </button>

                        <button
                          onClick={() => onOpenReportForUser(channel, user)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-medium border border-rose-500/30 transition cursor-pointer flex items-center space-x-1"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Şikayet Et</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
