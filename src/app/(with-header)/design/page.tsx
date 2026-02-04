'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextField } from '@/components/ui/TextField';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { Toggle } from '@/components/ui/Toggle';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Slider } from '@/components/ui/Slider';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Mail, Lock, Send, ChevronRight } from 'lucide-react';
import s from './DesignPage.module.scss';

const categories = [
  { label: 'Ceremony', status: 'open' },
  { label: 'Reception', status: 'pending' },
  { label: 'After party', status: 'salt' },
];

export default function DesignPage() {
  const [radioValue, setRadioValue] = React.useState('toss');
  const [tabValue, setTabValue] = React.useState('summary');
  const [sliderValue, setSliderValue] = React.useState(34);

  return (
    <div className={s.root}>
      <header className={s.header}>
        <p className={s.kicker}>Banana Studio · Toss + Apple Inspired</p>
        <h1>UI Playground</h1>
        <p>Minimal samples of buttons, inputs, selectors, and data cards.</p>
      </header>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Buttons</h2>
          <span className={s.sectionHint}>Toss pressure, Apple polish</span>
        </div>
        <div className={s.buttonRow}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="fill" leftIcon={<Send size={16} />}>
            Send
          </Button>
          <Button variant="toss" size="sm" rightIcon={<ChevronRight size={16} />}>
            Continue
          </Button>
          <Button isLoading variant="apple">
            Loading
          </Button>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Fields</h2>
          <span className={s.sectionHint}>Label, helper text, errors</span>
        </div>
        <div className={s.cardRow}>
          <TextField
            label="Recipient email"
            placeholder="bananarsvp@example.com"
            helperText="We will only use this for updates."
            leftSlot={<Mail size={18} />}
            clearable
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            error="Use at least 8 characters."
            leftSlot={<Lock size={18} />}
          />
          <Input label="Nickname" placeholder="바나나" />
          <Textarea label="Message" placeholder="A short note for the couple" showCount maxLength={120} />
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Selectors</h2>
          <span className={s.sectionHint}>Switches, toggles, radios</span>
        </div>
        <div className={s.grid}>
          <Card className={s.selectorCard}>
            <div className={s.selectorRow}>
              <span>Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className={s.selectorRow}>
              <span>Dark mode</span>
              <Switch />
            </div>
            <div className={s.selectorRow}>
              <span>Push-only</span>
              <Toggle defaultPressed />
            </div>
            <SegmentedControl defaultValue="weekly" alignment="fluid">
              <SegmentedControl.Item value="daily">Daily</SegmentedControl.Item>
              <SegmentedControl.Item value="weekly">Weekly</SegmentedControl.Item>
              <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
            </SegmentedControl>
            <RadioGroup value={radioValue} onValueChange={setRadioValue} defaultValue="toss">
              <div className={s.radioRow}>
                <RadioGroupItem value="toss">Toss flow</RadioGroupItem>
                <RadioGroupItem value="apple">Apple flow</RadioGroupItem>
                <RadioGroupItem value="banana">Banana flow</RadioGroupItem>
              </div>
            </RadioGroup>
          </Card>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Data + Feedback</h2>
          <span className={s.sectionHint}>Progress and cards</span>
        </div>
        <div className={s.cardRow}>
          <Card variant="ghost" className={s.statusCard}>
            <div className={s.statusHeader}>
              <div>
                <p className={s.statusLabel}>Next milestone</p>
                <p className={s.statusValue}>34% RSVP</p>
              </div>
              <Badge color="primary">Live</Badge>
            </div>
            <ProgressBar value={34} />
            <div className={s.sliderRow}>
              <span>Timeline weight</span>
              <Slider
                min={0}
                max={100}
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
              />
            </div>
            <div className={s.categoryRow}>
              {categories.map((category) => (
                <span
                  key={category.label}
                  className={s.categoryPill}
                >
                  {category.label}
                  <strong>{category.status}</strong>
                </span>
              ))}
            </div>
          </Card>
          <Card className={s.previewCard}>
            <h3>View transitions</h3>
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <p>Invitation builder updates happen with cache-aware rendering.</p>
              </TabsContent>
              <TabsContent value="details">
                <p>React 19.2 + Next.js 16 transitions keep motion silky.</p>
              </TabsContent>
            </Tabs>
            <Button variant="primary" fullWidth>
              Pick theme
            </Button>
            <div className={s.cardFooter}>
              <Loader size="sm" />
              <span>Syncing tokens</span>
            </div>
          </Card>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Final touch</h2>
          <span className={s.sectionHint}>Spacing and badges</span>
        </div>
        <div className={s.badgeRow}>
          <Badge color="primary">Matched</Badge>
          <Badge color="green" variant="solid">
            Green
          </Badge>
          <Badge color="blue">Calm</Badge>
          <Badge color="red">Warning</Badge>
          <Badge color="grey">Light</Badge>
        </div>
      </section>
    </div>
  );
}
