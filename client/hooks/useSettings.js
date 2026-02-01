import { useQuery } from "@tanstack/react-query";

export function useSettings() {
    return useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) {
                throw new Error("Failed to fetch settings");
            }
            return res.json();
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
}
