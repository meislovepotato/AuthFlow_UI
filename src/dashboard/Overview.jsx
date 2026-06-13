import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Overview() {
  const { user } = useAuth();
  const callsRef = useRef(null);
  const latencyRef = useRef(null);
  const callsChart = useRef(null);
  const latencyChart = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (cancelled) return;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const calls = [940, 1200, 870, 1540, 1820, 610, 1482];
      const lat = [38, 42, 55, 39, 44, 37, 42];

      callsChart.current = new Chart(callsRef.current, {
        type: "line",
        data: {
          labels: days,
          datasets: [
            {
              data: calls,
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: "#6366f1",
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
              ticks: { color: "#6b7094", font: { size: 11 } },
            },
          },
        },
      });

      latencyChart.current = new Chart(latencyRef.current, {
        type: "bar",
        data: {
          labels: days,
          datasets: [
            {
              data: lat,
              backgroundColor: "rgba(52,211,153,0.3)",
              borderColor: "#34d399",
              borderWidth: 1,
              borderRadius: 4,
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
              ticks: { color: "#6b7094", font: { size: 11 } },
            },
          },
        },
      });
    });

    return () => {
      cancelled = true;
      callsChart.current?.destroy();
      latencyChart.current?.destroy();
    };
  }, []);

  const ACTIVITY = [
    {
      type: "ok",
      icon: "✓",
      title: "Successful login",
      meta: "Chrome · Manila, PH · 192.168.1.4",
      time: "2m ago",
    },
    {
      type: "ok",
      icon: "🔑",
      title: "Token refreshed",
      meta: "Production key · auto-rotated",
      time: "4m ago",
    },
    {
      type: "warn",
      icon: "⚠",
      title: "New device sign-in",
      meta: "Firefox · Singapore, SG",
      time: "1h ago",
    },
    {
      type: "ok",
      icon: "✓",
      title: "Password verified",
      meta: "Settings change confirmed",
      time: "3h ago",
    },
  ];

  const LOCATIONS = [
    { flag: "🇵🇭", label: "Manila, Philippines", time: null, current: true },
    { flag: "🇸🇬", label: "Singapore", time: "1h ago", current: false },
    { flag: "🇺🇸", label: "San Francisco, US", time: "8h ago", current: false },
  ];

  return (
    <>
      <div className="grid-4">
        {[
          {
            label: "Security score",
            val: "87",
            sub: "↑ Good standing",
            subClass: "",
          },
          {
            label: "Active sessions",
            val: "3",
            sub: "2 countries",
            subClass: "",
          },
          {
            label: "API calls today",
            val: "1,482",
            sub: "↑ 12% vs yesterday",
            subClass: "",
          },
          {
            label: "Token refreshes",
            val: "14",
            sub: "Last: 4 min ago",
            subClass: "warn",
          },
        ].map((s) => (
          <div className="card-sm" key={s.label}>
            <div className="card-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className={`stat-sub ${s.subClass}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">API calls — last 7 days</span>
            <span className="pill pill-indigo">Daily volume</span>
          </div>
          <div style={{ position: "relative", height: 160 }}>
            <canvas
              ref={callsRef}
              role="img"
              aria-label="API calls over last 7 days"
            />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Response latency (ms)</span>
            <span className="pill pill-green">avg 42ms</span>
          </div>
          <div style={{ position: "relative", height: 160 }}>
            <canvas
              ref={latencyRef}
              role="img"
              aria-label="Response latency over last 7 days"
            />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent activity</span>
          </div>
          {ACTIVITY.map((a, i) => (
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

        <div className="card">
          <div className="card-header">
            <span className="card-title">Active session locations</span>
            <span className="pill pill-green">
              <span className="pulse" />3 live
            </span>
          </div>
          <div className="world-map">
            <div className="map-grid" />
            <div className="map-dot" style={{ top: "40%", left: "78%" }} />
            <div
              className="map-dot map-dot-2"
              style={{ top: "35%", left: "71%" }}
            />
            <div className="map-dot" style={{ top: "45%", left: "15%" }} />
            <span className="map-label">PH · SG · US</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LOCATIONS.map((loc) => (
              <div
                key={loc.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "var(--muted)" }}>
                  {loc.flag} {loc.label}
                </span>
                {loc.current ? (
                  <span
                    className="pill pill-green"
                    style={{ fontSize: 10, padding: "2px 8px" }}
                  >
                    <span className="pulse" />
                    current
                  </span>
                ) : (
                  <span style={{ color: "var(--muted2)" }}>{loc.time}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
