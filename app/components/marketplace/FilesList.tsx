// COMPONENTS
// TYPES
import { FileObject } from '@/app/types';
import { useMemo, useState } from 'react';
import { useWindowSize } from '@/app/utils/useWindowSize';
import FileCard from '@/app/components/marketplace/FileCard';
import Pagination from '@/app/components/Pagination';

const DESKTOP_WIDTH = 1280;
const TABLET_WIDTH = 768;

export default function FilesList({ files }: { files: FileObject[] }) {
  const [page, setPage] = useState(1);

  const { width } = useWindowSize();
  const columns = useMemo(
    () =>
      width &&
      ((width > DESKTOP_WIDTH && 3) || (width > TABLET_WIDTH && 2) || 1),
    [width]
  );
  const rows = useMemo(
    () =>
      width &&
      ((width > DESKTOP_WIDTH && 3) || (width > TABLET_WIDTH && 4) || 3),
    [width]
  );
  const values = useMemo(() => {
    if (columns && rows && files) {
      const limit = rows * columns;
      const offset = limit * (page - 1);
      return files.slice(offset, offset + limit);
    } else {
      return [];
    }
  }, [files, columns, rows, page]);

  const count = useMemo(() => files.length, [files]);
  const limit = useMemo(() => {
    if (columns && rows) {
      return columns * rows;
    } else {
      return 0;
    }
  }, [columns, rows]);
  const pages = useMemo(() => {
    if (rows && columns) {
      return Math.ceil(files.length / (rows * columns));
    } else {
      return 0;
    }
  }, [files, rows, columns]);

  const onNext = () => {
    setPage((state) => state + 1);
  };

  const onPrev = () => {
    setPage((state) => state - 1);
  };

  const onClick = (page: number) => () => {
    setPage(page);
  };

  return (
    <div
      className={'w-full rounded-lg border border-gray-200 bg-white px-8 py-12'}
    >
      <div
        className={`grid grid-cols-1 items-stretch gap-x-6 gap-y-11 md:grid-cols-2 xl:grid-cols-3`}
      >
        {values.map((file, i) => (
          <div key={file.external_id}>
            <FileCard file={file} />
          </div>
        ))}
      </div>
      <div className={'mt-4 flex items-center justify-center'}>
        <Pagination
          totalPages={pages}
          currentPage={page}
          onNext={onNext}
          onPrev={onPrev}
          onClick={onClick}
          limit={limit}
          count={count}
        />
      </div>
    </div>
  );
}
