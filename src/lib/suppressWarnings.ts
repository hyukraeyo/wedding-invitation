'use client';

/**
 * 특정 React 경고 메시지를 억제합니다.
 * 
 * React 18을 사용하지만 @types/react가 React 19 타입을 포함하고 있어서
 * 외부 라이브러리에서 발생하는 경고를 숨깁니다.
 */
export function suppressReact19Warnings() {
    if (typeof window === 'undefined') return;

    const originalWarn = console.warn;
    const originalError = console.error;

    const suppressedMessages = [
        'Accessing element.ref was removed in React 19',
        'ref is now a regular prop',
    ];

    const shouldSuppress = (args: unknown[]): boolean => {
        return args.some(arg =>
            typeof arg === 'string' &&
            suppressedMessages.some(msg => arg.includes(msg))
        );
    };

    console.warn = (...args: unknown[]) => {
        if (!shouldSuppress(args)) {
            originalWarn.apply(console, args);
        }
    };

    console.error = (...args: unknown[]) => {
        if (!shouldSuppress(args)) {
            originalError.apply(console, args);
        }
    };
}
