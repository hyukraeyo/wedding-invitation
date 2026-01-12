import React, { useCallback } from 'react';
import { Slider as ShadcnSlider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    unit?: string | undefined;
    className?: string | undefined;
    /** If true, show +/- step buttons */
    showStepButtons?: boolean | undefined;
}

export const Slider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    className = '',
    showStepButtons = true
}: SliderProps) => {
    const handleStep = useCallback((direction: 'up' | 'down') => {
        const newValue = direction === 'up' ? value + step : value - step;
        if (newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    }, [value, onChange, min, max, step]);

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex items-center gap-4 w-full">
                <ShadcnSlider
                    value={[value]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={(vals) => {
                        const val = vals[0];
                        if (val !== undefined) onChange(val);
                    }}
                    className="flex-1"
                />
            </div>

            {showStepButtons && (
                <div className="flex items-center justify-between border rounded-md p-1 bg-muted/20">
                    <Button
                        variant="toss-text"
                        size="icon-sm"
                        onClick={() => handleStep('down')}
                        disabled={value <= min}
                    >
                        <Minus size={14} />
                    </Button>
                    <span className="text-sm font-medium">
                        {value}{unit}
                    </span>
                    <Button
                        variant="toss-text"
                        size="icon-sm"
                        onClick={() => handleStep('up')}
                        disabled={value >= max}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            )}
        </div>
    );
};
