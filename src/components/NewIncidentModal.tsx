import React, { useState } from 'react';
import { VoiceChannel, ConnectedUser, IncidentCategory, DiscordUser } from '../types';
import { X, ShieldAlert, Plus, Clock, Shield, CheckCircle2, UserCheck } from 'lucide-react';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: VoiceChannel[];
  initialChannel?: VoiceChannel | null;
  initialUser?: ConnectedUser | null;
  currentUser: DiscordUser;
  onCreateIncident: (data: {
    title: string;
    category: IncidentCategory;
    channelId: string;
    reporterId: string;
    reporterUsername: string;
    accusedUsername: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    incidentTime: string;
    isYoneticiOzel: boolean;
  }) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  channels,
  initialChannel,
  initialUser,
  currentUser,
  onCreateIncident,
}) => {
  if (!isOpen) return null;

  const [channelId, setChannelId] = useState<string>(initialChannel?.id || channels[0]?.id || '');
  const [accusedUsername, setAccusedUsername] = useState<string>(initialUser?.username || '');
  const [category, setCategory] = useState<IncidentCategory>('Küfür / Hakaret');
  const [severity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [incidentTime, setIncidentTime] = useState<string>(
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  );
  const [isYoneticiOzel, setIsYoneticiOzel] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');

  const selectedChannel = channels.find((c) => c.id === channelId) || channels[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateIncident({
      title: title.trim() || `${category} - Olay Bildirimi (${selectedChannel?.name || 'Sesli Kanal'})`,
      category,
      channelId,
      reporterId: currentUser.id,
      reporterUsername: currentUser.username,
      accusedUsername: accusedUsername.trim() || 'Şüpheli_Kullanıcı',
      severity,
      incidentTime,
      isYoneticiOzel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Sunucu Yetkilisi Olay / Şikayet Bildirimi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Automated Reporter Account Info (No manual input field as requested) */}
        <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full border border-indigo-500/40 shadow-sm"
            />
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>Bildiren Yetkili: @{currentUser.username}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-500/30">
                  Otomatik Algılandı
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Discord User ID: <strong className="text-indigo-300">{currentUser.id}</strong> ({currentUser.role})
              </div>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Selection */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">
              Olayın Yaşandığı Ses Kanalı
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            >
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.connectedUsers.length} Kişi Bağlı)
                </option>
              ))}
            </select>
          </div>

          {/* Suspect Selection */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Şüpheli Kullanıcı Seçimi / Discord Kullanıcı Adı</span>
              <span className="text-[11px] text-slate-500">Kanal içi kullanıcı veya ID</span>
            </label>

            {selectedChannel && selectedChannel.connectedUsers.length > 0 && (
              <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500">Kanalda Olanlar:</span>
                {selectedChannel.connectedUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setAccusedUsername(u.username)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                      accusedUsername === u.username
                        ? 'bg-rose-600 text-white border-rose-500 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    @{u.username}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Şüpheli kullanıcı adı veya Discord ID girin (Örn: Troll_Burak)"
              value={accusedUsername}
              onChange={(e) => setAccusedUsername(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Incident Category Menu Requested by User */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">
              Olay Kategorisi / Şikayet Nedeni
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncidentCategory)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 font-semibold text-rose-300"
            >
              <option value="Küfür / Hakaret">🔴 Küfür / Hakaret</option>
              <option value="Dini Değerlere Küfür / Saldırı">⚡ Dini Değerlere Küfür / Saldırı</option>
              <option value="Atalara / Milli Değerlere Küfür">🇹🇷 Atalara / Milli Değerlere Küfür</option>
              <option value="Panel / Yasadışı İddia / Tehdit">⚠️ Panel / Yasadışı İddia / Tehdit</option>
              <option value="Mikrofon / Soundboard / Kulak Patlatma">🔊 Mikrofon / Soundboard / Kulak Patlatma</option>
              <option value="Siyasi Tartışma / Kışkırtma">🔥 Siyasi Tartışma / Kışkırtma</option>
              <option value="Sözlü Taciz / Rahatsız Etme">🗣️ Sözlü Taciz / Rahatsız Etme</option>
              <option value="Diğer">📌 Diğer Kural İhlali</option>
            </select>
          </div>

          {/* Time & Details */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Olay Saati / Zamanı</span>
            </label>
            <input
              type="text"
              placeholder="Örn: 15:42 veya 10 dk önce"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Management Escalation */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Yönetim Üyeleri El Atsın</div>
                  <div className="text-[11px] text-slate-400">Yöneticilere ve Üst Düzey Yetkililere Özel İşaretle</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isYoneticiOzel}
                onChange={(e) => setIsYoneticiOzel(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Olay Detayı / Açıklama</label>
              <input
                type="text"
                placeholder="Örn: Sesli kanalda milli değerlere küfür edildi, ses kaydının incelenmesini istiyorum."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-900/30 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Olayı Bildir & Yönetim İncelemesine Gönder</span>
          </button>
        </form>
      </div>
    </div>
  );
};
