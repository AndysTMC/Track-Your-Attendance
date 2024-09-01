import { useEffect } from 'react';

export default function useEveryMinute(action: () => void) {
    useEffect(() => {
        const now = new Date();
        const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 1000;
        const timeoutId = setTimeout(() => {
            action();
            const intervalId = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    action();
                }
            }, 60000);
            return () => clearInterval(intervalId);
        }, delay);
        return () => clearTimeout(timeoutId);
    }, [action]);
}