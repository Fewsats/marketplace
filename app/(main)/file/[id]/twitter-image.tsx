import { ImageResponse } from 'next/og';
import React from 'react';
import {FileObject} from "@/app/types";

// Define the size of the Open Graph image
export const alt = 'Fewsats Marketplace'
export const size = {
    width: 1200,
    height: 628,
};

// Define runtime options
export const runtime = 'edge';

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

// Function to generate the image
export default async function Image({ params }: { params: { id: string } }) {
    const data: { file: FileObject } = await fetchFile(params.id);

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={`${data.file.cover_url}`}
                    alt={alt}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    width={size.width}
                    height={size.height}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
