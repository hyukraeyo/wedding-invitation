import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './NumericSpinner.module.scss';

// SVG Icons
const MinusIcon = ({ className }: { className?: string | undefined }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
  >
    <path d="M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string | undefined }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
  >
    <path d="M12 5V19" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface NumericSpinnerProps {
  /**
   * The current value (Controlled mode)
   */
  number?: number;
  /**
   * The initial value (Uncontrolled mode)
   * @default 0
   */
  defaultNumber?: number;
  /**
   * Callback when value changes
   */
  onNumberChange?: (number: number) => void;
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'tiny' | 'small' | 'medium' | 'large';
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 999
   */
  max?: number;
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  /**
   * Disable interaction
   */
  disabled?: boolean;
  /**
   * Alias for disabled to match TDS docs if needed
   */
  disable?: boolean;
  /**
   * Aria label for decrease button
   */
  decreaseAriaLabel?: string;
  /**
   * Aria label for increase button
   */
  increaseAriaLabel?: string;
  className?: string;
  id?: string;
}

export const NumericSpinner = ({
  number: controlledValue,
  defaultNumber = 0,
  onNumberChange,
  size = 'medium',
  min = 0,
  max = 999,
  step = 1,
  disabled: _disabled,
  disable: _disable,
  decreaseAriaLabel = 'Decrease value',
  increaseAriaLabel = 'Increase value',
  className,
  id,
}: NumericSpinnerProps) => {
  const disabled = _disabled || _disable || false;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultNumber);

  // Sync internal state if controlled value changes (optional, but good for hybrid)
  // Usually we stick to one source of truth.
  // If controlledValue is undefined, we use internalValue.
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleUpdate = useCallback(
    (newValue: number) => {
      if (newValue < min || newValue > max) return;

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onNumberChange?.(newValue);
    },
    [isControlled, min, max, onNumberChange]
  );

  const decrease = useCallback(() => {
    handleUpdate(currentValue - step);
  }, [currentValue, step, handleUpdate]);

  const increase = useCallback(() => {
    handleUpdate(currentValue + step);
  }, [currentValue, step, handleUpdate]);

  // Long press logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  const handlePressStart = useCallback(
    (action: () => void) => {
      if (disabled) return;
      action(); // Immediate action

      // Start waiting for long press
      timerRef.current = setTimeout(() => {
        // Start rapid fire
        intervalRef.current = setInterval(() => {
          action();
        }, 100); // Rapid speed
      }, 500); // Delay before rapid fire
    },
    [disabled]
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Buttons state
  const isMin = currentValue <= min;
  const isMax = currentValue >= max;

  return (
    <div
      id={id}
      className={cn(styles.container, styles[size], disabled && styles.disabled, className)}
      role="group"
      aria-disabled={disabled}
    >
      <button
        type="button"
        className={styles.button}
        disabled={disabled || isMin}
        onPointerDown={(e) => {
          e.preventDefault(); // Prevent text selection
          handlePressStart(decrease);
        }}
        onPointerUp={clearTimers}
        onPointerLeave={clearTimers}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            decrease();
          }
        }}
        aria-label={decreaseAriaLabel}
      >
        <MinusIcon className={styles.icon} />
      </button>

      <span className={styles.value} aria-live="polite">
        {currentValue}
      </span>

      <button
        type="button"
        className={styles.button}
        disabled={disabled || isMax}
        onPointerDown={(e) => {
          e.preventDefault();
          handlePressStart(increase);
        }}
        onPointerUp={clearTimers}
        onPointerLeave={clearTimers}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            increase();
          }
        }}
        aria-label={increaseAriaLabel}
      >
        <PlusIcon className={styles.icon} />
      </button>
    </div>
  );
};

NumericSpinner.displayName = 'NumericSpinner';
