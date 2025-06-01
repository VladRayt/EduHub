import { Approvement, Permission } from '../mobile-types/front-types';

export const getTitleByFilter = (
  method: Approvement | Permission | undefined,
  t: (keys: string) => string
) => {
  switch (method) {
    case Approvement.PENDING:
      return t(`filter.${Approvement.PENDING}`);
    case Approvement.DECLINED:
      return t(`filter.${Approvement.DECLINED}`);
    case Permission.WRITE:
      return t(`filter.${Permission.WRITE}`);
    case Permission.READ:
      return t(`filter.${Permission.READ}`);
    default:
      return t('filter.default');
  }
};

export const getIconNameByFilter = (
  method: Approvement | Permission | 'Completed' | 'Uncompleted' | undefined
) => {
  switch (method) {
    case Permission.WRITE:
      return 'lock';
    case Permission.READ:
      return 'book-open';
    case Approvement.PENDING:
      return 'loader';
    case Approvement.DECLINED:
      return 'x-circle';
    case 'Completed':
      return 'x-circle';
    case 'Uncompleted':
      return 'x-circle';
    default:
      return 'trello';
  }
};
