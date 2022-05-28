import { useEffect, useState } from 'react';

export function useFetchOnce<T>(...fetchParams: Parameters<typeof fetch>): T | undefined {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const abortController = new AbortController();

    fetch(fetchParams[0], {
      ...fetchParams[1],
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((json: T) => setState(json))
      .catch((error) => {
        // Ignore aborted requests, but rethrow real errors
        if (!abortController.signal.aborted) throw error;
      });

    // React 18 is rendering useEffect twice in StrictMode: https://www.youtube.com/watch?v=j8s01ThR7bQ
    // Instead of using a ref or global variable to check if a request was already made, use a proper cleanup function
    return function cancel() {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
}
