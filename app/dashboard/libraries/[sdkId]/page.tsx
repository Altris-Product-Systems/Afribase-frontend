'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SdkDocs from '@/components/SdkDocs';

export default function SdkDocsPage() {
    const params = useParams();
    const sdkId = params.sdkId as string;

    return (
        <div className="h-full overflow-hidden">
            <SdkDocs sdkId={sdkId} />
        </div>
    );
}
