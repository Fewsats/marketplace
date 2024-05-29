'use client';

import React from 'react';
// COMPONENTS
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
// TYPES
import { FileObject } from '@/app/types';
// UTILS
import formatPrice from '@/app/utils/formatPrice';
import formatFileSize from '@/app/utils/formatFileSize';

const FileComponent = ({ file }: { file: FileObject }) => {
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
      {file && (
        <div className={'w-full'}>
          <div
            className={
              'mb-1 text-2xl font-bold text-zinc-950 sm:mb-4 sm:text-3xl'
            }
          >
            {file.name.replace(file.extension, '')}
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
              {formatPrice(file.price_in_usd_cents)}
            </span>
          </div>
          <div
            className={
              'flex flex-col space-y-6 sm:space-y-8 md:flex-row md:space-y-0'
            }
          >
            <div className={'relative flex-1'}>
              {file.cover_url ? (
                <Image
                  src={file.cover_url}
                  alt={file.name.replace(file.extension, '')}
                  className={`h-auto w-full rounded-lg border border-gray-200`}
                  width={692}
                  height={603}
                />
              ) : (
                <div
                  className={
                    'flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-black p-2.5 text-sm text-white'
                  }
                >
                  <span
                    className={
                      'line-clamp-2 whitespace-normal break-all text-center'
                    }
                  >
                    {file.name.replace(file.extension, '')}
                  </span>
                </div>
              )}
            </div>
            <div
              className={'flex-1 space-y-6 px-0 sm:space-y-8 md:px-4 lg:px-11'}
            >
              <div className={'text-sm text-zinc-950'}>
                {`Created: ${file.created_at ? new Date(file.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}`}
              </div>
              <div className={'text-base font-light text-zinc-950'}>
                {file.description}
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
                  <span className={'ml-2 font-medium text-zinc-950'}>
                    {file.size && formatFileSize(file.size)}
                  </span>
                </div>
                <div
                  className={
                    'flex-1 rounded-lg border border-gray-300 p-3 text-sm leading-4 text-zinc-400 sm:p-4 sm:text-base'
                  }
                >
                  Format:
                  <span className={'ml-2 font-medium text-zinc-950'}>
                    {file.extension && file.extension.replace('.', '')}
                  </span>
                </div>
              </div>
              <div className={'w-full'}>
                <PrimaryButton
                  buttonText={'Buy'}
                  link={`/billing/${file.external_id}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileComponent;
