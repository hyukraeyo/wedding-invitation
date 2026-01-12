export function smoothScrollTo(
    element: HTMLElement,
    target: number,
    duration: number = 500
): Promise<void> {
    const start = element.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    return new Promise((resolve) => {
        const animateScroll = (currentTime: number) => {
            const timeElapsed = currentTime - startTime;

            if (timeElapsed < duration) {
                // Ease Out Quint: 1 - pow(1 - t, 5)
                // This provides a very quick customized start and a long slow settle,
                // typical of iOS/Native app scrolling.
                const progress = timeElapsed / duration;
                const ease = 1 - Math.pow(1 - progress, 5);

                element.scrollTop = start + change * ease;
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = target;
                resolve();
            }
        };

        requestAnimationFrame(animateScroll);
    });
}

export function getScrollParent(node: HTMLElement | null): HTMLElement | null {
    if (!node) return null;

    if (node.scrollHeight > node.clientHeight) {
        const overflowY = window.getComputedStyle(node).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return node;
        }
    }

    return getScrollParent(node.parentElement);
}
