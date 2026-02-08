import { REQUIRED_FIELD_KEYS, type RequiredFieldKey } from '@/lib/builderValidation';

const REQUIRED_FIELD_SET = new Set<RequiredFieldKey>(REQUIRED_FIELD_KEYS);

export const isRequiredField = (key: RequiredFieldKey): boolean => REQUIRED_FIELD_SET.has(key);

export type { RequiredFieldKey };
