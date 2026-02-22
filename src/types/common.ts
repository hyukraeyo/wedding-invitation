// Common Type Definitions for Wedding Invitation Project

// Utility Types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Branded Types for Type Safety
export type Brand<T, Brand> = T & { readonly __brand: Brand };

// Common Status Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched?: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Event Types
export interface BaseEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeddingEvent extends BaseEvent {
  title: string;
  date: Date;
  location: string;
  description?: string;
}

// Image Types
export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  maxFiles?: number;
  quality?: number; // 0-1
}

// Validation Types
export type ValidationRule<T> = (value: T) => string | null;

export type ValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface AsyncComponentProps extends BaseComponentProps {
  loading?: boolean;
  error?: string | null;
  retry?: () => void;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// SEO Types
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface PageViewEvent extends AnalyticsEvent {
  page: string;
  referrer?: string;
  userAgent?: string;
}

// Feature Flags
export interface FeatureFlags {
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  enablePWA: boolean;
  enableOfflineMode: boolean;
  enableExperimentalFeatures: boolean;
}

// Environment Types
export interface Environment {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  apiUrl: string;
  cdnUrl?: string;
  version: string;
  buildTime: string;
}

// Generic Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type ValueOf<T> = T[keyof T];
export type NonNullable<T> = T extends null | undefined ? never : T;

// Array Utilities
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]]
  ? H
  : never;
export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer U] ? U : [];
export type Length<T extends readonly unknown[]> = T['length'];

// Object Utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Function Types
export type AnyFunction = (...args: unknown[]) => unknown;
export type Predicate<T> = (value: T) => boolean;
export type Comparator<T> = (a: T, b: T) => number;

// Promise Types
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

// String Literal Types
export type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;
export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : S;

// Record Utilities
export type RecordKey = string | number | symbol;
export type StrictRecord<K extends RecordKey, V> = Record<K, V>;

// Discriminated Union Helpers
export type Discriminant<T, K extends keyof T> = T extends { [P in K]: infer D } ? D : never;
export type ExtractByDiscriminant<T, K extends keyof T, D extends Discriminant<T, K>> = T extends {
  [P in K]: D;
}
  ? T
  : never;
