import { useState, useEffect, useRef } from 'react';

type FetchingState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
type Validate<T> = (result: T) => { error: string | null };
type MakeFetch<TArgs extends any[], TReturn> = (
  validate?: Validate<TReturn>,
  ...args: TArgs
) => void;
type FetchComponents<TArgs extends any[], TReturn> = [
  makeFetch: MakeFetch<TArgs, TReturn>,
  state: FetchingState<TReturn>
];
type Dependencies = Parameters<typeof useEffect>[1];

const useFetch = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  deps?: Dependencies
): FetchComponents<TArgs, TReturn> => {
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

  const makeFetch: MakeFetch<TArgs, TReturn> = async (validate, ...args: TArgs) => {
    console.log('bout to make call');

    let fetchResult: FetchingState<TReturn> = { data: null, loading: true, error: null };
    try {
      setFetchingState(fetchResult);
      const result = await fn(...args);
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
