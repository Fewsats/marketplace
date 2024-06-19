'use server';

import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import BillingComponent from '@/app/(main)/billing/[id]/content';
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

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data: { file: FileObject } = await fetchFile(params.id);

  return {
    metadataBase: `${metadataBase}/`,
    title: data.file.name.replace(data.file.extension, ''),
    description: data.file.description.replace(/\r\n/g, ''),
    openGraph: {
      title:
        data.file.name.replace(data.file.extension, ''),
      type: 'website',
      url: `${metadataBase}/billing/${data.file.external_id}`,
      description: data.file.description.replace(/\r\n/g, ''),
      siteName: 'Fewsats Marketplace',
    },
    twitter: {
      card: 'summary_large_image',
      title:
        data.file.name.replace(data.file.extension, ''),
      description: data.file.description.replace(/\r\n/g, ''),
      site: '@fewsats',
      creator: '@fewsats',
    },
  };
}

export default async function BillingPage({
  params,
}: {
  params: { id: string };
}) {
  revalidateTag('file');
  const id = params.id;
  const data = id && (await fetchFile(id));

  if (!data) {
    notFound();
  }

  return <BillingComponent file={data?.file} />;
}
