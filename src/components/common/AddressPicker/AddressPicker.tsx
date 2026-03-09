'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import type { Address } from 'react-daum-postcode';
import { useMediaQuery } from '@/hooks/use-media-query';
import { KAKAO_LOADER_OPTIONS } from '@/lib/kakaoLoader';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/SectionLoader';
import styles from './AddressPicker.module.scss';

const DaumPostcodeEmbed = dynamic(
  () => import('react-daum-postcode').then((mod) => mod.DaumPostcodeEmbed),
  {
    ssr: false,
    loading: () => <SectionLoader height={460} message="주소 검색창을 불러오고 있어요" />,
  }
);

export interface AddressPickerSelection {
  value: string;
  searchValue: string;
  lat?: number;
  lng?: number;
  title?: string;
  source: 'postcode' | 'place' | 'address';
}

interface MobileSearchResult extends AddressPickerSelection {
  id: string;
  description?: string;
}

interface AddressPickerProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (() => void) | undefined;
  onSelectResult?: ((selection: AddressPickerSelection) => void) | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  helperText?: string | undefined;
  variant?: React.ComponentProps<typeof TextField.Button>['variant'];
  radius?: React.ComponentProps<typeof TextField.Button>['radius'];
  disabled?: boolean | undefined;
  id?: string | undefined;
  error?: string | boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

function buildDisplayAddress(data: Address) {
  let fullAddress = data.address;
  let extraAddress = '';

  if (data.addressType === 'R') {
    if (data.bname !== '') {
      extraAddress += data.bname;
    }
    if (data.buildingName !== '') {
      extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
    }
    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
  }

  return fullAddress;
}

function buildSearchAddress(data: Address) {
  return data.roadAddress || data.jibunAddress || data.address;
}

