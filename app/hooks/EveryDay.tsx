import { useEffect } from 'react';

export default function useEveryDay(action: () => void) {
    useEffect(() => {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);
        const extra = 1000;
        const delay = nextMidnight.getTime() - now.getTime() + extra;
        const timeoutId = setTimeout(() => {
            action();
            const intervalId = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    action();
                }
            }, 86400000);

            return () => clearInterval(intervalId);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [action]);
}
