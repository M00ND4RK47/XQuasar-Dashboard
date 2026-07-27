import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Calendar, UserCheck } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsPanelProps {
  logs?: AuditLog[];
}

export const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({ logs = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const defaultLogs: AuditLog[] = [
    {
      id: 'al-1',
      moderator: '@MoonDark (Kurucu)',
      action: 'SUNUCU AYARI GÜNCELLENDİ',
      targetUser: 'Sistem',
      timestamp: 'Bugün 14:30',
      details: 'Sunucu ismi "Moebius" olarak değiştirildi ve tampon kayıt süresi 15 dakikaya yükseltildi.',
    },
    {
      id: 'al-2',
      moderator: 'NightGuard (Yönetici)',
      action: 'CEZA VERİLDİ (VOICE MUTE)',
      targetUser: 'TrollMaster_99',
      incidentId: 'INC-8492',
      timestamp: 'Bugün 14:15',
      details: 'Ses odasında gürültü ve küfür sebebiyle 40 dakika sesli susturma uygulandı.',
    },
    {
      id: 'al-3',
      moderator: 'Moebius_Bot (Otomatik AI)',
      action: 'ŞİKAYET OTOMATİK İŞLENDİ',
      targetUser: 'ToxicGamer_TR',
      incidentId: 'INC-8491',
      timestamp: 'Bugün 13:50',
      details: 'Küfür karalestesi eşleşmesi sonucu 25 dakika sağırlaştırma uygulandı.',
    },
    {
      id: 'al-4',
      moderator: '@MoonDark (Kurucu)',
      action: 'YETKİLİ ID EKLENDİ',
      targetUser: 'Discord ID: 987654321098765432',
      timestamp: 'Dün 18:20',
      details: 'Yeni moderatör ID sisteme kaydoldu ve panale yetkilendirildi.',
    },
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const filteredLogs = displayLogs.filter(
    (log) =>
      log.moderator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Güvenlik & Denetim Kaydı (Audit Logs)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistemde yöneticiler ve bot tarafından gerçekleştirilen tüm ceza verme, ayar değiştirme ve yetki ekleme/çıkarma işlemleri.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Moderatör, işlem veya kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Zaman</th>
                <th className="p-4">İşlemi Yapan</th>
                <th className="p-4">Eylem Türü</th>
                <th className="p-4">Hedef Kullanıcı / Nesne</th>
                <th className="p-4">Açıklama / Detaylar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono text-slate-400 font-semibold whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-100 whitespace-nowrap">{log.moderator}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-indigo-300 font-semibold">{log.targetUser}</td>
                  <td className="p-4 text-slate-300 leading-relaxed">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