const AddressPickerRaw = (
  {
    value,
    onChange,
    onComplete,
    onSelectResult,
    open: externalOpen,
    onOpenChange: setExternalOpen,
    className,
    label,
    placeholder = '주소 검색',
    helperText,
    variant = 'outline',
    radius = 'md',
    disabled,
    id,
    error,
    onClick,
    ...buttonProps
  }: AddressPickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [mobileQuery, setMobileQuery] = React.useState(value);
  const [mobileResults, setMobileResults] = React.useState<MobileSearchResult[]>([]);
  const [mobileStatusMessage, setMobileStatusMessage] = React.useState<string | null>(null);
  const [isSearchingMobile, setIsSearchingMobile] = React.useState(false);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const mobileResultListRef = React.useRef<HTMLDivElement>(null);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const [kakaoLoading, kakaoError] = useKakaoLoader(KAKAO_LOADER_OPTIONS);

  const setIsOpen = React.useCallback(
    (open: boolean) => {
      if (setExternalOpen) {
        setExternalOpen(open);
      } else {
        setInternalOpen(open);
      }
    },
    [setExternalOpen]
  );

  const focusMobileInput = React.useCallback(() => {
    mobileInputRef.current?.focus({ preventScroll: true });
    mobileInputRef.current?.select();
  }, []);

  React.useEffect(() => {
    if (!isOpen || !isMobile) return;

    setMobileQuery(value);

    const frameId = window.requestAnimationFrame(() => {
      focusMobileInput();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [focusMobileInput, isMobile, isOpen, value]);

  const searchMobileAddresses = React.useCallback(async (query: string) => {
    if (typeof window === 'undefined' || !window.kakao?.maps?.services) return [];

    const services = window.kakao.maps.services;
    const geocoder = new services.Geocoder();
    const places = new services.Places();

    const addressResultsPromise = new Promise<MobileSearchResult[]>((resolve) => {
      geocoder.addressSearch(query, (result, status) => {
        if (status !== services.Status.OK) {
          resolve([]);
          return;
        }

        resolve(
          result.map((item, index) => {
            const searchValue = item.road_address?.address_name || item.address_name;
            return {
              id: `address-${item.x}-${item.y}-${index}`,
              value: searchValue,
              searchValue,
              lat: Number(item.y),
              lng: Number(item.x),
              title: item.road_address?.building_name || '주소 검색 결과',
              description: item.address_name,
              source: 'address' as const,
            };
          })
        );
      });
    });

    const placeResultsPromise = new Promise<MobileSearchResult[]>((resolve) => {
      places.keywordSearch(
        query,
        (result, status) => {
          if (status !== services.Status.OK) {
            resolve([]);
            return;
          }

          resolve(
            result.map((item) => {
              const searchValue = item.road_address_name || item.address_name;
              return {
                id: `place-${item.id}`,
                value: searchValue,
                searchValue,
                lat: Number(item.y),
                lng: Number(item.x),
                title: item.place_name,
                description: searchValue,
                source: 'place' as const,
              };
            })
          );
        },
        { size: 7 }
      );
    });

    const [placeResults, addressResults] = await Promise.all([
      placeResultsPromise,
      addressResultsPromise,
    ]);

    const deduped = [...placeResults, ...addressResults].filter((item, index, array) => {
      return (
        array.findIndex(
          (candidate) =>
            candidate.value === item.value && candidate.lat === item.lat && candidate.lng === item.lng
        ) === index
      );
    });

    return deduped.slice(0, 8);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !isMobile) return;

    const trimmedQuery = mobileQuery.trim();

    if (trimmedQuery.length < 2) {
      setMobileResults([]);
      setMobileStatusMessage(null);
      setIsSearchingMobile(false);
      return;
    }

    if (kakaoLoading) {
      setIsSearchingMobile(true);
      setMobileStatusMessage(null);
      return;
    }

    if (kakaoError || typeof window === 'undefined' || !window.kakao?.maps?.services) {
      setIsSearchingMobile(false);
      setMobileStatusMessage('주소 검색 서비스를 불러오지 못했어요.');
      setMobileResults([]);
      return;
    }

    let isActive = true;
    setIsSearchingMobile(true);
    setMobileStatusMessage(null);

    const timerId = window.setTimeout(() => {
      void searchMobileAddresses(trimmedQuery)
        .then((results) => {
          if (!isActive) return;
          setMobileResults(results);
          setMobileStatusMessage(results.length === 0 ? '검색 결과가 없어요.' : null);
        })
        .catch(() => {
          if (!isActive) return;
          setMobileResults([]);
          setMobileStatusMessage('검색 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
        })
        .finally(() => {
          if (!isActive) return;
          setIsSearchingMobile(false);
        });
    }, 180);

    return () => {
      isActive = false;
      window.clearTimeout(timerId);
    };
  }, [isMobile, isOpen, kakaoError, kakaoLoading, mobileQuery, searchMobileAddresses]);

  const handleAddressComplete = (data: Address) => {
    const fullAddress = buildDisplayAddress(data);
    const searchValue = buildSearchAddress(data);

    onChange(fullAddress);
    onSelectResult?.({
      value: fullAddress,
      searchValue,
      source: 'postcode',
      ...(data.buildingName ? { title: data.buildingName } : {}),
    });
    setIsOpen(false);
    onComplete?.();
  };

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;

      if (isMobile) {
        flushSync(() => {
          setIsOpen(true);
        });
        focusMobileInput();
        return;
      }

      setIsOpen(true);
    },
    [disabled, focusMobileInput, isMobile, onClick, setIsOpen]
  );

  const handleMobileResultSelect = React.useCallback(
    (result: MobileSearchResult) => {
      onChange(result.value);
      onSelectResult?.(result);
      setIsOpen(false);
      onComplete?.();
    },
    [onChange, onComplete, onSelectResult, setIsOpen]
  );

  const handleMobileQueryKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;

      event.preventDefault();
      mobileInputRef.current?.blur();
      mobileResultListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  return (
    <>
      <TextField.Button
        ref={ref}
        id={id}
        variant={variant}
        radius={radius}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        value={value}
        className={className}
        rightSlot={<Search size={18} />}
        disabled={disabled}
        error={error}
        onClick={handleTriggerClick}
        {...buttonProps}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
        <Dialog.Content
          onOpenAutoFocus={(event) => {
            if (!isMobile) return;
            event.preventDefault();
            focusMobileInput();
          }}
        >
          <Dialog.Header title="주소 검색" />
          <Dialog.Body className={styles.body} padding={false} scrollable={!isMobile}>
            {isMobile ? (
              <div className={styles.mobileSearch}>
                <div className={styles.mobileSearchField}>
                  <TextField.Root className={styles.mobileSearchFieldRoot}>
                    <TextField.Input
                      ref={mobileInputRef}
                      value={mobileQuery}
                      onChange={(event) => setMobileQuery(event.target.value)}
                      onKeyDown={handleMobileQueryKeyDown}
                      placeholder="예식장명 또는 주소를 입력해 주세요"
                      enterKeyHint="search"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </TextField.Root>
                </div>
                <p className={styles.mobileSearchHint}>두 글자 이상 입력하면 바로 검색돼요.</p>
                <div ref={mobileResultListRef} className={styles.mobileResultList}>
                  {isSearchingMobile ? (
                    <SectionLoader height={240} message="주소를 찾고 있어요" />
                  ) : null}
                  {!isSearchingMobile && mobileStatusMessage ? (
                    <div className={styles.mobileStatus}>{mobileStatusMessage}</div>
                  ) : null}
                  {!isSearchingMobile &&
                    !mobileStatusMessage &&
                    mobileResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        className={styles.mobileResultButton}
                        onClick={() => handleMobileResultSelect(result)}
                      >
                        <span className={styles.mobileResultTitle}>{result.title || result.value}</span>
                        {result.description ? (
                          <span className={styles.mobileResultDescription}>{result.description}</span>
                        ) : null}
                      </button>
                    ))}
                </div>
              </div>
            ) : isOpen ? (
              <div className={styles.embedWrapper}>
                <DaumPostcodeEmbed
                  onComplete={handleAddressComplete}
                  focusInput
                  style={{ height: '100%' }}
                  autoClose={false}
                />
              </div>
            ) : null}
          </Dialog.Body>
          {!isMobile ? (
            <Dialog.Footer className={styles.footer}>
              <Dialog.Close asChild>
                <Button variant="soft">닫기</Button>
              </Dialog.Close>
            </Dialog.Footer>
          ) : null}
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export const AddressPicker = React.forwardRef<HTMLButtonElement, AddressPickerProps>(
  AddressPickerRaw
);
AddressPicker.displayName = 'AddressPicker';
