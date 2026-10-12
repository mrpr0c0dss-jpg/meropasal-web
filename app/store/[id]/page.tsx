'use client';

import React from 'react';
import { DedicatedStoreWebsite } from '@/components/storefront/DedicatedStoreWebsite';
import { useRouter } from 'next/navigation';

export default function DynamicStorePage() {
  const router = useRouter();

  return (
    <DedicatedStoreWebsite
      standalone={true}
      onBackToApp={() => router.push('/')}
    />
  );
}
