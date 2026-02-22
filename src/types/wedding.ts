// Wedding Domain Type Definitions

import { Brand } from './common';

// Branded Types for Domain Safety
export type WeddingId = Brand<string, 'WeddingId'>;
export type GuestId = Brand<string, 'GuestId'>;
export type InvitationId = Brand<string, 'InvitationId'>;
export type AccountId = Brand<string, 'AccountId'>;

// Core Wedding Types
export interface Wedding {
  id: WeddingId;
  groom: Person;
  bride: Person;
  ceremony: Ceremony;
  reception?: Reception;
  preferences: WeddingPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  relation: RelationType;
  parents: Parent[];
  contact?: ContactInfo;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isDeceased: boolean;
  relation: 'father' | 'mother';
}

export interface Ceremony {
  id: string;
  date: Date;
  time: string;
  venue: Venue;
  officiant?: string;
  program: CeremonyItem[];
}

export interface Reception {
  id: string;
  date: Date;
  time: string;
  venue: Venue;
  menu?: Menu;
  seating?: SeatingArrangement;
}

export interface Venue {
  id: string;
  name: string;
  address: Address;
  coordinates?: Coordinates;
  capacity?: number;
  contactInfo?: ContactInfo;
  parkingInfo?: string;
  transportationInfo?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export interface CeremonyItem {
  id: string;
  type:
    | 'processional'
    | 'unity'
    | 'vows'
    | 'ring_exchange'
    | 'pronouncement'
    | 'recessional'
    | 'custom';
  title: string;
  description?: string;
  duration?: number; // in minutes
  participants?: string[];
}

export interface Menu {
  id: string;
  type: 'buffet' | 'plated' | 'family_style' | 'cocktail';
  courses: MenuCourse[];
  dietaryOptions: DietaryOption[];
  alcoholService: boolean;
}

export interface MenuCourse {
  id: string;
  name: string;
  description?: string;
  options?: string[];
}

export interface DietaryOption {
  type: 'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'nut_free' | 'kosher' | 'halal';
  available: boolean;
  description?: string;
}

export interface SeatingArrangement {
  id: string;
  tables: Table[];
  layout: SeatingLayout;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  shape: 'round' | 'square' | 'rectangle' | 'oval';
  assignedGuests: GuestId[];
  specialNotes?: string;
}

export type SeatingLayout = 'theater' | 'classroom' | 'banquet' | 'reception' | 'custom';

// Guest Management Types
export interface Guest {
  id: GuestId;
  weddingId: WeddingId;
  personalInfo: PersonalInfo;
  invitation: Invitation;
  rsvp: RSVP;
  relationship: Relationship;
  plusOne?: PlusOne;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  preferredName?: string;
  title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Rev.';
  age?: number;
  dateOfBirth?: Date;
}

export interface Invitation {
  id: InvitationId;
  type: 'physical' | 'digital' | 'save_the_date';
  sent: boolean;
  sentDate?: Date;
  delivered: boolean;
  deliveredDate?: Date;
  responseDeadline?: Date;
}

export interface RSVP {
  responded: boolean;
  responseDate?: Date;
  attending: boolean;
  numberOfGuests: number;
  dietaryRestrictions?: string[];
  specialRequests?: string;
  declinedReason?: string;
}

export interface Relationship {
  type: RelationshipType;
  side: 'groom' | 'bride' | 'both';
  closeness: 'immediate' | 'close' | 'distant' | 'acquaintance';
  group?: string; // e.g., "Work Colleagues", "College Friends"
}

export interface PlusOne {
  allowed: boolean;
  name?: string;
  dietaryRestrictions?: string[];
}

// Wedding Preferences Types
export interface WeddingPreferences {
  theme: Theme;
  style: Style;
  restrictions: Restrictions;
  customs: Customs;
}

export interface Theme {
  colorPalette: ColorPalette;
  floralDesign: FloralDesign;
  lighting: Lighting;
  music: Music;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutrals: string[];
}

export interface FloralDesign {
  style: 'modern' | 'traditional' | 'rustic' | 'bohemian' | 'minimalist';
  flowers: string[];
  arrangements: Arrangement[];
}

export interface Arrangement {
  type: 'bouquet' | 'boutonniere' | 'corsage' | 'centerpiece' | 'arch';
  description: string;
}

export interface Lighting {
  style: 'natural' | 'string_lights' | 'candles' | 'uplighting' | 'chandeliers';
  colorTemperature: 'warm' | 'cool' | 'mixed';
}

export interface Music {
  ceremony: MusicSelection;
  reception: MusicSelection;
  firstDance?: Song;
}

export interface MusicSelection {
  style: 'classical' | 'jazz' | 'pop' | 'rock' | 'folk' | 'electronic';
  playlist?: Song[];
  liveBand?: boolean;
  dj?: boolean;
}

export interface Song {
  title: string;
  artist: string;
  duration?: number;
}

export interface Style {
  formality: 'black_tie' | 'cocktail' | 'casual' | 'beach' | 'destination';
  culturalElements: CulturalElement[];
  personalTouches: PersonalTouch[];
}

export interface CulturalElement {
  culture: string;
  element: string;
  significance: string;
}

export interface PersonalTouch {
  type: string;
  description: string;
  significance: string;
}

export interface Restrictions {
  budget: Budget;
  guestCount: GuestCount;
  timing: Timing;
  vendor: VendorRestrictions;
}

export interface Budget {
  total: number;
  breakdown: BudgetItem[];
  currency: string;
}

export interface BudgetItem {
  category: 'venue' | 'catering' | 'photography' | 'flowers' | 'attire' | 'music' | 'other';
  allocated: number;
  spent: number;
}

export interface GuestCount {
  target: number;
  minimum: number;
  maximum: number;
  current: number;
}

export interface Timing {
  preferredMonths: number[];
  preferredDaysOfWeek: number[];
  preferredTimes: string[];
  duration: number; // in hours
}

export interface VendorRestrictions {
  preferredVendors: string[];
  excludedVendors: string[];
  mustHaveServices: string[];
}

export interface Customs {
  traditions: Tradition[];
  rituals: Ritual[];
  personalRituals: PersonalRitual[];
}

export interface Tradition {
  culture: string;
  name: string;
  description: string;
  timing: 'pre_ceremony' | 'ceremony' | 'reception' | 'post_wedding';
}

export interface Ritual {
  name: string;
  description: string;
  participants: string[];
  props?: string[];
}

export interface PersonalRitual {
  name: string;
  description: string;
  significance: string;
  participants: string[];
}

// Enums and Union Types
export type RelationType =
  | 'father'
  | 'mother'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'grandfather'
  | 'grandmother'
  | 'uncle'
  | 'aunt'
  | 'cousin'
  | 'friend'
  | 'colleague'
  | 'other';

export type RelationshipType =
  | 'immediate_family'
  | 'extended_family'
  | 'close_friend'
  | 'friend'
  | 'colleague'
  | 'acquaintance'
  | 'other';

// Utility Types
export type WeddingSummary = Pick<Wedding, 'id' | 'groom' | 'bride' | 'ceremony'> & {
  guestCount: number;
  rsvpCount: number;
};

export type InvitationPreview = Pick<Wedding, 'groom' | 'bride' | 'ceremony'> & {
  theme: Partial<Theme>;
  customMessage?: string;
};

// Validation Types
export interface WeddingValidation {
  isValid: boolean;
  errors: WeddingValidationError[];
  warnings: WeddingValidationWarning[];
}

export interface WeddingValidationError {
  field: string;
  code: string;
  message: string;
}

export interface WeddingValidationWarning {
  field: string;
  code: string;
  message: string;
}
