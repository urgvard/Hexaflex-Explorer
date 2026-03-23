
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Volume2, Music, CloudRain, Waves, Wind, ChevronDown, Upload, AlertCircle } from 'lucide-react';
import { Theme } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientPlayerProps {
    theme: Theme;
    label: string;
    nextLabel: string;
}

type SoundConfig = {
    id: string;
    name: string;
    type: 'file';
    icon: React.ElementType;
    url: string;
};

const SOUNDSCAPES = [
    { 
        id: 'uploaded',
        category: 'Atmospheres',
        tracks: [
            { 
                id: 'clip-1', 
                name: 'Nature Stream', 
                type: 'file', 
                icon: Waves,
                url: 'video_clip_1.mp4'
            },
            { 
                id: 'clip-2', 
                name: 'Ambient Calm', 
                type: 'file', 
                icon: Wind,
                url: 'video_clip_2.mp4'
            },
            { 
                id: 'clip-3', 
                name: 'Soft Rain', 
                type: 'file', 
                icon: CloudRain,
                url: 'video_clip_3.mp4'
            },
            { 
                id: 'clip-4', 
                name: 'Evening Peace', 
                type: 'file', 
                icon: Music,
                url: 'video_clip_4.mp4'
            }
        ] as SoundConfig[]
    }
];

// Singleton Audio Engine to share state
class AudioEngine {
    private static instance: AudioEngine;
    
    currentAudioElement: HTMLAudioElement | null = null;
    currentVolume: number = 0.4;
    currentTrackId: string | null = null;
    isPlaying: boolean = false;
    playbackError: string | null = null;
    
    private listeners: Set<() => void> = new Set();

    private constructor() {}

    static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    setVolume(vol: number) {
        this.currentVolume = vol;
        if (this.currentAudioElement) {
            this.currentAudioElement.volume = vol;
        }
        this.notify();
    }

    stop() {
        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
            this.currentAudioElement.src = "";
            this.currentAudioElement.load();
            this.currentAudioElement = null;
        }
        this.isPlaying = false;
        this.playbackError = null;
        this.notify();
    }

    play(track: SoundConfig) {
        // If clicking the same track that is already playing, toggle stop
        if (this.isPlaying && this.currentTrackId === track.id) {
            this.stop();
            return;
        }

        this.stop(); // Stop previous
        this.currentTrackId = track.id;
        this.playbackError = null;

        const audio = new Audio();
        // Use direct path, and try to resolve locally
        audio.src = track.url;
        audio.loop = true;
        audio.volume = this.currentVolume;
        
        audio.addEventListener('error', (e) => {
            console.error("Audio Load Error:", e);
            const error = (e.target as HTMLAudioElement).error;
            let msg = "Load failed.";
            if (error) {
                switch (error.code) {
                    case error.MEDIA_ERR_ABORTED: msg = "Playback aborted."; break;
                    case error.MEDIA_ERR_NETWORK: msg = "Network error."; break;
                    case error.MEDIA_ERR_DECODE: msg = "Decode error."; break;
                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED: msg = "Source not supported."; break;
                }
            }
            this.playbackError = msg;
            this.isPlaying = false;
            this.notify();
        });

        audio.play()
            .then(() => {
                this.isPlaying = true;
                this.notify();
            })
            .catch(e => {
                console.error("Playback failed", e);
                this.playbackError = "Playback blocked or format error.";
                this.isPlaying = false;
                this.notify();
            });

        this.currentAudioElement = audio;
        this.notify();
    }
}

