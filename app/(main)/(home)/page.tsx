'use server';

import { revalidateTag } from 'next/cache';
import CatalogComponent from '@/app/(main)/(home)/content';

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
  : 'http://localhost:3000/';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    metadataBase: `${metadataBase}/`,
    title: 'Fewsats Marketplace',
    description: 'Discover and purchase a wide range of digital content, including ebooks, paintings, and more from providers worldwide. Transactions are secure and delivery is immediate through the Fewsats platform & L402 protocol. Explore the marketplace to find the digital assets you need for your projects and applications.',
    openGraph: {
      title: 'Marketplace.fewsats.com Buy digital content instantly',
      type: 'website',
      url: `${metadataBase}/`,
      description: 'Discover and purchase a wide range of digital content, including ebooks, paintings, and more from providers worldwide. Transactions are secure and delivery is immediate through the Fewsats platform & L402 protocol. Explore the marketplace to find the digital assets you need for your projects and applications.',
      siteName: 'Fewsats Marketplace',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Marketplace.fewsats.com Buy digital content instantly',
      description: 'Discover and purchase a wide range of digital content, including ebooks, paintings, and more from providers worldwide. Transactions are secure and delivery is immediate through the Fewsats platform & L402 protocol. Explore the marketplace to find the digital assets you need for your projects and applications.',
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
