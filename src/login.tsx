import { useState } from "react";
import { apiPost, CODE_MAP, codeMessage } from "./utils/apiClient";
import { useToast } from "./context/ToastContext";

interface Props {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: Props) {
  const [output, setOutput] = useState<string>("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const json = await apiPost("/login", body, { credentials: "include" });
      setOutput(JSON.stringify(json, null, 2));
      if (json?.accessToken) {
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);
        onSuccess();
      }
    } catch (err) {
      const errObj = err as any;
      const code = errObj?.errorCode || "SERVER_ERROR";
      if (code === "VALIDATION_ERROR") {
        setOutput(
          JSON.stringify(
            { fieldErrors: CODE_MAP.VALIDATION_ERROR(errObj) },
            null,
            2,
          ),
        );
      } else {
        const msg = codeMessage(code, errObj) || errObj?.message || "Error";
        showToast(msg, "error");
        setOutput(JSON.stringify({ error: msg }, null, 2));
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>AuthFlow — Login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Password
          <input name="password" type="password" required />
        </label>

        <button type="submit">Login</button>
      </form>

      <pre>{output}</pre>
    </div>
  );
}
