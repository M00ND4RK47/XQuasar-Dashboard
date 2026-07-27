export const FOUNDER_DISCORD_ID = '868123530439557171';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  role: 'Kurucu' | 'Yönetici' | 'Sunucu Yetkilisi' | 'Moderatör' | 'Sunucu Üyesi';
  isLoggedIn: boolean;
}

export type IncidentCategory = 
  | 'Küfür / Hakaret' 
  | 'Dini Değerlere Küfür / Saldırı' 
  | 'Atalara / Milli Değerlere Küfür' 
  | 'Panel / Yasadışı İddia / Tehdit' 
  | 'Mikrofon / Soundboard / Kulak Patlatma' 
  | 'Siyasi Tartışma / Kışkırtma' 
  | 'Sözlü Taciz / Rahatsız Etme' 
  | 'Diğer';

export type IncidentStatus = 'open' | 'in_review' | 'resolved' | 'sanctioned' | 'dismissed';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ConnectedUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  isSpeaking: boolean;
  micMuted: boolean;
  deafMuted: boolean;
  joinedAt: string;
  voiceLevelDb: number;
}

export interface VoiceChannel {
  id: string;
  name: string;
  category: string;
  isMonitored: boolean;
  isBotPresent: boolean;
  recordingStatus: 'active' | 'buffering' | 'idle' | 'paused';
  connectedUsers: ConnectedUser[];
  bufferedSeconds: number;
  dbLevel: number;
  userLimit: number;
}

export interface SpeakerSegment {
  id: string;
  userId: string;
  username: string;
  startTime: number; // in seconds from start of clip
  endTime: number;
  textSnippet: string;
  isFlagged: boolean;
  flagReason?: string;
}

export interface ModeratorNote {
  id: string;
  moderator: string;
  note: string;
  createdAt: string;
}

export interface SanctionAction {
  type: 'warn' | 'voice_mute' | 'kick' | 'temp_ban' | 'permanent_ban';
  durationMinutes?: number;
  reason: string;
  appliedBy: string;
  appliedAt: string;
}

export interface AiSummary {
  transcript: string;
  detectedToxicityScore: number; // 0 to 100
  keyViolations: string[];
  recommendedAction: string;
  confidence: number;
  analysisDetails: string;
}

export interface IncidentReport {
  id: string;
  ticketNumber: string;
  title: string;
  category: IncidentCategory;
  channelId: string;
  channelName: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  incidentTime?: string; // E.g. "14:35" or "10 dakika önce"
  isYoneticiOzel?: boolean; // Management / Board review required
  assignedAdminDiscordId?: string; // Specific assigned admin Discord ID
  reporter: {
    id: string;
    username: string;
    avatar: string;
  };
  accusedUser: {
    id: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  audioDurationSeconds: number;
  audioUrl?: string;
  waveformData: number[];
  speakerSegments: SpeakerSegment[];
  aiSummary?: AiSummary;
  moderatorNotes: ModeratorNote[];
  sanctionTaken?: SanctionAction;
}

export interface BotSettings {
  serverName: string; // Sunucu İsmi (varsayılan "Moebius")
  botToken: string;
  clientId: string;
  guildId: string;
  prefix: string;
  autoJoinPublicChannels: boolean;
  autoRecordOnConnect: boolean;
  rollingBufferMinutes: number;
  targetChannelIds: string[];
  webhookUrl: string;
  modRoleIds: string[];
  logChannelId: string;
  apiSecretKey: string;
  autoDeleteDays: number;
  audioQualityKbps: number;
  vadSensitivity: number;
  isBotOnline: boolean;
  lastPingMs: number;
  activeListenersCount: number;
  founderDiscordId: string; // Founder / Owner ID (868123530439557171)
  adminDiscordIds: string[]; // Authorized Admin Discord IDs
  staffDiscordIds: string[]; // Authorized Staff / Moderator Discord IDs
  themeAccent?: string; // Tema Vurgu Rengi ('indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple')
  githubRepoUrl?: string; // GitHub Güncelleme Deposu URL
}

export interface AuditLog {
  id: string;
  moderator: string;
  action: string;
  targetUser: string;
  incidentId?: string;
  timestamp: string;
  details: string;
}

export interface SystemStats {
  totalVoiceChannels: number;
  activeRecordedChannels: number;
  totalBufferedHours: number;
  totalIncidents: number;
  pendingIncidents: number;
  resolvedToday: number;
  botUptimeSeconds: number;
}
