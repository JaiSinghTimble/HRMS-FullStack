import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts/Mainlayout";
import { moveToOnboardApi } from "../../api/onboardApi";
import {
  getCandidatesApi,
  processCandidateApi,
  rejectCandidateApi,
} from "../../api/candidateApi";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaUserTie,
  FaFileAlt,
} from "react-icons/fa";

const Candidate = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const handleMoveToOnboard = async (id) => {
    try {
      const res = await moveToOnboardApi(id);
      console.log(res.data);
      fetchCandidates();
    } catch (error) {
      console.log(error);
      alert("Failed to move");
    }
  };

  const handleProcess = async (id) => {
    try {
      await processCandidateApi(id);
      fetchCandidates();
      alert("Candidate shortlisted and mail sent");
    } catch (error) {
      alert("Failed to process candidate");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCandidateApi(id);
      fetchCandidates();
      alert("Candidate rejected and mail sent");
    } catch (error) {
      alert("Failed to reject candidate");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await getCandidatesApi();
      setData(res.data.candidates);
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = data.filter((item) =>
    `${item.fullName} ${item.position} ${item.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return { background: "#ede9fe", color: "#6d28d9" };
      case "Onboarded":
        return { background: "#d1fae5", color: "#059669" };
      case "Rejected":
        return { background: "#fee2e2", color: "#dc2626" };
      default:
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  const avatarColor = (name) => {
    const colors = [
      ["#ede9fe", "#7c3aed"],
      ["#dbeafe", "#2563eb"],
      ["#fce7f3", "#be185d"],
      ["#d1fae5", "#059669"],
      ["#fef3c7", "#b45309"],
      ["#e0f2fe", "#0284c7"],
    ];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  const cols = ["#", "Candidate", "Contact", "Exp", "Notice", "CTC", "ECTC", "Remarks", "Resume", "Status", "Action"];

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .cand-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .cand-root h1 { font-family: 'Sora', sans-serif; }

        .cand-search-wrap {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 9px 16px;
          gap: 10px;
          width: 300px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: border-color 0.2s;
        }
        .cand-search-wrap:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px #eef2ff;
        }
        .cand-search-wrap input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          color: #374151;
          width: 100%;
        }
        .cand-search-wrap input::placeholder { color: #9ca3af; } 

        .cand-table-wrap {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          overflow: hidden;
        }

.cand-table { 
  min-width: 1200px;  /* or 1400px depending on columns */
  border-collapse: collapse; 
  font-size: 13.5px; 
}
        .cand-table thead tr {
          background: #fafafa;
          border-bottom: 1.5px solid #f0f0f0;
        }
        .cand-table thead th {
          padding: 13px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9ca3af;
          white-space: nowrap;
          text-align: left;
        }

        .cand-table tbody tr {
          border-bottom: 1px solid #f9f9f9;
          transition: background 0.15s;
        }
        .cand-table tbody tr:last-child { border-bottom: none; }
        .cand-table tbody tr:hover { background: #fafbff; }

        .cand-table td {
          padding: 14px 16px;
          white-space: nowrap;
          color: #374151;
          vertical-align: middle;
        }

        .row-num {
          font-size: 12px;
          font-weight: 600;
          color: #d1d5db;
        }

        .avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .cand-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .cand-pos { font-size: 11.5px; color: #9ca3af; margin-top: 1px; }
        .cand-phone { font-size: 13px; color: #374151; font-weight: 500; }
        .cand-email { font-size: 11.5px; color: #9ca3af; margin-top: 1px; }

        .cand-meta { color: #6b7280; font-size: 13px; }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 11px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .resume-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          font-size: 12.5px;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 8px;
          background: #eef2ff;
          text-decoration: none;
          transition: background 0.15s;
        }
        .resume-link:hover { background: #e0e7ff; }

        .btn-process {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f0fdf4; color: #16a34a;
          border: 1.5px solid #bbf7d0;
          padding: 6px 12px;
          border-radius: 9px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-process:hover { background: #dcfce7; border-color: #86efac; }

        .btn-reject {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff5f5; color: #dc2626;
          border: 1.5px solid #fecaca;
          padding: 6px 12px;
          border-radius: 9px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-reject:hover { background: #fee2e2; border-color: #fca5a5; }

        .btn-onboard {
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .btn-onboard:hover { opacity: 0.9; }

        .tag-moved {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #059669;
          background: #f0fdf4; padding: 5px 11px; border-radius: 99px;
          border: 1.5px solid #bbf7d0;
        }
        .tag-rejected {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #dc2626;
          background: #fff5f5; padding: 5px 11px; border-radius: 99px;
          border: 1.5px solid #fecaca;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #d1d5db;
          font-size: 14px;
        }

        .count-badge {
          background: #eef2ff;
          color: #6366f1;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 99px;
          margin-left: 8px;
          font-family: 'Sora', sans-serif;
        }
      `}</style>

<div 
  className="cand-root" 
  style={{ 
    padding: "28px", 
    background: "#f8f9fc", 
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden"   // 🔥 CRITICAL
  }}
>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Recruitment
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Candidates</h1>
              <span className="count-badge">{filtered.length}</span>
            </div>
          </div>

          <div className="cand-search-wrap">
            <FaSearch style={{ color: "#9ca3af", fontSize: 13, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by name, role, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="cand-table-wrap">
<div style={{ width: "100%", overflowX: "auto" }}>
              <table className="cand-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c} style={{ textAlign: c === "Action" ? "center" : "left" }}>{c}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="empty-state">
                      <FaUserTie style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }} />
                      <p style={{ margin: 0 }}>No candidates found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => {
                    const [avatarBg, avatarFg] = avatarColor(item.fullName);
                    const st = statusStyle(item.status);

                    return (
                      <tr key={item._id}>

                        {/* # */}
                        <td><span className="row-num">{i + 1}</span></td>

                        {/* CANDIDATE */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div className="avatar" style={{ background: avatarBg, color: avatarFg }}>
                              <FaUserTie />
                            </div>
                            <div>
                              <p className="cand-name">{item.fullName}</p>
                              <p className="cand-pos">{item.position}</p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td>
                          <p className="cand-phone">{item.phone}</p>
                          <p className="cand-email">{item.email}</p>
                        </td>

                        <td><span className="cand-meta">{item.experience}</span></td>
                        <td><span className="cand-meta">{item.notice}</span></td>
                        <td><span className="cand-meta">{item.currentCTC}</span></td>
                        <td><span className="cand-meta">{item.expectedCTC}</span></td>
                        <td>
                          <span className="cand-meta" style={{
                            maxWidth: 160, display: "block",
                            overflow: "hidden", textOverflow: "ellipsis"
                          }}>
                            {item.coverLetter || "—"}
                          </span>
                        </td>

                        {/* RESUME */}
                        <td>
                          <a
                            href={`http://localhost:5000/uploads/resumes/${item.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            className="resume-link"
                          >
                            <FaFileAlt style={{ fontSize: 11 }} /> View
                          </a>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span className="status-pill" style={st}>
                            <span className="status-dot" style={{ background: st.color }} />
                            {item.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td style={{ textAlign: "center" }}>
                          {item.status === "Shortlisted" ? (
                            <button className="btn-onboard" onClick={() => handleMoveToOnboard(item._id)}>
                              Move to Onboard →
                            </button>
                          ) : item.status === "Onboarded" ? (
                            <span className="tag-moved">✓ Moved</span>
                          ) : item.status === "Rejected" ? (
                            <span className="tag-rejected">✕ Rejected</span>
                          ) : (
                            <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
                              <button className="btn-process" onClick={() => handleProcess(item._id)}>
                                <FaCheck style={{ fontSize: 10 }} /> Process
                              </button>
                              <button className="btn-reject" onClick={() => handleReject(item._id)}>
                                <FaTimes style={{ fontSize: 10 }} /> Reject
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          {filtered.length > 0 && (
            <div style={{
              padding: "12px 20px",
              borderTop: "1px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fafafa"
            }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of <strong style={{ color: "#374151" }}>{data.length}</strong> candidates
              </span>
              <div style={{ display: "flex", gap: 12 }}>
                {["Pending", "Shortlisted", "Onboarded", "Rejected"].map((s) => {
                  const st = statusStyle(s);
                  const count = data.filter((d) => d.status === s).length;
                  return (
                    <span key={s} style={{ fontSize: 11.5, fontWeight: 600, color: st.color,
                      background: st.background, padding: "3px 10px", borderRadius: 99 }}>
                      {s}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default Candidate;