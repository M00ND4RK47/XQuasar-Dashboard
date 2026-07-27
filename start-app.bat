@echo off
title XQuasar Dashboard
color 0B
echo ===================================================================
echo   XQuasar Dashboard - Discord Bot & Moderasyon Paneli
echo   Kurucu Discord ID: 868123530439557171
echo ===================================================================
echo.
echo [1/2] Proje bağımlılıkları kontrol ediliyor ve derleniyor...
call npm run build
echo.
echo [2/2] Masaüstü Sunucu Başlatılıyor...
echo 🌐 Tarayıcınızda açın: http://localhost:3000
echo.
call npm run start
pause
