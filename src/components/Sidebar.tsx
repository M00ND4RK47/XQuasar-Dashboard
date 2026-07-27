import React from 'react';
import {
  Headphones,
  AlertTriangle,
  FileAudio,
  Settings,
  BarChart3,
  ShieldCheck,
  Crown,
  Lock,
  Activity,
  ShieldAlert,
  Sliders,
  Users,
  BellRing,
  History,
  Github,
} from 'lucide-react';
import { BotSettings, DiscordUser, FOUNDER_DISCORD_ID } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openIncidentsCount: number;
  currentUser: DiscordUser;
  settings: BotSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openIncidentsCount,
  currentUser,
  settings,
}) => {
  const isFounder = currentUser.id === FOUNDER_DISCORD_ID || currentUser.role === 'Kurucu';
  const isAdmin = isFounder || currentUser.role === 'Yönetici' || settings.adminDiscordIds?.includes(currentUser.id);

  const menuCategories = isAdmin
    ? [
        {
          categoryName: 'CANLI TAKİP & SİSTEM',
          items: [
            {
              id: 'channels',
              label: 'Canlı Ses Odaları',
              icon: Headphones,
              badge: 'CANLI',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
              description: 'Aktif kanallar & canlı konuşanlar',
            },
            {
              id: 'incidents',
              label: 'Şikayet & Olay İnceleme',
              icon: AlertTriangle,
              badge: openIncidentsCount > 0 ? `${openIncidentsCount} Olay` : null,
              badgeColor: 'bg-rose-600 text-white animate-pulse',
              description: 'Ses kayıtlarını dinle & karar ver',
            },
            {
              id: 'archive',
              label: 'Tampon Ses Kayıt Arşivi',
              icon: FileAudio,
              badge: null,
              description: 'Geçmiş ses tampon logları',
            },
            {
              id: 'voice-logs',
              label: 'Sesli Katılım Logları',
              icon: Activity,
              badge: 'CANLI',
              badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
              description: 'Anlık oda giriş/çıkış akışı',
            },
          ],
        },
        {
          categoryName: 'MODERASYON & CEZALAR',
          items: [
            {
              id: 'analytics',
              label: 'Moderasyon İstatistikleri',
              icon: BarChart3,
              badge: null,
              description: 'Cezai işlem verileri ve grafikler',
            },
            {
              id: 'active-bans',
              label: 'Aktif Muted & Cezalı Listesi',
              icon: ShieldAlert,
              badge: 'Aktif Mute',
              badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
              description: 'Mute, sağırlaştırma & geçici banlar',
            },
            {
              id: 'word-filter',
              label: 'Otomatik Kelime Filtresi',
              icon: Sliders,
              badge: null,
              description: 'Yasaklı kelime & argo filtresi',
            },
          ],
        },
        {
          categoryName: 'DASHBOARD TERCIHLERI',
          items: [
            {
              id: 'dashboard-settings',
              label: 'Dashboard Ayarları',
              icon: Sliders,
              badge: 'Arayüz',
              badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
              description: 'Tema, açık/koyu mod, yenileme hızı',
            },
          ],
        },
        {
          categoryName: 'GÜVENLİK & KADRO',
          items: [
            {
              id: 'staff-list',
              label: 'Sunucu Yetkili Kadrosu',
              icon: Users,
              badge: null,
              description: 'Yönetici & Moderatör ID listesi',
            },
            {
              id: 'audit-logs',
              label: 'Denetim Kaydı (Audit Logs)',
              icon: History,
              badge: null,
              description: 'Sistem denetim & güvenlik kaydı',
            },
          ],
        },
        ...(isFounder
          ? [
              {
                categoryName: 'YAPILANDIRMA (KURUCU)',
                items: [
                  {
                    id: 'settings',
                    label: 'Bot & Sunucu Ayarları',
                    icon: Settings,
                    badge: 'Kurucu',
                    badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold',
                    description: 'Sunucu ismi, token & tampon ayarları',
                  },
                  {
                    id: 'webhooks',
                    label: 'Webhook Entegrasyonu',
                    icon: BellRing,
                    badge: 'Kurucu',
                    badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold',
                    description: 'Discord bildirim kanalı webhookları',
                  },
                  {
                    id: 'system-updater',
                    label: 'GitHub Otomatik Güncelleyici',
                    icon: Github,
                    badge: 'v2.5.2',
                    badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold',
                    description: 'GitHub son sürüm güncelleme motoru',
                  },
                ],
              },
            ]
          : []),
      ]
    : [
        {
          categoryName: 'CANLI TAKİP & ŞİKAYETLERİM',
          items: [
            {
              id: 'channels',
              label: 'Canlı Ses Odaları',
              icon: Headphones,
              badge: 'CANLI',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
              description: 'Aktif kanallar & şikayet bildirimi',
            },
            {
              id: 'incidents',
              label: 'Şikayetlerim & Takip',
              icon: AlertTriangle,
              badge: null,
              description: 'Oluşturduğunuz şikayetlerin durumunu izleyin',
            },
          ],
        },
        {
          categoryName: 'DASHBOARD TERCİHLERİ',
          items: [
            {
              id: 'dashboard-settings',
              label: 'Dashboard Ayarları',
              icon: Sliders,
              badge: 'Arayüz',
              badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
              description: 'Tema, açık/koyu mod, yenileme hızı',
            },
          ],
        },
      ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        {menuCategories.map((cat, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
              <span>{cat.categoryName}</span>
              {cat.categoryName.includes('KURUCU') && (
                <Crown className="w-3 h-3 text-amber-400" />
              )}
            </div>
            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition text-xs group cursor-pointer ${
                    isActive
                      ? 'bg-rose-600/20 text-rose-200 font-semibold border border-rose-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <div className="truncate">
                      <div className="truncate font-medium">{item.label}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 font-medium ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info Card */}
      <div className="mt-8 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-slate-300 font-semibold text-xs">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{settings.serverName || 'XQuasar'} Moderasyon</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Aktif
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Bot ses kanallarında otomatik döngüsel bellek tamponu tutar. Olay bildiriminde ses kalıcı arşive aktarılır.
        </p>
      </div>
    </aside>
  );
};
