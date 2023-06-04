import { useState, useEffect, useRef } from 'react';

type FetchingState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
type Validate<T> = (result: T) => { error: string | null };
type MakeFetch<TReturn> = (validate?: Validate<TReturn>) => void;
type FetchComponents<T> = [makeFetch: MakeFetch<T>, state: FetchingState<T>];
type Dependencies = Parameters<typeof useEffect>[1];

const useFetch = <TReturn>(
  fn: () => Promise<TReturn>,
  deps?: Dependencies
): FetchComponents<TReturn> => {
  const shouldUpdate = useRef<boolean | null>(false);
  const [fetchingState, setFetchingState] = useState<FetchingState<TReturn>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    shouldUpdate.current = true;
    return () => {
      shouldUpdate.current = false;
    };
  }, deps);

  const makeFetch: MakeFetch<TReturn> = async (validate) => {
    let fetchResult: FetchingState<TReturn> = { data: null, loading: true, error: null };
    try {
      setFetchingState(fetchResult);
      const result = await fn();
      const error = validate && validate(result).error;
      if (error) fetchResult = { ...fetchResult, error };
      else fetchResult = { ...fetchResult, data: result };
    } catch (err) {
      if (err instanceof Error) fetchResult = { ...fetchResult, error: err.message };
      else fetchResult = { ...fetchResult, error: 'Неизвестная ошибка!' };
    }
    if (shouldUpdate.current) {
      fetchResult = { ...fetchResult, loading: false };
      setFetchingState(fetchResult);
    }
  };

  return [makeFetch, fetchingState];
};

export default useFetch;
