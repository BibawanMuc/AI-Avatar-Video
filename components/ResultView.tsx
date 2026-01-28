import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface ResultViewProps {
    videoUrl: string;
    onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ videoUrl, onRestart }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-700 w-full">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Video Player */}
                <div className="space-y-6 w-full">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-4xl font-black italic tracking-tighter">DEIN AVATAR LEBT.</h2>
                        <p className="text-zinc-400">Hier ist dein personalisiertes Video.</p>
                    </div>

                    <div className="relative group w-full rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            loop
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Right: QR Code & Actions */}
                <div className="flex flex-col items-center justify-center space-y-8 bg-zinc-900/30 p-12 rounded-3xl border border-zinc-800/50">

                    <div className="bg-white p-4 rounded-2xl shadow-xl">
                        <QRCodeCanvas
                            value={videoUrl}
                            size={200}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                            Scannen zum Downloaden
                        </h3>
                        <p className="text-sm text-zinc-500 max-w-xs">
                            Nutze deine Kamera, um das Video direkt auf dein Smartphone zu laden.
                        </p>
                    </div>

                </div>

                <div className="flex flex-col w-full space-y-3">
                    <button
                        onClick={async () => {
                            try {
                                const response = await fetch(videoUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = `avatar-video-${Date.now()}.mp4`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                            } catch (e) {
                                console.error("Direct download failed, opening in new tab", e);
                                window.open(videoUrl, '_blank');
                            }
                        }}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-violet-500/20"
                    >
                        Video Herunterladen ⬇️
                    </button>

                    <button
                        onClick={onRestart}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all border border-zinc-700"
                    >
                        Neuer Avatar ↻
                    </button>
                </div>
            </div>

        </div>
    );
};
