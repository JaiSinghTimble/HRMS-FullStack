import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import securityAnimation from "../../assets/Animation/security.json";
import { verifyOtpApi, resendOtpApi } from "../../api/authApi";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(40);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const animationRef = useRef(null);
  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await verifyOtpApi({ email, otp });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpApi({ email });
      setTimer(40);
      setOtp("");
      alert("OTP Resent Successfully");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!animationRef.current) return;
    const anim = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: securityAnimation,
    });
    return () => anim.destroy();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        html, body, #root { height: 100%; overflow: hidden; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .otp-root {
          height: 100vh; width: 100vw;
          display: flex; font-family: 'DM Sans', sans-serif; overflow: hidden;
        }

        /* ── LEFT ── */
        .otp-left {
          display: none; width: 52%; position: relative; overflow: hidden;
          background: #0f172a; flex-direction: column;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        @media (min-width: 768px) { .otp-left { display: flex; } }

        .otp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .otp-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .otp-orb-1 { width: 300px; height: 300px; background: radial-gradient(circle, #4f46e5 0%, transparent 70%); top: -80px; left: -60px; opacity: 0.45; }
        .otp-orb-2 { width: 240px; height: 240px; background: radial-gradient(circle, #0ea5e9 0%, transparent 70%); bottom: -60px; right: -40px; opacity: 0.35; }
        .otp-orb-3 { width: 160px; height: 160px; background: radial-gradient(circle, #818cf8 0%, transparent 70%); top: 50%; left: 60%; opacity: 0.2; transform: translate(-50%,-50%); }

        .otp-accent-line {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #6366f1, #38bdf8, #6366f1);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .otp-left-inner {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 0 40px; width: 100%;
        }

        .otp-brand-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 99px; padding: 4px 12px;
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #a5b4fc; margin-bottom: 14px;
        }
        .otp-brand-chip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1; box-shadow: 0 0 6px #6366f1;
        }

        .otp-lottie {
          width: min(220px, 26vh);
          margin-bottom: 16px;
          filter: drop-shadow(0 0 36px rgba(99,102,241,0.3));
        }

        .otp-left h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 800; color: #f8fafc;
          line-height: 1.25; margin-bottom: 10px; letter-spacing: -0.4px;
        }
        .otp-left h1 span {
          background: linear-gradient(135deg, #818cf8, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .otp-left p { font-size: 13px; color: #94a3b8; line-height: 1.6; max-width: 260px; }

        .otp-steps { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; width: 100%; max-width: 240px; }
        .otp-step {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; padding: 7px 12px;
        }
        .otp-step-num {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(99,102,241,0.25);
          border: 1px solid rgba(99,102,241,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #818cf8; flex-shrink: 0;
        }
        .otp-step-text { font-size: 11.5px; color: #94a3b8; text-align: left; }

        /* ── RIGHT ── */
        .otp-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 20px; background: #f0f4ff; overflow: hidden;
        }

        .otp-card {
          width: 100%; max-width: 390px; background: #ffffff;
          border-radius: 22px; padding: 32px 34px 28px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 18px 50px rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.08);
          animation: cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .otp-logo-mark {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 6px 18px rgba(99,102,241,0.35);
        }

        .otp-card-heading {
          font-family: 'Sora', sans-serif;
          font-size: 23px; font-weight: 700;
          color: #0f172a; margin-bottom: 5px; letter-spacing: -0.3px;
        }
        .otp-card-sub { font-size: 13px; color: #94a3b8; margin-bottom: 12px; line-height: 1.5; }
        .otp-card-sub span { color: #6366f1; font-weight: 500; }

        .otp-email-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0f4ff; border: 1px solid rgba(99,102,241,0.2);
          border-radius: 8px; padding: 5px 10px;
          font-size: 12px; color: #4f46e5; font-weight: 500;
          margin-bottom: 20px;
        }

        .otp-input-label {
          display: block; font-size: 11px; font-weight: 600;
          color: #475569; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 7px;
        }
        .otp-input-wrap { margin-bottom: 14px; }
        .otp-input {
          width: 100%; border: 1.5px solid #e2e8f0;
          border-radius: 11px; padding: 12px 14px;
          font-size: 22px; color: #0f172a; background: #f8faff;
          outline: none; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3em; text-align: center;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .otp-input::placeholder { color: #c4cdd9; font-size: 14px; letter-spacing: 0; }
        .otp-input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: #fff; }

        .otp-btn {
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
        .otp-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(99,102,241,0.42); }
        .otp-btn:active:not(:disabled) { transform: translateY(0); }
        .otp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .otp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .otp-timer-row {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 14px; font-size: 12px; color: #94a3b8;
        }
        .otp-timer-badge {
          background: #f0f4ff; border: 1px solid rgba(99,102,241,0.2);
          border-radius: 6px; padding: 2px 8px;
          font-size: 12px; font-weight: 600; color: #6366f1;
          font-variant-numeric: tabular-nums;
        }
        .otp-resend { color: #6366f1; cursor: pointer; font-weight: 500; font-size: 12px; }
        .otp-resend:hover { text-decoration: underline; }

        .otp-divider { display: flex; align-items: center; gap: 10px; margin: 18px 0 0; }
        .otp-divider-line { flex: 1; height: 1px; background: #f1f5f9; }
        .otp-divider-text { font-size: 11px; color: #cbd5e1; }

        .otp-security {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 14px; font-size: 11px; color: #94a3b8;
        }
      `}</style>

      <div className="otp-root">

        {/* ── LEFT ── */}
        <div className="otp-left">
          <div className="otp-accent-line" />
          <div className="otp-grid" />
          <div className="otp-orb otp-orb-1" />
          <div className="otp-orb otp-orb-2" />
          <div className="otp-orb otp-orb-3" />

          <div className="otp-left-inner">
            <div className="otp-brand-chip">
              <span className="otp-brand-chip-dot" />
              HRMS Platform
            </div>

            {/* YOUR Lottie animation — same ref, same setup */}
            <div ref={animationRef} className="otp-lottie" />

            <h1>Two-Factor<br /><span>Verification</span></h1>
            <p>A one-time password has been sent to your email. Enter it to securely access your dashboard.</p>

            <div className="otp-steps">
              {[
                "Check your work email inbox",
                "Enter the 6-digit OTP below",
                "Access your HRMS dashboard",
              ].map((text, i) => (
                <div key={i} className="otp-step">
                  <div className="otp-step-num">{i + 1}</div>
                  <div className="otp-step-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="otp-right">
          <div className="otp-card">

            <div className="otp-logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h2 className="otp-card-heading">Enter OTP</h2>
            <p className="otp-card-sub">Code sent to <span>{email}</span></p>

            <div className="otp-email-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Check your inbox
            </div>

            <label className="otp-input-label">One-Time Password</label>
            <div className="otp-input-wrap">
              <input
                className="otp-input"
                type="text"
                maxLength={6}
                placeholder="······"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
            </div>

            <button className="otp-btn" onClick={handleVerify} disabled={loading}>
              {loading ? (
                <><span className="otp-spinner" /> Verifying…</>
              ) : (
                <>
                  Verify OTP
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <div className="otp-timer-row">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {timer > 0 ? (
                <>Resend in <span className="otp-timer-badge">{timer}s</span></>
              ) : (
                <span className="otp-resend" onClick={handleResend}>Resend OTP</span>
              )}
            </div>

            <div className="otp-divider">
              <div className="otp-divider-line" />
              <span className="otp-divider-text">secure login</span>
              <div className="otp-divider-line" />
            </div>

          

          </div>
        </div>

      </div>
    </>
  );
};

export default OTP;