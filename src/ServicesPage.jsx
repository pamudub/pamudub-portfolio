import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sfx } from "./sfx";
import { makeTouchSelectHandlers } from "./useTouchSelect";
import menuVideo from "./assets/Mainn.mp4";
import menuLoopVideo from "./assets/Mainn_1.mp4";

const SERVICES = [
  {
    id: "voice",
    tag: "VOICE",
    label: "VOICE ACTING & DUBBING",
    stats: [
      { tag: "⭐", label: "DELIVERY", value: "2-3 DAYS" },
      { tag: "🍴", label: "REVISIONS", value: "2 TIMES" },
      { tag: "📦", label: "FORMAT", value: "WAV / MP3" },
      { tag: "🏷️", label: "START AT", value: "500 THB" },
    ],
  },
  {
    id: "edit",
    tag: "EDIT",
    label: "VIDEO & SHORT-FORM EDITING",
    stats: [
      { tag: "⭐", label: "DELIVERY", value: "3-5 DAYS" },
      { tag: "🍴", label: "REVISIONS", value: "2 TIMES" },
      { tag: "📦", label: "FORMAT", value: "1080P / 4K" },
      { tag: "🏷️", label: "START AT", value: "1,000 THB" },
    ],
  },
  {
    id: "sponsor",
    tag: "SPONSOR",
    label: "SPONSORED & TIE-IN CONTENT",
    stats: [
      { tag: "⭐", label: "DELIVERY", value: "1-3 DAYS" },
      { tag: "🍴", label: "TYPE", value: "TIE-IN / REVIEW" },
      { tag: "📦", label: "PLATFORM", value: "YT / TIKTOK / IG / FB" },
      { tag: "🏷️", label: "START AT", value: "1,000 THB" },
    ],
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [activeInfoBar, setActiveInfoBar] = useState(0);

  useEffect(() => {
    const v = document.querySelector('video');
    if (v) v.play().catch(() => { });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") { setActive(i => Math.max(0, i - 1)); sfx.move(); }
      if (e.key === "ArrowDown") { setActive(i => Math.min(SERVICES.length - 1, i + 1)); sfx.move(); }
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") { sfx.back(); navigate(-1); }
      if (e.key === "Enter") { sfx.confirm(); }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  const renderInfoBars = () => {
    const svc = SERVICES[active];
    if (!svc) return null;

    return svc.stats.map((s, i) => (
      <div
        className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
        key={`stat-${active}-${i}`}
        style={{ top: `${155 + i * 52}px`, animationDelay: `${i * 50}ms` }}
        onMouseEnter={() => setActiveInfoBar(i)}
      >
        <div className="sc-info-bar">
          <span style={{ fontSize: '24px', marginLeft: '14px', marginRight: '8px' }}>{s.tag}</span>
          <span className="sc-info-bar-text" style={{ flex: 1 }}>{s.label}</span>
          <span className="sc-info-bar-box">VALUE</span>
          <span className="sc-info-bar-count" style={{
            width: '150px',
            textAlign: 'right',
            marginRight: '16px',
            whiteSpace: 'nowrap',
            fontSize: s.value.length > 10 ? '18px' : '22px',
          }}>{s.value}</span>
        </div>
      </div>
    ))
  }

  return (
    <div id="menu-screen">
      <BackgroundVideo />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&family=Montserrat:wght@300&display=swap');

        .sp-container {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 8px;
          padding-left: 2.8vw;
          padding-top: 6vh;
        }

        .sp-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 88px;
          line-height: 0.9;
          color: #ffffff;
          letter-spacing: 4px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sp-container.mounted .sp-title, .sp-container.mounted .sp-subtitle {
          opacity: 1;
          transform: translateX(0);
        }

        .sp-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          font-weight: 300;
          color: #ffffff;
          letter-spacing: 1px;
          max-width: 55vw;
          line-height: 1.6;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
        }

        .sp-btn-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 24px;
        }

        /* ── Service bar ── */
        .sc-bar {
          position: relative;
          width: 45vw;
          height: 64px;
          transition: height 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, background 0.35s ease;
          background: #111;
          cursor: pointer;
          pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          z-index: 1;
        }
        .sc-bar-outer.active .sc-bar {
          transform: translateX(6px) scale(1.02);
          box-shadow: 10px 8px 0 #d63232;
        }
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer.active .sc-bar     { height: 90px; }
        .sc-bar-outer.active .sc-bar-red { height: 90px; opacity: 1; }
        .sc-bar-outer.mounted { opacity: 1; transform: translateX(0); }

        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45vw;
          height: 64px;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.3s ease, height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: var(--p3-blue-light);
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 20px 0 20px;
        }

        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: 'Anton', sans-serif;
          font-size: 50px;
          letter-spacing: 1px;
          color: #ffffff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
          width: 140px;
        }

        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 3px;
          padding-left: 50px;
        }

        .sc-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          line-height: 1.1;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-label { color: var(--p3-text-on-light); }

        /* ── Info Bars (Right Side Details) ── */
        @keyframes sc-infobar-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .sc-info-bar-wrap {
          position: fixed;
          right: 48px;
          left: 65%;
          height: 46px;
          background: transparent;
          pointer-events: all;
          z-index: 50;
          padding: 0;
          animation: sc-infobar-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s ease, padding 0.2s ease, border-radius 0.2s ease;
          cursor: default;
        }
        .sc-info-bar-wrap.selected {
          background: #111;
          padding: 1.5px;
          border-radius: 8px;
          transform: translateX(-4px);
        }
        .sc-info-bar {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: background 0.2s ease, border-radius 0.2s ease;
        }
        .sc-info-bar-wrap.selected .sc-info-bar {
          background: var(--p3-blue-light);
          border-radius: 7px;
        }
        .sc-info-bar-wrap.selected .sc-info-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: #c4001a;
          z-index: 1;
        }
        .sc-info-bar-text {
          flex: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: var(--p3-bg-dark);
          padding: 0 14px;
          user-select: none;
        }
        .sc-info-bar-box {
          height: 70%;
          background: #000;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: #fff;
          flex-shrink: 0;
          border-radius: 6px;
          margin-right: 4px;
          user-select: none;
        }
        .sc-info-bar-count {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          color: #111;
          flex-shrink: 0;
          user-select: none;
        }

        /* ── BACK button ── */
        .p3-row-clone {
          position: relative; cursor: pointer; display: inline-flex; align-items: center; justify-content: flex-start; line-height: 1; text-decoration: none; opacity: 0; transform: translateX(-36px); transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .sp-container.mounted .p3-row-clone { opacity: 1; transform: translateX(0); }
        .p3-skew-wrap-clone { position: relative; display: flex; align-items: center; isolation: isolate; transform: skewX(-4deg) skewY(2deg); }
        .p3-shadow-tri-clone { position: absolute; top: 50%; left: -10%; width: 120%; height: 100%; transform-origin: left center; background: rgba(235, 80, 120, 0.85); z-index: 1; pointer-events: none; transform: translateY(-40%) translateX(-12px) scaleX(0); transition: transform 0.18s ease; clip-path: polygon(0 0, 100% 50%, 0 100%); }
        .p3-row-clone:hover .p3-shadow-tri-clone { transform: translateY(-40%) translateX(-12px) scaleX(1); }
        .p3-highlight-clone { position: absolute; top: 50%; left: -10%; width: 120%; height: 100%; transform-origin: left center; background: #ffffff; z-index: 2; transition: transform 0.22s cubic-bezier(0.22,1,0.36,1); pointer-events: none; transform: translateY(-50%) scaleX(0); clip-path: polygon(0 0, 100% 50%, 0 100%); }
        .p3-row-clone:hover .p3-highlight-clone { transform: translateY(-50%) scaleX(1); }
        .p3-label-wrap-clone { position: relative; z-index: 3; }
        .p3-label-base-clone { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; line-height: 0.85; display: block; white-space: nowrap; }
        .p3-label-dark-clone { color: #3ce2ff; transition: color 0.12s ease; }
        .p3-row-clone:hover .p3-label-dark-clone { color: #6b0010; }
        .p3-label-bright-clone { color: #ff2a2a; position: absolute; inset: 0; z-index: 1; opacity: 0; transition: opacity 0.12s ease; clip-path: polygon(0 0, 100% 50%, 0 100%); }
        .p3-row-clone:hover .p3-label-bright-clone { opacity: 1; }
      `}</style>
      <div className={`sp-container${mounted ? ' mounted' : ''}`}>
        <h1 className="sp-title">COMMISSIONS</h1>

        <div className="sp-btn-list" role="navigation">
          {SERVICES.map((svc, idx) => (
            <div
              key={svc.id}
              className={`sc-bar-outer${active === idx ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: mounted ? `${idx * 60 + 100}ms` : "0ms" }}
              {...makeTouchSelectHandlers({
                isActive: active === idx,
                onActivate: () => { if (active !== idx) { setActive(idx); setActiveInfoBar(0); sfx.move(); } },
                onSelect: () => { if (active !== idx) { setActive(idx); setActiveInfoBar(0); sfx.move(); } else { sfx.confirm(); } },
              })}
            >
              <div className="sc-bar-red" />
              <div className="sc-bar">
                <div className="sc-bar-fill" />
                <div className="sc-bar-shade" />
                <div className="sc-bar-content">
                  <div className="sc-role">{svc.tag}</div>
                  <div className="sc-main">
                    <div className="sc-label" style={{ fontSize: svc.label.length > 20 ? '22px' : '28px' }}>
                      {svc.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '50px', display: 'flex', gap: '200px', marginLeft: '15px' }}>
            <a
              href="/"
              {...makeTouchSelectHandlers({ isActive: true, onActivate: null, onSelect: (e) => { sfx.back(); navigate('/') } })}
              className="p3-row-clone"
              style={{ transitionDelay: '600ms' }}
            >
              <div className="p3-skew-wrap-clone" style={{ transform: 'skewX(4deg) skewY(-2deg)' }}>
                <div className="p3-shadow-tri-clone" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transformOrigin: 'right center', left: '-5%', height: '40px' }} />
                <div className="p3-highlight-clone" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transformOrigin: 'right center', left: '-5%', height: '40px' }} />
                <div className="p3-label-wrap-clone">
                  <span className="p3-label-base-clone p3-label-dark-clone" style={{ fontSize: 42, color: '#3ce2ff' }}>← BACK</span>
                  <span className="p3-label-base-clone p3-label-bright-clone" style={{ fontSize: 42, color: '#ff2a2a', clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }}>← BACK</span>
                </div>
              </div>
            </a>
            <a
              href="#/socials"
              {...makeTouchSelectHandlers({ isActive: true, onActivate: null, onSelect: (e) => { sfx.open(); navigate('/socials') } })}
              className="p3-row-clone"
              style={{ transitionDelay: '700ms' }}
            >
              <div className="p3-skew-wrap-clone">
                <div className="p3-shadow-tri-clone" style={{ height: '40px' }} />
                <div className="p3-highlight-clone" style={{ height: '40px' }} />
                <div className="p3-label-wrap-clone">
                  <span className="p3-label-base-clone p3-label-dark-clone" style={{ fontSize: 42, color: '#3ce2ff' }}>CONTACT →</span>
                  <span className="p3-label-base-clone p3-label-bright-clone" style={{ fontSize: 42, color: '#ff2a2a' }}>CONTACT →</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Detail Bars (สถิติของบริการที่เลือกอยู่) */}
      {mounted && renderInfoBars()}
    </div>
  )
}

// วิดีโอพื้นหลังแบบเดียวกับหน้าอื่น (intro เล่นครั้งเดียว แล้วค่อยสลับไป loop)
function BackgroundVideo() {
  const [showLoop, setShowLoop] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#000' }}>
      <video
        src={menuVideo}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          zIndex: showLoop ? 1 : 2,
          opacity: showLoop ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out'
        }}
        onEnded={() => setShowLoop(true)}
      />
      <video
        src={menuLoopVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          zIndex: showLoop ? 2 : 1,
          opacity: showLoop ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out'
        }}
      />
    </div>
  );
}
