import React from 'react';
import { AuditLog, SystemStats } from '../types';
import { BarChart3, ShieldCheck, Clock, CheckCircle2, AlertOctagon, Activity, User, FileText } from 'lucide-react';

interface AnalyticsPanelProps {
  stats: SystemStats | null;
  auditLogs: AuditLog[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats, auditLogs }) => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Dinlenen Toplam Ses</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {stats?.totalBufferedHours || 0.35} <span className="text-sm font-normal text-slate-400">Saat</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Halka Açık Ring Buffer Kaydı</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Toplam Şikayet Kaydı</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {stats?.totalIncidents || 0}
          </div>
          <span className="text-[11px] text-rose-400 font-medium">{stats?.pendingIncidents || 0} Bekleyen İnceleme</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Çözülen / Yaptırım</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {stats?.resolvedToday || 0}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">%94 Başarılı Moderasyon</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Aktif Dinlenen Odalar</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">
            {stats?.activeRecordedChannels || 3} / {stats?.totalVoiceChannels || 4}
          </div>
          <span className="text-[11px] text-indigo-400 font-medium">Olay Kaydı Aktif</span>
        </div>
      </div>

      {/* Audit Trail Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Denetim & Moderatör İşlem Kayıtları (Audit Log)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">{auditLogs.length} İşlem</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-950/60 font-semibold">
              <tr>
                <th className="p-3 rounded-l-xl">Zaman</th>
                <th className="p-3">Yetkili / Moderatör</th>
                <th className="p-3">Eylem</th>
                <th className="p-3">Hedef Kullanıcı / Kanal</th>
                <th className="p-3">İlgili Bilet</th>
                <th className="p-3 rounded-r-xl">Ayrıntılar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString('tr-TR')}</td>
                  <td className="p-3 font-bold text-indigo-300">{log.moderator}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.action}</td>
                  <td className="p-3 text-rose-300 font-medium">@{log.targetUser}</td>
                  <td className="p-3 font-mono text-slate-400">{log.incidentId || '-'}</td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
