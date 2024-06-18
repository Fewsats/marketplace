import { ImageResponse } from 'next/og';
import React from 'react';

// Define the size of the Open Graph image
export const alt = 'Fewsats Marketplace'
export const size = {
    width: 1200,
    height: 628,
};

// Define runtime options
export const runtime = 'edge';

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';

// Function to generate the image
export default async function Image() {
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
                    src={`${metadataBase}/opengraph-main.png`}
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
