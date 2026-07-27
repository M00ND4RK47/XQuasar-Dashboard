import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, AlertTriangle, Sliders, CheckCircle2 } from 'lucide-react';

export const WordFilterPanel: React.FC = () => {
  const [bannedWords, setBannedWords] = useState<string[]>([
    'ailem',
    'sülale',
    'şerefsiz',
    'atama',
    'dinime',
    'panelci',
    'discord.gg/',
    'https://',
  ]);
  const [newWord, setNewWord] = useState('');
  const [sensitivity, setSensitivity] = useState<number>(85);
  const [autoMuteDuration, setAutoMuteDuration] = useState<number>(30);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim() && !bannedWords.includes(newWord.trim().toLowerCase())) {
      setBannedWords([...bannedWords, newWord.trim().toLowerCase()]);
      setNewWord('');
    }
  };

  const handleRemoveWord = (word: string) => {
    setBannedWords(bannedWords.filter((w) => w !== word));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Otomatik Kelime & İçerik Filtresi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Botun canlı ses analizinde (VAD & Speech-to-Text) veya komutlarda algıladığında otomatik uyarı/mute atacağı kelime karalestesi.
          </p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>{bannedWords.length} Yasaklı Terim</span>
        </div>
      </div>

      {/* Sensitivity & Auto Mute Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Yapay Zeka Algılama Hassasiyeti</span>
            </label>
            <span className="text-xs font-mono font-bold text-indigo-300">%{sensitivity}</span>
          </div>
          <input
            type="range"
            min="50"
            max="98"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hassasiyet yükseldikçe benzer fonetik küfür ve hakaretler daha katı yakalanır.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Otomatik Mute Süresi (Dakika)</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-300">{autoMuteDuration} Dk</span>
          </div>
          <input
            type="number"
            value={autoMuteDuration}
            onChange={(e) => setAutoMuteDuration(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Karakutuda küfür tespit edilen kullanıcıya otomatik uygulanacak sesli susturma süresi.
          </p>
        </div>
      </div>

      {/* Add Word Form */}
      <form onSubmit={handleAddWord} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
        <label className="block text-xs font-bold text-slate-200">
          Yeni Yasaklı Kelime / Deyim Ekle
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Yasaklanacak kelime veya link kalıbı girin..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Listeye Ekle</span>
          </button>
        </div>
      </form>

      {/* Banned Words Cloud / List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Aktif Karaliste Kelimeleri
        </h3>
        <div className="flex flex-wrap gap-2">
          {bannedWords.map((word) => (
            <span
              key={word}
              className="inline-flex items-center space-x-2 bg-slate-950 border border-slate-800 hover:border-rose-500/40 px-3 py-1.5 rounded-xl text-xs text-slate-200 transition group"
            >
              <span>{word}</span>
              <button
                type="button"
                onClick={() => handleRemoveWord(word)}
                className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                title="Kaldır"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
