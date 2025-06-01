import React from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Approvement, Permission, Sorting } from '@/@types/front';
import { useWritableSearchParams } from '@/hooks/useWritableSearchParams';

const filterValues = (t: (keys: string) => string) => [
  { value: Permission.WRITE, name: t('filter.WRITE'), icon: '✏️', color: '#3B82F6' },
  { value: Permission.READ, name: t('filter.READ'), icon: '👁️', color: '#10B981' },
  { value: Approvement.ACCEPTED, name: t('filter.ACCEPTED'), icon: '✅', color: '#059669' },
  { value: Approvement.PENDING, name: t('filter.PENDING'), icon: '⏳', color: '#F59E0B' },
];

const sortingValues = (t: (keys: string) => string) => [
  { value: Sorting.A_Z, name: t('sorting.A_Z'), icon: '🔤', description: 'A → Z' },
  { value: Sorting.Z_A, name: t('sorting.Z_A'), icon: '🔤', description: 'Z → A' },
  { value: Sorting.ZERO_NINE, name: t('sorting.ZERO_NINE'), icon: '🔢', description: '0 → 9' },
  { value: Sorting.NINE_ZERO, name: t('sorting.NINE_ZERO'), icon: '🔢', description: '9 → 0' },
];

type Props = {
  handleOpenModal: () => void;
};

export const HomeFiltersSidebar = ({ handleOpenModal }: Props) => {
  const searchParamsSettings = useWritableSearchParams();
  const searchFilter = searchParamsSettings.searchParams.get('search');
  const permissionFilter = searchParamsSettings.searchParams.get('filter');
  const sortingFilter = searchParamsSettings.searchParams.get('sorting');

  const t = useTranslations();

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParamsSettings.set('search', e.target.value);
  };

  const handleChangeFilter = (value: string) => {
    searchParamsSettings.set('filter', value);
  };

  const handleChangeSorting = (value: string) => {
    searchParamsSettings.set('sorting', value);
  };

  const selectedFilter = filterValues(t).find((f) => f.value === permissionFilter);
  const selectedSorting = sortingValues(t).find((s) => s.value === sortingFilter);

  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-8 hover:shadow-2xl transition-all duration-300'>
      {/* Header with gradient */}
      <div className='text-center pb-4 border-b border-gray-100'>
        <h2 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          Filters & Controls
        </h2>
        <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-2'></div>
      </div>

      {/* Search Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>🔍</span>
          <p className='text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent'>
            {t('main.side-bar.search')}
          </p>
        </div>
        <div className='relative group'>
          <Input
            defaultValue={searchFilter ?? ''}
            onChange={handleChangeSearch}
            placeholder={t('main.side-bar.search-pl')}
            className='pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm'
          />
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors'>
            🔍
          </div>
          {searchFilter && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              <button
                onClick={() => searchParamsSettings.delete('search')}
                className='text-gray-400 hover:text-red-500 transition-colors'
              >
                ❌
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>🎯</span>
          <p className='text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent'>
            {t('main.side-bar.filter')}
          </p>
        </div>
        <div className='relative'>
          <Select onValueChange={handleChangeFilter} defaultValue={permissionFilter ?? undefined}>
            <SelectTrigger className='w-full rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/50 backdrop-blur-sm pl-10'>
              <div className='flex items-center gap-2 w-full'>
                {selectedFilter && (
                  <>
                    <span>{selectedFilter.icon}</span>
                    <span className='font-medium' style={{ color: selectedFilter.color }}>
                      {selectedFilter.name}
                    </span>
                  </>
                )}
                {!selectedFilter && (
                  <span className='text-gray-500'>{t('main.side-bar.filter-pl')}</span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className='rounded-xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl'>
              {filterValues(t).map(({ value, name, icon, color }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className='hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors cursor-pointer'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-lg'>{icon}</span>
                    <span className='font-medium' style={{ color }}>
                      {name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500'>
            🎯
          </div>
        </div>
      </div>

      {/* Sorting Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>📊</span>
          <p className='text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent'>
            {t('main.side-bar.sorting')}
          </p>
        </div>
        <div className='relative'>
          <Select onValueChange={handleChangeSorting} defaultValue={sortingFilter ?? undefined}>
            <SelectTrigger className='w-full rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/50 backdrop-blur-sm pl-10'>
              <div className='flex items-center gap-2 w-full'>
                {selectedSorting && (
                  <>
                    <span>{selectedSorting.icon}</span>
                    <span className='font-medium text-purple-600'>{selectedSorting.name}</span>
                    <span className='text-sm text-gray-500 ml-auto'>
                      {selectedSorting.description}
                    </span>
                  </>
                )}
                {!selectedSorting && (
                  <span className='text-gray-500'>{t('main.side-bar.sorting-pl')}</span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className='rounded-xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl'>
              {sortingValues(t).map(({ value, name, icon, description }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className='hover:bg-gray-50 focus:bg-gray-50 rounded-lg transition-colors cursor-pointer'
                >
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-3'>
                      <span className='text-lg'>{icon}</span>
                      <span className='font-medium text-purple-600'>{name}</span>
                    </div>
                    <span className='text-sm text-gray-500 ml-4'>{description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500'>
            📊
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className='pt-4 border-t border-gray-100'>
        <Button
          onClick={handleOpenModal}
          className='w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 relative overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000'></div>
          <span className='relative flex items-center justify-center gap-2'>
            <span className='text-xl'>✨</span>
            {t('main.side-bar.button-create')}
            <span className='text-xl'>🚀</span>
          </span>
        </Button>
      </div>

      {/* Active Filters Summary */}
      {(searchFilter || permissionFilter || sortingFilter) && (
        <div className='pt-4 border-t border-gray-100'>
          <p className='text-sm font-medium text-gray-600 mb-2'>Active Filters:</p>
          <div className='flex flex-wrap gap-2'>
            {searchFilter && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                🔍 Search: {searchFilter}
                <button
                  onClick={() => searchParamsSettings.delete('search')}
                  className='ml-1 text-blue-600 hover:text-blue-800'
                >
                  ×
                </button>
              </span>
            )}
            {selectedFilter && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                {selectedFilter.icon} {selectedFilter.name}
                <button
                  onClick={() => searchParamsSettings.delete('filter')}
                  className='ml-1 text-green-600 hover:text-green-800'
                >
                  ×
                </button>
              </span>
            )}
            {selectedSorting && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'>
                {selectedSorting.icon} {selectedSorting.name}
                <button
                  onClick={() => searchParamsSettings.delete('sorting')}
                  className='ml-1 text-purple-600 hover:text-purple-800'
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
