"use client";

import React from 'react';
import { PerformanceProfiler } from './PerformanceProfiler/PerformanceProfiler';

// Lightweight wrapper to bridge server components with a client-side PerformanceProfiler
export default function PerformanceProfilerWrapper({ id = 'root-profiler', children }: { id?: string; children: React.ReactNode }) {
  return <PerformanceProfiler id={id}>{children}</PerformanceProfiler>;
}
