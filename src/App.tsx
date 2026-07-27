import React, { useState, useEffect } from 'react';
import { VoiceChannel, IncidentReport, BotSettings, AuditLog, SystemStats, ConnectedUser, IncidentCategory, DiscordUser, FOUNDER_DISCORD_ID } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LiveVoiceMonitor } from './components/LiveVoiceMonitor';
import { IncidentReviewPanel } from './components/IncidentReviewPanel';
import { BotSettingsPanel } from './components/BotSettingsPanel';
import { AudioArchivePanel } from './components/AudioArchivePanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { NewIncidentModal } from './components/NewIncidentModal';
import { DiscordAuthModal } from './components/DiscordAuthModal';
import { DiscordOAuthGate } from './components/DiscordOAuthGate';
import { GuildSelector, GuildInfo } from './components/GuildSelector';
import { VoiceLogsPanel } from './components/VoiceLogsPanel';
import { ActivePunishmentsPanel } from './components/ActivePunishmentsPanel';
import { WordFilterPanel } from './components/WordFilterPanel';
import { StaffManagementPanel } from './components/StaffManagementPanel';
import { AuditLogsPanel } from './components/AuditLogsPanel';
import { WebhooksPanel } from './components/WebhooksPanel';
import { SystemUpdaterPanel } from './components/SystemUpdaterPanel';
import { DashboardSettingsPanel } from './components/DashboardSettingsPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('channels');
  const [channels, setChannels] = useState<VoiceChannel[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [botSettings, setBotSettings] = useState<BotSettings>({
    serverName: 'Moebius',
    botToken: 'MTI3ODk0NTY3Mjk4MTI3ODk0NQ.G1z23X.SampleDiscordTokenForCommunityBot',
    clientId: '1278945672981278945',
    guildId: '987654321098765432',
    prefix: '!',
    autoJoinPublicChannels: true,
    autoRecordOnConnect: true,
    rollingBufferMinutes: 15,
    targetChannelIds: ['vc-genel-1', 'vc-sohbet-2', 'vc-oyun-a'],
    webhookUrl: 'https://discord.com/api/webhooks/123456789/sample_moderation_webhook',
    modRoleIds: ['role-mod', 'role-admin'],
    logChannelId: '112233445566778899',
    apiSecretKey: 'secret_moderation_key_123',
    autoDeleteDays: 7,
    audioQualityKbps: 96,
    vadSensitivity: 75,
    isBotOnline: true,
    lastPingMs: 24,
    activeListenersCount: 3,
    founderDiscordId: '868123530439557171',
    adminDiscordIds: ['385394606145222', '1278945672981278945'],
    staffDiscordIds: ['987654321098765432', '554433221100998'],
  });
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Discord Linked Account State - Require Login on Dashboard Entry
  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(null);
  const [selectedGuild, setSelectedGuild] = useState<GuildInfo | null>(null);
  const [isDiscordAuthOpen, setIsDiscordAuthOpen] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTargetChannel, setModalTargetChannel] = useState<VoiceChannel | null>(null);
  const [modalTargetUser, setModalTargetUser] = useState<ConnectedUser | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Fetch initial data from Express Backend
  const fetchAllData = () => {
    fetch('/api/channels')
      .then((res) => res.json())
      .then((data) => setChannels(data))
      .catch(() => {});

    fetch('/api/incidents')
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        if (!selectedIncidentId && data.length > 0) {
          setSelectedIncidentId(data[0].id);
        }
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setBotSettings(data))
      .catch(() => {});

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});

    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Actions
  const handleToggleMonitor = (channelId: string) => {
    const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';
    const isAdmin = currentUser?.role === 'Yönetici' || botSettings.adminDiscordIds?.includes(currentUser?.id || '');
    if (!isFounder && !isAdmin) {
      alert("İzlemeyi başlatma veya durdurma yetkisi yalnızca Yöneticiler ve Kurucu hesaplarına aittir!");
      return;
    }

    fetch(`/api/channels/${channelId}/toggle-monitor`, { method: 'POST' })
      .then((res) => res.json())
      .then((updated) => {
        setChannels((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        fetchAllData();
      });
  };

  const handleApplySanction = (
    incidentId: string,
    sanction: { type: any; durationMinutes?: number; reason: string; appliedBy: string }
  ) => {
    const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';
    const isAdmin = isFounder || currentUser?.role === 'Yönetici' || botSettings.adminDiscordIds?.includes(currentUser?.id || '');
    if (!isAdmin) {
      alert("Yetkisiz İşlem: Yaptırım uygulama yetkisi yalnızca Kurucu ve Yönetici hesaplarına aittir!");
      return;
    }

    fetch(`/api/incidents/${incidentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sanction: {
          ...sanction,
          appliedBy: currentUser.username,
        },
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        fetchAllData();
      });
  };

  const handleAddNote = (incidentId: string, note: string) => {
    const isFounder = currentUser?.id === FOUNDER_DISCORD_ID || currentUser?.role === 'Kurucu';
    const isAdmin = isFounder || currentUser?.role === 'Yönetici' || botSettings.adminDiscordIds?.includes(currentUser?.id || '');
    if (!isAdmin) {
      alert("Yetkisiz İşlem: Moderatör notu ekleme yetkisi yalnızca Kurucu ve Yönetici hesaplarına aittir!");
      return;
    }

    fetch(`/api/incidents/${incidentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, moderator: currentUser.username }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      });
  };

  const handleRunAiAnalysis = async (incidentId: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`/api/incidents/${incidentId}/ai-analyze`, { method: 'POST' });
      const aiSummary = await res.json();
      setIncidents((prev) =>
        prev.map((i) => (i.id === incidentId ? { ...i, aiSummary } : i))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveSettings = (newSettings: Partial<BotSettings>) => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    })
      .then((res) => res.json())
      .then((updated) => {
        setBotSettings(updated);
        fetchAllData();
      });
  };

  const handleCreateIncident = (data: {
    title: string;
    category: IncidentCategory;
    channelId: string;
    reporterId: string;
    reporterUsername: string;
    accusedUsername: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    incidentTime: string;
    isYoneticiOzel: boolean;
  }) => {
    fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        reporterId: currentUser.id,
        reporterUsername: currentUser.username,
        assignedAdminDiscordId: currentUser.id,
      }),
    })
      .then((res) => res.json())
      .then((created) => {
        setIncidents((prev) => [created, ...prev]);
        setSelectedIncidentId(created.id);
        setActiveTab('incidents');
        fetchAllData();
      });
  };

  const handleSimulateSpeaking = (channelId: string, userId: string) => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id !== channelId) return c;
        return {
          ...c,
          connectedUsers: c.connectedUsers.map((u) => {
            if (u.id !== userId) return u;
            return { ...u, isSpeaking: true };
          }),
        };
      })
    );

    setTimeout(() => {
      setChannels((prev) =>
        prev.map((c) => {
          if (c.id !== channelId) return c;
          return {
            ...c,
            connectedUsers: c.connectedUsers.map((u) => {
              if (u.id !== userId) return u;
              return { ...u, isSpeaking: false };
            }),
          };
        })
      );
    }, 2500);
  };

  // If not logged in, force Discord Login OAuth Gate Screen
  if (!currentUser || !currentUser.isLoggedIn) {
    return (
      <DiscordOAuthGate
        settings={botSettings}
        onAuthorizeSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  // If logged in but no server selected yet, show Server / Guild Selector screen
  if (!selectedGuild) {
    return (
      <GuildSelector
        currentUser={currentUser}
        settings={botSettings}
        onSelectGuild={(guild) => setSelectedGuild(guild)}
        onLogout={() => {
          setSelectedGuild(null);
          setCurrentUser(null);
        }}
      />
    );
  }

  const isAuthorizedAdmin =
    currentUser.id === FOUNDER_DISCORD_ID ||
    botSettings.adminDiscordIds?.includes(currentUser.id) ||
    currentUser.role === 'Kurucu' ||
    currentUser.role === 'Yönetici';
  const openIncidentsCount = incidents.filter((i) => i.status === 'open' || i.status === 'in_review').length;

  return (
    <div data-theme={botSettings.themeAccent || 'indigo'} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Header */}
      <Navbar
        settings={botSettings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenDiscordAuth={() => setIsDiscordAuthOpen(true)}
        onLogout={() => {
          setSelectedGuild(null);
          setCurrentUser(null);
        }}
        onSwitchGuild={() => setSelectedGuild(null)}
        onOpenNewIncident={() => {
          setModalTargetChannel(null);
          setModalTargetUser(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openIncidentsCount={openIncidentsCount}
          currentUser={currentUser}
          settings={botSettings}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'channels' && (
            <LiveVoiceMonitor
              channels={channels}
              currentUser={currentUser}
              settings={botSettings}
              onToggleMonitor={handleToggleMonitor}
              onOpenReportForUser={(channel, user) => {
                setModalTargetChannel(channel);
                setModalTargetUser(user);
                setIsModalOpen(true);
              }}
              onSimulateSpeaking={handleSimulateSpeaking}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentReviewPanel
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={(id) => setSelectedIncidentId(id)}
              onApplySanction={handleApplySanction}
              onAddNote={handleAddNote}
              onRunAiAnalysis={handleRunAiAnalysis}
              isAiLoading={isAiLoading}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'archive' && (
            <AudioArchivePanel
              incidents={incidents}
              channels={channels}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setActiveTab('incidents');
              }}
            />
          )}

          {activeTab === 'settings' && (
            (currentUser.id === FOUNDER_DISCORD_ID || currentUser.role === 'Kurucu') ? (
              <BotSettingsPanel
                settings={botSettings}
                channels={channels}
                currentUser={currentUser}
                onSaveSettings={handleSaveSettings}
                onNavigateToUpdater={() => setActiveTab('system-updater')}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4 my-12 shadow-2xl">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mx-auto">
                  <span className="text-2xl">👑</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">Bot Ayarlarına Erişim Kısıtlandı</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Bot ve sunucu yapılandırmalarını (tampon süresi, kanal listesi, yetkili ID tanımlamaları) yalnızca sistem Kurucusu (<code className="text-amber-300 font-mono font-bold">{FOUNDER_DISCORD_ID}</code>) değiştirebilir.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('channels')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Canlı Ses Odalarına Dön
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPanel
              stats={stats}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'voice-logs' && <VoiceLogsPanel />}

          {activeTab === 'active-bans' && <ActivePunishmentsPanel currentUser={currentUser} />}

          {activeTab === 'word-filter' && <WordFilterPanel />}

          {activeTab === 'staff-list' && (
            <StaffManagementPanel
              currentUser={currentUser}
              settings={botSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'audit-logs' && <AuditLogsPanel logs={auditLogs} />}

          {activeTab === 'webhooks' && (
            <WebhooksPanel
              currentUser={currentUser}
              settings={botSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'system-updater' && (
            <SystemUpdaterPanel
              currentUser={currentUser}
              settings={botSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'dashboard-settings' && (
            <DashboardSettingsPanel
              currentUser={currentUser}
              settings={botSettings}
              onSaveSettings={handleSaveSettings}
              onNavigateToUpdater={() => setActiveTab('system-updater')}
            />
          )}
        </main>
      </div>

      {/* Incident Creation Modal */}
      <NewIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        channels={channels}
        initialChannel={modalTargetChannel}
        initialUser={modalTargetUser}
        currentUser={currentUser}
        onCreateIncident={handleCreateIncident}
      />

      {/* Discord Account Sync / Connection Modal */}
      <DiscordAuthModal
        isOpen={isDiscordAuthOpen}
        onClose={() => setIsDiscordAuthOpen(false)}
        currentUser={currentUser}
        settings={botSettings}
        onConnectDiscord={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
