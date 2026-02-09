'use client';

import React from 'react';
import { DateWheelPicker } from '@/components/ui/DateWheelPicker';

export default function DatePickerTestPage() {
  const [date, setDate] = React.useState<Date>(new Date(2025, 5, 15));

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        minHeight: '100vh',
        justifyContent: 'center',
        background: 'var(--color-grey-100)',
      }}
    >
      <h1>Date Wheel Picker Test</h1>

      <div
        style={{
          background: 'var(--background)',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px color-mix(in srgb, var(--foreground) 10%, transparent)',
        }}
      >
        <DateWheelPicker value={date} onChange={setDate} minYear={2020} maxYear={2030} size="lg" />
      </div>

      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        Selected Date: {date.toLocaleDateString('ko-KR')}
      </div>
    </div>
  );
}
