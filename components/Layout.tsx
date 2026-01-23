
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-12 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-500/20">PX</div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            PX AI-Avatar
          </h1>
        </div>
        <div className="hidden md:block text-xs uppercase tracking-widest text-zinc-500 font-semibold">
          Powered by Gemini 2.5
        </div>
      </header>
      <main className="w-full max-w-4xl flex-1 flex flex-col">
        {children}
      </main>
      <footer className="mt-12 text-zinc-600 text-sm">
        &copy; {new Date().getFullYear()} PX AI-Avatar. High-end Portrait Engine.
      </footer>
    </div>
  );
};
