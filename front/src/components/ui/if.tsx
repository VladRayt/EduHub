import React from 'react';

type Props = {
  value: boolean;
  children?: React.ReactNode;
};

export const If = (props: Props) => {
  if (!props.value) return null;
  return <>{props.children}</>;
};
