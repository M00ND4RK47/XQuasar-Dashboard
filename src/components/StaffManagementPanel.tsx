import React, { useState } from 'react';
import { Users, Crown, Shield, ShieldCheck, UserPlus, Trash2, CheckCircle2, Lock } from 'lucide-react';
import { DiscordUser, BotSettings, FOUNDER_DISCORD_ID } from '../types';

interface StaffManagementPanelProps {
  currentUser?: DiscordUser | null;
  settings: BotSettings;
  onSaveSettings: (updated: Partial<BotSettings>) => void;
}

export const StaffManagementPanel: React.FC<StaffManagementPanelProps> = ({
  currentUser,
  settings,
  onSaveSettings,
}) => {
  const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';

  const [newAdminId, setNewAdminId] = useState('');
  const [newStaffId, setNewStaffId] = useState('');

  const adminList = settings.adminDiscordIds || ['868123530439557171', '123456789012345678'];
  const staffList = settings.staffDiscordIds || ['987654321098765432', '112233445566778899'];

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFounder) {
      alert('Sadece Kurucu yetkili ID ekleyebilir!');
      return;
    }
    if (newAdminId.trim() && !adminList.includes(newAdminId.trim())) {
      onSaveSettings({
        adminDiscordIds: [...adminList, newAdminId.trim()],
      });
      setNewAdminId('');
    }
  };

  const handleRemoveAdmin = (id: string) => {
    if (!isFounder) {
      alert('Sadece Kurucu yetkili ID silebilir!');
      return;
    }
    if (id === FOUNDER_DISCORD_ID) {
      alert('Kurucu hesabı ID listesinden silinemez!');
      return;
    }
    onSaveSettings({
      adminDiscordIds: adminList.filter((a) => a !== id),
    });
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFounder) {
      alert('Sadece Kurucu yetkili ID ekleyebilir!');
      return;
    }
    if (newStaffId.trim() && !staffList.includes(newStaffId.trim())) {
      onSaveSettings({
        staffDiscordIds: [...staffList, newStaffId.trim()],
      });
      setNewStaffId('');
    }
  };

  const handleRemoveStaff = (id: string) => {
    if (!isFounder) {
      alert('Sadece Kurucu yetkili ID silebilir!');
      return;
    }
    onSaveSettings({
      staffDiscordIds: staffList.filter((s) => s !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Sunucu Yetkili Kadrosu & Erişim Listesi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            XQuasar Dashboard paneline giriş yetkisine sahip Yönetici ve Sunucu Yetkililerinin Discord ID listesi.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isFounder ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Kurucu Kilitli Düzenleme Modu</span>
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Salt Okunur Görünüm</span>
            </span>
          )}
        </div>
      </div>

      {/* Admins & Staff Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YÖNETİCİLER (ADMINS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">Yöneticiler (Admins)</h3>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 font-mono px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
              {adminList.length} ID
            </span>
          </div>

          {isFounder && (
            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <input
                type="text"
                placeholder="Yönetici Discord ID ekle (18 hane)..."
                value={newAdminId}
                onChange={(e) => setNewAdminId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </form>
          )}

          <div className="space-y-2">
            {adminList.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {id === FOUNDER_DISCORD_ID ? '👑' : '🛡️'}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-200 block">{id}</span>
                    <span className="text-[10px] text-slate-500">
                      {id === FOUNDER_DISCORD_ID ? 'Kurucu (Dokunulmaz)' : 'Atanmış Yönetici'}
                    </span>
                  </div>
                </div>

                {isFounder && id !== FOUNDER_DISCORD_ID && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAdmin(id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition cursor-pointer"
                    title="Yetkiyi Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUNUCU YETKİLİLERİ (STAFF) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">Sunucu Yetkilileri / Moderatörler</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-300 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
              {staffList.length} ID
            </span>
          </div>

          {isFounder && (
            <form onSubmit={handleAddStaff} className="flex gap-2">
              <input
                type="text"
                placeholder="Yetkili Discord ID ekle (18 hane)..."
                value={newStaffId}
                onChange={(e) => setNewStaffId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </form>
          )}

          <div className="space-y-2">
            {staffList.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    🎧
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-200 block">{id}</span>
                    <span className="text-[10px] text-slate-500">Ses & Şikayet Yetkilisi</span>
                  </div>
                </div>

                {isFounder && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStaff(id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition cursor-pointer"
                    title="Yetkiyi Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
