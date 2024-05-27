// COMPONENTS
import Image from 'next/image';
import Link from 'next/link';
// TYPES
import { FileObject } from '@/app/types';

export default function FileCard({ file }: { file: FileObject }) {
  return (
    <Link
      href={`/catalog/${file.external_id}`}
      className={
        'flex h-full w-full flex-col rounded-lg border border-gray-200'
      }
    >
      <div
        className={'relative aspect-video w-full overflow-hidden rounded-t-xl'}
      >
        <Image
          src={'/images/FewsatsLogo.svg'}
          alt={'File'}
          className={`bg-gray-100 transition-opacity`}
          fill={true}
        />
      </div>
      <div className={'flex w-full flex-1 flex-col justify-between p-5'}>
        <div>
          <div className={'mb-2 text-base font-medium text-zinc-950'}>
            {file.name}
          </div>
          <div className={'mb-4 max-w-72 text-sm text-gray-400'}>
            {file.description}
          </div>
          <div className={'mb-4 flex flex-wrap items-start gap-2'}>
            {['Tag Title', 'Tag Title', 'Tag Title'].map((tag, i) => (
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
            {`$${Math.round(file.price_in_usd_cents / 100)
              .toFixed(2)
              .toString()
              .replace('.00', '')}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
