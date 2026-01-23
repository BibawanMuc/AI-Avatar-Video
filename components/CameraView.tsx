
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Zugriff auf Kamera verweigert. Bitte lade stattdessen ein Foto hoch.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Lass uns beginnen</h2>
        <p className="text-zinc-400">Erstelle ein Selfie oder lade ein Foto hoch, um fortzufahren.</p>
      </div>

      <div className="relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel flex items-center justify-center border-2 border-zinc-800 shadow-2xl">
        {!error ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none"></div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-8 border-white/20 hover:scale-105 active:scale-95 transition-all shadow-xl"
                aria-label="Capture"
              />
            </div>
          </>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="text-red-400 text-lg">{error}</div>
            <label className="inline-block cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl transition-colors font-medium">
              Foto auswählen
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col items-center gap-4">
        <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Oder</span>
        <label className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium transition-colors border-b border-violet-400/30 pb-1">
          Bestehendes Foto hochladen
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
};
