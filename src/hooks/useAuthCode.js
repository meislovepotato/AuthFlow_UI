import { useEffect, useState } from "react";

export const useAuthCode = () => {
  const [code, setCode] = useState(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCode(params.get("code"));
    setState(params.get("state"));
  }, []);

  return { code, state };
};