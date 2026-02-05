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
import { IconButton } from '@/components/ui/IconButton';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { OptionList } from '@/components/ui/OptionList';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TextButton } from '@/components/ui/TextButton';
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
import { CTAButton } from '@/components/ui/CTAButton';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormHeader,
  FormSubmit,
} from '@/components/ui/Form';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/Tooltip';
import { DatePicker } from '@/components/common/DatePicker/DatePicker';
import { TimePicker } from '@/components/common/TimePicker/TimePicker';
import { Mail, Lock, Send, ChevronDown, Sparkles } from 'lucide-react';
import s from './DesignPage.module.scss';

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
  const [weddingDate, setWeddingDate] = React.useState('2026-06-14');
  const [weddingTime, setWeddingTime] = React.useState('14:30');

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
          <h2>실전 폼 조합</h2>
          <span className={s.sectionHint}>실제 프로젝트에서 사용하는 컴포넌트 조합</span>
        </div>
        <div className={s.formComposition}>
          {/* 신랑/신부 정보 */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>신랑/신부 정보</h3>
            <TextField
              label="신랑 이름"
              placeholder="홍길동"
              helperText="실명을 입력해주세요"
              clearable
            />
            <TextField label="신부 이름" placeholder="김영희" clearable />
            <TextField
              label="연락처"
              type="tel"
              placeholder="010-1234-5678"
              helperText="'-' 없이 입력하시면 자동으로 포맷됩니다"
            />
          </div>

          {/* 예식 정보 */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>예식 정보</h3>
            <DatePicker
              label="예식 날짜"
              placeholder="날짜를 선택하세요"
              value={weddingDate}
              onChange={setWeddingDate}
            />
            <TimePicker
              label="예식 시간"
              placeholder="시간을 선택하세요"
              value={weddingTime}
              onChange={setWeddingTime}
            />
            <TextField label="예식장 이름" placeholder="그랜드 컨벤션 센터" clearable />
            <TextField
              label="예식장 주소"
              placeholder="서울시 강남구 테헤란로 123"
              helperText="도로명 주소를 입력해주세요"
              clearable
            />
          </div>

          {/* 관계 선택 (Dialog Select) */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>관계 선택</h3>
            <Dialog>
              <Dialog.Trigger asChild>
                <TextField.Button
                  label="신랑과의 관계"
                  placeholder="관계를 선택하세요"
                  value="친구"
                />
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header title="신랑과의 관계" />
                <Dialog.Body>
                  <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    <RadioGroupItem value="family">가족</RadioGroupItem>
                    <RadioGroupItem value="friend">친구</RadioGroupItem>
                    <RadioGroupItem value="colleague">직장동료</RadioGroupItem>
                    <RadioGroupItem value="etc">기타</RadioGroupItem>
                  </RadioGroup>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="ghost">취소</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button>확인</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </div>

          {/* 참석 여부 (SegmentedControl) */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>참석 여부</h3>
            <SegmentedControl value={segmentValue} alignment="fluid" onChange={setSegmentValue}>
              <SegmentedControl.Item value="attend">참석</SegmentedControl.Item>
              <SegmentedControl.Item value="absent">불참</SegmentedControl.Item>
              <SegmentedControl.Item value="pending">미정</SegmentedControl.Item>
            </SegmentedControl>
          </div>

          {/* 축하 메시지 (RichTextEditor) */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>축하 메시지</h3>
            <RichTextEditor
              content={richText}
              placeholder="따뜻한 축하 메시지를 남겨주세요"
              onChange={setRichText}
            />
          </div>

          {/* 식사 여부 (RadioGroup) */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>식사 여부</h3>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <RadioGroupItem value="yes">식사 하겠습니다</RadioGroupItem>
              <RadioGroupItem value="no">식사 안 하겠습니다</RadioGroupItem>
            </RadioGroup>
          </div>

          {/* 동반 인원 (Input) */}
          <div className={s.formGroup}>
            <h3 className={s.formGroupTitle}>동반 인원</h3>
            <Input
              type="number"
              label="동반 인원 수"
              placeholder="0"
              helperText="본인 포함 총 인원을 입력해주세요"
            />
          </div>

          {/* 제출 버튼 */}
          <BottomCTA.Single onClick={() => setToastOpen(true)}>참석 의사 전달하기</BottomCTA.Single>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Fields & Notes</h2>
          <span className={s.sectionHint}>Inputs, TextField, Textarea, Rich Text</span>
        </div>
        <div className={s.fieldGrid}>
          <TextField
            label="Recipient email"
            placeholder="banana@toss.work"
            helperText="We use this for status updates only."
            leftSlot={<Mail size={18} />}
            clearable
            className={s.fieldControl}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            error="Use at least 8 characters."
            leftSlot={<Lock size={18} />}
            className={s.fieldControl}
          />
          <Input label="Nickname" placeholder="Banana" className={s.fieldControl} />
          <Textarea
            label="Message"
            placeholder="Add a short celebratory note."
            showCount
            maxLength={160}
            className={s.fieldControl}
          />
          <Field.Root className={s.fieldWrapper}>
            <Field.Label htmlFor="custom-input">Custom field</Field.Label>
            <Input id="custom-input" placeholder="Add context for this flow." />
            <Field.HelperText>Field helper text keeps the label grounded.</Field.HelperText>
          </Field.Root>
          <div className={s.richEditorCard}>
            <RichTextEditor
              content={richText}
              placeholder="Share a celebratory story."
              onChange={setRichText}
            />
          </div>
          <div className={s.optionListWrapper}>
            <OptionList options={optionListItems} value={optionValue} onSelect={setOptionValue} />
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Selectors</h2>
          <span className={s.sectionHint}>Switches, toggles, segmented controls, and sliders</span>
        </div>
        <div className={s.selectorGrid}>
          <div className={s.selectorCard}>
            <div className={s.selectorRow}>
              <span>Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className={s.selectorRow}>
              <span>Dark mode</span>
              <Toggle defaultPressed />
            </div>
            <div className={s.selectorRow}>
              <span>Agree to terms</span>
              <Checkbox defaultChecked label="Agree" />
            </div>
            <div className={s.selectorRow}>
              <span>Quick tools</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ChevronDown size={14} />}
                    className={s.menuTrigger}
                  >
                    {menuChoice === 'duplicate'
                      ? 'Duplicate'
                      : menuChoice === 'export'
                        ? 'Export'
                        : 'Preview'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Quick tools</DropdownMenuLabel>
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem key={item.value} onSelect={() => setMenuChoice(item.value)}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={menuChecked} onCheckedChange={setMenuChecked}>
                    Auto sync tokens
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <SegmentedControl value={segmentValue} alignment="fluid" onChange={setSegmentValue}>
              <SegmentedControl.Item value="daily">Daily</SegmentedControl.Item>
              <SegmentedControl.Item value="weekly">Weekly</SegmentedControl.Item>
              <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
            </SegmentedControl>
            <RadioGroup value={radioValue} onValueChange={setRadioValue} className={s.radioGroup}>
              <RadioGroupItem value="toss">Toss</RadioGroupItem>
              <RadioGroupItem value="apple">Apple</RadioGroupItem>
              <RadioGroupItem value="banana">Banana</RadioGroupItem>
            </RadioGroup>
            <div className={s.sliderRow}>
              <span>Timeline weight</span>
              <Slider
                value={[sliderValue]}
                min={0}
                max={100}
                onValueChange={(value) => setSliderValue(value[0] ?? 0)}
              />
            </div>
          </div>
          <div className={s.selectorCard}>
            <Tabs defaultValue="summary">
              <TabsList className={s.tabList}>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <p className={s.tabCopy}>
                  React 19.2 + Next.js 16 view transitions stay silky smooth.
                </p>
              </TabsContent>
              <TabsContent value="details">
                <p className={s.tabCopy}>Suspense-friendly caching keeps the UI responsive.</p>
              </TabsContent>
            </Tabs>
            <SegmentedControl value={detailMode} alignment="fluid" onChange={setDetailMode}>
              <SegmentedControl.Item value="plan">Plan</SegmentedControl.Item>
              <SegmentedControl.Item value="compose">Compose</SegmentedControl.Item>
            </SegmentedControl>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Cards & Feedback</h2>
          <span className={s.sectionHint}>Avatar, badge, info, empty state, loader, skeleton</span>
        </div>
        <div className={s.cardGrid}>
          <div>
            <div className={s.statusRow}>
              <Avatar>
                <Avatar.Fallback delayMs={600}>BR</Avatar.Fallback>
              </Avatar>
              <div>
                <p className={s.statusLabel}>Banana RSVP</p>
                <p className={s.statusValue}>Ready to launch</p>
              </div>
              <Badge size="sm" color="green">
                Live
              </Badge>
            </div>
            <div className={s.badgeRow}>
              {statuses.map((status) => (
                <div key={status.label} className={s.statusStack}>
                  <span>{status.label}</span>
                  <strong>{status.value}</strong>
                </div>
              ))}
            </div>
            <ProgressBar value={34} />
            <div className={s.loaderRow}>
              <Loader size="sm" />
              <Skeleton circle width={24} height={24} />
              <Skeleton width={80} height={32} />
            </div>
          </div>
          <div>
            <InfoMessage>The next sync propagates builder milestones instantly.</InfoMessage>
            <EmptyState
              icon={<Sparkles size={32} />}
              title="Empty preview"
              description="Pick a theme so the invitation card renders here."
              action={{ label: 'Pick theme', onClick: () => setToastOpen(true) }}
              className={s.emptyState}
              variant="banana"
            />
          </div>
          <div>
            <Accordion type="multiple" defaultValue={['Builder meta']}>
              {accordionItems.map((item) => (
                <AccordionItem key={item.title} value={item.title}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>TextField Variants</h2>
          <span className={s.sectionHint}>Primary, Secondary, Outline, Ghost, Classic</span>
        </div>
        <div className={s.variantGrid}>
          {(['primary', 'secondary', 'outline', 'ghost', 'classic'] as const).map((v) => (
            <TextField
              key={v}
              variant={v}
              label={`Variant: ${v}`}
              placeholder={`Enter text in ${v} style`}
              className={s.fieldControl}
              clearable
            />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>TextField Sizes</h2>
          <span className={s.sectionHint}>XS, SM, MD, LG, XL</span>
        </div>
        <div className={s.variantGrid}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((sz) => (
            <TextField
              key={sz}
              size={sz}
              label={`Size: ${sz}`}
              placeholder={`Size ${sz} input`}
              className={s.fieldControl}
              clearable
            />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>TextField Radii</h2>
          <span className={s.sectionHint}>None, Small, Medium, Large, Full</span>
        </div>
        <div className={s.variantGrid}>
          {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
            <TextField
              key={r}
              radius={r}
              label={`Radius: ${r}`}
              placeholder={`${r} corner radius`}
              className={s.fieldControl}
              clearable
            />
          ))}
        </div>
      </section>
      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>TextField.Button</h2>
          <span className={s.sectionHint}>Interactive slots used in builders</span>
        </div>
        <div className={s.variantGrid}>
          <TextField.Button label="Date selector" placeholder="Select date" />
          <TextField.Button label="Time selector" value="09:00 PM" variant="outline" />
          <TextField.Button
            label="Secondary variant"
            placeholder="Secondary button"
            variant="secondary"
          />
          <TextField.Button label="Ghost variant" placeholder="Ghost button" variant="ghost" />
          <TextField.Button label="Small size" placeholder="Small" size="sm" />
          <TextField.Button label="Error state" placeholder="Has error" error="Mandatory field" />
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Form & Validation</h2>
          <span className={s.sectionHint}>Radix Form Primitive integration</span>
        </div>
        <div className={s.variantGrid}>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              setToastOpen(true);
            }}
          >
            <FormField name="email">
              <FormHeader>
                <FormLabel>Email</FormLabel>
                <FormMessage match="valueMissing">Please enter your email</FormMessage>
                <FormMessage match="typeMismatch">Please enter a valid email</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <TextField type="email" required placeholder="banana@toss.work" />
              </FormControl>
            </FormField>

            <FormField name="details">
              <FormHeader>
                <FormLabel>Details</FormLabel>
                <FormMessage match="valueMissing">Please enter details</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <Textarea required placeholder="How does this work?" />
              </FormControl>
            </FormField>

            <FormSubmit asChild>
              <Button style={{ marginTop: 10 }}>Submit Form</Button>
            </FormSubmit>
          </Form>
        </div>
      </section>
    </div>
  );
}
