'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Dialog } from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { NumericSpinner } from '@/components/ui/NumericSpinner';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { OptionList } from '@/components/ui/OptionList';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { Skeleton } from '@/components/ui/Skeleton';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TextField } from '@/components/ui/TextField';
import { Textarea } from '@/components/ui/Textarea';
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
import { ChrysanthemumSVG } from '@/components/common/Icons';
import { useNameInput, usePhoneInput } from '@/hooks/useFormInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { isValidKoreanNameValue, isValidPhone } from '@/lib/utils';
import { Mail, Lock, ChevronDown, Sparkles, Plus, CloudUpload, Check, Search } from 'lucide-react';
import s from './DesignPage.module.scss';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePhoto } from '@/components/common/SortablePhoto';

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

const accordionItems = [
  {
    title: 'Builder meta',
    content: 'Touch targets, spacing, and token pairing for mobile-first flows.',
  },
  {
    title: 'Motion cues',
    content: 'iOS-style cubic-bezier curves keep each transition buttery smooth.',
  },
];

const statuses = [
  { label: 'Invites', value: '542 sent' },
  { label: 'Guests', value: '1,380 confirmed' },
  { label: 'RSVP', value: '34% RSVPd' },
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
  const [selectedStyle, setSelectedStyle] = React.useState('classic');
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  const mainPhotoInputRef = React.useRef<HTMLInputElement>(null);

  const colors = [
    { value: '#C69C6D', label: 'Beige' },
    { value: '#4B4B4B', label: 'Dark' },
    { value: '#FFB7B2', label: 'Pink' },
    { value: '#D4A5D4', label: 'Purple' },
  ];

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
                />
              </FormControl>
              <p
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--grey-500, #6b7280)',
                }}
              >
                본인 포함 총 인원을 입력해주세요
              </p>
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
            <div className={s.photoSection}>
              <div className={s.sectionTitle}>
                <span>사진 관리</span>
                <span className={s.count}>
                  현재 등록된 사진 <strong style={{ color: '#FBC02D' }}>{galleryCount}</strong> / 10
                </span>
              </div>
              <div className={s.photoGrid}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={galleryPhotos} strategy={rectSortingStrategy}>
                    {galleryPhotos.map((photo, index) => (
                      <SortablePhoto
                        key={photo}
                        id={photo}
                        url={photo}
                        onRemove={() => removeGalleryPhoto(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {!isGalleryFull && (
                  <Button
                    unstyled
                    className={s.addPhotoButton}
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <Plus size={24} />
                    <span>추가</span>
                  </Button>
                )}
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Main Greeting Photo */}
            <div className={s.photoSection}>
              <div className={s.sectionTitle}>
                <span>사진</span>
              </div>
              <div
                className={s.mainPhotoUploader}
                onClick={() => mainPhotoInputRef.current?.click()}
              >
                {mainPhoto ? (
                  <div className={s.mainPhotoPreview}>
                    <img src={mainPhoto} alt="Main Greeting" />
                  </div>
                ) : (
                  <>
                    <div className={s.iconCircle}>
                      <CloudUpload size={24} />
                    </div>
                    <div className={s.uploadText}>인사말 사진 추가</div>
                    <div className={s.uploadSubtext}>클릭하여 이미지를 선택하세요</div>
                  </>
                )}
                <input
                  type="file"
                  ref={mainPhotoInputRef}
                  onChange={handleMainPhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <SegmentedControl value={photoRatio} onChange={setPhotoRatio} alignment="fluid">
                <SegmentedControl.Item value="fixed">고정 (기본)</SegmentedControl.Item>
                <SegmentedControl.Item value="original">원본 비율</SegmentedControl.Item>
              </SegmentedControl>
            </div>

            {/* Style Selection */}
            <div className={s.selectionSection}>
              <div className={s.sectionTitle}>
                <span>스타일</span>
              </div>
              <div className={s.styleGrid}>
                <div className={s.styleItem} onClick={() => setSelectedStyle('classic')}>
                  <div
                    className={`${s.styleCard} ${selectedStyle === 'classic' ? s.selected : ''}`}
                  >
                    <div className={s.previewMockup}>
                      <div className={s.mockTitle}>The Marriage</div>
                      <div className={s.mockNames}>신랑, 신부 결혼해요.</div>
                      <div
                        style={{
                          height: '20px',
                          background: '#fcefa3',
                          margin: '8px auto',
                          width: '80%',
                          opacity: 0.3,
                          borderRadius: '4px',
                        }}
                      ></div>
                      <div className={s.mockDate}>2026년 4월 29일</div>
                    </div>
                  </div>
                  <span className={s.styleName}>클래식</span>
                </div>

                <div className={`${s.styleItem} ${s.placeholder}`}>
                  <div className={s.styleCard}>
                    <Plus size={24} />
                  </div>
                  <span className={s.styleName}>추가 예정</span>
                </div>

                <div className={`${s.styleItem} ${s.placeholder}`}>
                  <div className={s.styleCard}>
                    <Plus size={24} />
                  </div>
                  <span className={s.styleName}>추가 예정</span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className={s.selectionSection}>
              <div className={s.sectionTitle}>
                <span>강조색</span>
              </div>
              <div className={s.colorContainer}>
                {colors.map((color) => (
                  <div
                    key={color.value}
                    className={s.colorSwatch}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    {selectedColor === color.value && <Check size={20} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Font Selection */}
            <div className={s.selectionSection}>
              <div className={s.sectionTitle}>
                <span>글꼴</span>
              </div>
              <div className={s.fontSelector}>
                <span>고운돋움 (기본)</span>
              </div>
            </div>
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
        <div
          style={{
            marginTop: '32px',
            position: 'relative',
            height: '380px',
            border: '1px solid #e2e8f0',
            borderRadius: '32px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100%',
              border: '2px dashed #cbd5e1',
              borderRadius: '24px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '16px',
            }}
          >
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
