'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import s from './ProgressStepper.module.scss';

// ------------------------------------------------------------------
// ProgressStep
// ------------------------------------------------------------------

export interface ProgressStepProps {
  title?: string;
  icon?: React.ReactNode;
  /* Internal props injected by ProgressStepper */
  index?: number;
  status?: 'active' | 'completed' | 'inactive';
  variant?: 'compact' | 'icon';
}

const ProgressStep = React.forwardRef<HTMLDivElement, ProgressStepProps>(
  ({ title, icon, index, status, variant, ...props }, ref) => {
    // Compact Variant (Inline: Circle + Text)
    if (variant === 'compact') {
      return (
        <div ref={ref} className={s.compactStep} {...props}>
          <div
            className={clsx(
              s.compactCircle,
              status === 'active' && s.active,
              status === 'completed' && s.completed
            )}
          >
            {/* Show Check if completed? Or just number? 
                TDS Compact usually keeps number or minimal change.
                We'll stick to number for compact unless icon provided.
            */}
            {status === 'completed' ? (index ?? 0) + 1 : (index ?? 0) + 1}
          </div>
          {title && (
            <span
              className={clsx(
                s.compactLabel,
                status === 'active' && s.active,
                status === 'completed' && s.completed
              )}
            >
              {title}
            </span>
          )}
        </div>
      );
    }

    // Default/Icon Variant (Text usually below or structured differently)
    // For now, mapping 'icon' or default to a standard vertical stack layout
    // or similar horizontal layout with text.
    // We'll use a generic vertical stack 'step' style for non-compact.
    return (
      <div ref={ref} className={s.step} {...props}>
        <div
          className={clsx(
            s.circle,
            status === 'active' && s.active,
            status === 'completed' && s.completed
          )}
        >
          {status === 'completed' ? <Check size={14} /> : icon || (index ?? 0) + 1}
        </div>
        {title && <span className={clsx(s.label, status === 'active' && s.active)}>{title}</span>}
      </div>
    );
  }
);
ProgressStep.displayName = 'ProgressStep';

// ------------------------------------------------------------------
// ProgressStepper
// ------------------------------------------------------------------

export interface ProgressStepperProps {
  variant?: 'compact' | 'icon';
  activeStepIndex?: number;
  paddingTop?: 'default' | 'wide';
  checkForFinish?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ProgressStepper = ({
  variant = 'compact',
  activeStepIndex = 0,
  paddingTop = 'default',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkForFinish,
  children,
  className,
}: ProgressStepperProps) => {
  const childrenArray = React.Children.toArray(children);
  const totalSteps = childrenArray.length;

  return (
    <div
      className={clsx(
        variant === 'compact' ? s.compactContainer : s.container,
        paddingTop === 'wide' && s.paddingTop_wide,
        className
      )}
    >
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return null;

        const isLast = index === totalSteps - 1;

        let status: 'active' | 'completed' | 'inactive' = 'inactive';
        if (index === activeStepIndex) {
          status = 'active';
        } else if (index < activeStepIndex) {
          status = 'completed';
        }

        // Clone Step
        const step = React.cloneElement(child as React.ReactElement<ProgressStepProps>, {
          index,
          status,
          variant,
        });

        return (
          <React.Fragment key={index}>
            {step}
            {!isLast && (
              <div
                className={clsx(
                  variant === 'compact' ? s.compactConnector : s.connector,
                  // Logic regarding coloring connection?
                  // Usually if step is completed, the line AFTER it is also colored?
                  // Or line is colored if BOTH sides are completed?
                  // Simple logic: if next step is active or completed, line is active?
                  // Typically: Line indicates flow. If index < activeStepIndex, line is completed?
                  index < activeStepIndex && s.active
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { ProgressStepper, ProgressStep };
