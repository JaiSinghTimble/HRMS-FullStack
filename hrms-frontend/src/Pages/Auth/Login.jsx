import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import animationData from "../../assets/Animation/login.json";
import { sendOtpApi } from "../../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const animationRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
    return () => anim.destroy();
  }, []);

  const handleSendOTP = async () => {
    if (!email) return alert("Enter email");
    try {
      setLoading(true);
      const res = await sendOtpApi({ email });
      if (res.data.success) {
        navigate("/otp", { state: { email } });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendOTP();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        html, body, #root {
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lg-root {
          height: 100vh;
          width: 100vw;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* LEFT */
        .lg-left {
          display: none;
          width: 52%;
          position: relative;
          overflow: hidden;
          background: #0f172a;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .lg-left { display: flex; } }

        .lg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .lg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .lg-orb-1 { width: 300px; height: 300px; background: radial-gradient(circle, #4f46e5 0%, transparent 70%); top: -80px; left: -60px; opacity: 0.45; }
        .lg-orb-2 { width: 240px; height: 240px; background: radial-gradient(circle, #0ea5e9 0%, transparent 70%); bottom: -60px; right: -40px; opacity: 0.35; }
        .lg-orb-3 { width: 160px; height: 160px; background: radial-gradient(circle, #818cf8 0%, transparent 70%); top: 50%; left: 60%; opacity: 0.2; transform: translate(-50%,-50%); }

        .lg-accent-line {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #6366f1, #38bdf8, #6366f1);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .lg-left-inner {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 0 40px; width: 100%;
        }

        .lg-lottie {
          width: min(240px, 28vh);
          margin-bottom: 16px;
          filter: drop-shadow(0 0 36px rgba(99,102,241,0.3));
        }

        .lg-brand-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 99px; padding: 4px 12px;
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #a5b4fc; margin-bottom: 14px;
        }
        .lg-brand-chip-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 6px #6366f1; }

        .lg-left h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 800; color: #f8fafc;
          line-height: 1.25; margin-bottom: 10px; letter-spacing: -0.4px;
        }
        .lg-left h1 span {
          background: linear-gradient(135deg, #818cf8, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .lg-left p { font-size: 13px; color: #94a3b8; line-height: 1.6; max-width: 290px; }

        .lg-features { display: flex; gap: 6px; margin-top: 18px; flex-wrap: wrap; justify-content: center; }
        .lg-feature-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px; padding: 4px 10px;
          font-size: 11px; color: #cbd5e1;
          display: flex; align-items: center; gap: 5px;
        }

        /* RIGHT */
        .lg-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f0f4ff;
          overflow: hidden;
        }

        .lg-card {
          width: 100%; max-width: 390px;
          background: #ffffff;
          border-radius: 22px;
          padding: 32px 34px 28px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 18px 50px rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.08);
          animation: cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .lg-logo-mark {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 6px 18px rgba(99,102,241,0.35);
        }

        .lg-card-heading {
          font-family: 'Sora', sans-serif;
          font-size: 23px; font-weight: 700;
          color: #0f172a; margin-bottom: 5px; letter-spacing: -0.3px;
        }
        .lg-card-sub { font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5; }

        .lg-input-group { margin-bottom: 14px; }
        .lg-input-label {
          display: block; font-size: 11px; font-weight: 600;
          color: #475569; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 7px;
        }
        .lg-input-wrap { position: relative; display: flex; align-items: center; }
        .lg-input-icon {
          position: absolute; left: 12px; color: #94a3b8;
          pointer-events: none; transition: color 0.2s; display: flex;
        }
        .lg-input-wrap.focused .lg-input-icon { color: #6366f1; }
        .lg-input {
          width: 100%; border: 1.5px solid #e2e8f0;
          border-radius: 11px; padding: 11px 14px 11px 38px;
          font-size: 14px; color: #0f172a; background: #f8faff;
          outline: none; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .lg-input::placeholder { color: #c4cdd9; }
        .lg-input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: #fff; }

        .lg-btn {
          width: 100%; padding: 12px; border-radius: 11px;
          border: none; cursor: pointer;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(99,102,241,0.38);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 6px;
        }
        .lg-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(99,102,241,0.42); }
        .lg-btn:active:not(:disabled) { transform: translateY(0); }
        .lg-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .lg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lg-divider { display: flex; align-items: center; gap: 10px; margin: 18px 0 0; }
        .lg-divider-line { flex: 1; height: 1px; background: #f1f5f9; }
        .lg-divider-text { font-size: 11px; color: #cbd5e1; }

        .lg-security {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 14px; font-size: 11px; color: #94a3b8;
        }
      `}</style>

      <div className="lg-root">

        {/* LEFT */}
        <div className="lg-left">
          <div className="lg-accent-line" />
          <div className="lg-grid" />
          <div className="lg-orb lg-orb-1" />
          <div className="lg-orb lg-orb-2" />
          <div className="lg-orb lg-orb-3" />

          <div className="lg-left-inner">
            <div className="lg-brand-chip">
              <span className="lg-brand-chip-dot" />
              HRMS Platform
            </div>

            <div ref={animationRef} className="lg-lottie" />

            <h1>Smarter HR,<br /><span>Simpler Workflows</span></h1>
            <p>Manage recruitment, onboarding, and employee data in one powerful platform built for modern teams.</p>

            <div className="lg-features">
              {["Recruitment", "Onboarding", "Analytics", "Payroll"].map((f) => (
                <div key={f} className="lg-feature-pill">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#6366f1" strokeWidth="1.5" />
                    <path d="M3 5l1.5 1.5L7 3.5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg-right">
          <div className="lg-card">

            <div className="lg-logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <h2 className="lg-card-heading">Welcome back</h2>
            <p className="lg-card-sub">Enter your work email to receive a one-time password.</p>

            <div className="lg-input-group">
              <label className="lg-input-label">Work Email</label>
              <div className={`lg-input-wrap${focused ? " focused" : ""}`}>
                <span className="lg-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  className="lg-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <button className="lg-btn" onClick={handleSendOTP} disabled={loading}>
              {loading ? (
                <><span className="lg-spinner" /> Sending OTP…</>
              ) : (
                <>
                  Send OTP
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <div className="lg-divider">
              <div className="lg-divider-line" />
              <span className="lg-divider-text">secure login</span>
              <div className="lg-divider-line" />
            </div>

            <div className="lg-security">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              OTP expires in 10 minutes · End-to-end encrypted
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;