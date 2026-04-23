import { useEffect } from "react";
import { useAuth } from "./useAuth";

export const useTokenRefresh = () => {
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 1000 * 60 * 10); // every 10 mins

    return () => clearInterval(interval);
  }, [refreshAccessToken]);
};