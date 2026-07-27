import React, { useState, useEffect, useRef } from 'react';
import { IncidentReport, IncidentStatus, SanctionAction, DiscordUser, FOUNDER_DISCORD_ID } from '../types';
import { createSynthesizedVoicePlayer } from '../utils/audioSynth';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  ShieldAlert,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  MessageSquare,
  FileText,
  Search,
  Filter,
  UserCheck,
  Zap,
  Lock,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface IncidentReviewPanelProps {
  incidents: IncidentReport[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onApplySanction: (incidentId: string, sanction: { type: any; durationMinutes?: number; reason: string; appliedBy: string }) => void;
  onAddNote: (incidentId: string, note: string) => void;
  onRunAiAnalysis: (incidentId: string) => Promise<void>;
  isAiLoading: boolean;
  currentUser?: DiscordUser | null;
}

export const IncidentReviewPanel: React.FC<IncidentReviewPanelProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onApplySanction,
  onAddNote,
  onRunAiAnalysis,
  isAiLoading,
  currentUser,
}) => {
  const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';
  const isAdmin = isFounder || currentUser?.role === 'Yönetici';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.8);

  // Sanction form state
  const [sanctionType, setSanctionType] = useState<SanctionAction['type']>('voice_mute');
  const [sanctionDurationHours, setSanctionDurationHours] = useState<number>(24);
  const [sanctionReason, setSanctionReason] = useState<string>('');
  const [moderatorNoteInput, setModeratorNoteInput] = useState<string>('');

  const audioSynthRef = useRef<any>(null);

  // For non-admin (Staff / Member), show only their own reported incidents
  const visibleIncidents = isAdmin
    ? incidents
    : incidents.filter(
        (i) =>
          i.reporter.id === currentUser?.id ||
          i.reporter.username.toLowerCase() === currentUser?.username.toLowerCase()
      );

  const selectedIncident =
    visibleIncidents.find((i) => i.id === selectedIncidentId || i.ticketNumber === selectedIncidentId) ||
    visibleIncidents[0];

  useEffect(() => {
    // Instantiate audio synth player
    audioSynthRef.current = createSynthesizedVoicePlayer(
      (time) => setCurrentTime(time),
      () => setIsPlaying(false)
    );

    return () => {
      if (audioSynthRef.current) {
        audioSynthRef.current.stop();
      }
    };
  }, []);

  // Filtered incidents list
  const filteredIncidents = visibleIncidents.filter((inc) => {
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.accusedUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePlayPause = () => {
    if (!selectedIncident) return;
    if (isPlaying) {
      audioSynthRef.current.pause();
      setIsPlaying(false);
    } else {
      audioSynthRef.current.play(selectedIncident.audioDurationSeconds, currentTime);
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioSynthRef.current) {
      audioSynthRef.current.seek(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioSynthRef.current) {
      audioSynthRef.current.setPlaybackRate(speed);
    }
  };

  const handleSanctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !sanctionReason.trim()) return;

    onApplySanction(selectedIncident.id, {
      type: sanctionType,
      durationMinutes: sanctionType === 'voice_mute' || sanctionType === 'temp_ban' ? sanctionDurationHours * 60 : undefined,
      reason: sanctionReason,
      appliedBy: 'Panel_Moderatör',
    });

    setSanctionReason('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !moderatorNoteInput.trim()) return;

    onAddNote(selectedIncident.id, moderatorNoteInput);
    setModeratorNoteInput('');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">Kritik</span>;
      case 'high':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">Yüksek</span>;
      case 'medium':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-semibold">Orta</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-medium">Düşük</span>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'open':
        return <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">Açık</span>;
      case 'in_review':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">İncelemede</span>;
      case 'sanctioned':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">Yaptırım Uygulandı</span>;
      case 'resolved':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">Çözüldü</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full text-xs">Kapatıldı</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Incident List */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[780px] shadow-sm">
        <div className="space-y-3 pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Olay & Şikayet Listesi</span>
            </h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-medium">
              {filteredIncidents.length} Kayıt
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Şikayet, kullanıcı veya kanal ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto text-xs">
            {['all', 'yonetici', 'open', 'in_review', 'sanctioned', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'Tümü'
                  : st === 'yonetici'
                  ? '🛡️ Yöneticiye Özel'
                  : st === 'open'
                  ? 'Açık'
                  : st === 'in_review'
                  ? 'İncelemede'
                  : st === 'sanctioned'
                  ? 'Cezalı'
                  : 'Çözüldü'}
              </button>
            ))}
          </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1">
          {filteredIncidents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Aranan kriterlere uygun şikayet bulunamadı.
            </div>
          ) : (
            filteredIncidents
              .filter((inc) => statusFilter !== 'yonetici' || inc.isYoneticiOzel)
              .map((inc) => {
              const isSelected = selectedIncident && selectedIncident.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    onSelectIncident(inc.id);
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                    <span className="font-mono font-bold text-indigo-400">{inc.ticketNumber}</span>
                    <div className="flex items-center space-x-1">
                      {inc.isYoneticiOzel && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold">
                          🛡️ Yönetim El Atsın
                        </span>
                      )}
                      {getSeverityBadge(inc.severity)}
                      {getStatusBadge(inc.status)}
                    </div>
                  </div>

                  <h4 className="font-semibold text-slate-200 text-xs line-clamp-1 mb-1">
                    {inc.title}
                  </h4>

                  <div className="text-[11px] text-amber-300/80 font-medium mb-2">
                    Kategori: {inc.category}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-500" />
                      <span className="text-rose-400 font-medium truncate max-w-[90px]">@{inc.accusedUser.username}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>{inc.incidentTime ? `Saat: ${inc.incidentTime}` : `${inc.audioDurationSeconds}sn`}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Main Area: Selected Incident Inspector */}
      <div className="lg:col-span-8 space-y-5">
        {selectedIncident ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
            {/* Header Details */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-800/50">
                    {selectedIncident.ticketNumber}
                  </span>
                  {selectedIncident.isYoneticiOzel && (
                    <span className="bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      🛡️ Yönetim Üyeleri İnceliyor
                    </span>
                  )}
                  {getStatusBadge(selectedIncident.status)}
                  {getSeverityBadge(selectedIncident.severity)}
                </div>
                <h2 className="text-lg font-bold text-slate-100 mt-2">{selectedIncident.title}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Kategori: <strong className="text-amber-300">{selectedIncident.category}</strong></span>
                  <span>•</span>
                  <span>Kanal: <strong className="text-slate-200">{selectedIncident.channelName}</strong></span>
                  <span>•</span>
                  <span>Olay Saati: <strong className="text-indigo-300">{selectedIncident.incidentTime || 'Anlık'}</strong></span>
                </p>
              </div>

              {/* Accused vs Reporter Avatars */}
              <div className="flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">ŞİKAYETÇİ</span>
                  <div className="flex items-center space-x-1.5">
                    <img src={selectedIncident.reporter.avatar} alt="" className="w-6 h-6 rounded-full border border-slate-700" />
                    <span className="font-medium text-slate-300">@{selectedIncident.reporter.username}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-center">
                  <span className="text-[10px] text-rose-400 font-semibold block mb-1">ŞÜPHELİ</span>
                  <div className="flex items-center space-x-1.5">
                    <img src={selectedIncident.accusedUser.avatar} alt="" className="w-6 h-6 rounded-full border border-rose-500/50" />
                    <span className="font-bold text-rose-300">@{selectedIncident.accusedUser.username}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AUDIO PLAYER & WAVEFORM INSPECTOR */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>Olay Anı Ses Kaydı ({selectedIncident.audioDurationSeconds} Saniye)</span>
                </span>
                <span className="font-mono text-indigo-400 font-bold">
                  {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')} / {Math.floor(selectedIncident.audioDurationSeconds / 60).toString().padStart(2, '0')}:{(selectedIncident.audioDurationSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Waveform Bar */}
              <div className="relative h-20 bg-slate-900 rounded-xl p-2 flex items-end justify-between gap-1 overflow-hidden border border-slate-800 cursor-pointer"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const clickX = e.clientX - rect.left;
                     const ratio = clickX / rect.width;
                     handleSeek(ratio * selectedIncident.audioDurationSeconds);
                   }}>
                {selectedIncident.waveformData.map((val, idx) => {
                  const barProgress = (idx / selectedIncident.waveformData.length) * selectedIncident.audioDurationSeconds;
                  const isPassed = currentTime >= barProgress;
                  return (
                    <div
                      key={idx}
                      style={{ height: `${val}%` }}
                      className={`flex-1 rounded-t transition-all ${
                        isPassed ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-700/60 hover:bg-slate-600'
                      }`}
                    ></div>
                  );
                })}

                {/* Cursor playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 shadow-lg shadow-rose-500"
                  style={{
                    left: `${(currentTime / selectedIncident.audioDurationSeconds) * 100}%`,
                  }}
                >
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -ml-1 -mt-1 shadow-md"></div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => handleSeek(0)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Başa Dön"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed multipliers */}
                <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-500 px-2 font-medium">Hız:</span>
                  {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        playbackSpeed === rate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SPEAKER TRANSCRIPT BREAKDOWN */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Sesli Konuşma Metin Dökümü & Zaman Çizelgesi</span>
              </h3>

              <div className="space-y-2">
                {selectedIncident.speakerSegments.map((seg) => (
                  <div
                    key={seg.id}
                    onClick={() => handleSeek(seg.startTime)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      seg.isFlagged
                        ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
                        : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-indigo-400 font-semibold">
                          00:{seg.startTime.toString().padStart(2, '0')} - 00:{seg.endTime.toString().padStart(2, '0')}
                        </span>
                        <span className={`font-bold ${seg.isFlagged ? 'text-rose-400' : 'text-slate-300'}`}>
                          @{seg.username}
                        </span>
                      </div>
                      {seg.isFlagged && (
                        <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                          ⚠️ {seg.flagReason || 'İhlal İşareti'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{seg.textSnippet}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GEMINI AI MODERATION SUMMARY */}
            <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/30 border border-indigo-500/30 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">Gemini AI Moderasyon Karar Destek Paneli</h4>
                    <p className="text-[11px] text-slate-400">Yapay zeka ses analiz motoru tarafından otomatik oluşturuldu.</p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => onRunAiAnalysis(selectedIncident.id)}
                    disabled={isAiLoading}
                    className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isAiLoading ? 'Analiz Ediliyor...' : 'Yeniden Analiz Et'}</span>
                  </button>
                )}
              </div>

              {selectedIncident.aiSummary ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Toksisite & Küfür Skoru</span>
                    <div className="text-2xl font-black text-rose-400 mt-1">
                      %{selectedIncident.aiSummary.detectedToxicityScore}
                    </div>
                    <span className="text-[10px] text-slate-400">Güven Oranı: %{selectedIncident.aiSummary.confidence}</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 md:col-span-2 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Önerilen Moderatör Yaptırımı</span>
                    <p className="text-sm font-bold text-indigo-300">
                      🎯 {selectedIncident.aiSummary.recommendedAction}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {selectedIncident.aiSummary.analysisDetails}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 border border-dashed border-indigo-500/20 rounded-xl">
                  Henüz AI analizi çalıştırılmadı.
                </div>
              )}
            </div>

            {/* MODERATOR SANCTION CONSOLE */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Moderatör Karar & Yaptırım Durumu</span>
                </div>
                {!isAdmin && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>Yönetim Yetkisinde</span>
                  </span>
                )}
              </h3>

              {selectedIncident.sanctionTaken ? (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Yaptırım Uygulandı: {selectedIncident.sanctionTaken.type.toUpperCase()}</span>
                    <span>Moderatör: {selectedIncident.sanctionTaken.appliedBy}</span>
                  </div>
                  <p><strong>Sebep:</strong> {selectedIncident.sanctionTaken.reason}</p>
                  <p className="text-[11px] text-purple-400">Tarih: {new Date(selectedIncident.sanctionTaken.appliedAt).toLocaleString('tr-TR')}</p>
                </div>
              ) : isAdmin ? (
                <form onSubmit={handleSanctionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1">Yaptırım Türü</label>
                      <select
                        value={sanctionType}
                        onChange={(e) => setSanctionType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="voice_mute">Sesli Kanal Mute</option>
                        <option value="warn">Sözlü /yazılı Uyarı</option>
                        <option value="temp_ban">Geçici Sunucu Banı</option>
                        <option value="kick">Sunucudan At (Kick)</option>
                        <option value="permanent_ban">Süresiz Ban</option>
                      </select>
                    </div>

                    {(sanctionType === 'voice_mute' || sanctionType === 'temp_ban') && (
                      <div>
                        <label className="block text-xs text-slate-400 font-medium mb-1">Süre (Saat)</label>
                        <input
                          type="number"
                          min="1"
                          max="720"
                          value={sanctionDurationHours}
                          onChange={(e) => setSanctionDurationHours(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}

                    <div className={(sanctionType === 'voice_mute' || sanctionType === 'temp_ban') ? 'sm:col-span-1' : 'sm:col-span-2'}>
                      <label className="block text-xs text-slate-400 font-medium mb-1">Yaptırım Gerekçesi</label>
                      <input
                        type="text"
                        placeholder="Örn: Ses kanalında hakaret ve kural ihlali"
                        value={sanctionReason}
                        onChange={(e) => setSanctionReason(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Kullanıcıya Yaptırım Uygula & Şikayeti Kapat</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Yönetim İncelemesi Devam Ediyor</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Açtığınız bu şikayet kaydı Kurucu ve Yönetici ekibimizin incelemesindedir. İşlem tamamlandığında alınan karar bu sayfada görünecektir.
                  </p>
                </div>
              )}
            </div>

            {/* MODERATOR NOTES */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>İç Moderatör Notları ({selectedIncident.moderatorNotes.length})</span>
              </h3>

              <div className="space-y-2">
                {selectedIncident.moderatorNotes.map((n) => (
                  <div key={n.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-semibold">
                      <span>{n.moderator}</span>
                      <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString('tr-TR')}</span>
                    </div>
                    <p className="text-slate-300">{n.note}</p>
                  </div>
                ))}
              </div>

              {isAdmin && (
                <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Moderatör ekibine özel not yazın..."
                    value={moderatorNoteInput}
                    onChange={(e) => setModeratorNoteInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    Not Ekle
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            İncelemek için soldaki listeden bir olay seçin.
          </div>
        )}
      </div>
    </div>
  );
};
