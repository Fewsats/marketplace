'use server';

import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import FileComponent from '@/app/(main)/file/[id]/content';
import { FileObject } from '@/app/types';

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

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

  return {
    metadataBase: new URL(`${metadataBase}`),
    alternates: {
      canonical: `/file/${data.file.external_id}`,
    },
    title: data.file.name.replace(data.file.extension, ''),
    description: data.file.description.replace(/\r\n/g, ''),
    openGraph: {
      title: data.file.name.replace(data.file.extension, ''),
      type: 'website',
      url: `${metadataBase}/file/${data.file.external_id}`,
      description: data.file.description.replace(/\r\n/g, ''),
      siteName: 'Marketplace.fewsats.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.file.name.replace(data.file.extension, ''),
      description: data.file.description.replace(/\r\n/g, ''),
      site: '@fewsats',
      creator: '@fewsats',
    },
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
