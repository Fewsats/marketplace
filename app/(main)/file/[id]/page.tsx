'use server';

import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import FileComponent from '@/app/(main)/file/[id]/content';
import { FileObject } from '@/app/types';

async function fetchFile(id: string) {
  const res = await fetch(`${process.env.API_URL}/v0/storage/${id}`, {
    next: { tags: ['file'] },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res?.ok) return undefined;
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data: { file: FileObject } = await fetchFile(params.id);

  if (!data?.file) {
    return {
      title: 'File',
    };
  }

  return {
    title: 'File ' + data.file.name.replace(data.file.extension, ''),
  };
}

export default async function FilePage({ params }: { params: { id: string } }) {
  revalidateTag('file');
  const id = params.id;
  const data = id && (await fetchFile(id));

  if (!data || data?.file.status !== 'valid') {
    notFound();
  }

  return <FileComponent file={data?.file} />;
}
