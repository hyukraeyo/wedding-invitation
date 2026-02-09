'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Badge } from '@/components/ui/Badge';
import { BottomCTA } from '@/components/common/BottomCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { NumericSpinner } from '@/components/ui/NumericSpinner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SwitchRow } from '@/components/common/SwitchRow';
import { TextField } from '@/components/ui/TextField';
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormHeader,
} from '@/components/ui/Form';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { AddressPicker } from '@/components/common/AddressPicker';
import { PhotoRatioInput } from '@/components/common/PhotoRatioInput';
import { PhotoGallery } from '@/components/common/PhotoGallery';
import { ChrysanthemumSVG } from '@/components/common/Icons';
import { StylePicker } from '@/components/common/StylePicker';
import { ColorPicker } from '@/components/common/ColorPicker';
import { FontPicker } from '@/components/common/FontPicker';
import { SequentialDateTimePicker } from '@/components/common/SequentialDateTimePicker';
import { useNameInput, usePhoneInput } from '@/hooks/useFormInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { isInvalidKoreanName, isInvalidPhone } from '@/lib/utils';
import { PALETTE } from '@/constants/palette';
import s from './DesignPage.module.scss';
import { DateWheelPicker } from '@/components/ui/DateWheelPicker';
import { DragEndEvent } from '@dnd-kit/core';

