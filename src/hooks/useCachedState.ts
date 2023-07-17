import { useEffect, useState } from 'react';

type CachedStateOptions = {
  storage?: Storage;
};

const useCachedState = <S=undefined>(
  key: string,
  initialState?: S,
  options: CachedStateOptions = {},
) => {
  const { storage = window.localStorage } = options;
  const storedValue = storage.getItem(key);
  const [state, setState] = useState<S>(storedValue ? JSON.parse(storedValue) : initialState);

  useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [state]);
  return [state, setState] as const;
};

export default useCachedState;
