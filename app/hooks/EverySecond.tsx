
import { useEffect, useRef, useState } from 'react';

export default function useEverySecond(action: () => void) {
    const [active, setActive] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (active) {
            intervalRef.current = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    action();
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [action, active]);

    return { setActive };
}
