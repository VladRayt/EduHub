import { useEffect, useState } from 'react';

import { useAuthStore } from '@store/auth.store';

export const useHydratedRequestStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    //@ts-ignore
    useAuthStore.persist.rehydrate();
  }, []);

  return isHydrated;
};
