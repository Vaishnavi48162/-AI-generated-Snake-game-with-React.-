import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: '0x00FF::DECAY', artist: 'SYS_ADMIN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'SECTOR_7_CORRUPTION', artist: 'NULL_PTR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'HEX_DUMP.WAV', artist: 'DAEMON', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.error("SYS.ERR: AUTOPLAY_DENIED:", e);
            setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-black border-2 border-[#0ff] p-4 glitch-box shadow-[4px_4px_0_#f0f]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={() => nextTrack()}
      />

      <div className="border-b-2 border-dashed border-[#f0f] pb-2 mb-4 flex justify-between items-end">
         <h3 className="font-mono text-sm tracking-widest text-[#0ff]">&gt; AUDIO_SUBSYSTEM</h3>
         <span className={`text-[0.6rem] font-mono ${isPlaying ? 'text-[#ff0] animate-pulse' : 'text-[#f0f]'}`}>
            [{isPlaying ? 'ACTIVE' : 'IDLE'}]
         </span>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex gap-4 items-center">
            <span className="font-mono text-xl text-[#f0f]">
               [{String(currentTrackIndex + 1).padStart(2, '0')}]
            </span>
            <div className="flex flex-col">
               <span className="text-[#0ff] font-sans text-2xl uppercase tracking-widest break-all">
                  {currentTrack.title}
               </span>
               <span className="text-[#f0f] font-mono text-[0.6rem] tracking-widest uppercase">
                  AUTHOR: {currentTrack.artist}
               </span>
            </div>
        </div>

        {/* Raw ASCII Visualizer */}
        <div className="font-mono text-xs text-[#0ff] tracking-tighter mt-2 h-8 overflow-hidden opacity-80 break-all select-none leading-none">
          {isPlaying 
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s`}}>
                     {Array(30).fill(0).map(() => Math.random() > 0.5 ? '█' : '▒').join('')}
                  </div>
                ))
              : '------------------------------\n------------------------------\n------------------------------'}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t-2 border-[#0ff] pt-4">
         
         {/* Controls */}
         <div className="flex items-center gap-4 font-mono text-sm">
            <button onClick={prevTrack} className="hover:text-[#f0f] transition-colors cursor-pointer text-[#0ff]">
               [ {'<<'} ]
            </button>

            <button
               onClick={togglePlay}
               className="hover:text-[#ff0] transition-colors cursor-pointer text-[#0ff]"
            >
               [ {isPlaying ? '||' : '>>'} ]
            </button>

            <button onClick={nextTrack} className="hover:text-[#f0f] transition-colors cursor-pointer text-[#0ff]">
               [ {'>>|'} ]
            </button>
         </div>

         {/* Volume */}
         <div className="flex items-center gap-2 font-mono text-[0.6rem] text-[#f0f]">
            <span>VOL:</span>
            <input
               type="range"
               min="0"
               max="1"
               step="0.1"
               value={volume}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-24 appearance-none hover:bg-[#f0f] bg-black border border-[#f0f] h-2 rounded-none cursor-pointer focus:outline-none"
               style={{ 
                   accentColor: '#0ff',
               }}
            />
            <span className="w-6 text-right">{(volume * 100).toFixed(0)}%</span>
         </div>
      </div>
    </div>
  );
}
