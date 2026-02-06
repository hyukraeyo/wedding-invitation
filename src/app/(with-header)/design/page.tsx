'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Badge } from '@/components/ui/Badge';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { NumericSpinner } from '@/components/ui/NumericSpinner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Switch } from '@/components/ui/Switch';
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
import { DatePicker } from '@/components/common/DatePicker/DatePicker';
import { TimePicker } from '@/components/common/TimePicker/TimePicker';
import { AddressPicker } from '@/components/common/AddressPicker';
import { PhotoRatioInput } from '@/components/common/PhotoRatioInput';
import { PhotoGallery } from '@/components/common/PhotoGallery';
import { ChrysanthemumSVG } from '@/components/common/Icons';
import { StylePicker } from '@/components/common/StylePicker';
import { ColorPicker } from '@/components/common/ColorPicker';
import { useNameInput, usePhoneInput } from '@/hooks/useFormInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { isValidKoreanNameValue, isValidPhone } from '@/lib/utils';
import s from './DesignPage.module.scss';
import { DragEndEvent } from '@dnd-kit/core';

const dropdownItems = [
  { label: 'Duplicate invite', value: 'duplicate' },
  { label: 'Export guest list', value: 'export' },
  { label: 'Send preview', value: 'preview' },
];

const optionListItems = [
  { label: 'Ceremony suite', value: 'ceremony' },
  { label: 'Reception suite', value: 'reception' },
  { label: 'After party', value: 'after' },
];

export default function DesignPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [segmentValue, setSegmentValue] = React.useState('weekly');
  const [detailMode, setDetailMode] = React.useState('plan');
  const [radioValue, setRadioValue] = React.useState('toss');
  const [sliderValue, setSliderValue] = React.useState(58);
  const [optionValue, setOptionValue] = React.useState(optionListItems[0]!.value);
  const [menuChoice, setMenuChoice] = React.useState(dropdownItems[0]!.value);
  const [menuChecked, setMenuChecked] = React.useState(true);
  const [richText, setRichText] = React.useState('<p>Leave a warm welcome note here.</p>');
  const [weddingDate, setWeddingDate] = React.useState('');
  const [weddingTime, setWeddingTime] = React.useState('');

  // Form hooks state
  const [groomName, setGroomName] = React.useState('');
  const [brideName, setBrideName] = React.useState('');
  const [groomContact, setGroomContact] = React.useState('');

  const handleGroomNameChange = useNameInput(setGroomName);
  const handleBrideNameChange = useNameInput(setBrideName);
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
  const [selectedColor, setSelectedColor] = React.useState('#C69C6D'); // Beige
  const [isMotherDeceased, setIsMotherDeceased] = React.useState(false);

  // Photos hooks
  const {
    images: galleryPhotos,
    handleUpload: handleGalleryUpload,
    removeImage: removeGalleryPhoto,
    moveImage: moveGalleryPhoto,
    count: galleryCount,
    isFull: isGalleryFull,
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

  const validateKoreanName = (value: string): boolean => {
    if (!value.trim()) return false;
    return !isValidKoreanNameValue(value);
  };

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
                <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
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
                      variant="ghost"
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
            <FormField name="brideName">
              <FormHeader>
                <FormLabel>신부 이름</FormLabel>
                <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <TextField
                  placeholder="김영희"
                  value={brideName}
                  onChange={handleBrideNameChange}
                  clearable
                />
              </FormControl>
            </FormField>

            <FormField name="groomPhone">
              <FormHeader>
                <FormLabel>연락처</FormLabel>
                <FormMessage match={(value) => !!value && !isValidPhone(value)}>
                  올바른 전화번호를 입력해주세요
                </FormMessage>
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
              <div className={s.toggleRow}>
                <FormLabel>식사 여부</FormLabel>
                <FormControl asChild>
                  <Switch
                    checked={radioValue === 'yes'}
                    onCheckedChange={(checked) => setRadioValue(checked ? 'yes' : 'no')}
                  />
                </FormControl>
              </div>
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
              <div className={s.toggleRow}>
                <FormLabel>달력 노출</FormLabel>
                <FormControl asChild>
                  <Switch checked={showCalendar} onCheckedChange={setShowCalendar} />
                </FormControl>
              </div>
            </FormField>

            <FormField name="showDday">
              <div className={s.toggleRow}>
                <FormLabel>D-Day 노출</FormLabel>
                <FormControl asChild>
                  <Switch checked={showDday} onCheckedChange={setShowDday} />
                </FormControl>
              </div>
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
                  onRemove={(index) => removeGalleryPhoto(index)}
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
                <ColorPicker value={selectedColor} onChange={setSelectedColor} />
              </FormControl>
            </FormField>

            {/* Font Selection */}
            <FormField name="font">
              <FormHeader>
                <FormLabel>글꼴</FormLabel>
              </FormHeader>
              <FormControl asChild>
                <div className={s.fontSelector}>
                  <span>고운돋움 (기본)</span>
                </div>
              </FormControl>
            </FormField>
          </Form>

          {/* 제출 버튼 */}
          <BottomCTA.Single onClick={() => setToastOpen(true)}>참석 의사 전달하기</BottomCTA.Single>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Buttons & Actions</h2>
          <span className={s.sectionHint}>Supported variants and special actions</span>
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
          <h2>Overlays & Toasts</h2>
          <span className={s.sectionHint}>Dialog, AlertDialog, BottomSheet, Toast, BottomCTA</span>
        </div>
        <div className={s.overlayGrid}>
          <div className={s.overlayCard}>
            <div className={s.overlayActions}>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger asChild>
                  <Button variant="ghost">Dialog</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header title="Dialog preview" />
                  <Dialog.Body>
                    <p>Cache-friendly data and tokens are previewed here.</p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.Close asChild>
                      <Button variant="ghost">Close</Button>
                    </Dialog.Close>
                    <Button>Action</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary">Alert</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <p>Warning: this action immediately syncs the live builder.</p>
                  <div className={s.alertActions}>
                    <AlertDialogCancel asChild>
                      <Button variant="ghost">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button color="red">Confirm</Button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <BottomSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              header="Quick actions"
              cta={<Button>Save draft</Button>}
            >
              <p>The builder action sheet rises from the bottom on mobile.</p>
            </BottomSheet>
            <Button variant="ghost" onClick={() => setSheetOpen(true)}>
              BottomSheet
            </Button>
          </div>
          <div className={s.overlayCard}>
            <h3>Toast demo</h3>
            <ToastProvider swipeDirection="right">
              <Button onClick={() => setToastOpen(true)}>Show toast</Button>
              <Toast open={toastOpen} onOpenChange={setToastOpen}>
                <ToastTitle>Saved</ToastTitle>
                <ToastDescription>Color tokens are synced to the live preview.</ToastDescription>
              </Toast>
              <ToastViewport />
            </ToastProvider>
          </div>
        </div>
      </section>
    </div>
  );
}
