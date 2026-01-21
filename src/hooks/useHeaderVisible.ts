import { useState, useEffect, useRef } from 'react';

export function useHeaderVisible(threshold = 10, targetId?: string) {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        let ticking = false;
        const target = targetId ? document.getElementById(targetId) : window;

        if (!target) return;

        const getScrollY = () => {
            if (targetId && target instanceof HTMLElement) {
                return target.scrollTop;
            }
            return window.scrollY;
        };

        const updateHeader = () => {
            const currentScrollY = getScrollY();

            // Always show at the top
            if (currentScrollY < 10) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                ticking = false;
                return;
            }

            // Ignore small scroll movements
            if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
                ticking = false;
                return;
            }

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        target.addEventListener('scroll', onScroll);
        return () => target.removeEventListener('scroll', onScroll);
    }, [threshold, targetId]); // Removed lastScrollY from dependencies

    return isVisible;
}
