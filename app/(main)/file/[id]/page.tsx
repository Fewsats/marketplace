'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
// ACTIONS
import { useAppDispatch, useAppThunkDispatch } from '@/app/store/store';
import { hideLoader, showLoader } from '@/app/store/applicationSlice';
import { getFileDetails } from '@/app/store/storageSlice';
// COMPONENTS
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
// TYPES
import { StorageState } from '@/app/types';
// UTILS
import formatPrice from '@/app/utils/formatPrice';

const FilePage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
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
    handleGetFile();
  }, []);

  const handleGetFile = async () => {
    await dispatchThunk(getFileDetails({ fileId: id }));
  };

  useEffect(() => {
    if (status === 'loading') {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [status]);

  return (
    <div
      className={
        'mx-auto h-full min-h-screen w-full max-w-screen-1xl flex-col space-y-6 bg-white px-4 pb-8 pt-6 sm:space-y-8 sm:pb-16 sm:pt-8 md:px-14'
      }
    >
      <div className={'flex w-full py-2 text-sm leading-6 text-gray-500'}>
        <Link
          href={'/'}
          className={
            'items-align flex space-x-3 transition-colors hover:text-violet-600'
          }
        >
          <ChevronLeftIcon className={'h-6 w-6'} />
          <span>Back to Catalog</span>
        </Link>
      </div>
      <div className={'w-full'}>
        <div
          className={
            'mb-1 text-2xl font-bold text-zinc-950 sm:mb-4 sm:text-3xl'
          }
        >
          File long title
        </div>
        <div
          className={
            'mb-6 py-1.5 text-base font-medium leading-6 text-zinc-400 sm:mb-8 md:mb-9'
          }
        >
          Price:
          <span
            className={
              'ml-2 text-lg font-semibold leading-6 text-zinc-950 sm:text-xl'
            }
          >
            {formatPrice(100)}
          </span>
        </div>
        <div
          className={
            'flex flex-col space-y-6 sm:space-y-8 md:flex-row md:space-y-0'
          }
        >
          <div className={'relative flex-1'}>
            <Image
              src={'/images/FewsatsLogo.svg'}
              alt={'File'}
              className={`rounded-lg`}
              width={692}
              height={603}
              layout={'responsive'}
            />
          </div>
          <div
            className={'flex-1 space-y-6 px-0 sm:space-y-8 md:px-4 lg:px-11'}
          >
            <div className={'text-sm text-zinc-950'}>
              {`Created: ${new Date() ? new Date(new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}`}
            </div>
            <div className={'text-base font-light text-zinc-950'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              efficitur odio diam. Nam facilisis sit amet velit vitae
              pellentesque. Donec at elit purus. Nullam ullamcorper commodo ex,
              quis ornare nisl dictum eu. In hac habitasse platea dictumst.
              Morbi arcu ante, fringilla at nibh eget, posuere viverra libero.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              efficitur odio diam. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nam efficitur odio diam.
            </div>
            <div className={'flex flex-wrap items-start gap-2'}>
              {['Tag Title', 'Tag Title', 'Tag Title'].map((tag, i) => (
                <div
                  key={i}
                  className={
                    'rounded-md bg-purple-100 px-1.5 py-1  text-xs font-medium leading-4 text-purple-700 sm:px-2 sm:py-2 sm:text-base'
                  }
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className={'flex gap-2'}>
              <div
                className={
                  'flex-1 rounded-lg border border-gray-300 p-3 text-sm leading-4 text-zinc-400 sm:p-4 sm:text-base'
                }
              >
                Size:
                <span className={'ml-2 font-medium text-zinc-950'}>45 MB</span>
              </div>
              <div
                className={
                  'flex-1 rounded-lg border border-gray-300 p-3 text-sm leading-4 text-zinc-400 sm:p-4 sm:text-base'
                }
              >
                Format:
                <span className={'ml-2 font-medium text-zinc-950'}>png</span>
              </div>
            </div>
            <div className={'w-full'}>
              <PrimaryButton buttonText={'Buy'} link={`/billing/${'test'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePage;