const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ theme, label }) => {
    const engine = AudioEngine.getInstance();
    
    const [customTracks, setCustomTracks] = useState<SoundConfig[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isPlaying, setIsPlaying] = useState(engine.isPlaying);
    const [volume, setVolume] = useState(engine.currentVolume);
    const [playbackError, setPlaybackError] = useState(engine.playbackError);
    
    const [currentTrack, setCurrentTrack] = useState<SoundConfig>(() => {
        if (engine.currentTrackId) {
            for (const group of SOUNDSCAPES) {
                const found = group.tracks.find(t => t.id === engine.currentTrackId);
                if (found) return found;
            }
        }
        return SOUNDSCAPES[0].tracks[0];
    });
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const displaySoundscapes = useMemo(() => {
        // Crucial: Use array spreading to maintain reference to Icons
        // Serialization (JSON.stringify) destroys component references
        const base = [...SOUNDSCAPES];
        if (customTracks.length > 0) {
            base.push({
                id: 'custom',
                category: 'My Uploads',
                tracks: customTracks
            });
        }
        return base;
    }, [customTracks]);

    useEffect(() => {
        const unsubscribe = engine.subscribe(() => {
            setIsPlaying(engine.isPlaying);
            setVolume(engine.currentVolume);
            setPlaybackError(engine.playbackError);
            
            if (engine.currentTrackId && engine.currentTrackId !== currentTrack.id) {
                let found: SoundConfig | undefined;
                for (const group of SOUNDSCAPES) {
                    found = group.tracks.find(t => t.id === engine.currentTrackId);
                    if (found) break;
                }
                if (!found) {
                    found = customTracks.find(t => t.id === engine.currentTrackId);
                }
                if (found) {
                    setCurrentTrack(found);
                }
            }
        });
        return unsubscribe;
    }, [currentTrack.id, customTracks]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const playTrack = (track: SoundConfig) => {
        if (track.id !== currentTrack.id) {
            setCurrentTrack(track);
        }
        engine.play(track);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            engine.stop();
        } else {
            engine.play(currentTrack);
        }
    };

    const handleVolumeChange = (newVol: number) => {
        setVolume(newVol);
        engine.setVolume(newVol);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack: SoundConfig = {
                id: `custom-${Date.now()}`,
                name: file.name.substring(0, 18),
                type: 'file',
                url: url,
                icon: Music
            };
            
            setCustomTracks(prev => [...prev, newTrack]);
            playTrack(newTrack);
        }
        if (event.target) event.target.value = '';
    };

    const btnClass = theme === 'dark' ? 'hover:bg-white/10 text-white/70' : 'hover:bg-black/5 text-slate-600';
    const activeClass = isPlaying ? 'text-emerald-500' : '';
    const menuBg = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800';

    return (
        <div className="relative" ref={menuRef}>
            <div className={`flex items-center gap-1 pl-1 pr-3 py-1 rounded-full border transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-slate-200 shadow-sm'}`}>
                 <button 
                    onClick={togglePlayPause}
                    className={`p-2 rounded-full transition-colors ${btnClass} ${activeClass}`}
                    title={isPlaying ? "Stop" : "Play"}
                >
                    {isPlaying ? <Volume2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                </button>
                
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-2 py-1.5 rounded-md transition-colors ${btnClass}`}
                >
                    <span className="max-w-[80px] truncate">{currentTrack.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute top-full right-0 mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden z-[110] ${menuBg}`}
                    >
                        {playbackError && (
                            <div className="p-3 bg-red-500/10 flex items-center gap-2 border-b border-red-500/20">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <span className="text-[10px] font-bold text-red-500 uppercase leading-tight">{playbackError}</span>
                            </div>
                        )}

                        <div className="p-3 border-b border-current/10">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold uppercase opacity-50">Volume</span>
                                <span className="text-xs opacity-50">{Math.round(volume * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={volume} 
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="w-full h-1 rounded-full appearance-none cursor-pointer bg-current opacity-20 accent-emerald-500"
                            />
                        </div>

                        <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {displaySoundscapes.map((group) => (
                                <div key={group.id} className="mb-2 last:mb-0">
                                    <div className="px-3 py-1 text-xs font-bold uppercase opacity-40 tracking-wider">
                                        {group.category}
                                    </div>
                                    {group.tracks.map((track) => {
                                        const Icon = track.icon;
                                        const isTrackPlaying = engine.currentTrackId === track.id && isPlaying;
                                        const isSelected = currentTrack.id === track.id;
                                        
                                        return (
                                            <button
                                                key={track.id}
                                                onClick={() => playTrack(track)}
                                                className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                                                    isSelected 
                                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                                    : 'hover:bg-current/5 opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <Icon className="w-3 h-3" />
                                                <span className="text-sm font-medium flex-1 truncate">{track.name}</span>
                                                {isTrackPlaying && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="p-2 border-t border-current/10">
                            <input 
                                type="file" 
                                accept="audio/mp3,audio/mpeg,audio/wav,video/mp4" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden" 
                            />
                            <button 
                                onClick={handleUploadClick}
                                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >
                                <Upload className="w-3 h-3" />
                                Upload Audio
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AmbientPlayer;
