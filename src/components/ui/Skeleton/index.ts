"use client";

import { Skeleton as TDSSkeleton } from '@toss/tds-mobile';

/**
 * TDS Skeleton
 * Exported as any to bypass strict mandatory prop checks (like className) 
 * in existing codebases while migrating.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Skeleton = TDSSkeleton as any;

export type { SkeletonProps } from '@toss/tds-mobile';
