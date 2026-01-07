// Data Fetching Services
// Optimized for Next.js 16 with Request Memoization and Parallel Loading

import { cache } from 'react';
import { API_CONFIG, CACHE_CONFIG } from './constants';
import { ServerActionResponse } from './actions';

// Base fetch function with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Cached API functions for Request Memoization
export const getInvitationData = cache(async (invitationId: string) => {
  try {
    const url = `${API_CONFIG.baseUrl}/invitations/${invitationId}`;

    const data = await fetchWithErrorHandling(url, {
      next: {
        revalidate: CACHE_CONFIG.revalidation.dynamic,
        tags: [CACHE_CONFIG.tags.invitation],
      },
    });

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

export const getGuestList = cache(async (invitationId: string) => {
  try {
    const url = `${API_CONFIG.baseUrl}/invitations/${invitationId}/guests`;

    const data = await fetchWithErrorHandling(url, {
      next: {
        revalidate: CACHE_CONFIG.revalidation.api,
        tags: [CACHE_CONFIG.tags.guest],
      },
    });

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

export const getWeddingStats = cache(async (invitationId: string) => {
  try {
    const url = `${API_CONFIG.baseUrl}/invitations/${invitationId}/stats`;

    const data = await fetchWithErrorHandling(url, {
      next: {
        revalidate: CACHE_CONFIG.revalidation.api,
        tags: [CACHE_CONFIG.tags.invitation],
      },
    });

    return {
      success: true as const,
      data: {
        totalGuests: data.totalGuests || 0,
        rsvpCount: data.rsvpCount || 0,
        attendingCount: data.attendingCount || 0,
        pendingCount: data.pendingCount || 0,
      },
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// Parallel data loading functions
export async function loadInvitationPageData(invitationId: string) {
  // Parallel loading with Promise.allSettled for better error handling
  const [invitationResult, guestsResult, statsResult] = await Promise.allSettled([
    getInvitationData(invitationId),
    getGuestList(invitationId),
    getWeddingStats(invitationId),
  ]);

  return {
    invitation: invitationResult.status === 'fulfilled' ? invitationResult.value : null,
    guests: guestsResult.status === 'fulfilled' ? guestsResult.value : null,
    stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
  };
}

// External API integrations
export const getKakaoMapData = cache(async (query: string) => {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      next: {
        revalidate: CACHE_CONFIG.revalidation.api,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true as const,
      data: data.documents.map((place: any) => ({
        id: place.id,
        name: place.place_name,
        address: place.address_name,
        roadAddress: place.road_address_name,
        phone: place.phone,
        x: parseFloat(place.x),
        y: parseFloat(place.y),
      })),
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

export const getWeatherData = cache(async (lat: number, lng: number, date: string) => {
  try {
    // Weather API integration (example with OpenWeatherMap)
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url, {
      next: {
        revalidate: CACHE_CONFIG.revalidation.api,
      },
    });

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true as const,
      data: {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// Utility functions for data processing
export function processInvitationData(rawData: any) {
  return {
    id: rawData.id,
    groom: {
      ...rawData.groom,
      fullName: `${rawData.groom.firstName} ${rawData.groom.lastName}`,
    },
    bride: {
      ...rawData.bride,
      fullName: `${rawData.bride.firstName} ${rawData.bride.lastName}`,
    },
    ceremony: {
      ...rawData.ceremony,
      date: new Date(rawData.ceremony.date),
    },
    theme: rawData.theme,
    gallery: rawData.gallery || [],
    accounts: rawData.accounts || [],
  };
}

export function calculateRSVPStats(guests: any[]) {
  const total = guests.length;
  const responded = guests.filter(g => g.rsvp.responded).length;
  const attending = guests.filter(g => g.rsvp.attending).length;

  return {
    total,
    responded,
    attending,
    pending: total - responded,
    responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
    attendanceRate: responded > 0 ? Math.round((attending / responded) * 100) : 0,
  };
}

// Error handling utilities
export function createServiceError(
  message: string,
  code?: string,
  details?: Record<string, unknown>
) {
  return {
    success: false as const,
    error: message,
    code,
    details,
  };
}

export function isServiceError(result: any): result is { success: false; error: string } {
  return result && typeof result === 'object' && 'success' in result && result.success === false;
}