'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { searchKakaoAddresses, type MobileSearchResult } from '@/app/actions/kakaoSearch';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/SectionLoader';
import styles from './AddressPicker.module.scss';

const MOBILE_FOCUS_DELAY_MS = 180;

export interface AddressPickerSelection {
  value: string;
  searchValue: string;
  lat?: number;
  lng?: number;
  title?: string;
  source: 'postcode' | 'place' | 'address';
}

type MobileSearchState = 'idle' | 'ready' | 'empty' | 'error';

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

function dedupeMobileSearchResults(results: MobileSearchResult[]) {
  return results.filter((item, index, array) => {
    return (
      array.findIndex(
        (candidate) =>
          candidate.value === item.value &&
          candidate.lat === item.lat &&
          candidate.lng === item.lng
      ) === index
    );
  });
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
  const [mobileSearchState, setMobileSearchState] = React.useState<MobileSearchState>('idle');
  const [mobileStatusMessage, setMobileStatusMessage] = React.useState<string | null>(null);
  const [isSearchingMobile, setIsSearchingMobile] = React.useState(false);
  const [isLoadingMoreMobile, setIsLoadingMoreMobile] = React.useState(false);
  const [isMobileComposing, setIsMobileComposing] = React.useState(false);
  const [mobileSearchedQuery, setMobileSearchedQuery] = React.useState('');
  const [mobileSearchPage, setMobileSearchPage] = React.useState(1);
  const [hasMoreMobileResults, setHasMoreMobileResults] = React.useState(false);
  const [showMobileResultTopMask, setShowMobileResultTopMask] = React.useState(false);
  const [showMobileResultBottomMask, setShowMobileResultBottomMask] = React.useState(false);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const mobileResultListRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRequestIdRef = React.useRef(0);
  const mobileMaskAnimationFrameRef = React.useRef<number | null>(null);
  const mobileMaskStateRef = React.useRef({ top: false, bottom: false });
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const trimmedMobileQuery = mobileQuery.trim();
  const canSearchMobile = trimmedMobileQuery.length >= 2;
  const canLoadMoreMobileResults =
    hasMoreMobileResults && mobileSearchedQuery.length > 0 && mobileSearchedQuery === trimmedMobileQuery;
  const hasMobileResults = mobileResults.length > 0;

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

  const updateMobileResultMasks = React.useCallback(() => {
    if (mobileMaskAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(mobileMaskAnimationFrameRef.current);
    }

    mobileMaskAnimationFrameRef.current = window.requestAnimationFrame(() => {
      mobileMaskAnimationFrameRef.current = null;

      const element = mobileResultListRef.current;

      if (!element) {
        if (mobileMaskStateRef.current.top || mobileMaskStateRef.current.bottom) {
          mobileMaskStateRef.current = { top: false, bottom: false };
          setShowMobileResultTopMask(false);
          setShowMobileResultBottomMask(false);
        }
        return;
      }

      const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
      const nextTop = element.scrollTop > 2;
      const nextBottom = maxScrollTop - element.scrollTop > 2;

      if (
        mobileMaskStateRef.current.top === nextTop &&
        mobileMaskStateRef.current.bottom === nextBottom
      ) {
        return;
      }

      mobileMaskStateRef.current = { top: nextTop, bottom: nextBottom };
      setShowMobileResultTopMask(nextTop);
      setShowMobileResultBottomMask(nextBottom);
    });
  }, []);

  const resetMobileResultMasks = React.useCallback(() => {
    if (mobileMaskAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(mobileMaskAnimationFrameRef.current);
      mobileMaskAnimationFrameRef.current = null;
    }

    mobileMaskStateRef.current = { top: false, bottom: false };
    setShowMobileResultTopMask(false);
    setShowMobileResultBottomMask(false);
  }, []);

  React.useEffect(() => {
    return () => {
      if (mobileMaskAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileMaskAnimationFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    setMobileQuery(value);
    setMobileResults([]);
    setMobileSearchedQuery('');
    setMobileSearchPage(1);
    setHasMoreMobileResults(false);
    setMobileStatusMessage(null);
    setMobileSearchState(value.trim().length >= 2 ? 'ready' : 'idle');

    const timeoutId = window.setTimeout(() => {
      focusMobileInput();
    }, MOBILE_FOCUS_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [focusMobileInput, isOpen, value]);

  React.useEffect(() => {
    if (!isOpen || isSearchingMobile || mobileResults.length === 0) {
      resetMobileResultMasks();
      return;
    }

    updateMobileResultMasks();
  }, [isOpen, isSearchingMobile, mobileResults.length, resetMobileResultMasks, updateMobileResultMasks]);

  React.useEffect(() => {
    const element = mobileResultListRef.current;

    if (!isOpen || !element || isSearchingMobile || mobileResults.length === 0) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateMobileResultMasks();
    });

    observer.observe(element);

    const contentElement = element.firstElementChild;
    if (contentElement instanceof HTMLElement) {
      observer.observe(contentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [isOpen, isSearchingMobile, mobileResults.length, updateMobileResultMasks]);

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;

      setIsOpen(true);
    },
    [disabled, onClick, setIsOpen]
  );

  const handleMobileQueryChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const nextTrimmedValue = nextValue.trim();
    setMobileQuery(nextValue);
    setMobileStatusMessage(null);
    setMobileSearchState(nextTrimmedValue.length >= 2 ? 'ready' : 'idle');
  }, []);

  const runMobileSearch = React.useCallback(
    async (page: number, mode: 'replace' | 'append') => {
      if (!canSearchMobile) return;

      const requestId = mobileSearchRequestIdRef.current + 1;
      mobileSearchRequestIdRef.current = requestId;

      if (mode === 'replace') {
        setIsSearchingMobile(true);
        setMobileSearchedQuery(trimmedMobileQuery);
        resetMobileResultMasks();
        mobileInputRef.current?.blur();
        mobileResultListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsLoadingMoreMobile(true);
      }

      setMobileStatusMessage(null);

      try {
        const response = await searchKakaoAddresses(trimmedMobileQuery, page);
        if (requestId !== mobileSearchRequestIdRef.current) return;

        const nextResults =
          mode === 'append'
            ? dedupeMobileSearchResults([...mobileResults, ...response.results])
            : response.results;

        React.startTransition(() => {
          setMobileResults(nextResults);
          setMobileSearchPage(response.page);
          setHasMoreMobileResults(response.hasMore);
          setMobileSearchState(nextResults.length === 0 ? 'empty' : 'ready');
          setMobileStatusMessage(nextResults.length === 0 ? '다른 키워드로 다시 찾아보세요.' : null);
        });
      } catch {
        if (requestId !== mobileSearchRequestIdRef.current) return;

        React.startTransition(() => {
          if (mode === 'replace') {
            setMobileResults([]);
          }
          setMobileSearchState('error');
          setMobileStatusMessage('검색 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
        });
      } finally {
        if (requestId === mobileSearchRequestIdRef.current) {
          if (mode === 'replace') {
            setIsSearchingMobile(false);
          } else {
            setIsLoadingMoreMobile(false);
          }
        }
      }
    },
    [canSearchMobile, mobileResults, resetMobileResultMasks, trimmedMobileQuery]
  );

  const handleMobileSearch = React.useCallback(async () => {
    if (!canSearchMobile || isSearchingMobile || isLoadingMoreMobile) return;

    await runMobileSearch(1, 'replace');
  }, [canSearchMobile, isLoadingMoreMobile, isSearchingMobile, runMobileSearch]);

  const handleMobileLoadMore = React.useCallback(async () => {
    if (!canLoadMoreMobileResults || isSearchingMobile || isLoadingMoreMobile) return;

    await runMobileSearch(mobileSearchPage + 1, 'append');
  }, [canLoadMoreMobileResults, isLoadingMoreMobile, isSearchingMobile, mobileSearchPage, runMobileSearch]);

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
      if (isMobileComposing || event.nativeEvent.isComposing) return;

      event.preventDefault();
      void handleMobileSearch();
    },
    [handleMobileSearch, isMobileComposing]
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
          className={styles.sheetContent}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <Dialog.Header title="주소 검색" className={styles.sheetHeader} />
          <Dialog.Body className={styles.body} padding={false} scrollable={false}>
            <div className={styles.mobileSearch}>
              <div className={styles.mobileSearchField}>
                <TextField
                  ref={mobileInputRef}
                  type="search"
                  value={mobileQuery}
                  onChange={handleMobileQueryChange}
                  onKeyDown={handleMobileQueryKeyDown}
                  onCompositionStart={() => setIsMobileComposing(true)}
                  onCompositionEnd={() => setIsMobileComposing(false)}
                  placeholder="예식장명 또는 주소를 입력해 주세요"
                  enterKeyHint="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={!canSearchMobile || isSearchingMobile}
                  onClick={() => void handleMobileSearch()}
                  aria-label="주소 검색"
                >
                  <Search size={18} />
                </Button>
              </div>

              <div className={styles.mobileResultViewport}>
                <AnimatePresence mode="wait" initial={false}>
                  {isSearchingMobile ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={styles.mobileStatePanel}
                    >
                      <SectionLoader height={240} message="주소를 찾고 있어요" />
                    </motion.div>
                  ) : hasMobileResults ? (
                    <motion.div
                      key={mobileSearchedQuery || 'results'}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22 }}
                      className={styles.mobileResultGroup}
                    >
                      <div className={styles.mobileResultMeta}>
                        <span className={styles.mobileResultCount}>{mobileResults.length}개 표시</span>
                        <span className={styles.mobileResultQuery}>&ldquo;{mobileSearchedQuery}&rdquo;</span>
                      </div>
                      <div className={styles.mobileResultScrollerWrap}>
                        <div
                          ref={mobileResultListRef}
                          className={clsx(
                            styles.mobileResultList,
                            showMobileResultTopMask &&
                              showMobileResultBottomMask &&
                              styles.mobileResultListFadeBoth,
                            showMobileResultTopMask &&
                              !showMobileResultBottomMask &&
                              styles.mobileResultListFadeTop,
                            !showMobileResultTopMask &&
                              showMobileResultBottomMask &&
                              styles.mobileResultListFadeBottom
                          )}
                          onScroll={updateMobileResultMasks}
                        >
                          <div className={styles.mobileResultItems}>
                            {mobileResults.map((result, index) => (
                              <motion.button
                                key={result.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.18) }}
                                type="button"
                                className={styles.mobileResultButton}
                                onClick={() => handleMobileResultSelect(result)}
                              >
                                <span className={styles.mobileResultTitle}>
                                  {result.title || result.value}
                                </span>
                                {result.description ? (
                                  <span className={styles.mobileResultDescription}>
                                    {result.description}
                                  </span>
                                ) : null}
                              </motion.button>
                            ))}
                            {canLoadMoreMobileResults ? (
                              <div className={styles.mobileLoadMore}>
                                <Button
                                  type="button"
                                  variant="soft"
                                  size="md"
                                  fullWidth
                                  loading={isLoadingMoreMobile}
                                  onClick={() => void handleMobileLoadMore()}
                                >
                                  더보기
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={mobileSearchState}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className={styles.mobileStatePanel}
                    >
                      <div className={styles.mobileStateCopy}>
                        <strong className={styles.mobileStateTitle}>
                          {mobileSearchState === 'error'
                            ? '검색 중 문제가 발생했어요'
                            : mobileSearchState === 'empty'
                              ? '검색 결과가 없어요'
                              : '주소를 검색해 주세요'}
                        </strong>
                        <p className={styles.mobileStateDescription}>
                          {mobileSearchState === 'error'
                            ? mobileStatusMessage || '잠시 후 다시 시도해 주세요.'
                            : mobileSearchState === 'empty'
                              ? mobileStatusMessage || '다른 키워드로 다시 찾아보세요.'
                              : '예식장명 또는 도로명 주소를 입력하면 결과가 여기에 표시돼요.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
