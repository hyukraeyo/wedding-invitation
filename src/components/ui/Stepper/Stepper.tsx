import React from 'react';
import styles from './Stepper.module.scss';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn(styles.root, className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              styles.step,
              index < currentStep && styles.completed,
              index === currentStep && styles.active
            )}
          >
            <span className={styles.number}>{index + 1}</span>
            <span className={styles.label}>{step.label}</span>
          </div>
          {index < steps.length - 1 && <div className={styles.separator} />}
        </React.Fragment>
      ))}
    </div>
  );
};

Stepper.displayName = 'Stepper';

export { Stepper };
