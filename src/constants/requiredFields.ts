export const REQUIRED_FIELD_MAP = {
    groomName: true,
    brideName: true,
    mainImage: true,
} as const;

export type RequiredFieldKey = keyof typeof REQUIRED_FIELD_MAP;

export const isRequiredField = (key: RequiredFieldKey): boolean => REQUIRED_FIELD_MAP[key];
