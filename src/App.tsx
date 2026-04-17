import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen relative bg-black text-[#0ff] flex flex-col items-center p-4 md:p-8 font-sans screen-tear uppercase selection:bg-[#f0f] selection:text-white">
       
       {/* Glitch overlays */}
       <div className="scanlines" />
       <div className="scanline-bar" />
       <div className="noise-bg" />

       {/* Main Content Wrapper */}
       <div className="z-10 w-full max-w-6xl flex flex-col gap-10">
           
           {/* Terminal Header */}
           <header className="border-b-4 border-[#f0f] pb-4 select-none">
              <h1 className="text-5xl md:text-7xl font-sans glitch-text text-white tracking-widest" data-text="SNAKE.EXE_">SNAKE.EXE_</h1>
              <div className="flex gap-4 items-center mt-2">
                 <div className="w-4 h-4 bg-[#ff0] animate-pulse" />
                 <p className="text-[#0ff] font-mono text-xs md:text-sm tracking-widest">&gt; INITIALIZING PROTOCOL 0x4A... SECURE.</p>
              </div>
           </header>

           {/* Layout Grid */}
           <main className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-10">
              
              {/* Main execution window (Snake) */}
              <div className="flex-1 flex justify-center w-full">
                 <SnakeGame />
              </div>

              {/* Sidebar Diagnostics */}
              <div className="w-full max-w-md xl:w-[400px] flex flex-col gap-10 shrink-0">
                 <MusicPlayer />

                 {/* System Status Panel */}
                 <div className="border-2 border-[#ff0] bg-black p-4 relative shadow-[-4px_4px_0_#0ff]">
                    <h3 className="text-[#ff0] font-mono text-sm tracking-widest mb-4 border-b border-[#ff0] pb-2">&gt; DIAGNOSTICS</h3>
                    
                    <ul className="text-[0.7rem] md:text-xs font-mono text-[#0ff] space-y-4">
                       <li className="flex justify-between items-center bg-[#0ff]/10 p-2">
                         <span>CPU_LOAD</span>
                         <span className="text-[#fff] glitch-text" data-text="99.9%">99.9%</span>
                       </li>
                       <li className="flex justify-between items-center bg-[#f0f]/10 p-2 text-[#f0f]">
                         <span>NET_UPLINK</span>
                         <span className="animate-pulse">[CONNECTED]</span>
                       </li>
                       <li className="flex justify-between items-center bg-black p-2 border border-[#fff]">
                         <span>HUMAN_DETECTION</span>
                         <span className="text-[#ff0] font-bold">TRUE</span>
                       </li>
                    </ul>
                    
                    <div className="mt-4 font-mono text-[0.6rem] text-gray-500 break-all h-16 overflow-hidden">
                       0x0010: FF FF FF FF FF FF FF FF<br />
                       0x0020: 00 00 A1 B2 C3 00 00 00<br />
                       0x0030: ERR_CORRUPT_SECTOR_7<br />
                       0x0040: 10 11 12 13 14 15 16 17
                    </div>
                 </div>
              </div>
           </main>
           
           <footer className="w-full text-center mt-10 border-t border-[#0ff]/50 pt-4 font-mono text-[0.6rem] text-gray-500">
               TERMINAL v4.2.1 // PROPERTY OF MEGAS CORP // DO NOT DISTRIBUTE
           </footer>
       </div>
    </div>
  );
}
