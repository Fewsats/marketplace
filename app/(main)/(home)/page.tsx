'use server';

import { revalidateTag } from 'next/cache';
import CatalogComponent from '@/app/(main)/(home)/content';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: 'Catalog',
  };
}

async function fetchFiles() {
  const res = await fetch(`${process.env.API_URL}/v0/storage/search`, {
    next: { tags: ['files'] },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res?.ok) return undefined;
  return res.json();
}

export default async function CatalogPage() {
  revalidateTag('files');
  const data = await fetchFiles();

  return <CatalogComponent files={data?.files.filter((file) => file.status !== 'in_review')} />;
}
