import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { seedDatabaseIfEmpty } from '@/shared/db/seed';

export function DbInitProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await seedDatabaseIfEmpty();
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка базы данных');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!ready) {
    return null;
  }

  return children;
}
