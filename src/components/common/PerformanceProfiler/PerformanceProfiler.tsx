"use client";

import React from 'react';

type PerfProps = {
  id: string;
  children: React.ReactNode;
  onRender?: (
    id: string,
    phase: 'mount' | 'update',
    actualTime: number,
    baseTime: number,
    startTime: number,
    commitTime: number,
    interactions?: Set<unknown>
  ) => void;
};

export function PerformanceProfiler({ id, children, onRender }: PerfProps) {
  const handleRender = React.useMemo(() => {
    return (
      rid: string,
      phase: string,
      actualTime: number,
      baseTime: number,
      startTime: number,
      commitTime: number,
      interactions?: Set<unknown>
    ) => {
      if (typeof onRender === 'function') {
        onRender(rid, phase as 'mount' | 'update', actualTime, baseTime, startTime, commitTime, interactions);
      } else {
        // Default lightweight log to console for quick profiling during development
        console.debug(`[PerfProfiler] ${rid} ${phase} | actual=${actualTime.toFixed(2)}ms, base=${baseTime.toFixed(2)}ms`);
      }
    };
  }, [onRender]);

  return <React.Profiler id={id} onRender={handleRender}>{children}</React.Profiler>;
}

export default PerformanceProfiler;
