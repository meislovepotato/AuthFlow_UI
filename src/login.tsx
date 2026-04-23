import { useState } from "react";

interface Props {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: Props) {
  const [output, setOutput] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      setOutput(JSON.stringify(json, null, 2));

      if (res.ok) {
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);

        onSuccess();
      }
    } catch (err) {
      console.error(err);
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