
export type Outfit = 'Alltagskleidung' | 'Sportkleidung' | 'Anzug' | 'Kleid' | 'Rock' | 'Abendkleid' | 'Tuxedo';
export type Setting = 'News Studio' | 'Hawaii am Strand' | 'Berggipfel in den Alpen' | 'Am Rande eines Vulkans' | 'Fremder Planet';
export type Style = 'Cinematic' | 'Cartoon' | 'Neonpunk' | 'Cyberpunk';
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface Voice {
  id: string;
  name: string;
  voice_id: string;
}

export interface AppState {
  step: 'selfie' | 'selection' | 'generating-image' | 'voice-input' | 'generating-video' | 'result';
  selfie: string | null;
  outfit: Outfit | null;
  setting: Setting | null;
  style: Style | null;
  aspectRatio: AspectRatio;

  // Image Result
  generatedImageUrl: string | null;

  // Voice/Video Inputs
  selectedVoice: Voice | null;
  textPrompt: string;

  // Final Results
  audioUrl: string | null;
  videoUrl: string | null;

  error: string | null;
}

export const OUTFITS: { id: Outfit; label: string; icon: string }[] = [
  { id: 'Alltagskleidung', label: 'Alltagskleidung', icon: '👕' },
  { id: 'Sportkleidung', label: 'Sportkleidung', icon: '👟' },
  { id: 'Anzug', label: 'Anzug', icon: '👔' },
  { id: 'Kleid', label: 'Kleid', icon: '👗' },
  { id: 'Rock', label: 'Rock', icon: '🩰' },
  { id: 'Abendkleid', label: 'Abendkleid', icon: '👠' },
  { id: 'Tuxedo', label: 'Tuxedo', icon: '🤵' },
];

export const SETTINGS: { id: Setting; label: string; icon: string }[] = [
  { id: 'News Studio', label: 'News Studio', icon: '🎙️' },
  { id: 'Hawaii am Strand', label: 'Hawaii Beach', icon: '🏖️' },
  { id: 'Berggipfel in den Alpen', label: 'Alpen Gipfel', icon: '🏔️' },
  { id: 'Am Rande eines Vulkans', label: 'Vulkan Rand', icon: '🌋' },
  { id: 'Fremder Planet', label: 'Fremder Planet', icon: '🪐' },
];

export const STYLES: { id: Style; label: string; icon: string }[] = [
  { id: 'Cinematic', label: 'Cinematic', icon: '🎬' },
  { id: 'Cartoon', label: 'Cartoon', icon: '🎨' },
  { id: 'Neonpunk', label: 'Neonpunk', icon: '✨' },
  { id: 'Cyberpunk', label: 'Cyberpunk', icon: '🤖' },
];

export const RATIOS: { id: AspectRatio; label: string }[] = [
  { id: '1:1', label: '1:1 Square' },
  { id: '16:9', label: '16:9 Landscape' },
  { id: '9:16', label: '9:16 Portrait' },
];
