'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/AlertDialog';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import { CTAButton } from '@/components/ui/CTAButton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/Tooltip';
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
  { title: 'Builder meta', content: 'Touch targets, spacing, and token pairing for mobile-first flows.' },
  { title: 'Motion cues', content: 'iOS-style cubic-bezier curves keep each transition buttery smooth.' },
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
          Experience Toss and Apple-inspired interactions for buttons, inputs, selectors, overlays, and
          asynchronous feedback without leaving the design preview.
        </p>
      </header>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Buttons & Actions</h2>
          <span className={s.sectionHint}>Primary, CTA, Text, and Tooltip combos</span>
        </div>
        <div className={s.buttonMatrix}>
          <Button leftIcon={<Send size={16} />}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="fill" size="md">
            Fill
          </Button>
          <TextButton underline>Text button</TextButton>
          <CTAButton>CTA Button</CTAButton>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton variant="clear" size="lg" aria-label="Spark">
                  <Sparkles size={18} />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Tooltip + icon action</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="toss" size="sm">
            Toss accent
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" rightIcon={<ChevronDown size={16} />} className={s.menuTrigger}>
                {menuChoice === 'duplicate' ? 'Duplicate' : menuChoice === 'export' ? 'Export' : 'Preview'}
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
          <Textarea label="Message" placeholder="Add a short celebratory note." showCount maxLength={160} className={s.fieldControl} />
          <Field.Root className={s.fieldWrapper}>
            <Field.Label htmlFor="custom-input">Custom field</Field.Label>
            <Input id="custom-input" placeholder="Add context for this flow." />
            <Field.HelperText>Field helper text keeps the label grounded.</Field.HelperText>
          </Field.Root>
          <Card className={s.richEditorCard}>
            <RichTextEditor content={richText} placeholder="Share a celebratory story." onChange={setRichText} />
          </Card>
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
          <Card className={s.selectorCard}>
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
              <Slider value={[sliderValue]} min={0} max={100} onValueChange={(value) => setSliderValue(value[0] ?? 0)} />
            </div>
          </Card>
          <Card className={s.selectorCard}>
            <Tabs defaultValue="summary">
              <TabsList className={s.tabList}>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <p className={s.tabCopy}>React 19.2 + Next.js 16 view transitions stay silky smooth.</p>
              </TabsContent>
              <TabsContent value="details">
                <p className={s.tabCopy}>Suspense-friendly caching keeps the UI responsive.</p>
              </TabsContent>
            </Tabs>
            <SegmentedControl value={detailMode} alignment="fluid" onChange={setDetailMode}>
              <SegmentedControl.Item value="plan">Plan</SegmentedControl.Item>
              <SegmentedControl.Item value="compose">Compose</SegmentedControl.Item>
            </SegmentedControl>
          </Card>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Cards & Feedback</h2>
          <span className={s.sectionHint}>Avatar, badge, info, empty state, loader, skeleton</span>
        </div>
        <div className={s.cardGrid}>
          <Card>
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
          </Card>
          <Card>
            <InfoMessage>The next sync propagates builder milestones instantly.</InfoMessage>
            <EmptyState
              icon={<Sparkles size={32} />}
              title="Empty preview"
              description="Pick a theme so the invitation card renders here."
              action={{ label: 'Pick theme', onClick: () => setToastOpen(true) }}
              className={s.emptyState}
              variant="banana"
            />
          </Card>
          <Card>
            <Accordion type="multiple" defaultValue={['Builder meta']}>
              {accordionItems.map((item) => (
                <AccordionItem key={item.title} value={item.title}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Overlays & Toasts</h2>
          <span className={s.sectionHint}>Dialog, AlertDialog, BottomSheet, Toast, BottomCTA</span>
        </div>
        <div className={s.overlayGrid}>
          <Card className={s.overlayCard}>
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
                    <Button variant="fill">Action</Button>
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
            <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} header="Quick actions" cta={<Button>Save draft</Button>}>
              <p>The builder action sheet rises from the bottom on mobile.</p>
            </BottomSheet>
            <Button variant="ghost" onClick={() => setSheetOpen(true)}>
              BottomSheet
            </Button>
          </Card>
          <Card className={s.overlayCard}>
            <h3>Toast demo</h3>
            <ToastProvider swipeDirection="right">
              <Button onClick={() => setToastOpen(true)}>Show toast</Button>
              <Toast open={toastOpen} onOpenChange={setToastOpen}>
                <ToastTitle>Saved</ToastTitle>
                <ToastDescription>Color tokens are synced to the live preview.</ToastDescription>
              </Toast>
              <ToastViewport />
            </ToastProvider>
            <div className={s.bottomCTAWrapper}>
              <BottomCTA.Single>
                Bottom CTA
              </BottomCTA.Single>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
