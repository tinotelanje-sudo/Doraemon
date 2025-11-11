
import React, { useState } from 'react';

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            setIsLoading(true);
            try {
                await window.aistudio.openSelectKey();
                // Assume success and let the parent component re-check
                onKeySelected();
            } catch (error) {
                console.error("Error opening API key selection:", error);
                // Handle error if necessary, e.g., show a message
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('AISTUDIO_API_KEY environment variable not found. Please set it in your environment.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="max-w-md w-full p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">API Key Required</h2>
                <p className="text-gray-400 mb-6">
                    This application uses the Veo video generation model, which requires you to select an API key.
                </p>
                <p className="text-gray-400 mb-8 text-sm">
                    Please note that using this model may incur costs. For more information, please review the{' '}
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        billing documentation
                    </a>.
                </p>
                <button
                    onClick={handleSelectKey}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-wait"
                >
                    {isLoading ? 'Opening...' : 'Select Your API Key'}
                </button>
            </div>
        </div>
    );
};
