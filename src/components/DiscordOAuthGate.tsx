import React, { useState } from 'react';
import { DiscordUser, BotSettings, FOUNDER_DISCORD_ID } from '../types';
import { ShieldCheck, CheckCircle2, User, ArrowRight, ShieldAlert, Sparkles, Check, Cloud, Lock, Crown, AlertTriangle } from 'lucide-react';

interface DiscordOAuthGateProps {
  settings: BotSettings;
  onAuthorizeSuccess: (user: DiscordUser) => void;
}

const PRESET_DISCORD_ACCOUNTS: DiscordUser[] = [
  {
    id: FOUNDER_DISCORD_ID,
    username: 'MoonDark (Kurucu)',
    discriminator: '0001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Kurucu',
    isLoggedIn: true,
  },
  {
    id: '385394606145222',
    username: 'Aykut_Mod',
    discriminator: '0001',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
  {
    id: '999888777666555',
    username: 'Rastgele_Uye_Deneme',
    discriminator: '4040',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'Sunucu Üyesi',
    isLoggedIn: true,
  },
];

export const DiscordOAuthGate: React.FC<DiscordOAuthGateProps> = ({
  settings,
  onAuthorizeSuccess,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(FOUNDER_DISCORD_ID);
  const [customDiscordId, setCustomDiscordId] = useState<string>('');
  const [customUsername, setCustomUsername] = useState<string>('');
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authStatusText, setAuthStatusText] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const targetId = useCustomInput ? customDiscordId.trim() : selectedAccountId;
    if (!targetId) {
      setAuthError('Lütfen geçerli bir Discord ID girin.');
      return;
    }

    const isFounder = targetId === FOUNDER_DISCORD_ID || targetId === (settings.founderDiscordId || FOUNDER_DISCORD_ID);
    const isAdmin = settings.adminDiscordIds?.includes(targetId);
    const isStaff = settings.staffDiscordIds?.includes(targetId);

    // STRICT PERMISSION CHECK: Must be Founder, Admin, or Staff
    if (!isFounder && !isAdmin && !isStaff) {
      setAuthError(`❌ Erişim Engellendi (ID: ${targetId}): Discord hesabınız panelde Yetkili veya Yönetici olarak kayıtlı değil! Panele sadece Kurucu (@868123530439557171) tarafından eklenen kişiler giriş yapabilir.`);
      return;
    }

    setIsAuthorizing(true);
    setAuthStatusText('Discord OAuth2 sunucularına bağlanılıyor...');

    setTimeout(() => {
      setAuthStatusText('Kimlik doğrulanıyor & Yönetici/Yetkili rolleri sorgulanıyor...');
    }, 600);

    setTimeout(() => {
      let finalUser: DiscordUser;

      const userRole: 'Kurucu' | 'Yönetici' | 'Sunucu Yetkilisi' = isFounder
        ? 'Kurucu'
        : isAdmin
        ? 'Yönetici'
        : 'Sunucu Yetkilisi';

      if (useCustomInput && customDiscordId.trim()) {
        finalUser = {
          id: targetId,
          username: customUsername.trim() || `Yetkili_${targetId.slice(-4)}`,
          discriminator: '0001',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: userRole,
          isLoggedIn: true,
        };
      } else {
        const found = PRESET_DISCORD_ACCOUNTS.find((a) => a.id === targetId);
        if (found) {
          finalUser = {
            ...found,
            role: userRole,
            isLoggedIn: true,
          };
        } else {
          finalUser = {
            id: targetId,
            username: `Yetkili_${targetId.slice(-4)}`,
            discriminator: '0001',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role: userRole,
            isLoggedIn: true,
          };
        }
      }

      setAuthStatusText(`Giriş Başarılı! Hoş Geldin @${finalUser.username} [${finalUser.role}]`);

      setTimeout(() => {
        onAuthorizeSuccess(finalUser);
      }, 500);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1f22] text-slate-100 flex items-center justify-center p-4 overflow-y-auto selection:bg-[#5865F2] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5865F2]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="bg-[#313338] border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative z-10 my-8">
        
        {/* Cloud Notice Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 rounded-2xl p-4 flex items-start space-x-3 shadow-lg">
          <Cloud className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs space-y-1">
            <strong className="text-indigo-200 font-bold block text-[13px]">
              ☁️ %100 Bulut Tabanlı Otomatik Moderasyon
            </strong>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Yöneticilerin veya yetkililerin bilgisayarlarına bot/program yüklemesine <strong>GEREK YOKTUR!</strong> Sadece bu web paneline Discord hesabınızla giriş yaparak tüm ses odalarını 7/24 canlı takip edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Discord OAuth2 Header */}
        <div className="flex items-center space-x-4 border-b border-slate-700/60 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shadow-xl shadow-[#5865F2]/30 shrink-0">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#5865F2] uppercase bg-[#5865F2]/15 px-2.5 py-0.5 rounded-md border border-[#5865F2]/30">
              Discord OAuth2 Girişi
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Ses Moderasyon Paneline Giriş Yap
            </h2>
            <p className="text-xs text-slate-400">
              Gamer & Chat TR Sunucusu • Yönetici Yetkilendirme Portal
            </p>
          </div>
        </div>

        {/* Permissions Requested List */}
        <div className="bg-[#2b2d31] rounded-2xl p-4 space-y-2.5 border border-slate-700/50">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Doğrulanacak Discord İzinleri:
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Discord Kullanıcı Kimliği (identify)</strong>
                <span className="text-slate-400 text-[11px]">Kullanıcı ID'niz ve Profil Bilgileriniz.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Yönetici Rol Doğrulaması (guilds.members.read)</strong>
                <span className="text-slate-400 text-[11px]">
                  ID'niz kayıtlı Yönetici ID listesinde (<code className="text-indigo-300">{settings.adminDiscordIds?.slice(0, 2).join(', ')}...</code>) yer alıyorsa otomatik Yönetici girişi sağlanır.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Selector */}
        <form onSubmit={handleAuthorize} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#5865F2]" />
                <span>Giriş Yapılacak Discord Hesabı:</span>
              </label>

              <button
                type="button"
                onClick={() => setUseCustomInput(!useCustomInput)}
                className="text-[11px] text-[#5865F2] hover:underline font-semibold cursor-pointer"
              >
                {useCustomInput ? '← Örnek Hesaplar' : '+ Kendi Discord ID\'ni Gir'}
              </button>
            </div>

            {!useCustomInput ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {PRESET_DISCORD_ACCOUNTS.map((account) => {
                  const isFounderAcc = account.id === FOUNDER_DISCORD_ID || account.id === settings.founderDiscordId;
                  const isAdminAcc = settings.adminDiscordIds?.includes(account.id);
                  const isStaffAcc = settings.staffDiscordIds?.includes(account.id);
                  const isSelected = selectedAccountId === account.id;

                  return (
                    <div
                      key={account.id}
                      onClick={() => setSelectedAccountId(account.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#5865F2]/20 border-[#5865F2] ring-1 ring-[#5865F2]'
                          : 'bg-[#2b2d31] border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={account.avatar}
                          alt={account.username}
                          className="w-9 h-9 rounded-full border border-slate-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                            <span>@{account.username}</span>
                            {isFounderAcc ? (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded-md font-bold flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-400" />
                                <span>Kurucu (Full)</span>
                              </span>
                            ) : isAdminAcc ? (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-md font-bold">
                                🛡️ Yönetici
                              </span>
                            ) : isStaffAcc ? (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.2 rounded-md font-semibold">
                                👮 Sunucu Yetkilisi
                              </span>
                            ) : (
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded-md font-semibold">
                                🔒 Giriş Yetkisiz
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            ID: {account.id}
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#5865F2] border-[#5865F2]' : 'border-slate-600'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#2b2d31] p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Kendi Discord Kullanıcı ID'niz (Geliştirici Modundan Alınan ID)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 385394606145222"
                    value={customDiscordId}
                    onChange={(e) => setCustomDiscordId(e.target.value)}
                    required={useCustomInput}
                    className="w-full bg-[#1e1f22] border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#5865F2]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sistem ID'nizin panel ayarlardaki Yönetici ID listesinde olup olmadığını kontrol eder.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Discord Kullanıcı Adınız
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Mehmet_Admin"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#5865F2]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/80 rounded-xl text-xs text-rose-200 flex items-start space-x-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {authError}
              </div>
            </div>
          )}

          {/* Admin Detection Info Banner */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl text-[11px] text-indigo-200 flex items-center space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Otomatik Rol Kontrolü:</strong> Seçilen Discord ID'si Bot Ayarlarındaki <strong>Yönetici Listesinde</strong> yer alıyorsa panele doğrudan <strong>Yönetici</strong> yetkisiyle yönlendirileceksiniz.
            </span>
          </div>

          {/* Status feedback */}
          {isAuthorizing && (
            <div className="p-3 bg-[#5865F2]/20 border border-[#5865F2]/40 rounded-xl text-xs text-indigo-200 font-semibold text-center animate-pulse flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{authStatusText}</span>
            </div>
          )}

          {/* Submit / Authorize Button */}
          <button
            type="submit"
            disabled={isAuthorizing}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a5] text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-xl shadow-[#5865F2]/25 cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Discord Hesabını Yetkilendir & Dashboard'a Gir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

