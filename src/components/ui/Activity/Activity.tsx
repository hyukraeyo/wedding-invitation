'use client';

import * as React from 'react';
import { Activity as ReactActivity } from 'react';

type ActivityMode = 'visible' | 'hidden';

interface ActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  mode?: ActivityMode;
}

export const Activity = React.forwardRef<HTMLDivElement, ActivityProps>(
  ({ children, mode = 'visible', className, ...props }, ref) => {
    return (
      <ReactActivity mode={mode}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </ReactActivity>
    );
  }
);

Activity.displayName = 'Activity';
