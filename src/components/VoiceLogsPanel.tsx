import React, { useState } from 'react';
import { Headphones, Mic, MicOff, LogIn, LogOut, Search, Filter, RefreshCw, Volume2, ShieldAlert } from 'lucide-react';

interface VoiceLogItem {
  id: string;
  timestamp: string;
  username: string;
  userId: string;
  avatar: string;
  channelName: string;
  action: 'join' | 'leave' | 'mute' | 'unmute' | 'deafen' | 'undeafen' | 'soundboard' | 'stream_start';
  details: string;
}

export const VoiceLogsPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const logs: VoiceLogItem[] = [
    {
      id: 'vl-1',
      timestamp: '14:38:12',
      username: 'DarkRider99',
      userId: '49201928301928301',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      channelName: '🔊 Sohbet #1',
      action: 'join',
      details: 'Kanala katıldı (Mikrofon Açık)',
    },
    {
      id: 'vl-2',
      timestamp: '14:37:45',
      username: 'ToxicGamer_TR',
      userId: '88392019283716253',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      channelName: '🎮 Valorant / Competitive',
      action: 'mute',
      details: 'Sistem tarafından otomatik susturuldu (Yüksek gürültü / Yüksek dB)',
    },
    {
      id: 'vl-3',
      timestamp: '14:35:10',
      username: 'ShadowByte',
      userId: '77281029384756102',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
      channelName: '🎮 CS2 / Dust II',
      action: 'stream_start',
      details: 'Ekran paylaşımı başlattı (1080p 60fps)',
    },
    {
      id: 'vl-4',
      timestamp: '14:32:05',
      username: 'Vortex_X',
      userId: '33442211009988776',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      channelName: '👑 Yönetim Toplantı',
      action: 'deafen',
      details: 'Kulaklığı kapattı (Deafen)',
    },
    {
      id: 'vl-5',
      timestamp: '14:28:40',
      username: 'HyperSonic',
      userId: '99887766554433221',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      channelName: '🔊 Müzik & Chill',
      action: 'soundboard',
      details: 'Soundboard ses effekti oynattı (Airhorn.mp3)',
    },
    {
      id: 'vl-6',
      timestamp: '14:25:00',
      username: 'Alpha_Zero',
      userId: '11223344556677889',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      channelName: '🔊 Sohbet #2',
      action: 'leave',
      details: 'Kanaldan ayrıldı (Toplam Süre: 42dk)',
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getBadgeStyle = (action: VoiceLogItem['action']) => {
    switch (action) {
      case 'join':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'leave':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'mute':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'unmute':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'soundboard':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'stream_start':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-indigo-400" />
            <span>Sesli Konuşma & Katılım Logları</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sunucudaki tüm ses odalarında gerçekleşen anlık giriş, çıkış, mute ve ekran paylaşım hareketleri.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Canlı Akış Aktif
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kullanıcı veya kanal ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <button
            onClick={() => setActionFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
              actionFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setActionFilter('join')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
              actionFilter === 'join'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Girişler
          </button>
          <button
            onClick={() => setActionFilter('mute')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
              actionFilter === 'mute'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Muteler
          </button>
          <button
            onClick={() => setActionFilter('soundboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
              actionFilter === 'soundboard'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Soundboard
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Zaman</th>
                <th className="p-4">Kullanıcı</th>
                <th className="p-4">Kanal</th>
                <th className="p-4">Eylem</th>
                <th className="p-4">Açıklama / Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono text-slate-400 font-semibold">{log.timestamp}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2.5">
                      <img src={log.avatar} alt={log.username} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-100">{log.username}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">ID: {log.userId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-indigo-300">{log.channelName}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getBadgeStyle(log.action)}`}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
