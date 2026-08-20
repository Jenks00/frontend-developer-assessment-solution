'use client';

import { useEffect, useState } from 'react';

// Scoped to the module so the worker is started at most once even when this
// effect runs twice under React StrictMode in development.
let mockingReady: Promise<unknown> | undefined;

function enableMocking(): Promise<unknown> {
  mockingReady ??= import('@/mocks/browser').then(({ worker }) =>
    worker.start({ onUnhandledRequest: 'bypass' })
  );
  return mockingReady;
}

export function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    enableMocking().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}