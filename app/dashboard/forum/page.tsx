'use client';

import React from 'react';
import ForumManager from '@/components/ForumManager';

export default function GlobalForumPage() {
    return (
        <div className="p-8 lg:p-10 max-w-7xl mx-auto h-full overflow-y-auto bg-[#09090b]">
            <ForumManager />
        </div>
    );
}
