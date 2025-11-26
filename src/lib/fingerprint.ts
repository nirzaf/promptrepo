import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Initialize FingerprintJS agent
 * This should be called once and the promise can be reused
 */
export function initFingerprint() {
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }
    return fpPromise;
}

/**
 * Get the visitor's fingerprint ID
 * Returns a unique identifier based on browser characteristics
 */
export async function getFingerprint(): Promise<string> {
    try {
        const fp = await initFingerprint();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Error getting fingerprint:', error);
        // Fallback to a random ID if fingerprinting fails
        return `fallback-${Math.random().toString(36).substring(2, 15)}`;
    }
}
