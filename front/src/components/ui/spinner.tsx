import React from 'react';

export const FullPageSpinner = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 h-16 w-16 aspect-square rounded-full'>
        <div className='rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md'></div>
      </div>
    </div>
  );
};
