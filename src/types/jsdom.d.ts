declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string, options?: JSDOMOptions);
    window: DOMWindow;
    serialize(): string;
  }

  interface JSDOMOptions {
    url?: string;
    referrer?: string;
    contentType?: string;
    includeNodeLocations?: boolean;
    runScripts?: 'dangerously' | 'outside-only';
    resources?: 'usable' | ResourceLoader;
    virtualConsole?: VirtualConsole;
    cookieJar?: CookieJar;
    pretendToBeVisual?: boolean;
    beforeParse?: (window: DOMWindow) => void;
  }

  interface DOMWindow extends Window {
    close(): void;
    document: Document;
  }

  interface ResourceLoader {
    fetch(url: string, options: FetchOptions): Promise<Buffer | null>;
  }

  interface FetchOptions {
    element?: HTMLElement;
    cookieJar?: CookieJar;
    referrer?: string;
    accept?: string;
  }

  interface VirtualConsole {
    sendTo(console: Console): VirtualConsole;
  }

  interface CookieJar {
    setCookie(cookie: string, url: string): void;
    getCookies(url: string): string[];
  }
}
