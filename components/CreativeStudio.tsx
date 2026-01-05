import React, { useState } from 'react';
import { Video, Image as ImageIcon, Loader2, Sparkles, Upload, Key } from 'lucide-react';
import { generateVeoVideo, editImageWithGemini } from '../services/geminiService';

export const CreativeStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'video' | 'image'>('video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Helpers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeySelection = async () => {
      if (window.aistudio) {
          try {
              await window.aistudio.openSelectKey();
          } catch (e) {
              setError("Failed to open key selector.");
          }
      } else {
          setError("AI Studio environment not detected.");
      }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt && !videoSourceImage) {
        setError("Please provide a prompt or an image.");
        return;
    }
    setLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
        // Strip base64 header for API
        const imageBytes = videoSourceImage ? videoSourceImage.split(',')[1] : undefined;
        
        const url = await generateVeoVideo(videoPrompt, aspectRatio, imageBytes);
        if (url) {
            setGeneratedVideoUrl(url);
        } else {
            setError("Generation completed but returned no video.");
        }
    } catch (e: any) {
        if (e.message === "KEY_REQUIRED") {
            setError("Veo requires a paid API Key. Please select one below.");
        } else {
            setError("Failed to generate video. " + e.message);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!sourceImage || !imagePrompt) {
        setError("Please upload an image and provide a prompt.");
        return;
    }
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        const imageBytes = sourceImage.split(',')[1];
        const result = await editImageWithGemini(imageBytes, imagePrompt);
        setGeneratedImage(result);
    } catch (e) {
        setError("Failed to edit image.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="font-serif text-3xl text-ink">Creative Studio</h2>
           <p className="text-sm font-sans text-ink-light">Generate films and magic visuals.</p>
        </div>
        
        {/* Toggle */}
        <div className="flex bg-white rounded-full p-1 border border-ink/10 shadow-sm">
            <button
                onClick={() => setActiveTool('video')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${activeTool === 'video' ? 'bg-ink text-paper' : 'text-ink-light hover:bg-ink/5'}`}
            >
                <Video size={16} /> Dream Cinema
            </button>
            <button
                onClick={() => setActiveTool('image')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${activeTool === 'image' ? 'bg-ink text-paper' : 'text-ink-light hover:bg-ink/5'}`}
            >
                <ImageIcon size={16} /> Magic Canvas
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-ink/5 p-6 md:p-8">
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex justify-between items-center">
                <span>{error}</span>
                {error.includes("Key") && (
                     <button onClick={handleKeySelection} className="flex items-center gap-1 font-bold underline">
                        <Key size={14} /> Select Key
                     </button>
                )}
            </div>
        )}

        {/* --- VIDEO TOOL --- */}
        {activeTool === 'video' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Prompt</label>
                            <textarea 
                                value={videoPrompt}
                                onChange={(e) => setVideoPrompt(e.target.value)}
                                placeholder="A cinematic drone shot of a futuristic city..."
                                className="w-full bg-[#F7F5F0] border-none rounded-xl p-4 text-ink font-serif h-32 focus:ring-1 focus:ring-accent resize-none placeholder:text-ink/30"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Source Image (Optional)</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-[#F7F5F0] hover:bg-ink/5 transition-colors border border-dashed border-ink/20 rounded-xl w-32 h-32 flex flex-col items-center justify-center text-ink-light">
                                    {videoSourceImage ? (
                                        <img src={videoSourceImage} alt="Source" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="mb-2" />
                                            <span className="text-[10px] uppercase">Upload</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setVideoSourceImage)} />
                                </label>
                                <div className="text-xs text-ink-light/70 max-w-[200px]">
                                    Upload an image to animate it. Veo will bring it to life based on your prompt.
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Aspect Ratio</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setAspectRatio('16:9')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${aspectRatio === '16:9' ? 'bg-ink text-paper border-ink' : 'border-ink/10 text-ink-light'}`}
                                >
                                    Landscape (16:9)
                                </button>
                                <button 
                                    onClick={() => setAspectRatio('9:16')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${aspectRatio === '9:16' ? 'bg-ink text-paper border-ink' : 'border-ink/10 text-ink-light'}`}
                                >
                                    Portrait (9:16)
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateVideo}
                            disabled={loading}
                            className="w-full bg-ink text-paper py-3 rounded-xl font-sans text-sm font-medium hover:bg-ink/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Generate Video
                        </button>
                        <p className="text-[10px] text-center text-ink-light">Powered by Veo. Generation takes 1-2 minutes.</p>
                    </div>

                    <div className="bg-black/5 rounded-2xl flex items-center justify-center min-h-[300px] overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                <Loader2 className="animate-spin text-ink mb-2" size={32} />
                                <p className="font-serif text-ink animate-pulse">Dreaming up your video...</p>
                            </div>
                        )}
                        {generatedVideoUrl ? (
                            <video controls src={generatedVideoUrl} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center text-ink-light/40">
                                <Video size={48} className="mx-auto mb-2 opacity-50" />
                                <p className="font-serif">Output will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- IMAGE TOOL --- */}
        {activeTool === 'image' && (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Original Image (Required)</label>
                            <label className="cursor-pointer bg-[#F7F5F0] hover:bg-ink/5 transition-colors border border-dashed border-ink/20 rounded-xl w-full h-48 flex flex-col items-center justify-center text-ink-light relative overflow-hidden group">
                                {sourceImage ? (
                                    <img src={sourceImage} alt="Source" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <>
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-xs uppercase">Click to Upload</span>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setSourceImage)} />
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Edit Instruction</label>
                            <input 
                                type="text"
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder="e.g., Add a retro filter, remove the background..."
                                className="w-full bg-[#F7F5F0] border-none rounded-xl px-4 py-3 text-ink font-serif focus:ring-1 focus:ring-accent placeholder:text-ink/30"
                            />
                        </div>

                        <button 
                            onClick={handleEditImage}
                            disabled={loading || !sourceImage}
                            className="w-full bg-ink text-paper py-3 rounded-xl font-sans text-sm font-medium hover:bg-ink/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Transform Image
                        </button>
                        <p className="text-[10px] text-center text-ink-light">Powered by Gemini 2.5 Flash Image.</p>
                    </div>

                    <div className="bg-black/5 rounded-2xl flex items-center justify-center min-h-[300px] overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                <Loader2 className="animate-spin text-ink mb-2" size={32} />
                                <p className="font-serif text-ink animate-pulse">Applying magic...</p>
                            </div>
                        )}
                        {generatedImage ? (
                            <div className="relative w-full h-full p-2">
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain rounded-lg" />
                                <a href={generatedImage} download="odyssey-edit.png" className="absolute bottom-4 right-4 bg-white text-ink px-3 py-1 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform">Download</a>
                            </div>
                        ) : (
                            <div className="text-center text-ink-light/40">
                                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                <p className="font-serif">Result will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};