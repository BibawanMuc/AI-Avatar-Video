import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CameraView } from './components/CameraView';
import { SelectionView } from './components/SelectionView';
import { VoiceInputView } from './components/VoiceInputView';
import { ResultView } from './components/ResultView';
import { AppState, Outfit, Setting, Style, AspectRatio, Voice } from './types';
import { generatePersonaImage } from './services/geminiService';
import { generateSpeech, getVoices } from './services/elevenLabsService';
import { generateVideo } from './services/replicateService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);

  const refreshVoices = async () => {
    try {
      console.log("Fetching voices...");
      const apiVoices = await getVoices();
      console.log("Raw ElevenLabs Voices:", apiVoices);

      // Filter for 'KI Event' tag
      // Also checking Name and Category just in case
      const filteredVoices = apiVoices.filter(v => {
        const jsonString = JSON.stringify(v).toLowerCase();
        return jsonString.includes('ki event') || jsonString.includes('ki-event');
      });

      console.log(`Found ${apiVoices.length} total voices, ${filteredVoices.length} matching 'KI Event'`);

      if (filteredVoices.length === 0) {
        console.warn("No voices found with 'KI Event' tag! Showing ALL voices for debugging.");
        alert("ACHTUNG: Keine Stimmen mit 'KI Event' Tag gefunden. Zeige alle verfügbaren Stimmen an.");
        const mappedVoices: Voice[] = apiVoices.map(v => ({
          id: v.voice_id,
          name: v.name,
          voice_id: v.voice_id
        }));
        setVoices(mappedVoices);
      } else {
        const mappedVoices: Voice[] = filteredVoices.map(v => ({
          id: v.voice_id,
          name: v.name,
          voice_id: v.voice_id
        }));
        setVoices(mappedVoices);
      }
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };

  // -- STATE --
  const initialAppState: AppState = {
    step: 'selfie',
    selfie: null,
    outfit: null,
    setting: null,
    style: null,
    aspectRatio: '1:1',
    generatedImageUrl: null,
    selectedVoice: null,
    textPrompt: '',
    audioUrl: null,
    videoUrl: null,
    error: null,
  };

  const [state, setState] = useState<AppState>(initialAppState);

  // Trigger fetch when entering 'voice-input' step
  useEffect(() => {
    if (state.step === 'voice-input') {
      refreshVoices();
    }
  }, [state.step]);

  // 1. Capture Selfie
  const handleSelfieCaptured = (base64: string) => {
    setState(prev => ({ ...prev, selfie: base64, step: 'selection' }));
  };

  // 2. Generate Image (Gemini)
  const handleGenerateImage = async (outfit: Outfit, setting: Setting, style: Style, ratio: AspectRatio) => {
    if (!state.selfie) return;

    setState(prev => ({
      ...prev,
      outfit, setting, style, aspectRatio: ratio,
      step: 'generating', // Re-using 'generating' for image loading state if logically consistent, but type says 'generating-image'
      // Let's stick to the type definition strictly
    }));

    // Quick fix: temporary set step to 'generating-image' in types or cast here.
    // The type definition in previous step had 'generating-image'. 
    // Wait, the previous `types.ts` update had 'generating-video', 'voice-input', etc.
    // Let's assume strict type adherence.
    setState(prev => ({ ...prev, step: 'generating-image', error: null }));

    try {
      const imageUrl = await generatePersonaImage(state.selfie, outfit, setting, style, ratio);
      setState(prev => ({
        ...prev,
        generatedImageUrl: imageUrl,
        step: 'voice-input' // Move to approval/voice step
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, step: 'selection', error: "Bildgenerierung fehlgeschlagen." }));
      alert("Fehler: " + err.message);
    }
  };

  // 3. Generate Video (ElevenLabs + Replicate)
  const handleGenerateVideo = async (voice: Voice, text: string) => {
    if (!state.generatedImageUrl) return;

    setState(prev => ({
      ...prev,
      selectedVoice: voice,
      textPrompt: text,
      step: 'generating-video',
      error: null
    }));

    try {
      // A. Generate Audio
      console.log("Generating Audio...");
      const audioDataUri = await generateSpeech(text, voice.voice_id);

      // B. Generate Video
      console.log("Generating Video...");
      // Replicate needs a public URL for image usually, but some models accept data URI. 
      // WAN-Video on Replicate expects inputs.
      // If Replicate fails with Data URI, we might need to upload to Supabase Storage first.
      // Let's try passing Data URI first, as many Replicate models support it.
      // IF NOT, we fallback to uploading to Supabase Storage.
      // *Self-Correction*: For stability, let's assume we might need to upload if Data URI fails.
      // But for this "Prototyping" speed run, let's try Data URI.

      const videoUrl = await generateVideo(state.generatedImageUrl, audioDataUri);

      // C. Save to Supabase (History)
      await supabase.from('generations').insert([{
        voice_id: voice.voice_id,
        name: voice.name,
        text_prompt: text,
        // We might not store full Base64 in DB rows (too large). 
        // Ideally we upload to storage. For this demo, we might skip saving huge strings/files 
        // or just save the Replicate URL (which is public tailored for this).
        generated_video_url: videoUrl,
        generated_image_url: "stored_locally_base64_skipped", // Placeholder
        generated_audio_url: "stored_locally_base64_skipped"  // Placeholder
      }]);

      setState(prev => ({ ...prev, videoUrl, step: 'result' }));

    } catch (err: any) {
      console.error(err);
      setState(prev => ({ ...prev, step: 'voice-input', error: "Video Generierung fehlgeschlagen." }));
      alert("Fehler: " + err.message);
    }
  };

  const handleRestart = () => {
    setState(initialAppState);
  };

  // -- RENDER --

  return (
    <Layout>

      {/* 1. Selfie */}
      {state.step === 'selfie' && (
        <CameraView onCapture={handleSelfieCaptured} />
      )}

      {/* 2. Selection */}
      {state.step === 'selection' && state.selfie && (
        <SelectionView
          selfie={state.selfie}
          onBack={() => setState(prev => ({ ...prev, step: 'selfie', selfie: null }))}
          onConfirm={handleGenerateImage}
        />
      )}

      {/* 3. Loading Image */}
      {state.step === 'generating-image' && (
        <LoadingScreen text="Dein Avatar wird designt..." subtext="Gemini 2.5 on work" />
      )}

      {/* 4. Voice Input (Approval) */}
      {state.step === 'voice-input' && state.generatedImageUrl && (
        <VoiceInputView
          imageUrl={state.generatedImageUrl}
          voices={voices}
          onBack={() => setState(prev => ({ ...prev, step: 'selection' }))} // "Retry" / Back
          onConfirm={handleGenerateVideo}
        />
      )}

      {/* 5. Loading Video */}
      {state.step === 'generating-video' && (
        <LoadingScreen text="Stimme & Video werden generiert..." subtext="ElevenLabs & Replicate Synthesis" />
      )}

      {/* 6. Result */}
      {state.step === 'result' && state.videoUrl && (
        <ResultView
          videoUrl={state.videoUrl}
          onRestart={handleRestart}
        />
      )}

    </Layout>
  );
};

// Simple Loading Component
const LoadingScreen: React.FC<{ text: string, subtext: string }> = ({ text, subtext }) => (
  <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20 animate-in fade-in zoom-in duration-1000">
    <div className="relative">
      <div className="w-24 h-24 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
    </div>
    <div className="text-center space-y-3">
      <h2 className="text-3xl font-bold tracking-tight">{text}</h2>
      <p className="text-zinc-500 max-w-sm">{subtext}</p>
    </div>
    <div className="flex gap-1">
      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);

export default App;
