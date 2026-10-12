'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { WAStoreDesignStudio } from '@/components/storefront/WAStoreDesignStudio';

export default function DesignPage() {
  const router = useRouter();

  return (
    <WAStoreDesignStudio
      onBackToApp={() => router.push('/')}
    />
  );
}
