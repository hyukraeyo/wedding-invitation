import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    value: string;
    colors: string[];
    onChange: (color: string) => void;
    className?: string;
}

const getLuma = (hex: string): number => {
    // Basic hex parsing, assumes standard #RRGGBB format
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const ColorPicker = ({ value, colors, onChange, className }: ColorPickerProps) => {
    const colorData = useMemo(() =>
        colors.map(color => ({
            color,
            ringColor: getLuma(color) > 220 ? '#D1D5DB' : color
        })),
        [colors]
    );

    return (
        <div className={cn("grid grid-cols-7 gap-2", className)}>
            {colorData.map(({ color, ringColor }) => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={cn(
                        "w-8 h-8 rounded-full border border-black/10 transition-transform active:scale-90",
                        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                        value === color && "ring-2 ring-offset-2 scale-110"
                    )}
                    style={{
                        backgroundColor: color,
                        // If value matches, we use ringColor for the ring (using tailwind arbitrary values would be nicer but style override is easy here)
                        // Actually tailwind ring-color utilities work better if ringColor is standard.
                        // Here we use box-shadow style for custom ring color to match logic
                        boxShadow: value === color ? `0 0 0 2px white, 0 0 0 4px ${ringColor}` : undefined
                    }}
                    title={color}
                    type="button"
                />
            ))}
        </div>
    );
};
