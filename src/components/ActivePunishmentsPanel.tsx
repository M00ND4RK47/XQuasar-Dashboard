import React, { useState } from 'react';
import { ShieldAlert, MicOff, VolumeX, UserX, Clock, Search, CheckCircle2, AlertTriangle, Undo } from 'lucide-react';
import { DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface ActivePunishment {
  id: string;
  username: string;
  userId: string;
  avatar: string;
  type: 'voice_mute' | 'deafen' | 'temp_ban' | 'warn';
  reason: string;
  appliedBy: string;
  appliedAt: string;
  expiresInMinutes: number;
}

interface ActivePunishmentsPanelProps {
  currentUser?: DiscordUser | null;
}

export const ActivePunishmentsPanel: React.FC<ActivePunishmentsPanelProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [punishments, setPunishments] = useState<ActivePunishment[]>([
    {
      id: 'p-1',
      username: 'TrollMaster_99',
      userId: '77281029384756102',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      type: 'voice_mute',
      reason: 'Seste küfür ve gürültü yapma (Soundboard spam)',
      appliedBy: 'NightGuard (Moderatör)',
      appliedAt: '20 dakika önce',
      expiresInMinutes: 40,
    },
    {
      id: 'p-2',
      username: 'MicAbuser_TR',
      userId: '88392019283716253',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      type: 'deafen',
      reason: 'Dini/Siyasi kışkırtma şüphesiyle geçici sağırlaştırma',
      appliedBy: 'Moebius_Bot (Otomatik AI)',
      appliedAt: '5 dakika önce',
      expiresInMinutes: 25,
    },
    {
      id: 'p-3',
      username: 'SpammerBoy',
      userId: '11223344556677889',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      type: 'temp_ban',
      reason: 'Panel/Yasadışı iddia tehditleri',
      appliedBy: '@MoonDark (Kurucu)',
      appliedAt: '2 saat önce',
      expiresInMinutes: 1420,
    },
  ]);

  const handleLiftPunishment = (id: string, username: string) => {
    if (window.confirm(`${username} adlı kullanıcının cezasını kaldırmak istediğinize emin misiniz?`)) {
      setPunishments(punishments.filter((p) => p.id !== id));
    }
  };

  const filtered = punishments.filter(
    (p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.appliedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Aktif Cezalı & Muted Kullanıcı Listesi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Şu anda sunucuda sesli susturması (Voice Mute), sağırlaştırması veya geçici uzaklaştırması devam eden kullanıcılar.
          </p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{punishments.length} Aktif Yaptırım</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cezalı kullanıcı veya sebep ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.avatar} alt={item.username} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-rose-500/30" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{item.username}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {item.userId}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {item.type === 'voice_mute' ? 'SES MUTE' : item.type === 'deafen' ? 'SAĞIRLAŞTIRMA' : 'GEÇİCİ BAN'}
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs">
              <div className="text-slate-400">
                <strong className="text-slate-300">Gerekçe:</strong> {item.reason}
              </div>
              <div className="text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                <span>Uygulayan: <strong className="text-slate-300">{item.appliedBy}</strong></span>
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.expiresInMinutes} dk kaldı
                </span>
              </div>
            </div>

            <button
              onClick={() => handleLiftPunishment(item.id, item.username)}
              className="w-full bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-300 hover:border-emerald-500/30 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Undo className="w-4 h-4" />
              <span>Cezayı / Mute'u Kaldır</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
