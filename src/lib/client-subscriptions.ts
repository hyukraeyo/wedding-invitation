type Listener = () => void;

let resizeListening = false;
const resizeListeners = new Set<Listener>();

const onResize = () => {
  for (const listener of resizeListeners) {
    listener();
  }
};

export const subscribeWindowWidth = (callback: Listener) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  resizeListeners.add(callback);
  if (!resizeListening) {
    window.addEventListener('resize', onResize);
    resizeListening = true;
  }

  return () => {
    resizeListeners.delete(callback);
    if (resizeListeners.size === 0 && resizeListening) {
      window.removeEventListener('resize', onResize);
      resizeListening = false;
    }
  };
};

export const getWindowWidthSnapshot = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
};

interface MediaQueryEntry {
  mql: MediaQueryList;
  listeners: Set<Listener>;
  handleChange: () => void;
  isListening: boolean;
}

const mediaQueryMap = new Map<string, MediaQueryEntry>();

const getMediaQueryEntry = (query: string): MediaQueryEntry | null => {
  if (typeof window === 'undefined') return null;

  const existing = mediaQueryMap.get(query);
  if (existing) return existing;

  const mql = window.matchMedia(query);
  const listeners = new Set<Listener>();
  const handleChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const entry: MediaQueryEntry = {
    mql,
    listeners,
    handleChange,
    isListening: false,
  };

  mediaQueryMap.set(query, entry);
  return entry;
};

export const subscribeMediaQuery = (query: string, callback: Listener) => {
  const entry = getMediaQueryEntry(query);
  if (!entry) return () => {};

  entry.listeners.add(callback);
  if (!entry.isListening) {
    entry.mql.addEventListener('change', entry.handleChange);
    entry.isListening = true;
  }

  return () => {
    entry.listeners.delete(callback);
    if (entry.listeners.size === 0 && entry.isListening) {
      entry.mql.removeEventListener('change', entry.handleChange);
      entry.isListening = false;
    }
  };
};

export const getMediaQuerySnapshot = (query: string) => {
  const entry = getMediaQueryEntry(query);
  return entry ? entry.mql.matches : false;
};
