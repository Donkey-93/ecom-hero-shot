'use client';
import { useEffect, useState } from 'react';

/**
 * Re-runs the query at a fixed interval and updates state with the result.
 * Useful for polling client-only stores (e.g. IndexedDB) without external deps.
 */
export function useLiveQuery<T>(
  query: () => Promise<T>,
  deps: unknown[] = [],
  intervalMs = 2000,
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    const run = () => {
      query()
        .then(d => {
          if (alive) setData(d);
        })
        .catch(() => {
          // swallow errors so polling continues; surface via data shape if needed
        });
    };
    run();
    const id = setInterval(run, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}