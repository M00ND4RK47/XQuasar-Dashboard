import React, { useState } from 'react';
import { IncidentReport, VoiceChannel } from '../types';
import { FileAudio, Download, Search, Calendar, Play, Shield, Volume2, ExternalLink } from 'lucide-react';

interface AudioArchivePanelProps {
  incidents: IncidentReport[];
  channels: VoiceChannel[];
  onSelectIncident: (id: string) => void;
}

export const AudioArchivePanel: React.FC<AudioArchivePanelProps> = ({
  incidents,
  channels,
  onSelectIncident,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');

  const archivedIncidents = incidents.filter((inc) => {
    const matchesChannel = selectedChannelId === 'all' || inc.channelId === selectedChannelId;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.accusedUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleExportJson = (incident: IncidentReport) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${incident.ticketNumber}_moderation_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileAudio className="w-5 h-5 text-indigo-400" />
          <span>Ses Kayıt Arşivi & Kalıcı Ses Tamponu Logları</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Discord şikayetleri sonucunda kalıcı arşive alınan tüm ses kayıtlarını, diyalog dökümlerini ve kanıt paketlerini buradan indirin.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Arşivde bilet veya kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Kanallar</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {archivedIncidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400">{inc.ticketNumber}</span>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">{inc.title}</h3>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {inc.channelName}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 italic">
              "{inc.speakerSegments[1]?.textSnippet || inc.speakerSegments[0]?.textSnippet}"
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>Süre: <strong className="text-slate-200">{inc.audioDurationSeconds} saniye</strong></span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(inc.timestamp).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onSelectIncident(inc.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>İnceleme Panelinde Aç</span>
              </button>

              <button
                onClick={() => handleExportJson(inc)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rapor İndir (JSON)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
