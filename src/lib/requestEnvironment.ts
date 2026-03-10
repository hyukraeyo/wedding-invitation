const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;
const TOSS_USER_AGENT_IDENTIFIERS = ['TOSS_WEBVIEW', 'APPSINTOSS'];

export interface RequestEnvironment {
  isToss: boolean;
  isMobile: boolean;
  deviceKind: 'mobile' | 'desktop';
}

export function isMobileUserAgent(userAgent: string): boolean {
  return MOBILE_USER_AGENT_REGEX.test(userAgent);
}

export function isTossUserAgent(userAgent: string): boolean {
  const normalizedUa = userAgent.toUpperCase();
  return TOSS_USER_AGENT_IDENTIFIERS.some((identifier) => normalizedUa.includes(identifier));
}

export function detectRequestEnvironment(userAgent: string = ''): RequestEnvironment {
  const isToss = isTossUserAgent(userAgent);
  const isMobile = isToss || isMobileUserAgent(userAgent);

  return {
    isToss,
    isMobile,
    deviceKind: isMobile ? 'mobile' : 'desktop',
  };
}
