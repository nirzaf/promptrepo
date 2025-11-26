"use client";

import { useEffect, useState } from 'react';
import { getFingerprint } from '@/lib/fingerprint';

/**
 * React hook to get the browser fingerprint for guest users
 * Returns null while loading, then the fingerprint string
 */
export function useFingerprint() {
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadFingerprint() {
            try {
                const fp = await getFingerprint();
                if (mounted) {
                    setFingerprint(fp);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to load fingerprint:', error);
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        loadFingerprint();

        return () => {
            mounted = false;
        };
    }, []);

    return { fingerprint, isLoading };
}
