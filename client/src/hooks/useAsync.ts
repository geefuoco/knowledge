import { useState, useEffect, useCallback } from "react";

export function useAsync(func: Function, dependencies: Array<any> = []) {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export function useAsyncFn(func: Function, dependencies: Array<any> = []) {
  return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal(
  func: Function,
  dependencies: Array<any>,
  initialLoading: boolean = false
) {
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  const execute = useCallback((...params: string[]) => {
    setLoading(true);
    return func(...params)
      .then((data: unknown) => {
        setValue(data);
        return data;
      })
      .catch((error: Error) => {
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);

  return { loading, error, value, execute };
}
