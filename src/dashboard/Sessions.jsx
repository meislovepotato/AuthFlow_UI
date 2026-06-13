import { useState, useEffect, useRef } from "react";

export default function Sessions() {
  const INITIAL_SESSIONS = [
    {
      id: 1,
      icon: "💻",
      name: "This device — Chrome 124",
      meta: "Manila, Philippines · 192.168.1.4",
      time: "Active now",
      current: true,
    },
    {
      id: 2,
      icon: "🦊",
      name: "Firefox 125",
      meta: "Singapore, SG · 103.21.47.8",
      time: "1 hour ago",
      current: false,
    },
    {
      id: 3,
      icon: "🍎",
      name: "Safari 17",
      meta: "San Francisco, US · 104.18.22.1",
      time: "8 hours ago",
      current: false,
    },
  ];

  const SETTINGS = [
    {
      key: "autoRefresh",
      label: "Auto-refresh tokens",
      sub: "Silently renew access tokens",
      default: true,
    },
    {
      key: "idleTimeout",
      label: "Idle timeout",
      sub: "Sign out after 30 min inactivity",
      default: true,
    },
    {
      key: "concurrent",
      label: "Concurrent sessions",
      sub: "Allow multiple active sessions",
      default: false,
    },
    {
      key: "fingerprint",
      label: "Device fingerprinting",
      sub: "Flag logins from new devices",
      default: true,
    },
  ];

  function useToast() {
    const [msg, setMsg] = useState(null);
    const show = (m) => {
      setMsg(m);
      setTimeout(() => setMsg(null), 2000);
    };
    return [msg, show];
  }

  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [prefs, setPrefs] = useState(
    Object.fromEntries(SETTINGS.map((s) => [s.key, s.default])),
  );
  const [toast, showToast] = useToast();
  const timelineRef = useRef(null);
  const timelineChart = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (cancelled || !timelineRef.current) return;
      timelineChart.current = new Chart(timelineRef.current, {
        type: "line",
        data: {
          labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm"],
          datasets: [
            {
              label: "Manila",
              data: [0, 0, 1, 1, 1, 2, 3],
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.07)",
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
            },
            {
              label: "Singapore",
              data: [0, 0, 0, 0, 1, 1, 0],
              borderColor: "#34d399",
              backgroundColor: "rgba(52,211,153,0.05)",
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: "rgba(255,255,255,0.04)" },
              ticks: { color: "#6b7094", font: { size: 11 } },
            },
            y: {
              grid: { color: "rgba(255,255,255,0.04)" },
              ticks: { color: "#6b7094", font: { size: 11 }, stepSize: 1 },
            },
          },
        },
      });
    });
    return () => {
      cancelled = true;
      timelineChart.current?.destroy();
    };
  }, []);

  function revoke(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session revoked");
  }

  function revokeAll() {
    setSessions((prev) => prev.filter((s) => s.current));
    showToast("All other sessions revoked");
  }

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      {toast && <div className="toast-inline">{toast}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Active sessions</div>
            <div className="card-sub" style={{ marginTop: 2 }}>
              Revoking a session signs that device out immediately.
            </div>
          </div>
          <button className="btn-danger-sm" onClick={revokeAll}>
            Revoke all others
          </button>
        </div>

        {sessions.map((s) => (
          <div className="device-row" key={s.id}>
            <div className="device-icon">{s.icon}</div>
            <div className="device-info">
              <div className="device-name">{s.name}</div>
              <div className="device-meta">
                {s.meta} · Last active: {s.time}
              </div>
            </div>
            {s.current ? (
              <span className="current-badge">Current</span>
            ) : (
              <button className="revoke-btn" onClick={() => revoke(s.id)}>
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>
            Session settings
          </div>
          {SETTINGS.map((s) => (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text)",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
                >
                  {s.sub}
                </div>
              </div>
              <div
                className={`toggle ${prefs[s.key] ? "on" : "off"}`}
                onClick={() => toggle(s.key)}
                role="switch"
                aria-checked={prefs[s.key]}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggle(s.key)}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Session timeline — today</span>
          </div>
          <div
            style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 12 }}
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
              <span style={{ color: "var(--muted)" }}>Manila</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "#34d399",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--muted)" }}>Singapore</span>
            </span>
          </div>
          <div style={{ position: "relative", height: 160 }}>
            <canvas
              ref={timelineRef}
              role="img"
              aria-label="Session activity timeline for today"
            />
          </div>
        </div>
      </div>
    </>
  );
}
