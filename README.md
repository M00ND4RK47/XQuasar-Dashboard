# 🛡️ Discord Ses Moderasyon & Bot Yönetim Paneli (Masaüstü & Web)

Discord topluluk sunucuları için geliştirilmiş, **otomatik masaüstü uygulaması (.exe & .AppImage)** ve %100 Bulut Tabanlı Otomatik Moderasyon ve Canlı Ses Dinleme/Şikayet Yönetim Paneli.

---

## 👑 Kurucu ve Güvenlik Koruması

* **Sistem Kurucusu (Tek Dokunulmaz Admin):** `@MoonDark` (`Discord ID: 868123530439557171`)
* **Giriş Güvenliği:** Panele veya masaüstü uygulamasına sadece Kurucu tarafından `Bot Ayarları` panelinden eklenen **Yönetici** ve **Sunucu Yetkilisi** Discord ID'leri giriş yapabilir.
* **Yetkilendirme Kilidi:** Yönetici ve Yetkili ID listelerini ekleme/çıkarma yetkisi yalnızca Kurucu (`868123530439557171`) hesabına kilitlenmiştir.

---

## 💻 MASAÜSTÜ UYGULAMALARI (2 AYRI VERSİYON) - HİÇBİR KOMUT / NODE YÜKLEMEDEN ÇALIŞTIRMA!

Yöneticilerinize ve yetkililerinize herhangi bir terminal komutu kullandırtmak, Node.js veya kod yükletmek **GEREKMEZ!**

Projeyi GitHub'a aktardığınızda **GitHub Actions** iki ayrı klasör/sürüm paketler:

### 🪟 1. SÜRÜM: Windows x64 (`.exe`)
* **`Windows-x64-Setup`:** Çift tıklandığında Windows masaüstünüze otomatik kısayol simgesi ekler ve uygulamayı başlatır.
* **Dosya Adı:** `DiscordVoiceModeration-Setup-0.0.0-x64.exe`

### 🐧 2. SÜRÜM: Linux x64 (`.AppImage` & `.deb`)
* **`Linux-x64-AppImage`:** Ubuntu, Debian ve tüm Linux dağıtımlarında çift tıklayıp çalıştırabileceğiniz paket.
* **Dosya Adı:** `DiscordVoiceModeration-Linux-0.0.0-x64.AppImage`

---

## 🚀 GitHub Üzerinden İki Versiyonu İndirme Adımları

1. Sağ üstteki **Settings -> Export to GitHub** seçeneğiyle projeyi GitHub hesabınıza aktarın.
2. GitHub reponuza gidin ve üstteki **Actions** sekmesine tıklayın.
3. Otomatik derlenen en son işe (Workflow run) tıklayın.
4. En alttaki **Artifacts** bölümünde iki ayrı paketi göreceksiniz:
   - 📦 `Windows-x64-Setup` (Windows kullanıcıları için `.exe`)
   - 📦 `Linux-x64-AppImage` (Linux kullanıcıları için `.AppImage`)

---

## 🛠️ Yerel Bilgisayarda Manuel .exe / .AppImage Üretme

Eğer kendi bilgisayarınızda derlemek isterseniz:
```bash
# Windows x64 .exe üretmek için:
npm run dist:win

# Linux x64 .AppImage üretmek için:
npm run dist:linux
```
Üretilen masaüstü uygulamaları otomatik olarak `release/` klasörüne kaydedilecektir.

