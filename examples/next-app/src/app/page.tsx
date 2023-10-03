'use client';
import { BanditWidget, BanditContextProvider } from '@bandit-network/sdk-react';

export default function Home() {
  return (
    <BanditContextProvider
      settings={{
        accessKey: 'ACCESS KEY',
      }}
    >
      <BanditWidget />
    </BanditContextProvider>
  );
}
