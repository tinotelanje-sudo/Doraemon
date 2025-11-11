
import React from 'react';
import type { Scene } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface SceneCardProps {
    scene: Scene;
    onGenerate: (sceneId: number) => void;
}

const GeneratingOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-10 rounded-lg">
        <LoadingSpinner />
        <p className="text-lg font-semibold text-blue-300 mt-4">Generating Video...</p>
        <p className="text-sm text-gray-400 mt-2">This may take a few minutes. Please be patient.</p>
    </div>
);


const ErrorDisplay: React.FC<{ message: string, onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-sm">
        <p className="font-semibold">Generation Failed</p>
        <p className="mt-1">{message}</p>
        <button
            onClick={onRetry}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-md transition-colors"
        >
            Retry
        </button>
    </div>
);

const GenerateButton: React.FC<{ disabled: boolean; onClick: () => void }> = ({ disabled, onClick }) => (
     <button
        onClick={onClick}
        disabled={disabled}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    >
        Generate Scene Video
    </button>
);


export const SceneCard: React.FC<SceneCardProps> = ({ scene, onGenerate }) => {
    const { id, title, location, visuals, dialogue, status, videoUrl, error } = scene;
    const isGenerating = status === 'generating';

    const handleGenerateClick = () => {
        if (!isGenerating) {
            onGenerate(id);
        }
    };

    return (
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:border-blue-500 hover:shadow-2xl">
            {isGenerating && <GeneratingOverlay />}
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200 mb-2">{title}</h2>
                <p className="text-sm font-medium text-gray-400 mb-4">{location}</p>
                
                <div className="space-y-3 text-gray-300 text-sm">
                    <div>
                        <strong className="text-teal-300">Visuals:</strong>
                        <p>{visuals}</p>
                    </div>
                     <div>
                        <strong className="text-teal-300">Dialogue:</strong>
                        <p className="whitespace-pre-wrap font-mono text-xs">{dialogue}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {videoUrl && status === 'success' && (
                    <div className="mb-4">
                        <video controls className="w-full rounded-lg" src={videoUrl}>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
                
                {status !== 'generating' && (
                     <GenerateButton disabled={isGenerating} onClick={handleGenerateClick} />
                )}

                {status === 'error' && error && (
                    <ErrorDisplay message={error} onRetry={handleGenerateClick} />
                )}
            </div>
        </div>
    );
};
