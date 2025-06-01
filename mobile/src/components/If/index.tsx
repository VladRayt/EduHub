import { PropsWithChildren } from 'react';

export const If = ({ value, children }: PropsWithChildren<{ value: boolean }>) => {
  if (value) {
    return <>{children}</>;
  }
  return null;
};
