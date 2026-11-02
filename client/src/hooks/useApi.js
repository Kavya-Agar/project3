import { useCallback, useEffect, useState } from 'react';

// Loads data from `fetcher` on mount (and whenever `deps` change).
export function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      setState({ data: await fetcher(), loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
