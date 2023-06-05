import { useState, useEffect, useRef } from 'react';

type FetchInit = {
  data: null;
  loading: false;
  error: null;
};
type FetchLoading = {
  data: null;
  loading: true;
  error: null;
};
type FetchError = {
  data: null;
  loading: false;
  error: string;
};
type FetchFullfilled<TReturn> = {
  data: TReturn;
  loading: false;
  error: null;
};

type FetchingState<TReturn> = FetchInit | FetchLoading | FetchError | FetchFullfilled<TReturn>;

type Validate<TReturn> = (result: TReturn) => { error: string | null };
type MakeFetch<TArgs extends any[]> = (...args: TArgs) => void;
type FetchComponents<TArgs extends any[], TReturn> = [
  makeFetch: MakeFetch<TArgs>,
  state: FetchingState<TReturn>
];
type Dependencies = Parameters<typeof useEffect>[1];
type FetchConfig<TReturn> = {
  deps?: Dependencies;
  init?: FetchLoading | FetchFullfilled<TReturn>;
  validate?: Validate<TReturn>;
};

const useFetch = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  config: FetchConfig<TReturn> = { deps: undefined, init: undefined, validate: undefined }
): FetchComponents<TArgs, TReturn> => {
  const { deps, init, validate } = config;
  const shouldUpdate = useRef<boolean | null>(false);
  const [fetchingState, setFetchingState] = useState<FetchingState<TReturn>>(
    init
      ? init
      : {
          data: null,
          loading: false,
          error: null,
        }
  );
  useEffect(() => {
    shouldUpdate.current = true;
    return () => {
      shouldUpdate.current = false;
    };
  }, deps);

  const makeFetch: MakeFetch<TArgs> = async (...args: TArgs) => {
    let fetchResult: FetchingState<TReturn> = { data: null, loading: true, error: null };
    try {
      setFetchingState(fetchResult);
      const result = await fn(...args);
      const error = validate && validate(result).error;
      if (error) fetchResult = { ...fetchResult, loading: false, error };
      else fetchResult = { ...fetchResult, loading: false, data: result };
    } catch (err) {
      if (err instanceof Error)
        fetchResult = { ...(fetchResult as FetchLoading), loading: false, error: err.message };
      else
        fetchResult = {
          ...(fetchResult as FetchLoading),
          loading: false,
          error: 'Неизвестная ошибка!',
        };
    }
    if (shouldUpdate.current) setFetchingState(fetchResult);
  };

  return [makeFetch, fetchingState];
};

export default useFetch;
