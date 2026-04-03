import { useState, useEffect, useCallback } from 'react';

export default function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { immediate = true, method = 'GET', body = null } = options;

  const fetchData = useCallback(
    async (overrideBody) => {
      setLoading(true);
      setError(null);

      try {
        const fetchOptions = {
          method,
          headers: { 'Content-Type': 'application/json' },
        };

        const payload = overrideBody || body;
        if (payload) {
          fetchOptions.body = JSON.stringify(payload);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        const result = json.data !== undefined ? json.data : json;
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, body]
  );

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [url, immediate]);

  return { data, loading, error, refetch: fetchData };
}
