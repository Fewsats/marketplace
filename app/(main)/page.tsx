'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// ACTIONS
import { useAppDispatch, useAppThunkDispatch } from '@/app/store/store';
import { hideLoader, showLoader } from '@/app/store/applicationSlice';
import { getSearchedFiles } from '@/app/store/storageSlice';
// COMPONENTS
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import FilesList from '@/app/components/marketplace/FilesList';
// TYPES
import { FileObject, StorageState } from '@/app/types';
// CONSTANTS
import { SEARCH_DEBOUNCE } from '@/constants/constants';
// UTILS
import debounce from 'lodash.debounce';

const Marketplace = () => {
  const dispatchThunk = useAppThunkDispatch();
  const dispatch = useAppDispatch();
  const data = useSelector(
    (state: { storage: StorageState }) => state.storage.data
  );
  const status = useSelector(
    (state: { storage: StorageState }) => state.storage.status
  );
  const isFetching = useRef(false);

  const values = useMemo(() => data?.files || [], [data]);

  useEffect(() => {
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    handleGetStorage();
  }, []);

  const handleGetStorage = async () => {
    await dispatchThunk(getSearchedFiles({}));
  };

  useEffect(() => {
    if (status === 'loading') {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [status]);

  const [filters, setFilters] = useState({
    search: '',
  });
  const handleInputChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [name]: event.target.value,
      }));
    };

  const [filteredValues, setFilteredValues] = useState([]);

  const setFiltersDebounced = useRef(
    debounce(({ filters, values }) => {
      const filtered = values.filter((item: FileObject) => {
        return filters.search
          ? item.name.toLowerCase().includes(filters.search.toLowerCase())
          : true;
      });
      setFilteredValues(filtered);
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
            'max-w-1440 relative flex w-full flex-col items-center px-14 pb-64 pt-8'
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
          <h1 className={'mb-5 text-5xl font-bold text-white'}>
            Files catalog
          </h1>
          <form
            className='relative mb-20 flex w-full max-w-4xl items-center rounded-lg bg-white px-8 py-4'
            action='#'
          >
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
          </form>
          <div className={'flex items-center justify-end gap-4'}></div>
        </div>
      </div>
      <div className={'max-w-1440 relative -mt-60 w-full px-14 pb-7'}>
        <FilesList files={filteredValues} />
      </div>
    </div>
  );
};

export default Marketplace;
