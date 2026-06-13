import { useState, useEffect, useRef } from "react";

export default function ApiKeys() {
  const TIPS = [
    { ok: true, text: "Rotate keys every 90 days" },
    { ok: true, text: "Use separate keys per environment" },
    { ok: false, text: "Never commit keys to git" },
    { ok: true, text: "Scope keys to minimum permissions" },
  ];

  const INITIAL_KEYS = [
    {
      id: 1,
      name: "Production",
      masked: "sk_live_••••••••••••3f8a",
      full: "sk_live_7xK2pQmN9vR4tY1wZ3f8a",
      scope: "read/write",
      created: "Jun 1",
    },
    {
      id: 2,
      name: "Staging",
      masked: "sk_test_••••••••••••9c2b",
      full: "sk_test_4bH7jL0eA6uX8mP9c2b",
      scope: "read only",
      created: "May 12",
    },
  ];

  let nextId = 3;

  function useToast() {
    const [msg, setMsg] = useState(null);
    const show = (m) => {
      setMsg(m);
      setTimeout(() => setMsg(null), 2000);
    };
    return [msg, show];
  }

  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("read/write");
  const [toast, showToast] = useToast();
  const usageRef = useRef(null);
  const usageChart = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (cancelled || !usageRef.current) return;
      usageChart.current = new Chart(usageRef.current, {
        type: "doughnut",
        data: {
          labels: ["Production", "Staging"],
          datasets: [
            {
              data: [1247, 235],
              backgroundColor: ["#6366f1", "rgba(99,102,241,0.3)"],
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: { legend: { display: false } },
        },
      });
    });
    return () => {
      cancelled = true;
      usageChart.current?.destroy();
    };
  }, []);

  function copy(val) {
    navigator.clipboard?.writeText(val).catch(() => {});
    showToast("Copied to clipboard");
  }

  function revoke(id) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    showToast("Key revoked");
  }

  function generate() {
    if (!name.trim()) return;
    const rand = Math.random().toString(36).slice(2, 14);
    const full = "sk_live_" + rand;
    const masked = "sk_live_••••••••••••" + rand.slice(-4);
    setKeys((prev) => [
      ...prev,
      {
        id: nextId++,
        name: name.trim(),
        masked,
        full,
        scope,
        created: "Jun 13",
      },
    ]);
    setName("");
    showToast("New key generated");
  }

  return (
    <>
      {toast && <div className="toast-inline">{toast}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">API keys</div>
            <div className="card-sub" style={{ marginTop: 2 }}>
              Keys are shown once. Click any key to copy.
            </div>
          </div>
          <span className="pill pill-indigo">{keys.length} active</span>
        </div>

        {keys.map((k) => (
          <div className="key-row" key={k.id}>
            <span className="key-name">{k.name}</span>
            <div
              className="key-val"
              onClick={() => copy(k.full)}
              title="Click to copy"
            >
              {k.masked}
            </div>
            <span className="key-scope">{k.scope}</span>
            <span style={{ fontSize: 11, color: "var(--muted2)" }}>
              {k.created}
            </span>
            <div className="key-actions">
              <button className="key-btn" onClick={() => copy(k.full)}>
                Copy
              </button>
              <button className="key-btn red" onClick={() => revoke(k.id)}>
                Revoke
              </button>
            </div>
          </div>
        ))}

        <div className="new-key-form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Key name (e.g. Mobile app)"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="read/write">read / write</option>
            <option value="read only">read only</option>
          </select>
          <button className="create-key-btn" onClick={generate}>
            + Generate key
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Usage this month</span>
          </div>
          <div style={{ position: "relative", height: 140 }}>
            <canvas
              ref={usageRef}
              role="img"
              aria-label="API key usage by key name"
            />
          </div>
          <div
            style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "#6366f1",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--muted)" }}>Production 1,247</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "rgba(99,102,241,0.3)",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--muted)" }}>Staging 235</span>
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            Key best practices
          </div>
          {TIPS.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: t.ok ? "var(--mint-bg)" : "var(--amber-bg)",
                  color: t.ok ? "var(--mint)" : "var(--amber)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  flexShrink: 0,
                }}
              >
                {t.ok ? "✓" : "⚠"}
              </span>
              <span style={{ color: t.ok ? "var(--muted)" : "var(--amber)" }}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
