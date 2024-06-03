'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
// COMPONENTS
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import FilesList from '@/app/components/marketplace/FilesList';
import InputSelect from '@/app/components/inputs/InputSelect';
// TYPES
import { FileObject, Option } from '@/app/types';
// CONSTANTS
import { FILTER_SORT_OPTIONS, SEARCH_DEBOUNCE } from '@/constants/constants';
// UTILS
import debounce from 'lodash.debounce';

const CatalogComponent = ({ files }: { files: FileObject[] }) => {
  const values = useMemo(() => files || [], [files]);

  const [filters, setFilters] = useState({
    search: '',
    sort: 'date',
  });
  const handleInputChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [name]: event.target.value,
      }));
    };

  const handleFilterChange = (name: string) => (value: Option) => {
    setFilters({ ...filters, [name]: value.id });
  };

  const [filteredValues, setFilteredValues] = useState(values);

  const setFiltersDebounced = useRef(
    debounce(({ filters, values }) => {
      const filtered = values.filter((item: FileObject) => {
        return filters.search
          ? item.name.toLowerCase().includes(filters.search.toLowerCase())
          : true;
      });
      const sorted =
        (filters.sort === 'date' &&
          filtered.sort(
            (a: FileObject, b: FileObject) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )) ||
        (filters.sort === 'price' &&
          filtered.sort(
            (a: FileObject, b: FileObject) =>
              b.price_in_cents - a.price_in_cents
          )) ||
        filtered;
      setFilteredValues(sorted);
    }, SEARCH_DEBOUNCE)
  );

  useEffect(() => {
    setFiltersDebounced.current({ filters, values });
  }, [filters, values]);

  return (
    <div className={'h-full min-h-screen w-full flex-col'}>
      <div className={'relative w-full'}>
        <Image
          src={'/images/CatalogBackground.png'}
          alt={'background'}
          className={'absolute left-0 top-0 object-cover'}
          fill={true}
        />
        <div
          className={
            'relative mx-auto flex w-full max-w-screen-1xl flex-col items-center px-4 pb-64 pt-8 md:px-14'
          }
        >
          <div className={'mb-10 flex w-full justify-start'}>
            <Image
              src={'/images/FewsatsLogo.svg'}
              width={126}
              height={41}
              alt={'Fewsats'}
              className={'h-auto w-32'}
            />
          </div>
          <h1
            className={
              'mb-5 text-3xl font-bold text-white sm:text-4xl md:text-5xl'
            }
          >
            Files catalog
          </h1>
          <div className='relative mb-20 flex w-full max-w-4xl items-center rounded-lg bg-white px-8 py-4'>
            <label htmlFor='search-field' className='sr-only'>
              Search by file name or tags
            </label>
            <MagnifyingGlassIcon
              className='pointer-events-none absolute inset-y-0 left-8 top-4 h-6 w-6 text-gray-400'
              aria-hidden='true'
            />
            <input
              id='search-field'
              className='block h-6 w-full border-0 py-0 pl-8 pr-0 text-base leading-6 text-black outline-none placeholder:text-gray-400 focus:ring-0'
              placeholder={'Search by file name or tags'}
              type='search'
              name='search'
              value={filters.search}
              onChange={handleInputChange('search')}
            />
          </div>
          <div
            className={'relative flex w-full items-center justify-end gap-4'}
          >
            <InputSelect
              options={FILTER_SORT_OPTIONS}
              selected={filters.sort}
              onChange={handleFilterChange('sort')}
              autoWidth={true}
            />
          </div>
        </div>
      </div>
      <div
        className={
          'relative mx-auto -mt-60 w-full max-w-screen-1xl px-4 pb-7 md:px-14'
        }
      >
        <FilesList files={filteredValues} />
      </div>
    </div>
  );
};

export default CatalogComponent;
