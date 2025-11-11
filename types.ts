export type SceneStatus = 'idle' | 'generating' | 'success' | 'error';
export type AspectRatio = '16:9' | '9:16';

export interface Scene {
    id: number;
    title: string;
    location: string;
    visuals: string;
    dialogue: string;
    action: string;
    status: SceneStatus;
    videoUrl: string | null;
    error: string | null;
}

// Fix: The error "Subsequent property declarations must have the same type" indicates
// a conflict with another global declaration of `window.aistudio`. Defining and using a
// named interface `AIStudio` allows TypeScript to correctly merge the declarations.
export interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

// Augment the window object with the aistudio property for TypeScript
declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}
