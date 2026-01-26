"use client";

import React, { useState } from "react";
import { PropItem } from "../DocSection";

type ControlType = 'boolean' | 'select' | 'text' | 'radio' | 'segmented';
type ControlValue = boolean | string;

const getFallbackValue = (type: ControlType): ControlValue => {
    return type === 'boolean' ? false : '';
};

export interface ControlConfig {
    type?: ControlType; // If undefined, it will be displayed without a control (e.g. callbacks)
    defaultValue?: ControlValue;
    description?: string;
    options?: (string | { label: string; value: string; icon?: React.ReactNode })[];
    componentType?: string; // The TypeScript type string to check (e.g. "'default' | 'basic'")
}

export type ConfigMap = { [key: string]: ControlConfig };

/**
 * A hook to automatically manage the state and documentation generation for Design System props.
 * This simplifies the 'playground' code by removing the need to manually create state and PropItem arrays.
 */
export function usePropControls(config: ConfigMap) {
    const [values, setValues] = useState<Record<string, ControlValue>>(() => {
        const initial: Record<string, ControlValue> = {};
        Object.entries(config).forEach(([key, cfg]) => {
            // Only set initial value if it exists, otherwise it might be undefined
            if (cfg.defaultValue !== undefined) {
                initial[key] = cfg.defaultValue;
            }
        });
        return initial;
    });

    const setValue = (key: string, value: ControlValue) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    // Generates the PropItem array for the DocSection
    // accepts an optional filter function to conditionally hide props (e.g. based on current values)
    const getPropItems = (filter?: (key: string, currentValues: Record<string, ControlValue>) => boolean): PropItem[] => {
        return Object.entries(config)
            .filter(([key]) => filter ? filter(key, values) : true)
            .map(([key, cfg]) => {
                const item: PropItem = {
                    name: key,
                    type: cfg.componentType || cfg.type || '-',
                    description: cfg.description || '',
                };

                // Add default value display if not controlled or just for info
                if (cfg.defaultValue !== undefined && !cfg.type) {
                    item.defaultValue = String(cfg.defaultValue);
                }

                // If it has a control type, add the control object
                if (cfg.type) {
                    item.control = {
                        type: cfg.type,
                        value: values[key] ?? (cfg.defaultValue ?? getFallbackValue(cfg.type)),
                        onChange: (val) => setValue(key, val),
                        options: cfg.options
                    };
                }

                return item;
            });
    };

    return {
        values,
        setValue,
        setValues,
        getPropItems
    };
}
