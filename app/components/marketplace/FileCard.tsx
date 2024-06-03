import React from 'react';
// COMPONENTS
import Image from 'next/image';
import Link from 'next/link';
// TYPES
import { FileObject } from '@/app/types';
// UTILS
import formatPrice from '@/app/utils/formatPrice';

export default function FileCard({ file }: { file: FileObject }) {
  return (
    <Link
      href={`/file/${file.external_id}`}
      className={
        'flex h-full w-full flex-col rounded-lg border border-gray-200'
      }
    >
      <div
        className={'relative aspect-video w-full overflow-hidden rounded-t-xl'}
      >
        {file.cover_url ? (
          <Image
            src={file.cover_url}
            alt={file.name.replace(file.extension, '')}
            className={`bg-gray-100 object-cover transition-opacity`}
            fill={true}
          />
        ) : (
          <div
            className={
              'absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black p-2.5 text-sm text-white'
            }
          >
            <span
              className={'line-clamp-2 whitespace-normal break-all text-center'}
            >
              {file.name.replace(file.extension, '')}
            </span>
          </div>
        )}
      </div>
      <div className={'flex w-full flex-1 flex-col justify-between p-5'}>
        <div>
          <div className={'mb-2 text-base font-medium text-zinc-950'}>
            {file.name.replace(file.extension, '')}
          </div>
          <div className={'mb-4 max-w-72 text-sm text-gray-400'}>
            {file.description}
          </div>
          <div className={'mb-4 flex flex-wrap items-start gap-2'}>
            {file.tags
              ?.filter((tag) => !!tag)
              .map((tag, i) => (
                <div
                  key={i}
                  className={
                    'rounded-md bg-purple-100 px-1.5 py-1 text-xs font-medium leading-4 text-purple-700'
                  }
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>
        <div
          className={'pt-20 text-base font-semibold leading-6 text-gray-400'}
        >
          Price:
          <span
            className={'ml-2 text-base font-semibold leading-6 text-zinc-950'}
          >
            {formatPrice(file.price_in_cents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
