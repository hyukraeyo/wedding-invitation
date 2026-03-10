'use server';

export interface MobileSearchResult {
  id: string;
  value: string;
  searchValue: string;
  lat?: number;
  lng?: number;
  title?: string;
  description?: string;
  source: 'postcode' | 'place' | 'address';
}

const KAKAO_REST_API_KEY = process.env.KAKAO_CLIENT_ID;

export async function searchKakaoAddresses(query: string): Promise<MobileSearchResult[]> {
  if (!KAKAO_REST_API_KEY) {
    console.error('KAKAO_CLIENT_ID is not set. Cannot use Kakao Local API.');
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };

    const [addressResponse, keywordResponse] = await Promise.all([
      fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodedQuery}&size=10`, { headers }),
      fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodedQuery}&size=10`, { headers }),
    ]);

    const addressData = await addressResponse.json();
    const keywordData = await keywordResponse.json();

    const addressResults: MobileSearchResult[] = (addressData.documents || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any, index: number) => {
        const searchValue = item.road_address?.address_name || item.address_name;
        return {
          id: `address-${item.y}-${item.x}-${index}`,
          value: searchValue,
          searchValue: searchValue,
          lat: Number(item.y),
          lng: Number(item.x),
          title: item.road_address?.building_name || '주소 검색 결과',
          description: item.address_name,
          source: 'address',
        };
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keywordResults: MobileSearchResult[] = (keywordData.documents || []).map((item: any) => {
      const searchValue = item.road_address_name || item.address_name;
      return {
        id: `place-${item.id}`,
        value: searchValue,
        searchValue: searchValue,
        lat: Number(item.y),
        lng: Number(item.x),
        title: item.place_name,
        description: searchValue,
        source: 'place',
      };
    });

    const combined = [...keywordResults, ...addressResults];

    const deduped = combined.filter((item, index, array) => {
      return (
        array.findIndex(
          (candidate) =>
            candidate.value === item.value &&
            candidate.lat === item.lat &&
            candidate.lng === item.lng
        ) === index
      );
    });

    return deduped.slice(0, 8);
  } catch (error) {
    console.error('[searchKakaoAddresses] error:', error);
    return [];
  }
}
