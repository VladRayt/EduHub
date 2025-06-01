import { ProfileNavigation } from '../mobile-types/navigation.type';

export const settingNameByRoute: (
  t: (keys: string) => string
) => Partial<Record<ProfileNavigation, string>> = (t) => {
  return {
    [ProfileNavigation.ORGANIZATION_SELECT]: t('profile.list.organizations-list'),
    [ProfileNavigation.TEST_SELECT]: t('profile.list.tests-list'),
    [ProfileNavigation.PROFILE]: t('profile.list.profile'),
    [ProfileNavigation.ABOUT]: t('profile.list.about'),
  };
};

export const iconNameByRoute: Partial<Record<ProfileNavigation, string>> = {
  [ProfileNavigation.NOTIFICATION]: 'bell',
  [ProfileNavigation.ORGANIZATION_SELECT]: 'layers',
  [ProfileNavigation.TEST_SELECT]: 'check-circle',
  [ProfileNavigation.PROFILE]: 'user',
  [ProfileNavigation.ABOUT]: 'alert-circle',
};
