import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Sorting } from '@/@types/front';

export enum Color {
  PRIMARY = '#3498db',
  SECONDARY = '#2ecc71',
  BACKGROUND = '#f0f0f0',
  TEXT_DARK = '#333333',
  TEXT_LIGHT = '#666666',
  ACCENT = '#ff7f50',
  SUCCESS = '#28a745',
  WARNING = '#ffc107',
  DANGER = '#dc3545',
  INFO = '#17a2b8',
  LIGHT_GRAY = '#e9ecef',
  DARK_GRAY = '#6c757d',
  PURPLE = '#6a1b9a',
  GREEN = '#4caf50',
  RED = '#f44336',
  BLUE = '#2196f3',
  YELLOW = '#ffeb3b',
  BLACK = '#000000',
  WHITE = '#ffffff',
}

export enum PrimaryColor {
  CrimsonRed = '#DC143C',
  SunshineYellow = '#FFD700',
  SkyBlue = '#87CEEB',
  EmeraldGreen = '#50C878',
  RoyalPurple = '#6A0DAD',
  TangerineOrange = '#FFA500',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function primaryColorToClassName(color: PrimaryColor, property: 'bg' | 'text'): string {
  switch (color) {
    case PrimaryColor.CrimsonRed:
      return property === 'bg' ? 'bg-primary-crimson' : 'text-primary-crimson';
    case PrimaryColor.SunshineYellow:
      return property === 'bg' ? 'bg-primary-yellow' : 'text-primary-yellow';
    case PrimaryColor.SkyBlue:
      return property === 'bg' ? 'bg-primary-blue' : 'text-primary-blue';
    case PrimaryColor.EmeraldGreen:
      return property === 'bg' ? 'bg-primary-green' : 'text-primary-green';
    case PrimaryColor.RoyalPurple:
      return property === 'bg' ? 'bg-primary-purple' : 'text-primary-purple';
    case PrimaryColor.TangerineOrange:
      return property === 'bg' ? 'bg-primary-orange' : 'text-primary-orange';
    default:
      return property === 'bg' ? 'bg-primary' : 'text-primary';
  }
}

export const getSortedArrayBySorting = (
  method: Sorting | undefined,
  list: any[],
  stringField: string,
  numberField: string,
  useLength?: boolean
) => {
  const listCopy = list.slice(0, list.length);
  listCopy.sort((a, b) => {
    switch (method) {
      case Sorting.A_Z:
        return a[stringField].localeCompare(b[stringField]);
      case Sorting.Z_A:
        return b[stringField].localeCompare(a[stringField]);
      case Sorting.ZERO_NINE:
        const aValue = useLength ? a[numberField]?.length || 0 : a[numberField] || 0;
        const bValue = useLength ? b[numberField]?.length || 0 : b[numberField] || 0;
        return aValue - bValue;
      case Sorting.NINE_ZERO:
        const aNumValue = useLength ? a[numberField]?.length || 0 : a[numberField] || 0;
        const bNumValue = useLength ? b[numberField]?.length || 0 : b[numberField] || 0;
        return bNumValue - aNumValue;
      default:
        return a[stringField].localeCompare(b[stringField]);
    }
  });
  return listCopy;
};
