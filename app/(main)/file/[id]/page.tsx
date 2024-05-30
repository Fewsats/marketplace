'use server';

import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import FileComponent from '@/app/(main)/file/[id]/content';

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

export default async function FilePage({ params }: { params: { id: string } }) {
  revalidateTag('file');
  const id = params.id;
  const data = id && (await fetchFile(id));

  if (!data) {
    notFound();
  }

  return <FileComponent file={data?.file} />;
}
