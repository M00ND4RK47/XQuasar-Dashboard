import React, { useState } from 'react';
import { DiscordUser, BotSettings } from '../types';
import { ShieldCheck, UserCheck, Key, CheckCircle, Sparkles, X, Cloud } from 'lucide-react';

interface DiscordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DiscordUser;
  settings: BotSettings;
  onConnectDiscord: (user: DiscordUser) => void;
}

const PRESET_STAFF_ACCOUNTS: DiscordUser[] = [
  {
    id: '385394606145222',
    username: 'Aykut_Mod',
    discriminator: '0001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Yönetici',
    isLoggedIn: true,
  },
  {
    id: '1278945672981278945',
    username: 'DarkAdmin_34',
    discriminator: '1337',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Yönetici',
    isLoggedIn: true,
  },
  {
    id: '987654321098765432',
    username: 'Kaan_Mod',
    discriminator: '9999',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Sunucu Yetkilisi',
    isLoggedIn: true,
  },
];

export const DiscordAuthModal: React.FC<DiscordAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  settings,
  onConnectDiscord,
}) => {
  if (!isOpen) return null;

  const [customId, setCustomId] = useState<string>(currentUser.id || '');
  const [customUsername, setCustomUsername] = useState<string>(currentUser.username || '');

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customId.trim()) return;

    const id = customId.trim();
    const isAdmin = settings.adminDiscordIds?.includes(id);

    onConnectDiscord({
      id,
      username: customUsername.trim() || `Yetkili_${id.slice(-4)}`,
      discriminator: '0001',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: isAdmin ? 'Yönetici' : 'Sunucu Yetkilisi',
      isLoggedIn: true,
    });
    onClose();
  };

  const handleSelectPreset = (staff: DiscordUser) => {
    onConnectDiscord(staff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5865F2]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/30">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                <span>Discord Hesabını Bağla</span>
                <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 px-2 py-0.5 rounded-full font-bold">
                  OAuth2 Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Moderasyon yetkisi almak ve şikayetlerde kimliğinizi otomatik doğrulamak için bağlanın.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Select Preset Staff Accounts */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hızlı Sunucu Yetkilisi Giriş Profilleri:</span>
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {PRESET_STAFF_ACCOUNTS.map((staff) => {
              const isCurrent = currentUser.id === staff.id;
              return (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleSelectPreset(staff)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#5865F2]/15 border-[#5865F2] ring-1 ring-[#5865F2]/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={staff.avatar}
                      alt={staff.username}
                      className="w-9 h-9 rounded-full border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>@{staff.username}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          {staff.role}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Discord ID: {staff.id}
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Bağlı</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#5865F2] font-semibold hover:underline">
                      Bağlan →
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">
            veya Kendi Discord ID'nizi Bağlayın
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomConnect} className="space-y-3.5">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Discord Kullanıcı ID'niz (User ID)</span>
              <span className="text-[10px] text-slate-500">Geliştirici Modundan Kopyalayın</span>
            </label>
            <input
              type="text"
              placeholder="Örn: 385394606145222"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 font-mono focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">
                Kullanıcı Adınız
              </label>
              <input
                type="text"
                placeholder="Örn: Aykut_Mod"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-[11px] text-indigo-200 space-y-1">
              <strong className="block text-indigo-300 font-bold">🛡️ Otomatik Rol Tanımlama:</strong>
              <p className="text-slate-300 text-[10px]">
                Girdiğiniz Discord ID'si Bot Ayarlarındaki <strong>Yönetici ID Listesinde</strong> yer alıyorsa otomatik olarak <strong>Yönetici</strong> hakları tanımlanır.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-[#5865F2]/25 mt-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Discord Hesabını Onayla & Dashboard'a Bağlan</span>
          </button>
        </form>
      </div>
    </div>
  );
};
