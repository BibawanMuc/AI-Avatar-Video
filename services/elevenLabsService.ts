const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const generateSpeech = async (text: string, voiceId: string): Promise<string> => {
    if (!ELEVENLABS_API_KEY) throw new Error("VITE_ELEVENLABS_API_KEY is missing");

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
            }
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs Error: ${response.status} ${errorBody}`);
    }

    const blob = await response.blob();

    // Convert Blob to Base64 Data URI
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export interface ElevenLabsVoice {
    voice_id: string;
    name: string;
    category: string;
    labels?: Record<string, string>;
    // Add other fields if needed
}

export const getVoices = async (): Promise<ElevenLabsVoice[]> => {
    if (!ELEVENLABS_API_KEY) throw new Error("VITE_ELEVENLABS_API_KEY is missing");

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
};
