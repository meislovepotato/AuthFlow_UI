import { useEffect, useRef } from "react";

export default function SecurityCenter() {
  const scoreRef = useRef(null);
  const loginRef = useRef(null);
  const scoreChart = useRef(null);
  const loginChart = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (cancelled) return;

      scoreChart.current = new Chart(scoreRef.current, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [87, 13],
              backgroundColor: ["#6366f1", "rgba(99,102,241,0.1)"],
              borderWidth: 0,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: false,
          cutout: "78%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
      });

      loginChart.current = new Chart(loginRef.current, {
        type: "bar",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5"],
          datasets: [
            {
              label: "Success",
              data: [18, 24, 21, 20, 15],
              backgroundColor: "rgba(99,102,241,0.6)",
              borderRadius: 3,
              stack: "s",
            },
            {
              label: "Failed",
              data: [0, 1, 2, 0, 0],
              backgroundColor: "rgba(248,113,113,0.6)",
              borderRadius: 3,
              stack: "s",
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
              stacked: true,
            },
            y: {
              grid: { color: "rgba(255,255,255,0.04)" },
              ticks: { color: "#6b7094", font: { size: 11 } },
              stacked: true,
            },
          },
        },
      });
    });

    return () => {
      cancelled = true;
      scoreChart.current?.destroy();
      loginChart.current?.destroy();
    };
  }, []);

  const CHECKS = [
    { ok: true, text: "Strong password set" },
    { ok: true, text: "Email verified" },
    { ok: false, text: "2FA not enabled", cta: true },
    { ok: true, text: "No suspicious logins" },
    { ok: true, text: "API keys scoped correctly" },
  ];

  const LOG = [
    {
      type: "ok",
      icon: "✓",
      title: "Successful login",
      meta: "Chrome 124 · Manila, PH · 192.168.1.4",
      time: "Just now",
    },
    {
      type: "ok",
      icon: "🔑",
      title: "Access token issued",
      meta: "Session started, expires in 59m",
      time: "2m ago",
    },
    {
      type: "ok",
      icon: "✓",
      title: "Token auto-refreshed",
      meta: "Seamless rotation via refresh token",
      time: "4m ago",
    },
    {
      type: "warn",
      icon: "⚠",
      title: "New device detected",
      meta: "Firefox 125 · Singapore, SG · flagged",
      time: "1h ago",
    },
    {
      type: "ok",
      icon: "✓",
      title: "Successful login",
      meta: "Firefox 125 · Singapore, SG",
      time: "1h ago",
    },
    {
      type: "danger",
      icon: "✗",
      title: "Failed login attempt",
      meta: "Wrong password · 3 attempts · IP 103.44.12.7",
      time: "2h ago",
    },
    {
      type: "ok",
      icon: "✓",
      title: "Successful login",
      meta: "Safari 17 · San Francisco, US",
      time: "8h ago",
    },
    {
      type: "ok",
      icon: "🔑",
      title: "API key used",
      meta: "Production key · 847 requests",
      time: "10h ago",
    },
  ];

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Security score</span>
            <span className="pill pill-green">Good</span>
          </div>
          <div className="score-ring-wrap">
            <canvas
              ref={scoreRef}
              width={100}
              height={100}
              role="img"
              aria-label="Security score 87 out of 100"
            />
            <div className="score-info">
              <h2>87</h2>
              <p>out of 100 · Good standing</p>
            </div>
          </div>
          <div className="score-checks">
            {CHECKS.map((c, i) => (
              <div className="score-check" key={i}>
                <div
                  className={`check-icon ${c.ok ? "check-ok" : "check-warn"}`}
                >
                  {c.ok ? "✓" : "!"}
                </div>
                {c.cta ? (
                  <span style={{ color: "var(--amber)" }}>
                    2FA not enabled —{" "}
                    <a
                      href="#"
                      style={{
                        color: "var(--accent2)",
                        textDecoration: "none",
                      }}
                    >
                      enable now
                    </a>
                  </span>
                ) : (
                  <span style={{ color: "var(--text)" }}>{c.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Login attempts — 30 days</span>
          </div>
          <div style={{ position: "relative", height: 180 }}>
            <canvas
              ref={loginRef}
              role="img"
              aria-label="Login attempts over 30 days"
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
              <span style={{ color: "var(--muted)" }}>Success 98</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "#f87171",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--muted)" }}>Failed 3</span>
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Full activity log</span>
          <span className="pill pill-indigo">Last 24h</span>
        </div>
        {LOG.map((a, i) => (
          <div className="activity-item" key={i}>
            <div className={`activity-icon ${a.type}`}>{a.icon}</div>
            <div className="activity-body">
              <div className="activity-title">{a.title}</div>
              <div className="activity-meta">{a.meta}</div>
            </div>
            <div className="activity-time">{a.time}</div>
          </div>
        ))}
      </div>
    </>
  );
}
