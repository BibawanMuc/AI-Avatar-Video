import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const TerminalOne: React.FC = () => {
    const [name, setName] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !voiceId) return;

        setStatus('saving');
        try {
            const { error } = await supabase
                .from('voices')
                .insert([{ name, voice_id: voiceId }]);

            if (error) throw error;

            setStatus('success');
            setMessage(`Voice for "${name}" saved successfully!`);
            setName('');
            setVoiceId('');

            // Reset success message after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);

        } catch (err: any) {
            console.error('Error saving voice:', err);
            setStatus('error');
            setMessage('Error saving to database: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2">TERMINAL 1</h1>
                    <p className="text-zinc-400">Voice Clone Registry</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                Sprecher Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="z.B. Max Mustermann"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="voiceId" className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                ElevenLabs Voice ID
                            </label>
                            <input
                                id="voiceId"
                                type="text"
                                value={voiceId}
                                onChange={(e) => setVoiceId(e.target.value)}
                                placeholder="z.B. 21m00Tcm4TlvDq8ikWAM"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'saving' || !name || !voiceId}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${status === 'saving'
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg hover:shadow-violet-500/25'
                                }`}
                        >
                            {status === 'saving' ? 'Speichern...' : 'Registrieren'}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${status === 'success'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-zinc-600">
                    <p>Daten werden in der Supabase "voices" Tabelle gespeichert.</p>
                </div>
            </div>
        </div>
    );
};
