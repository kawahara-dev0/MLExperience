/** Custom hook for API calls. */
import { useState, useCallback } from "react";
import type { ApiResponse } from "../types/api";

interface UseApiOptions {
  onSuccess?: (data: ApiResponse) => void;
  onError?: (error: Error) => void;
  timeout?: number; // milliseconds
}

export function useApi(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchApi = useCallback(
    async <T = unknown>(requestData: {
      req: string;
      selectData: string;
      arg?: (string | number | boolean)[];
    }): Promise<ApiResponse<T> | null> => {
      setLoading(true);
      setError("");

      try {
        const apiUrl = import.meta.env.VITE_WEBAPI_URL;
        if (!apiUrl) {
          throw new Error("API URL is not set. Configure VITE_WEBAPI_URL in .env.");
        }

        // Timeout: default 30 min for Optimize, 5 min for others
        const timeoutMs = options.timeout || (requestData.req === "Optimize" ? 1800000 : 300000);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

        const data: ApiResponse<T> = await response.json();

        if (data.res === requestData.req) {
          options.onSuccess?.(data);
          return data;
        }
        setError(data.res);
        if (import.meta.env.DEV) {
          console.log(`${requestData.req} error:: res: ${data.res} arg: ${data.arg}`);
        }
        return null;
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (err) {
        let errorMessage = "Communication error";
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Request timed out. Please try again later.";
          } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
            errorMessage = "Network error. Check your connection.";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));

        if (import.meta.env.DEV) {
          console.error(`${requestData.req} error:`, err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fetchApi, loading, error, setError };
}
