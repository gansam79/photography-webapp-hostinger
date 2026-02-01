import { useState, useEffect } from 'react';

export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) {
                    throw new Error('Failed to fetch settings');
                }
                const data = await res.json();
                if (mounted) {
                    setSettings(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
                if (mounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchSettings();

        return () => {
            mounted = false;
        };
    }, []);

    return { settings, loading, error };
};
