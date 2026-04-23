import { useEffect, useState } from "react";

export default function Dashboard() {
  // Store the token and API response
  const [token, setToken] = useState<string | null>(null);
  const [meOutput, setMeOutput] = useState<string>("");

  // On mount, load the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  // Fetch user info from backend
  const handleMe = async () => {
    if (!token) return; // Prevent request if no token

    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const json = await res.json();
      setMeOutput(JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(err);
      setMeOutput("Error fetching user info");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>AuthFlow — Dashboard</h1>

      <button onClick={handleMe}>Get My Info</button>

      {meOutput && (
        <pre
          style={{
            background: "#f0f0f0",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
        >
          {meOutput}
        </pre>
      )}
    </div>
  );
}