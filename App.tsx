
import React, { useState, useEffect, useCallback } from 'react';
import { SceneCard } from './components/SceneCard';
import { ApiKeySelector } from './components/ApiKeySelector';
import { generateSceneVideo } from './services/geminiService';
import type { Scene, SceneStatus, AspectRatio } from './types';

const initialScenes: Scene[] = [
    {
        id: 1,
        title: "Babak 1: Dunia yang Terbalik",
        location: "Bilik Nobita → Dunia Alternatif",
        visuals: "Langit berkilau, bangunan terapung, sekolah sihir. Telefon jadi kristal, bas jadi naga terbang.",
        dialogue: `Nobita: “Doraemon, aku harap dunia ini penuh sihir… bukan teknologi yang menyusahkan.”\nDoraemon: “Baiklah, mari kita ubah realiti dengan ‘Penukar Dimensi’!”`,
        action: "Dunia berubah sepenuhnya dari teknologi modern menjadi dunia sihir fantasi.",
        status: 'idle',
        videoUrl: null,
        error: null,
    },
    {
        id: 2,
        title: "Babak 2: Akademi Sihir",
        location: "Sekolah Sihir",
        visuals: "Pelajar terbang di atas sapu, latihan sihir dengan tongkat sihir, makhluk pelindung mitos (Phoenix, Elf, Naga Air) berkeliaran.",
        dialogue: `Gian: “Aku nak jadi ahli sihir paling kuat!”\nShizuka: “Sihir bukan untuk berlagak, tapi untuk membantu.”`,
        action: "Nobita dan teman-temannya belajar sihir asas di akademi sihir, bertemu dengan makhluk penjaga yang agung.",
        status: 'idle',
        videoUrl: null,
        error: null,
    },
    {
        id: 3,
        title: "Babak 3: Ancaman Dunia Bawah",
        location: "Hutan Larangan → Gerbang Dunia Bawah",
        visuals: "Hutan diselimuti kabus gelap, makhluk bayangan dengan mata merah menyala muncul, portal berapi yang berdenyut terbuka.",
        dialogue: `Suneo: “Apa benda tu… ia bergerak dalam bayang!”\nDoraemon: “Itu makhluk dari dunia bawah. Kita perlu tutup portal sebelum terlambat!”`,
        action: "Makhluk ghaib yang menakutkan menyerang kampung sihir saat portal ke dunia bawah mulai terbuka.",
        status: 'idle',
        videoUrl: null,
        error: null,
    },
    {
        id: 4,
        title: "Babak 4: Pertarungan Terakhir",
        location: "Gerbang Dunia Bawah",
        visuals: "Ledakan sihir berwarna-warni, perisai cahaya pelindung yang berkilauan, air mata jatuh dari mata Doraemon.",
        dialogue: `Nobita: “Kita tak boleh lari. Kita mesti lawan bersama!”\nDoraemon: “Gunakan sihir hati – gabungkan kekuatan persahabatan!”`,
        action: "Nobita dan teman-temannya menggabungkan kekuatan sihir mereka, menciptakan perisai pelindung yang kuat. Doraemon dengan berat hati mengorbankan alat terakhirnya untuk menutup portal selamanya.",
        status: 'idle',
        videoUrl: null,
        error: null,
    },
    {
        id: 5,
        title: "Babak 5: Kembali dan Kenangan",
        location: "Dunia asal",
        visuals: "Bilik Nobita yang familiar, cahaya matahari pagi yang hangat masuk melalui jendela, semua teman tersenyum dengan rasa lega dan kedewasaan baru.",
        dialogue: `Nobita: “Dunia sihir itu… akan kekal dalam hati kita.”\nDoraemon: “Kadang-kadang, keajaiban datang dari dalam diri.”`,
        action: "Mereka kembali ke dunia asal, lebih matang dan menghargai kehidupan normal mereka, membawa kenangan petualangan sihir mereka.",
        status: 'idle',
        videoUrl: null,
        error: null,
    },
];

const App: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [scenes, setScenes] = useState<Scene[]>(initialScenes);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

    const checkApiKey = useCallback(async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        } else {
            console.warn('aistudio API not found. Running in local mode.');
            // For local development, assume key is available
            setApiKeySelected(true);
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    const handleGenerateVideo = async (sceneId: number) => {
        const sceneIndex = scenes.findIndex(s => s.id === sceneId);
        if (sceneIndex === -1) return;

        const updateSceneStatus = (id: number, status: SceneStatus, data: Partial<Scene> = {}) => {
            setScenes(prevScenes =>
                prevScenes.map(s => (s.id === id ? { ...s, status, ...data } : s))
            );
        };
        
        updateSceneStatus(sceneId, 'generating', { error: null, videoUrl: null });

        try {
            const currentScene = scenes[sceneIndex];
            const prompt = `Animated film scene in the style of Doraemon. ${currentScene.visuals}. ${currentScene.action}`;
            
            const videoUrl = await generateSceneVideo(prompt, aspectRatio);
            updateSceneStatus(sceneId, 'success', { videoUrl });
        } catch (error) {
            console.error('Video generation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            updateSceneStatus(sceneId, 'error', { error: errorMessage });

            if (errorMessage.includes("Requested entity was not found.")) {
                setApiKeySelected(false);
            }
        }
    };

    if (!apiKeySelected) {
        return <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        Doraemon Animated Film Generator
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                        Bring Doraemon's magical adventure to life! Generate a video for each scene using Google's Veo model.
                    </p>
                </header>

                <div className="mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4 sticky top-4 z-10">
                    <label htmlFor="aspectRatio" className="font-semibold text-lg text-white">
                        Aspect Ratio:
                    </label>
                    <div className="flex gap-2">
                        {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                                    aspectRatio === ratio
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {ratio} {ratio === '16:9' ? '(Landscape)' : '(Portrait)'}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {scenes.map(scene => (
                        <SceneCard
                            key={scene.id}
                            scene={scene}
                            onGenerate={handleGenerateVideo}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
};

export default App;
