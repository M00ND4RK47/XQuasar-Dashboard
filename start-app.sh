#!/bin/bash
echo "==================================================================="
echo "  XQuasar Dashboard - Discord Bot & Moderasyon Paneli"
echo "  Kurucu Discord ID: 868123530439557171"
echo "==================================================================="
echo ""
echo "[1/2] Proje bağımlılıkları kontrol ediliyor ve derleniyor..."
npm run build
echo ""
echo "[2/2] Sunucu Başlatılıyor (http://localhost:3000)..."
npm run start
