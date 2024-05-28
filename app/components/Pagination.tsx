import React, { useMemo } from 'react';
// UTILS
import { useWindowSize } from '@/app/utils/useWindowSize';
// COMPONENTS
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const DOTS = '...';

export default function Pagination({
  totalPages,
  currentPage,
  onNext,
  onPrev,
  onClick,
  limit,
  count,
}: {
  totalPages: number;
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  onClick: (page: number) => () => void;
  limit: number;
  count: number;
}) {
  const { width } = useWindowSize();
  const siblingCount = useMemo(
    () => (width ? (width > 640 ? 10 : 3) : 0),
    [width]
  );

  const paginationRange = useMemo(() => {
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (siblingCount >= totalPages) {
      return range(1, totalPages);
    }

    if (currentPage < siblingCount) {
      const leftRange = range(1, siblingCount);
      return [...leftRange, DOTS, totalPages];
    } else if (currentPage > totalPages - siblingCount + 1) {
      const rightRange = range(totalPages - siblingCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    } else {
      const siblingsHalf = Math.floor(siblingCount / 2);
      const middleRange = range(
        currentPage - siblingsHalf,
        currentPage + siblingsHalf
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalPages, limit, siblingCount, currentPage]);

  return (
    <div className={'flex w-fit items-center justify-center'}>
      <button
        onClick={onPrev}
        className={`-mt-px mr-10 flex flex-1 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'opacity-1'} transition-all`}
      >
        <span
          className={`inline-flex items-center border-t-2 border-transparent pr-1 text-sm font-semibold text-zinc-950 hover:text-violet-600`}
        >
          <ArrowLongLeftIcon
            className='mr-3 h-5 w-5 text-zinc-500'
            aria-hidden='true'
          />
          Previous
        </span>
      </button>
      <ul className={'-mt-px flex'}>
        {count <= limit && <div className={''}>1</div>}
        {count >= limit + 1 &&
          paginationRange.map((item, i) =>
            item === DOTS ? (
              <li
                key={i}
                className={
                  'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-semibold text-zinc-950'
                }
              >
                &#8230;
              </li>
            ) : (
              <li key={i}>
                <button
                  onClick={onClick(+item)}
                  className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-semibold ${currentPage === item ? 'text-violet-600' : 'text-zinc-950 hover:text-violet-500'} transition-all`}
                >
                  {item}
                </button>
              </li>
            )
          )}
      </ul>
      <button
        onClick={onNext}
        className={`-mt-px ml-10 flex flex-1 justify-end ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'opacity-1'} transition-all`}
      >
        <span
          className={`inline-flex items-center border-t-2 border-transparent pl-1 text-sm font-semibold text-zinc-950 hover:text-violet-600`}
        >
          Next
          <ArrowLongRightIcon
            className='ml-3 h-5 w-5 text-zinc-500'
            aria-hidden='true'
          />
        </span>
      </button>
    </div>
  );
}
