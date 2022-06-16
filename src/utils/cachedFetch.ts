// https://javascript.plainenglish.io/react-18-useeffect-double-call-for-apis-emergency-fix-724b7ee6a646#:~:text=Fix%204%3A%20Create%20a%20Custom%20Fetcher

type FetchFactory = () => <T>(...params: Parameters<typeof fetch>) => Promise<T>;

const createCachedFetch: FetchFactory = () => {
  const cache: Map<Parameters<typeof fetch>[0], ReturnType<typeof fetch>> = new Map();

  return (url, options) => {
    const cachedPromise = cache.get(url);

    if (!cachedPromise) {
      const newPromise = fetch(url, options).then((response) => response.json());
      cache.set(url, newPromise);
      return newPromise;
    }
    return cachedPromise;
  };
};

export const cachedFetch = createCachedFetch();
