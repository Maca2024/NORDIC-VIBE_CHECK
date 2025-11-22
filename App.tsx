import React, { useState } from 'react';
import { generateVibeCheck } from './services/geminiService';
import { VibeResponse, VibeStatus } from './types';
import { VibeLoader } from './components/VibeLoader';
import { VibeCard } from './components/VibeCard';
import { Sparkles, Snowflake, Send, Terminal } from 'lucide-react';

const SUGGESTIONS = [
  "Where's the best après-ski party?",
  "I need a fit check for the slopes.",
  "Is it too cold for a sauna selfie?",
  "Take me to the secret reindeer rave."
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<VibeStatus>(VibeStatus.IDLE);
  const [result, setResult] = useState<VibeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVibeCheck = async (promptText: string = input) => {
    if (!promptText.trim()) return;
    
    setStatus(VibeStatus.THINKING);
    setError(null);
    
    // Split timing for UX - Text first usually, but we await both for the card reveal
    // Actually, for better UX, let's just wait for both
    try {
      const data = await generateVibeCheck(promptText);
      setResult(data);
      setStatus(VibeStatus.COMPLETE);
    } catch (err) {
      setStatus(VibeStatus.ERROR);
      setError("The Aurora interfered with the signal. Try again!");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVibeCheck();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed font-sans selection:bg-ruka-green selection:text-black">
      {/* Overlay for darkness */}
      <div className="absolute inset-0 bg-ruka-dark/90 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ruka-purple/20 via-ruka-dark/80 to-ruka-dark pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto min-h-screen flex flex-col p-4 sm:p-6">
        
        {/* Header */}
        <header className="flex justify-between items-center py-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-ruka-green to-ruka-purple p-2 rounded-lg rotate-3">
                <Snowflake className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-white italic">
                    RUKA<span className="text-ruka-green">RIZZ</span>
                </h1>
                <p className="text-[10px] font-mono text-ruka-purple tracking-widest uppercase">
                    Powered by Gemini 2.5
                </p>
            </div>
          </div>
          <button className="text-xs font-mono border border-white/20 rounded-full px-3 py-1 text-white/50 hover:bg-white/10 transition">
            V 1.0
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center w-full">
          
          {status === VibeStatus.IDLE && (
            <div className="w-full space-y-8 animate-float">
              <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-ruka-snow to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  NORDIC<br/>VIBE CHECK
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                  Planning a trip to Ruka? Ask <span className="text-ruka-green font-bold">Oku</span> the Reindeer for the ultimate itinerary or get roasted by AI.
                </p>
              </div>

              {/* Input Section */}
              <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/5 group focus-within:ring-ruka-purple/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="pl-4 text-ruka-green">
                    <Terminal size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type: 'Best spot for selfies?' or 'It's cold outside...'"
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-mono text-sm sm:text-base h-14 px-4"
                  />
                  <button 
                    onClick={() => handleVibeCheck()}
                    className="bg-white text-black p-3 rounded-xl hover:bg-ruka-green hover:text-white transition-colors duration-200 shadow-lg"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>

              {/* Suggestions Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        setInput(s);
                        handleVibeCheck(s);
                    }}
                    className="text-xs sm:text-sm bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full hover:bg-ruka-purple/20 hover:border-ruka-purple/50 transition-all cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(status === VibeStatus.THINKING || status === VibeStatus.GENERATING_IMAGE) && (
             <VibeLoader status={status} />
          )}

          {status === VibeStatus.COMPLETE && result && (
            <div className="animate-in fade-in zoom-in duration-500 w-full">
                <VibeCard data={result} onReset={() => {
                    setResult(null);
                    setStatus(VibeStatus.IDLE);
                    setInput('');
                }} />
            </div>
          )}

          {status === VibeStatus.ERROR && (
             <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-md">
                <p className="text-red-400 mb-4 font-mono">{error}</p>
                <button 
                    onClick={() => setStatus(VibeStatus.IDLE)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-white px-6 py-2 rounded font-bold transition"
                >
                    TRY AGAIN
                </button>
             </div>
          )}

        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-white/20 mb-4">
                <span className="text-xs font-mono">RUKA NORDIC</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span className="text-xs font-mono">GEN Z EDITION</span>
            </div>
            <p className="text-[10px] text-white/10 max-w-xs mx-auto">
                AI generated content can be hallucinated. Don't actually try to rave with reindeer without supervision.
            </p>
        </footer>

      </div>
      
      {/* Background Ambient Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-ruka-green/10 rounded-full blur-[120px] pointer-events-none animate-pulse-fast"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-ruka-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default App;
