'use server';

import { revalidateTag } from 'next/cache';
import CatalogComponent from '@/app/(main)/(home)/content';

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    metadataBase,
    title: 'Fewsats Marketplace Catalog',
    openGraph: {
      title: 'Fewsats Marketplace Catalog',
      type: 'website',
      url: `${metadataBase}`,
      description: 'Fewsats Marketplace Catalog',
      siteName: 'Fewsats Marketplace',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Fewsats Marketplace Catalog',
      description: 'Fewsats Marketplace Catalog',
      site: '@fewsats',
      creator: '@fewsats',
    },
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

  return <CatalogComponent files={data?.files} />;
}
