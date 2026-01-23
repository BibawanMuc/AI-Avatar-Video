import React, { useState, useMemo } from 'react';
import { Voice } from '../types';

interface VoiceInputViewProps {
    imageUrl: string;
    voices: Voice[];
    onConfirm: (voice: Voice, text: string) => void;
    onBack: () => void;
}

export const VoiceInputView: React.FC<VoiceInputViewProps> = ({
    imageUrl,
    voices,
    onConfirm,
    onBack
}) => {
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVoices = useMemo(() => {
        return voices.filter(voice =>
            voice.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [voices, searchQuery]);

    const handleConfirm = () => {
        const voice = voices.find(v => v.voice_id === selectedVoiceId);
        if (voice && text.trim()) {
            onConfirm(voice, text);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: The Generated Image */}
                <div className="relative group w-full max-w-md mx-auto lg:mx-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                        <img
                            src={imageUrl}
                            alt="Generated Persona"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="space-y-8 w-full">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black italic tracking-tighter">GIB IHM EINE STIMME.</h2>
                        <p className="text-zinc-400">Wähle eine Stimme und was dein Avatar sagen soll.</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">

                        {/* Voice Search & Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex justify-between">
                                <span>Wähle eine Stimme</span>
                                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">{filteredVoices.length} verfügbar</span>
                            </label>

                            {/* Search Bar */}
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Suche nach Name..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                                />
                            </div>

                            {/* Scrollable List */}
                            <div className="h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                {filteredVoices.map((voice) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => setSelectedVoiceId(voice.voice_id)}
                                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedVoiceId === voice.voice_id
                                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg'
                                                : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                            }`}
                                    >
                                        <span className="font-bold">{voice.name}</span>
                                        <span className={`text-[10px] font-mono px-2 py-1 rounded ${selectedVoiceId === voice.voice_id ? 'bg-violet-500/50 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:bg-zinc-700 group-hover:text-zinc-400'
                                            }`}>
                                            {voice.voice_id.slice(0, 4)}...
                                        </span>
                                    </button>
                                ))}

                                {filteredVoices.length === 0 && (
                                    <div className="text-center py-8 text-zinc-600 text-sm italic border border-dashed border-zinc-800 rounded-xl">
                                        Keine Stimme gefunden "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                Dein Text
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Hallo! Ich bin dein neuer AI Avatar. Wie findest du mich?"
                                rows={3}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                            />
                        </div>

                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={onBack}
                            className="px-8 py-4 rounded-2xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                        >
                            Zurück
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedVoiceId || !text}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${!selectedVoiceId || !text
                                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-white text-black hover:scale-[1.02]'
                                }`}
                        >
                            <span>Video Generieren</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