export default function DesignPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [segmentValue, setSegmentValue] = React.useState('weekly');
  const [radioValue, setRadioValue] = React.useState('toss');
  const [richText, setRichText] = React.useState('<p>Leave a warm welcome note here.</p>');
  const [weddingDate, setWeddingDate] = React.useState('');
  const [weddingTime, setWeddingTime] = React.useState('');

  // Sequential Picker State
  const [seqDate, setSeqDate] = React.useState('');
  const [seqTime, setSeqTime] = React.useState('');

  // Form hooks state
  const [groomName, setGroomName] = React.useState('');
  // const [brideName, setBrideName] = React.useState('');
  const [groomContact, setGroomContact] = React.useState('');

  const handleGroomNameChange = useNameInput(setGroomName);
  // const handleBrideNameChange = useNameInput(setBrideName);
  const handleGroomContactChange = usePhoneInput(setGroomContact);

  // Address search state
  const [address, setAddress] = React.useState('');

  // Guest count state
  const [guestCount, setGuestCount] = React.useState(0);

  // New UI states
  const [showCalendar, setShowCalendar] = React.useState(true);
  const [showDday, setShowDday] = React.useState(true);
  const [photoRatio, setPhotoRatio] = React.useState('fixed');

  // Customization states
  const [selectedStyle, setSelectedStyle] = React.useState('classic1');
  const [selectedColor, setSelectedColor] = React.useState<string>(PALETTE.PRIMARY_600);
  const [selectedFont, setSelectedFont] = React.useState('gowun-dodum');
  const [isMotherDeceased, setIsMotherDeceased] = React.useState(false);

  // Photos hooks
  const {
    images: galleryPhotos,
    handleUpload: handleGalleryUpload,
    removeImage: removeGalleryPhoto,
    moveImage: moveGalleryPhoto,
    count: galleryCount,
  } = useImageUpload({
    mode: 'multiple',
    maxCount: 10,
    maxSizeMB: 5,
    onError: (msg) => alert(msg),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = galleryPhotos.indexOf(active.id as string);
      const newIndex = galleryPhotos.indexOf(over.id as string);
      moveGalleryPhoto(oldIndex, newIndex);
    }
  };

  const { images: mainPhotos, handleUpload: handleMainPhotoUpload } = useImageUpload({
    mode: 'single',
    maxSizeMB: 5,
    onError: (msg) => alert(msg),
  });

  const mainPhoto = mainPhotos[0] || null;

  return (
    <div className={s.root}>
      <header className={s.hero}>
        <div className={s.heroMeta}>
          <Badge size="sm" variant="soft" color="primary">
            Dev-only playground
          </Badge>
          <span className={s.heroHint}>Radix + Banana tokens</span>
        </div>
        <h1>All UI components in one page</h1>
        <p className={s.heroDescription}>
          Experience Apple-inspired and Banana-themed interactions for buttons, inputs, selectors,
          overlays, and asynchronous feedback without leaving the design preview.
        </p>
      </header>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>실전 폼 조합</h2>
          <span className={s.sectionHint}>실제 프로젝트에서 사용하는 컴포넌트 조합</span>
        </div>
        <div className={s.formComposition}>
          {/* 신랑/신부 정보 */}
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormField name="groomName">
              <FormHeader>
                <FormLabel>신랑 이름</FormLabel>
                <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <TextField
                  placeholder="홍길동"
                  helperText="실명을 입력해주세요"
                  value={groomName}
                  onChange={handleGroomNameChange}
                  clearable
                />
              </FormControl>
            </FormField>

            <FormField name="groomMotherName">
              <FormHeader>
                <FormLabel>어머니</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <TextField
                  placeholder=""
                  className={s.grow}
                  onChange={handleGroomNameChange}
                  rightSlot={
                    <Toggle
                      size="sm"
                      variant="unstyled"
                      accentColorOnly
                      pressed={isMotherDeceased}
                      onPressedChange={setIsMotherDeceased}
                      aria-label="고인 여부 토글"
                    >
                      <ChrysanthemumSVG size={18} />
                    </Toggle>
                  }
                />
              </FormControl>
            </FormField>

            <FormField name="groomPhone">
              <FormHeader>
                <FormLabel>연락처</FormLabel>
                <FormMessage match={isInvalidPhone}>올바른 전화번호를 입력해주세요</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <TextField
                  type="tel"
                  placeholder="010-1234-5678"
                  helperText="'-' 없이 입력하시면 자동으로 포맷됩니다"
                  value={groomContact}
                  onChange={handleGroomContactChange}
                />
              </FormControl>
            </FormField>

            <FormField name="weddingDate">
              <FormHeader>
                <FormLabel>예식 날짜</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <DatePicker
                  placeholder="날짜를 선택하세요"
                  value={weddingDate}
                  onChange={setWeddingDate}
                />
              </FormControl>
            </FormField>

            <FormField name="weddingTime">
              <FormHeader>
                <FormLabel>예식 시간</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <TimePicker
                  placeholder="시간을 선택하세요"
                  value={weddingTime}
                  onChange={setWeddingTime}
                />
              </FormControl>
            </FormField>

            <FormField name="seqCombined">
              <FormHeader>
                <FormLabel>예식 일시</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <SequentialDateTimePicker
                  date={seqDate}
                  time={seqTime}
                  onDateChange={setSeqDate}
                  onTimeChange={setSeqTime}
                  className={s.grow || ''}
                />
              </FormControl>
            </FormField>

            <FormField name="venueName">
              <FormHeader>
                <FormLabel>예식장 이름</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <TextField placeholder="그랜드 컨벤션 센터" clearable />
              </FormControl>
            </FormField>

            <FormField name="venueAddress">
              <FormHeader>
                <FormLabel>예식장 주소</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <AddressPicker
                  placeholder="클릭하여 주소를 검색하세요"
                  value={address}
                  onChange={setAddress}
                  helperText="도로명 주소를 입력해주세요"
                />
              </FormControl>
            </FormField>

            <FormField name="attendance">
              <FormHeader>
                <FormLabel>참석 여부</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <SegmentedControl value={segmentValue} alignment="fluid" onChange={setSegmentValue}>
                  <SegmentedControl.Item value="attend">참석</SegmentedControl.Item>
                  <SegmentedControl.Item value="absent">불참</SegmentedControl.Item>
                  <SegmentedControl.Item value="pending">미정</SegmentedControl.Item>
                </SegmentedControl>
              </FormControl>
            </FormField>

            <FormField name="message">
              <FormHeader>
                <FormLabel>축하 메시지</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <RichTextEditor
                  content={richText}
                  placeholder="따뜻한 축하 메시지를 남겨주세요"
                  onChange={setRichText}
                />
              </FormControl>
            </FormField>

            <FormField name="mealSelection">
              <FormControl asChild>
                <SwitchRow
                  label="식사 여부"
                  checked={radioValue === 'yes'}
                  onCheckedChange={(checked) => setRadioValue(checked ? 'yes' : 'no')}
                />
              </FormControl>
            </FormField>

            <FormField name="guestCount">
              <FormHeader>
                <FormLabel>동반 인원 수</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <NumericSpinner
                  number={guestCount}
                  onNumberChange={setGuestCount}
                  min={0}
                  max={10}
                  size="large"
                  decreaseAriaLabel="동반 인원 줄이기"
                  increaseAriaLabel="동반 인원 늘리기"
                  helperText="본인 포함 총 인원을 입력해주세요"
                />
              </FormControl>
            </FormField>

            <FormField name="showCalendar">
              <FormControl asChild>
                <SwitchRow
                  label="달력 노출"
                  checked={showCalendar}
                  onCheckedChange={setShowCalendar}
                />
              </FormControl>
            </FormField>

            <FormField name="showDday">
              <FormControl asChild>
                <SwitchRow label="D-Day 노출" checked={showDday} onCheckedChange={setShowDday} />
              </FormControl>
            </FormField>

            {/* Photo Gallery */}
            <FormField name="gallery">
              <FormHeader>
                <FormLabel>사진 관리</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <PhotoGallery
                  images={galleryPhotos}
                  onUpload={handleGalleryUpload}
                  onRemove={(index: number) => removeGalleryPhoto(index)}
                  onDragEnd={handleDragEnd}
                  helperText={
                    <span>
                      현재 등록된 사진 <strong className={s.highlight}>{galleryCount}</strong> / 10
                    </span>
                  }
                />
              </FormControl>
            </FormField>

            {/* Main Greeting Photo */}
            {/* Main Greeting Photo */}
            <FormField name="mainGreeting">
              <FormHeader>
                <FormLabel>사진</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <PhotoRatioInput
                  image={mainPhoto}
                  onUpload={handleMainPhotoUpload}
                  ratio={photoRatio}
                  onRatioChange={setPhotoRatio}
                  placeholder="인사말 사진 추가"
                />
              </FormControl>
            </FormField>

            <FormField name="style">
              <FormHeader>
                <FormLabel>스타일</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <StylePicker value={selectedStyle} onChange={setSelectedStyle} />
              </FormControl>
            </FormField>

            {/* Color Selection */}
            <FormField name="accentColor">
              <FormHeader>
                <FormLabel>강조색</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <ColorPicker
                  value={selectedColor}
                  onChange={setSelectedColor}
                  colors={[
                    { value: PALETTE.PRIMARY_600, label: 'Banana' },
                    { value: PALETTE.STONE_700, label: 'Warm Dark' },
                    { value: PALETTE.ROSE_400, label: 'Soft Rose' },
                    { value: PALETTE.ACCENT_700, label: 'Forest Green' },
                  ]}
                />
              </FormControl>
            </FormField>

            {/* Font Selection */}
            <FormField name="font">
              <FormHeader>
                <FormLabel>글꼴</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <FontPicker
                  value={selectedFont}
                  onChange={setSelectedFont}
                  options={[
                    { label: '고운돋움 (기본)', value: 'gowun-dodum' },
                    { label: 'Pretendard', value: 'pretendard' },
                    { label: 'Nanum Myeongjo', value: 'nanum-myeongjo' },
                    { label: '고운바탕', value: 'gowun-batang' },
                    { label: '송명', value: 'song-myung' },
                    { label: '연성', value: 'yeon-sung' },
                    { label: '도현', value: 'do-hyeon' },
                    { label: '지마켓 산스', value: 'gmarket' },
                    { label: '세리프', value: 'serif' },
                    { label: '산세리프', value: 'sans' },
                  ]}
                />
              </FormControl>
            </FormField>
          </Form>

          {/* 제출 버튼 */}
          <BottomCTA.Single onClick={() => setToastOpen(true)}>참석 의사 전달하기</BottomCTA.Single>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Wheel Picker</h2>
          <span className={s.sectionHint}>모바일 친화적인 휠 피커 컴포넌트</span>
        </div>
        <div className={s.demoContainer}>
          <div
            className={s.demoContent}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
          >
            <div
              style={{
                background: 'var(--white)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--grey-200)',
              }}
            >
              <DateWheelPicker
                value={weddingDate ? new Date(weddingDate) : new Date()}
                onChange={(d: Date) => {
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  setWeddingDate(`${year}-${month}-${day}`);
                }}
                minYear={2020}
                maxYear={2030}
              />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              선택된 날짜: {weddingDate || '날짜를 선택하세요'}
            </p>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>버튼 및 액션</h2>
          <span className={s.sectionHint}>다양한 버튼 스타일 및 하단 고정 버튼(CTA)</span>
        </div>
        <div className={s.buttonGrid}>
          {(['primary', 'blue', 'secondary', 'outline', 'ghost'] as const).map((v) => (
            <div key={v} className={s.buttonItem}>
              <span className={s.variantLabel}>{v}</span>
              <Button variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
            </div>
          ))}
        </div>
        <div className={s.demoContainer}>
          <div className={s.demoContent}>
            <BottomCTA.Single fixed={false} variant="blue" onClick={() => setToastOpen(true)}>
              CTA Button
            </BottomCTA.Single>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>다이얼로그 및 토스트</h2>
          <span className={s.sectionHint}>다이얼로그, 얼럿 다이얼로그, 바텀시트, 토스트</span>
        </div>
        <div className={s.overlayGrid}>
          <div className={s.overlayCard}>
            <div className={s.overlayActions}>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger asChild>
                  <Button variant="blue">다이얼로그</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header title="다이얼로그 미리보기" />
                  <Dialog.Body>
                    <p>
                      애플 감성의 부드러운 애니메이션과 함께 디자인 시스템 토큰이 적용된
                      다이얼로그입니다.
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.Close asChild>
                      <Button variant="ghost">닫기</Button>
                    </Dialog.Close>
                    <Button onClick={() => setDialogOpen(false)}>확인</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>

              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button>얼럿 다이얼로그</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없으며, 모든 데이터가 즉시 동기화됩니다.
                  </AlertDialogDescription>
                  <div className={s.alertActions}>
                    <AlertDialogCancel asChild>
                      <Button variant="ghost">취소</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button color="red">삭제</Button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => setSheetOpen(true)}>바텀시트</Button>
              <BottomSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                header="빠른 액션"
                cta={<Button onClick={() => setSheetOpen(false)}>내용 저장하기</Button>}
              >
                <div style={{ padding: '0 24px 24px' }}>
                  <p>모바일 환경에서는 하단에서 부드럽게 올라오는 바텀시트가 제공됩니다.</p>
                </div>
              </BottomSheet>
              <ToastProvider swipeDirection="right">
                <Button onClick={() => setToastOpen(true)}>토스트 실행</Button>
                <Toast open={toastOpen} onOpenChange={setToastOpen}>
                  <ToastTitle>저장 완료</ToastTitle>
                  <ToastDescription>선택하신 설정이 프리뷰에 즉시 반영되었습니다.</ToastDescription>
                </Toast>
                <ToastViewport />
              </ToastProvider>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
