import { useEffect, useRef } from 'react';

type PollSuccessfull<TResult> = {
  data: TResult;
  error: null;
};
type PollRejected = {
  data: null;
  error: string;
};
type PollResult<TResult> = PollRejected | PollSuccessfull<TResult>;

const usePolling = <TResult>(
  interval: number,
  request: () => Promise<TResult>,
  onFullfilled: (result: PollResult<TResult>) => void
) => {
  const done = useRef<boolean>(false);

  const makeRequest = async () => {
    if (done.current) return;
    try {
      const result = await request();
      onFullfilled({ data: result, error: null });
    } catch (err) {
      if (err instanceof Error) onFullfilled({ data: null, error: err.message });
      else onFullfilled({ data: null, error: 'Неизвестная ошибка!' });
    }
    setTimeout(() => makeRequest(), interval);
  };

  useEffect(() => {
    makeRequest();
    return () => {
      done.current = true;
    };
  }, []);
};

export default usePolling;
