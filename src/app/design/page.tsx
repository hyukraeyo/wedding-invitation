'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { Mail, Lock, Send, ChevronRight, User } from 'lucide-react';
import s from './DesignPage.module.scss';

export default function DesignPage() {
  return (
    <div className={s.container}>
      <header className={s.header}>
        <h1>Banana Design System</h1>
        <p>Minimal & Smooth UI Components Showcase</p>
      </header>

      {/* Buttons */}
      <section className={s.section}>
        <h2>Buttons</h2>
        <div className={s.card}>
          <div className={s.label}>Variants</div>
          <div className={s.row}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <div className={s.label}>Sizes & States</div>
          <div className={s.row}>
            <Button size="lg">Large Target</Button>
            <Button size="md">Medium</Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>

          <div className={s.label}>With Icons</div>
          <div className={s.row}>
            <Button leftIcon={<Send size={18} />}>Send Message</Button>
            <Button variant="secondary" rightIcon={<ChevronRight size={18} />}>
              Continue
            </Button>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className={s.section}>
        <h2>Inputs</h2>
        <div className={s.card}>
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            leftIcon={<User size={20} />} 
          />
          
          <Input 
            label="Email Address" 
            placeholder="example@banana.com" 
            leftIcon={<Mail size={20} />} 
          />
          
          <Input 
            label="Error State" 
            placeholder="Invalid input" 
            error="This email is already in use."
            defaultValue="wrong@email.com" 
          />
        </div>
      </section>

      {/* Selectors */}
      <section className={s.section}>
        <h2>Selectors</h2>
        <div className={s.card}>
          <div className={s.row} style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Notifications</span>
            <Switch defaultChecked />
          </div>
          
          <div className={s.row} style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Dark Mode</span>
            <Switch />
          </div>

          <div className={s.row} style={{ marginTop: '12px' }}>
            <Checkbox label="Agree to terms" defaultChecked />
            <Checkbox.Circle label="Subscribe to newsletter" />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className={s.section}>
        <h2>Badges</h2>
        <div className={s.card}>
          <div className={s.row}>
            <Badge color="primary">New</Badge>
            <Badge color="blue">Updated</Badge>
            <Badge color="green">Success</Badge>
            <Badge color="red">Danger</Badge>
            <Badge color="grey">Archive</Badge>
          </div>
          <div className={s.row}>
            <Badge variant="solid" color="primary">Solid Primary</Badge>
            <Badge variant="outline" color="primary">Outline</Badge>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className={s.section}>
        <h2>Preview: Login Card</h2>
        <div className={s.card} style={{ backgroundColor: '#fffdf0', border: '1px solid #fbc02d' }}>
          <Input label="Email" placeholder="Enter your email" leftIcon={<Mail size={18} />} />
          <Input label="Password" type="password" placeholder="••••••••" leftIcon={<Lock size={18} />} />
          <div className={s.row} style={{ justifyContent: 'space-between', margin: '4px 0' }}>
            <Checkbox label="Remember me" />
            <span style={{ color: '#f9a825', fontSize: '13px', fontWeight: 600 }}>Forgot password?</span>
          </div>
          <Button fluid style={{ marginTop: '8px' }}>Login</Button>
        </div>
      </section>
    </div>
  );
}
