
import React, { useState } from 'react';
import { 
  Outfit, Setting, Style, AspectRatio, 
  OUTFITS, SETTINGS, STYLES, RATIOS 
} from '../types';

interface SelectionViewProps {
  onConfirm: (outfit: Outfit, setting: Setting, style: Style, ratio: AspectRatio) => void;
  onBack: () => void;
  selfie: string;
}

export const SelectionView: React.FC<SelectionViewProps> = ({ onConfirm, onBack, selfie }) => {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [setting, setSetting] = useState<Setting | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [ratio, setRatio] = useState<AspectRatio>('1:1');

  const isComplete = outfit && setting && style && ratio;

  return (
    <div className="flex flex-col gap-10 w-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Zurück
        </button>
        <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${outfit ? 'bg-violet-500' : 'bg-zinc-700'}`} />
            <div className={`w-2 h-2 rounded-full ${setting ? 'bg-violet-500' : 'bg-zinc-700'}`} />
            <div className={`w-2 h-2 rounded-full ${style ? 'bg-violet-500' : 'bg-zinc-700'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Deine Vorlage</h3>
           <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-xl">
              <img src={selfie} className="w-full h-full object-cover" alt="Selfie" />
           </div>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm border border-zinc-800">1</span>
              Wähle dein Outfit
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OUTFITS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOutfit(item.id)}
                  className={`p-3 rounded-xl border text-sm transition-all flex flex-col items-center gap-2 ${
                    outfit === item.id 
                    ? 'border-violet-500 bg-violet-500/10 text-violet-200 shadow-lg shadow-violet-500/10 scale-[1.02]' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm border border-zinc-800">2</span>
              Wähle das Setting
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SETTINGS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSetting(item.id)}
                  className={`p-3 rounded-xl border text-sm transition-all flex flex-col items-center gap-2 ${
                    setting === item.id 
                    ? 'border-violet-500 bg-violet-500/10 text-violet-200 shadow-lg shadow-violet-500/10 scale-[1.02]' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm border border-zinc-800">3</span>
              Wähle den Stil & Format
            </h3>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STYLES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStyle(item.id)}
                    className={`p-3 rounded-xl border text-sm transition-all flex flex-col items-center gap-2 ${
                      style === item.id 
                      ? 'border-violet-500 bg-violet-500/10 text-violet-200 shadow-lg shadow-violet-500/10 scale-[1.02]' 
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {RATIOS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRatio(item.id)}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      ratio === item.id 
                      ? 'border-violet-500 bg-violet-500/10 text-violet-200' 
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-4 w-full pt-8">
        <button
          disabled={!isComplete}
          onClick={() => isComplete && onConfirm(outfit, setting, style, ratio)}
          className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl ${
            isComplete 
            ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20 translate-y-0 opacity-100 cursor-pointer' 
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isComplete ? 'Jetzt generieren' : 'Bitte wähle alle Optionen aus'}
        </button>
      </div>
    </div>
  );
};
