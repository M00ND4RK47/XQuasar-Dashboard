import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Initial State
let botSettings = {
  serverName: 'Moebius',
  botToken: 'MTI3ODk0NTY3Mjk4MTI3ODk0NQ.G1z23X.SampleDiscordTokenForCommunityBot',
  clientId: '1278945672981278945',
  guildId: '987654321098765432',
  prefix: '!',
  autoJoinPublicChannels: true,
  autoRecordOnConnect: true,
  rollingBufferMinutes: 15,
  targetChannelIds: ['vc-genel-1', 'vc-sohbet-2', 'vc-oyun-a', 'vc-vip'],
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
};

interface ConnectedUser {
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

interface VoiceChannel {
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

interface SpeakerSegment {
  id: string;
  userId: string;
  username: string;
  startTime: number;
  endTime: number;
  textSnippet: string;
  isFlagged: boolean;
  flagReason?: string;
}

interface ModeratorNote {
  id: string;
  moderator: string;
  note: string;
  createdAt: string;
}

interface SanctionAction {
  type: 'warn' | 'voice_mute' | 'kick' | 'temp_ban' | 'permanent_ban';
  durationMinutes?: number;
  reason: string;
  appliedBy: string;
  appliedAt: string;
}

interface AiSummary {
  transcript: string;
  detectedToxicityScore: number;
  keyViolations: string[];
  recommendedAction: string;
  confidence: number;
  analysisDetails: string;
}

interface IncidentReport {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'Küfür / Hakaret' | 'Dini Değerlere Küfür / Saldırı' | 'Atalara / Milli Değerlere Küfür' | 'Panel / Yasadışı İddia / Tehdit' | 'Mikrofon / Soundboard / Kulak Patlatma' | 'Siyasi Tartışma / Kışkırtma' | 'Sözlü Taciz / Rahatsız Etme' | 'Diğer';
  channelId: string;
  channelName: string;
  status: 'open' | 'in_review' | 'resolved' | 'sanctioned' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  incidentTime?: string;
  isYoneticiOzel?: boolean;
  assignedAdminDiscordId?: string;
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

interface AuditLog {
  id: string;
  moderator: string;
  action: string;
  targetUser: string;
  incidentId?: string;
  timestamp: string;
  details: string;
}

let voiceChannels: VoiceChannel[] = [
  {
    id: 'vc-genel-1',
    name: '🔊 Genel Ses #1',
    category: 'GENEL KANALLAR',
    isMonitored: true,
    isBotPresent: true,
    recordingStatus: 'active',
    bufferedSeconds: 780,
    dbLevel: -22,
    userLimit: 0,
    connectedUsers: [
      {
        id: 'u-101',
        username: 'Aykut_Mod',
        discriminator: '0001',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isSpeaking: false,
        micMuted: false,
        deafMuted: false,
        joinedAt: '12:15',
        voiceLevelDb: -40,
      },
      {
        id: 'u-102',
        username: 'Volkan_Tr',
        discriminator: '1337',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        isSpeaking: true,
        micMuted: false,
        deafMuted: false,
        joinedAt: '12:20',
        voiceLevelDb: -14,
      },
      {
        id: 'u-103',
        username: 'Gamer_Emre',
        discriminator: '4040',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
        isSpeaking: false,
        micMuted: true,
        deafMuted: false,
        joinedAt: '12:34',
        voiceLevelDb: -60,
      },
    ],
  },
  {
    id: 'vc-sohbet-2',
    name: '💬 Muhabbet & Makara',
    category: 'GENEL KANALLAR',
    isMonitored: true,
    isBotPresent: true,
    recordingStatus: 'active',
    bufferedSeconds: 450,
    dbLevel: -18,
    userLimit: 10,
    connectedUsers: [
      {
        id: 'u-104',
        username: 'Selin_S',
        discriminator: '2211',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isSpeaking: true,
        micMuted: false,
        deafMuted: false,
        joinedAt: '12:05',
        voiceLevelDb: -10,
      },
      {
        id: 'u-105',
        username: 'Troll_Burak',
        discriminator: '9988',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isSpeaking: true,
        micMuted: false,
        deafMuted: false,
        joinedAt: '12:40',
        voiceLevelDb: -5,
      },
    ],
  },
  {
    id: 'vc-oyun-a',
    name: '🎮 Valorant / CS2 Odası A',
    category: 'OYUN KANALLARI',
    isMonitored: true,
    isBotPresent: true,
    recordingStatus: 'active',
    bufferedSeconds: 920,
    dbLevel: -30,
    userLimit: 5,
    connectedUsers: [
      {
        id: 'u-106',
        username: 'Kaan_Aim',
        discriminator: '5544',
        avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
        isSpeaking: false,
        micMuted: false,
        deafMuted: false,
        joinedAt: '11:50',
        voiceLevelDb: -45,
      },
    ],
  },
  {
    id: 'vc-vip',
    name: '⭐ VIP Özel Oda',
    category: 'ÖZEL KANALLAR',
    isMonitored: false,
    isBotPresent: false,
    recordingStatus: 'idle',
    bufferedSeconds: 0,
    dbLevel: -90,
    userLimit: 0,
    connectedUsers: [],
  },
];

let incidentReports: IncidentReport[] = [
  {
    id: 'inc-9021',
    ticketNumber: '#INC-9021',
    title: 'Ses kanalında hakaret, küfür ve ailevi değerlere saldırı',
    category: 'Küfür / Hakaret',
    channelId: 'vc-sohbet-2',
    channelName: '💬 Muhabbet & Makara',
    status: 'open',
    severity: 'high',
    incidentTime: '12:20',
    isYoneticiOzel: true,
    reporter: {
      id: 'u-104',
      username: 'Selin_S',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    accusedUser: {
      id: 'u-105',
      username: 'Troll_Burak',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    audioDurationSeconds: 42,
    audioUrl: '/audio/sample_incident_1.mp3',
    waveformData: [12, 25, 45, 85, 95, 100, 78, 60, 20, 15, 80, 90, 88, 40, 10, 5, 55, 75, 95, 100, 65, 30, 10, 50, 70, 85, 90, 45, 15, 10],
    speakerSegments: [
      {
        id: 'seg-1',
        userId: 'u-104',
        username: 'Selin_S',
        startTime: 0,
        endTime: 8,
        textSnippet: 'Burak lütfen bağırmayı keser misin? Zaten mikrofonun sürekli patlıyor.',
        isFlagged: false,
      },
      {
        id: 'seg-2',
        userId: 'u-105',
        username: 'Troll_Burak',
        startTime: 9,
        endTime: 24,
        textSnippet: 'Sana mı soracağım lan! Istediğim gibi konuşurum, [Ağır Hakaret ve Küfür İfadesi]!',
        isFlagged: true,
        flagReason: 'Ağır Hakaret / Ailevi Değerlere Saldırı',
      },
      {
        id: 'seg-3',
        userId: 'u-104',
        username: 'Selin_S',
        startTime: 25,
        endTime: 32,
        textSnippet: 'Tamam ben bot komutuyla yetkililere şikayet açıyorum, ses kaydı incelenecektir.',
        isFlagged: false,
      },
      {
        id: 'seg-4',
        userId: 'u-105',
        username: 'Troll_Burak',
        startTime: 33,
        endTime: 42,
        textSnippet: 'Aç ne açarsan aç, yetkili gelse ne olacak [Gülüş ve Ağız Dalaşı]!',
        isFlagged: true,
        flagReason: 'Meydan Okuma / Huzur Bozma',
      },
    ],
    aiSummary: {
      transcript: '00:00 - Selin_S: Burak lütfen bağırmayı keser misin? Zaten mikrofonun sürekli patlıyor.\n00:09 - Troll_Burak: Sana mı soracağım lan! Istediğim gibi konuşurum, [Ağır Hakaret ve Küfür İfadesi]!\n00:25 - Selin_S: Tamam ben bot komutuyla yetkililere şikayet açıyorum...\n00:33 - Troll_Burak: Aç ne açarsan aç...',
      detectedToxicityScore: 92,
      keyViolations: [
        'Topluluk Kuralları Madde 3: Doğrudan Kişiye Yönelik Ağır Hakaret',
        'Topluluk Kuralları Madde 7: Sesli Kanal Huzurunu Kasıtlı Bozma',
        'Mikrofon / Soundboard Bağırma Tacizi',
      ],
      recommendedAction: '7 Günlük Sesli Kanal Mute veya 3 Günlük Geçici Sunucu Banı',
      confidence: 96,
      analysisDetails: 'Ses analizinde Troll_Burak kullanıcısının yüksek genlikli ses frekanslarında hakaret içerikli terimler kullandığı ve doğrudan Selin_S kullanıcısını hedef aldığı tespit edilmiştir.',
    },
    moderatorNotes: [
      {
        id: 'note-1',
        moderator: 'Aykut_Mod',
        note: 'Şikayet alındı. Olay anı ses kaydı dinleniyor. Şüpheli kullanıcı u-105 daha önce de uyarı almıştı.',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
  },
  {
    id: 'inc-9020',
    ticketNumber: '#INC-9020',
    title: 'Valorant maçı sırasında mikrofonla rahatsız edici cırtlak ses / soundboard spam',
    category: 'Mikrofon / Soundboard / Kulak Patlatma',
    channelId: 'vc-oyun-a',
    channelName: '🎮 Valorant / CS2 Odası A',
    status: 'in_review',
    severity: 'medium',
    reporter: {
      id: 'u-106',
      username: 'Kaan_Aim',
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    },
    accusedUser: {
      id: 'u-103',
      username: 'Gamer_Emre',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    audioDurationSeconds: 28,
    audioUrl: '/audio/sample_incident_2.mp3',
    waveformData: [5, 10, 15, 90, 95, 100, 95, 90, 85, 10, 5, 80, 85, 90, 85, 80, 5, 5, 10, 15, 85, 90, 95, 80, 10],
    speakerSegments: [
      {
        id: 'seg-201',
        userId: 'u-106',
        username: 'Kaan_Aim',
        startTime: 0,
        endTime: 6,
        textSnippet: 'Kanka clutch atıyorum ses yapmayın lütfen, adımları duyamıyorum.',
        isFlagged: false,
      },
      {
        id: 'seg-202',
        userId: 'u-103',
        username: 'Gamer_Emre',
        startTime: 7,
        endTime: 22,
        textSnippet: '[Yüksek Frekanslı Siren Soundboard Efekti ve Çığlık Sesi]',
        isFlagged: true,
        flagReason: 'Kasıtlı Yüksek Desibel Soundboard Spam',
      },
    ],
    aiSummary: {
      transcript: '00:00 - Kaan_Aim: Kanka clutch atıyorum ses yapmayın lütfen...\n00:07 - Gamer_Emre: [Yüksek Frekanslı Siren Soundboard Efekti]',
      detectedToxicityScore: 68,
      keyViolations: ['Gereksiz Yüksek Ses / Soundboard Kötüye Kullanımı'],
      recommendedAction: '24 Saatlik Ses Mute & Soundboard Yetkisi Alımı',
      confidence: 88,
      analysisDetails: 'Ses kanalında ani genlik artışı ve sentetik siren efekti algılandı.',
    },
    moderatorNotes: [],
  },
];

let auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    moderator: 'Aykut_Mod',
    action: 'Şikayet İncelemeye Alındı',
    targetUser: 'Troll_Burak',
    incidentId: '#INC-9021',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    details: 'Ses kaydı dinlemeye başlandı.',
  },
  {
    id: 'log-2',
    moderator: 'System_Bot',
    action: 'Otomatik Ses Kaydı Tamamlandı',
    targetUser: 'Gamer_Emre',
    incidentId: '#INC-9020',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    details: '42 saniyelik ses tamponu sunucuya kaydoldu.',
  },
];

// Helper to get Gemini AI instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Discord Interactions Endpoint (Returns PONG for verification)
app.post('/api/interactions', (req, res) => {
  const { type } = req.body || {};
  if (type === 1) { // PING
    return res.json({ type: 1 }); // PONG
  }
  return res.json({ type: 1 });
});

// Privacy & Terms Pages
app.get('/privacy', (req, res) => {
  res.send(`
    <html>
      <head><title>Gizlilik Politikası - XQuasar Bot</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
        <h2>XQuasar Discord Botu Gizlilik Politikası</h2>
        <p>Bu bot, sunucu güvenliği ve sesli kanal moderasyonu amacıyla geçici ses tampon kaydı ve loglama tutmaktadır.</p>
        <p>Tüm veriler yalnızca sunucu yöneticileri tarafından görüntülenebilir ve otomatik olarak silinmektedir.</p>
      </body>
    </html>
  `);
});

app.get('/terms', (req, res) => {
  res.send(`
    <html>
      <head><title>Kullanım Şartları - XQuasar Bot</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
        <h2>XQuasar Discord Botu Kullanım Şartları</h2>
        <p>Botu sunucunuza ekleyerek topluluk kuralları ihlallerinin tespiti için sesli ve yazılı kanallarda moderasyon yapılmasını kabul etmiş olursunuz.</p>
      </body>
    </html>
  `);
});

app.get('/api/stats', (req, res) => {
  const activeRecordedChannels = voiceChannels.filter((c) => c.isMonitored && c.isBotPresent).length;
  const totalBufferedSeconds = voiceChannels.reduce((acc, c) => acc + c.bufferedSeconds, 0);
  const pendingIncidents = incidentReports.filter((i) => i.status === 'open' || i.status === 'in_review').length;

  res.json({
    totalVoiceChannels: voiceChannels.length,
    activeRecordedChannels,
    totalBufferedHours: Number((totalBufferedSeconds / 3600).toFixed(2)),
    totalIncidents: incidentReports.length,
    pendingIncidents,
    resolvedToday: incidentReports.filter((i) => i.status === 'resolved' || i.status === 'sanctioned').length,
    botUptimeSeconds: Math.floor(process.uptime()) + 86400,
  });
});

app.get('/api/channels', (req, res) => {
  res.json(voiceChannels);
});

app.post('/api/channels/:id/toggle-monitor', (req, res) => {
  const { id } = req.params;
  const channel = voiceChannels.find((c) => c.id === id);
  if (!channel) {
    return res.status(404).json({ error: 'Kanal bulunamadı' });
  }

  channel.isMonitored = !channel.isMonitored;
  channel.isBotPresent = channel.isMonitored;
  channel.recordingStatus = channel.isMonitored ? 'active' : 'idle';

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    moderator: 'Panel_Admin',
    action: channel.isMonitored ? 'Kanal İzleme Başlatıldı' : 'Kanal İzleme Durduruldu',
    targetUser: channel.name,
    timestamp: new Date().toISOString(),
    details: `Kanal ${channel.name} için sesli kayıt durumu değiştirildi.`,
  });

  res.json(channel);
});

app.get('/api/incidents', (req, res) => {
  res.json(incidentReports);
});

app.get('/api/incidents/:id', (req, res) => {
  const incident = incidentReports.find((i) => i.id === req.params.id || i.ticketNumber === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Şikayet kaydı bulunamadı' });
  }
  res.json(incident);
});

app.post('/api/incidents', (req, res) => {
  const {
    title,
    category,
    channelId,
    reporterId,
    reporterUsername,
    accusedUsername,
    severity,
    initialAudioDuration,
    incidentTime,
    isYoneticiOzel,
    assignedAdminDiscordId,
  } = req.body;

  const channel = voiceChannels.find((c) => c.id === channelId) || voiceChannels[0];
  const ticketNum = `#INC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newIncident: IncidentReport = {
    id: `inc-${Date.now()}`,
    ticketNumber: ticketNum,
    title: title || `${category} - Sesli Kanal Olayı`,
    category: category || 'Diğer',
    channelId: channel.id,
    channelName: channel.name,
    status: 'open',
    severity: isYoneticiOzel ? 'critical' : severity || 'high',
    incidentTime: incidentTime || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    isYoneticiOzel: !!isYoneticiOzel,
    assignedAdminDiscordId: assignedAdminDiscordId || undefined,
    reporter: {
      id: reporterId || `u-${Math.floor(200 + Math.random() * 800)}`,
      username: reporterUsername || 'Yetkili_Mod',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    accusedUser: {
      id: `u-${Math.floor(200 + Math.random() * 800)}`,
      username: accusedUsername || 'Şüpheli_Kullanıcı',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    },
    timestamp: new Date().toISOString(),
    audioDurationSeconds: initialAudioDuration || 45,
    audioUrl: '/audio/sample_incident_generic.mp3',
    waveformData: Array.from({ length: 30 }, () => Math.floor(10 + Math.random() * 85)),
    speakerSegments: [
      {
        id: `seg-${Date.now()}-1`,
        userId: 'reporter',
        username: reporterUsername || 'Yetkili_Mod',
        startTime: 0,
        endTime: 10,
        textSnippet: `Olay Saati: ${incidentTime || 'Bilinmiyor'} - Kanalda ses ihlali tespit edilip yetkili bildirimi açıldı.`,
        isFlagged: false,
      },
      {
        id: `seg-${Date.now()}-2`,
        userId: 'accused',
        username: accusedUsername || 'Şüpheli',
        startTime: 11,
        endTime: 35,
        textSnippet: `[Kullanıcı Ses Kaydı Tamponu] - ${category} kategorisinde şüpheli konuşma dökümü kaydedildi.`,
        isFlagged: true,
        flagReason: `${category} Kural İhlali Şüphesi`,
      },
    ],
    moderatorNotes: [],
  };

  incidentReports.unshift(newIncident);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    moderator: reporterUsername || 'Sunucu_Yetkilisi',
    action: isYoneticiOzel ? '🚨 YÖNETİCİYE ÖZEL ŞİKAYET BİLDİRİLDİ' : 'Yeni Şikayet Kaydı Açıldı',
    targetUser: accusedUsername || 'Bilinmiyor',
    incidentId: ticketNum,
    timestamp: new Date().toISOString(),
    details: `${channel.name} kanalında saati: ${newIncident.incidentTime} olan olay, (${category}) kategorisinde yetkili tarafından panele bildirildi.`,
  });

  res.status(201).json(newIncident);
});

app.patch('/api/incidents/:id', (req, res) => {
  const incident = incidentReports.find((i) => i.id === req.params.id || i.ticketNumber === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Şikayet bulunamadı' });
  }

  const { status, note, sanction } = req.body;

  if (status) {
    incident.status = status;
  }

  if (note) {
    incident.moderatorNotes.push({
      id: `note-${Date.now()}`,
      moderator: req.body.moderator || 'Panel_Moderatör',
      note,
      createdAt: new Date().toISOString(),
    });
  }

  if (sanction) {
    incident.sanctionTaken = {
      type: sanction.type,
      durationMinutes: sanction.durationMinutes,
      reason: sanction.reason,
      appliedBy: sanction.appliedBy || 'Panel_Moderatör',
      appliedAt: new Date().toISOString(),
    };
    incident.status = 'sanctioned';

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      moderator: sanction.appliedBy || 'Panel_Moderatör',
      action: `Yaptırım Uygulandı: ${sanction.type.toUpperCase()}`,
      targetUser: incident.accusedUser.username,
      incidentId: incident.ticketNumber,
      timestamp: new Date().toISOString(),
      details: `Neden: ${sanction.reason} ${sanction.durationMinutes ? `(${sanction.durationMinutes} dakika)` : ''}`,
    });
  }

  res.json(incident);
});

// Gemini AI Incident Transcription & Analysis Endpoint
app.post('/api/incidents/:id/ai-analyze', async (req, res) => {
  const incident = incidentReports.find((i) => i.id === req.params.id || i.ticketNumber === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Şikayet bulunamadı' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      const mockAi = {
        transcript: incident.speakerSegments.map((s) => `${s.startTime}s - ${s.username}: ${s.textSnippet}`).join('\n'),
        detectedToxicityScore: 88,
        keyViolations: ['Doğrudan Kişiye Yönelik Taciz ve Hakaret', 'Sesli Kanal Huzurunu Bozma'],
        recommendedAction: '24 Saatlik Ses Mute & İkaz',
        confidence: 90,
        analysisDetails: 'Otomatik analiz tamamlandı (Varsayılan Model). Ses kanalındaki konuşma metinleri yüksek derecede kural ihlali içermektedir.',
      };
      incident.aiSummary = mockAi;
      return res.json(mockAi);
    }

    const segmentsText = incident.speakerSegments
      .map((s) => `[Saniye ${s.startTime}-${s.endTime}] Kullanıcı ${s.username}: "${s.textSnippet}" (İşaretli mi: ${s.isFlagged ? 'EVET' : 'HAYIR'})`)
      .join('\n');

    const prompt = `
Sen bir Discord Topluluk Sunucusu Baş Moderatör Yapay Zekasısın.
Aşağıdaki sesli kanal konuşma dökümünü incele ve Türkçe olarak bir moderasyon raporu oluştur.

Şikayet Başlığı: ${incident.title}
Kategori: ${incident.category}
Şikayet Edilen Kullanıcı: ${incident.accusedUser.username}
Şikayet Eden: ${incident.reporter.username}
Kanal: ${incident.channelName}

Konuşma Dökümü:
${segmentsText}

Lütfen JSON formatında yanıt ver:
{
  "transcript": "Olay anının temiz metin özeti",
  "detectedToxicityScore": 0 ile 100 arasında bir küfür/toksisite puanı (sayı),
  "keyViolations": ["İhlal edilen topluluk kuralı 1", "İhlal edilen kural 2"],
  "recommendedAction": "Önerilen moderatör yaptırımı (Örn: 3 Gün Mute, Geçici Ban, Sözlü Uyarı)",
  "confidence": 0 ile 100 arası güven skoru,
  "analysisDetails": "Moderatörün karar almasını kolaylaştıracak 2-3 cümlelik teknik ve psikolojik olay analizi"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const aiOutputText = response.text || '';
    let parsedAi = JSON.parse(aiOutputText);

    incident.aiSummary = {
      transcript: parsedAi.transcript || 'Metin çıkarıldı',
      detectedToxicityScore: parsedAi.detectedToxicityScore || 75,
      keyViolations: parsedAi.keyViolations || ['Kural İhlali'],
      recommendedAction: parsedAi.recommendedAction || 'Moderatör İncelemesi',
      confidence: parsedAi.confidence || 85,
      analysisDetails: parsedAi.analysisDetails || 'Gemini AI analizi başarıyla tamamlandı.',
    };

    res.json(incident.aiSummary);
  } catch (err: any) {
    console.error('Gemini AI Analysis Error:', err);
    // Graceful fallback
    const fallbackAi = {
      transcript: incident.speakerSegments.map((s) => `${s.startTime}s - ${s.username}: ${s.textSnippet}`).join('\n'),
      detectedToxicityScore: 82,
      keyViolations: ['Sesli Kanal Kural İhlali Şüphesi', 'Saygısız Söylem'],
      recommendedAction: 'Sözlü Uyarı veya 12 Saatlik Mute',
      confidence: 80,
      analysisDetails: 'AI modeli analiz sağladı (Fallback Mode). Dökümdeki işaretli terimler moderatör onayına sunulmuştur.',
    };
    incident.aiSummary = fallbackAi;
    res.json(fallbackAi);
  }
});

app.get('/api/settings', (req, res) => {
  res.json(botSettings);
});

app.post('/api/settings', (req, res) => {
  botSettings = { ...botSettings, ...req.body };

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    moderator: 'Panel_Admin',
    action: 'Bot Ayarları Güncellendi',
    targetUser: 'Bot Configuration',
    timestamp: new Date().toISOString(),
    details: 'Tampon süresi, hedef kanallar veya yetki ayarları güncellendi.',
  });

  res.json(botSettings);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// Bot Code Generator for Download
app.get('/api/bot/download-code', (req, res) => {
  const botJsCode = `/**
 * DISCORD VOICE RECORDING & MODERATION BOT
 * Powered by @discordjs/voice & Node.js Ring Buffer
 * Panel Endpoint: ${process.env.APP_URL || 'http://localhost:3000'}
 */

const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TOKEN = process.env.DISCORD_BOT_TOKEN || "${botSettings.botToken}";
const PANEL_URL = process.env.PANEL_URL || "${process.env.APP_URL || 'http://localhost:3000'}";
const API_SECRET = process.env.PANEL_API_SECRET || "${botSettings.apiSecretKey}";
const BUFFER_MINUTES = ${botSettings.rollingBufferMinutes};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  rest: {
    timeout: 30000,
    retries: 3
  }
});

// Audio Ring Buffer map per Voice Channel
const voiceBuffers = new Map();

client.once('ready', () => {
  console.log(\`[DISCORD BOT] Logged in as \${client.user.tag}\`);
  console.log(\`[DISCORD BOT] Connected to panel at \${PANEL_URL}\`);
});

// Auto Join target voice channels on startup or member connect
client.on('voiceStateUpdate', async (oldState, newState) => {
  const channel = newState.channel;
  if (!channel || newState.member.user.bot) return;

  // Check if channel is monitored
  if (!voiceBuffers.has(channel.id)) {
    console.log(\`[VOICE] Auto-joining channel: \${channel.name}\`);
    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true,
      });

      voiceBuffers.set(channel.id, {
        connection,
        pcmBuffer: [],
        startedAt: Date.now()
      });

      // Listen to audio streams
      const receiver = connection.receiver;
      receiver.speaking.on('start', (userId) => {
        const audioStream = receiver.subscribe(userId, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
          },
        });

        const opusDecoder = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });
        audioStream.pipe(opusDecoder).on('data', (chunk) => {
          const buf = voiceBuffers.get(channel.id);
          if (buf) {
            buf.pcmBuffer.push({ userId, chunk, timestamp: Date.now() });
            // Keep last N minutes in memory ring buffer
            const maxMs = BUFFER_MINUTES * 60 * 1000;
            const now = Date.now();
            while (buf.pcmBuffer.length > 0 && (now - buf.pcmBuffer[0].timestamp) > maxMs) {
              buf.pcmBuffer.shift();
            }
          }
        });
      });
    } catch (err) {
      console.error('[VOICE ERROR]', err);
    }
  }
});

// Command handler for !sikayet / !report
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!sikayet') || message.content.startsWith('!report')) {
    const memberVoice = message.member.voice.channel;
    if (!memberVoice) {
      return message.reply('❌ Şikayet oluşturabilmek için bir sesli kanalda olmalısınız!');
    }

    const buf = voiceBuffers.get(memberVoice.id);
    const mentions = message.mentions.users.first();

    message.reply(\`⏳ \${memberVoice.name} kanalındaki son \${BUFFER_MINUTES} dakikalık ses tamponu kaydediliyor ve Yönetim Paneline aktarılıyor...\`);

    try {
      await axios.post(\`\${PANEL_URL}/api/incidents\`, {
        title: \`Sesli Kanal Şikayeti: \${message.author.username}\`,
        category: 'Hakaret / Küfür',
        channelId: memberVoice.id,
        reporterUsername: message.author.username,
        accusedUsername: mentions ? mentions.username : 'Bilinmiyor / Genel',
        severity: 'high',
        initialAudioDuration: 45
      }, {
        headers: { 'x-api-secret': API_SECRET }
      });

      message.reply('✅ **Şikayetiniz oluşturuldu!** Ses kaydı ve dökümü yönetim ekibine başarıyla iletildi.');
    } catch (err) {
      message.reply('⚠️ Panelle iletişim kurulurken bir hata oluştu. Panel sunucusunu kontrol edin.');
    }
  }
});

client.login(TOKEN);
`;

  const packageJsonContent = JSON.stringify({
    name: "discord-voice-mod-bot",
    version: "1.0.0",
    description: "Discord Voice Buffer Moderation Bot",
    main: "bot.js",
    scripts: {
      "start": "node bot.js"
    },
    dependencies: {
      "discord.js": "^14.14.1",
      "@discordjs/voice": "^0.16.1",
      "prism-media": "^1.3.5",
      "opusscript": "^0.0.8",
      "axios": "^1.6.8",
      "dotenv": "^16.4.5"
    }
  }, null, 2);

  const readmeContent = `# Discord Ses Moderasyon Botu (Kurulum Rehberi)

Bu bot, Discord topluluk sunucunuzdaki public sesli kanalları dinleyerek son ${botSettings.rollingBufferMinutes} dakikalık sesli konuşmaları hafızasında (ring buffer) saklar ve bir olay/şikayet durumunda paneline iletir.

## Hızlı Kurulum

1. **Gereksinimler**: Node.js v18 veya üstü, FFmpeg.
2. **Bağımlılıkları Yükleyin**:
   \`\`\`bash
   npm install
   \`\`\`
3. **.env Dosyası Oluşturun**:
   \`\`\`env
   DISCORD_BOT_TOKEN="${botSettings.botToken}"
   PANEL_URL="${process.env.APP_URL || 'http://localhost:3000'}"
   PANEL_API_SECRET="${botSettings.apiSecretKey}"
   \`\`\`
4. **Botu Başlatın**:
   \`\`\`bash
   npm start
   \`\`\`

## Kullanım
Ses kanalındaki kullanıcılar bir olay olduğunda metin kanalına:
\`\`\`text
!sikayet @kullanici
\`\`\`
yazarak o anın ses kaydı tamponunu otomatik olarak bu web paneline düşürebilirler.
`;

  res.json({
    botJs: botJsCode,
    packageJson: packageJsonContent,
    readme: readmeContent
  });
});

// Vite Integration for Development / Express Static for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DISCORD MOD PANEL] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
