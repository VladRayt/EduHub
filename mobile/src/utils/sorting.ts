import { Sorting } from '../mobile-types/front-types';

export function getSortedArrayBySorting<T extends { [key: string]: any }>(
  method: Sorting | undefined,
  list: T[],
  stringField: string,
  numberField: string,
  useLength?: boolean
) {
  return [...list].sort((a, b) => {
    switch (method) {
      case Sorting.A_Z:
        return a[stringField] - b[stringField];
      case Sorting.Z_A:
        return b[stringField] - a[stringField];
      case Sorting.ZERO_NINE:
        return useLength
          ? a[numberField]?.length - b[numberField]?.length
          : a[numberField] - b[numberField];
      case Sorting.NINE_ZERO:
        return useLength
          ? b[numberField]?.length - a[numberField]?.length
          : b[numberField] - b[numberField];
      default:
        return a[stringField] - b[stringField];
    }
  });
}

export const getTitleBySorting = (method: Sorting | undefined, t: (keys: string) => string) => {
  switch (method) {
    case Sorting.A_Z:
      return t(`sorting.${Sorting.A_Z}`);
    case Sorting.Z_A:
      return t(`sorting.${Sorting.Z_A}`);
    case Sorting.ZERO_NINE:
      return t(`sorting.${Sorting.ZERO_NINE}`);
    case Sorting.NINE_ZERO:
      return t(`sorting.${Sorting.NINE_ZERO}`);
    default:
      return t('sorting.default');
  }
};

export const getIconNameBySorting = (method: Sorting | undefined) => {
  switch (method) {
    case Sorting.A_Z:
      return 'sort-alphabetical-ascending';
    case Sorting.Z_A:
      return 'sort-alpha-down-alt';
    case Sorting.ZERO_NINE:
      return 'sort-amount-down-alt';
    case Sorting.NINE_ZERO:
      return 'sort-amount-down';
    default:
      return 'sort';
  }
};
