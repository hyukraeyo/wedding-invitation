'use client';

import * as React from 'react';
import { Activity as ReactActivity } from 'react';

interface ActivityProps {
  children: React.ReactNode;
  mode: 'visible' | 'hidden';
}

export const Activity = React.forwardRef<HTMLDivElement, ActivityProps>(
  ({ children, mode }, ref) => {
    return (
      <ReactActivity mode={mode}>
        <div ref={ref}>{children}</div>
      </ReactActivity>
    );
  }
);

Activity.displayName = 'Activity';
