"use client";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Volume2, Download, Play, Pause, RotateCcw, Mic2, Sparkles, ArrowLeft, Music } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

interface VoiceProfile {
  id: number;
  name: string;
  accent: string;
  gender: "male" | "female" | "non-binary";
  voiceType: string;
  avatarUrl: string;
  description: string;
  sampleAudioUrl?: string;
}

// Simple avatar placeholder generator
const getAvatarPlaceholder = (id: number) => {
  const colors = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-red-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-yellow-600",
    "from-indigo-500 to-blue-600",
    "from-cyan-500 to-blue-600",
  ];
  return colors[id % colors.length];
};

export default function Generator() {
  const [text, setText] = useState("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playingSampleId, setPlayingSampleId] = useState<number | null>(null);
  const [playingMainSample, setPlayingMainSample] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sampleAudioRef = useRef<HTMLAudioElement>(null);
  const mainSampleAudioRef = useRef<HTMLAudioElement>(null);

  // Fetch voice profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/trpc/voice.getAllProfiles");
        if (!response.ok) throw new Error("Failed to fetch profiles");
        const data = await response.json();
        setVoiceProfiles(data.result?.data || []);
        if (data.result?.data?.length > 0) {
          setSelectedVoiceId(data.result.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load voice profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    if (!selectedVoiceId) {
      toast.error("Please select a voice");
      return;
    }

    if (generationCount >= 2) {
      toast.error("You have reached the 2-generation limit for this session");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/trpc/voice.generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: { text, voiceProfileId: selectedVoiceId },
          meta: { values: ["undefined"] },
        }),
      });

      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      
      if (data.result?.data?.audioUrl) {
        setAudioUrl(data.result.data.audioUrl);
        setGenerationCount(prev => prev + 1);
        toast.success("Voice generated successfully!");
      } else {
        throw new Error("No audio URL returned");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate voice");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dalsi-voice-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Audio downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download audio");
    }
  };

  const handlePlaySample = (sampleUrl: string | undefined, voiceId: number) => {
    if (!sampleUrl) {
      toast.info("Sample not available for this voice yet");
      return;
    }

    if (playingSampleId === voiceId && sampleAudioRef.current) {
      if (sampleAudioRef.current.paused) {
        sampleAudioRef.current.play();
      } else {
        sampleAudioRef.current.pause();
      }
    } else {
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
      }
      setPlayingSampleId(voiceId);
      sampleAudioRef.current = new Audio(sampleUrl);
      sampleAudioRef.current.onended = () => setPlayingSampleId(null);
      sampleAudioRef.current.play().catch(err => {
        console.error("Error playing sample:", err);
        toast.error("Failed to play sample");
      });
    }
  };

  const handlePlayMainSample = (sampleUrl: string | undefined) => {
    if (!sampleUrl) {
      toast.info("Sample not available for this voice yet");
      return;
    }

    if (mainSampleAudioRef.current) {
      if (mainSampleAudioRef.current.paused) {
        mainSampleAudioRef.current.play();
        setPlayingMainSample(true);
      } else {
        mainSampleAudioRef.current.pause();
        setPlayingMainSample(false);
      }
    } else {
      mainSampleAudioRef.current = new Audio(sampleUrl);
      mainSampleAudioRef.current.onended = () => setPlayingMainSample(false);
      mainSampleAudioRef.current.onplay = () => setPlayingMainSample(true);
      mainSampleAudioRef.current.onpause = () => setPlayingMainSample(false);
      mainSampleAudioRef.current.play().catch(err => {
        console.error("Error playing sample:", err);
        toast.error("Failed to play sample");
      });
    }
  };

  const selectedVoice = voiceProfiles.find(v => v.id === selectedVoiceId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">Loading voice profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Dalsi Voice
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-purple-300">Generations:</span>
              <span className="ml-2 font-bold text-purple-400">{generationCount}/2</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Create Your Voice
            </h1>
            <p className="text-purple-200 text-lg">
              Select a voice, enter your text, and generate professional audio in seconds
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Voice Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Voices
                </h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {voiceProfiles.map((profile) => {
                    const isSelected = selectedVoiceId === profile.id;
                    const gradientClass = getAvatarPlaceholder(profile.id);
                    const isSamplePlaying = playingSampleId === profile.id;
                    return (
                      <div
                        key={profile.id}
                        className={`rounded-lg transition-all duration-200 overflow-hidden ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20"
                            : "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 hover:border-purple-500/30"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedVoiceId(profile.id)}
                          className="w-full text-left p-3 flex items-center gap-3"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex-shrink-0 flex items-center justify-center text-sm font-bold`}>
                            {profile.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{profile.name}</p>
                            <p className="text-xs text-purple-300/70 truncate">{profile.accent}</p>
                          </div>
                        </button>
                        
                        {/* Voice Sample Player */}
                        {isSelected && (
                          <div className="px-3 pb-3 border-t border-purple-400/20">
                            <button
                              onClick={() => handlePlaySample(profile.sampleAudioUrl, profile.id)}
                              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition text-sm font-medium text-purple-200"
                            >
                              {isSamplePlaying ? (
                                <>
                                  <Pause className="w-4 h-4" />
                                  Pause Sample
                                </>
                              ) : (
                                <>
                                  <Music className="w-4 h-4" />
                                  Play Sample
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Generator */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Selected Voice Info */}
                {selectedVoice && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getAvatarPlaceholder(selectedVoice.id)} flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                        {selectedVoice.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{selectedVoice.name}</h3>
                        <p className="text-purple-200 text-sm mb-3">{selectedVoice.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs font-medium">
                            {selectedVoice.accent}
                          </span>
                          <span className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-xs font-medium">
                            {selectedVoice.gender}
                          </span>
                          <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-medium">
                            {selectedVoice.voiceType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Voice Sample Preview in Main Card */}
                    {selectedVoice.sampleAudioUrl && (
                      <div className="border-t border-purple-400/20 pt-4">
                        <p className="text-sm font-semibold text-purple-300 mb-3">Voice Sample Preview</p>
                        <button
                          onClick={() => handlePlayMainSample(selectedVoice.sampleAudioUrl)}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 rounded-lg transition font-medium text-purple-200 border border-purple-400/30"
                        >
                          {playingMainSample ? (
                            <>
                              <Pause className="w-5 h-5" />
                              Pause Sample
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              Play Sample
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Input */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                  <label className="block text-sm font-semibold mb-3 text-purple-200">
                    Text to Convert
                  </label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the text you want to convert to speech..."
                    className="w-full h-40 bg-slate-900/50 border-slate-600/50 text-white placeholder-slate-400 rounded-lg resize-none focus:border-purple-400/50 focus:ring-purple-400/20"
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-purple-300/70">
                      {text.length} characters
                    </span>
                    <span className="text-xs text-purple-300/70">
                      Max 5000 characters
                    </span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || generationCount >= 2}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Generate Voice
                    </>
                  )}
                </button>

                {/* Audio Player */}
                {audioUrl && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      Generated Audio
                    </h3>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      controls
                      className="w-full mb-4 rounded-lg"
                    />
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Audio
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
