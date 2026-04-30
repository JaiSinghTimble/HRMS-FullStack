import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../Layouts/Mainlayout";
import { useLocation } from "react-router-dom";
import { FaUserPlus, FaTimes, FaUserTie } from "react-icons/fa";

const Onboard = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ctc: "",
    doj: "",
    bgv: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/onboard/add", form);
      fetchOnboard();
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", ctc: "", doj: "", bgv: "Pending" });
    } catch (error) {
      console.log(error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchOnboard();
  }, [location.pathname]);

  const fetchOnboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/onboard/all");
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
      setData([]);
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

  const cols = ["Candidate", "Email", "Phone", "CTC", "Date of Joining", "BGV Status"];

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .ob-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .ob-root h1, .ob-root h2 { font-family: 'Sora', sans-serif; }
        .ob-root { overflow-x: hidden; width: 100%; }

        .ob-btn-add {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none;
          padding: 10px 20px; border-radius: 12px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s;
          box-shadow: 0 2px 10px rgba(99,102,241,0.35);
          white-space: nowrap;
        }
        .ob-btn-add:hover { opacity: 0.9; }

        .ob-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          overflow: hidden;
          width: 100%; min-width: 0;
        }

        .ob-table-scroll {
          overflow-x: auto;
          overflow-y: visible;
          width: 100%;
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 transparent;
        }
        .ob-table-scroll::-webkit-scrollbar { height: 5px; }
        .ob-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .ob-table-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
        .ob-table-scroll::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

        .ob-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; font-size: 13.5px;
        }
        .ob-table thead tr {
          background: #fafafa;
          border-bottom: 1.5px solid #f0f0f0;
        }
        .ob-table thead th {
          padding: 13px 18px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #9ca3af; white-space: nowrap; text-align: left;
        }
        .ob-table tbody tr {
          border-bottom: 1px solid #f9f9f9;
          transition: background 0.15s;
        }
        .ob-table tbody tr:last-child { border-bottom: none; }
        .ob-table tbody tr:hover { background: #fafbff; }
        .ob-table td {
          padding: 14px 18px; white-space: nowrap;
          color: #374151; vertical-align: middle;
        }

        .ob-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .ob-name { font-weight: 600; color: #111827; font-size: 13.5px; margin: 0; }
        .ob-meta { font-size: 11.5px; color: #9ca3af; margin: 2px 0 0; }
        .ob-text { color: #6b7280; font-size: 13px; }

        .bgv-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 99px;
          font-size: 11.5px; font-weight: 600;
        }
        .bgv-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* PAGINATION */
        .ob-footer {
          padding: 14px 20px;
          border-top: 1px solid #f3f4f6;
          display: flex; justify-content: space-between; align-items: center;
          background: #fafafa; flex-wrap: wrap; gap: 10px;
        }
        .ob-page-info { font-size: 12px; color: #9ca3af; }
        .ob-page-info strong { color: #374151; }
        .ob-page-btns { display: flex; gap: 5px; align-items: center; }

        .ob-pg-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; border: 1.5px solid #e5e7eb;
          background: #fff; color: #6b7280;
          transition: all 0.15s;
        }
        .ob-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
        .ob-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ob-pg-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border-color: transparent;
          box-shadow: 0 2px 6px rgba(99,102,241,0.3);
        }

        /* MODAL */
        .ob-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 20px;
        }
        .ob-modal {
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          width: 100%; max-width: 480px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: ob-slide-in 0.2s ease;
        }
        @keyframes ob-slide-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ob-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 22px;
        }
        .ob-modal-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
        .ob-close-btn {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: #f3f4f6; border: none; cursor: pointer;
          color: #6b7280; font-size: 13px; transition: background 0.15s;
        }
        .ob-close-btn:hover { background: #e5e7eb; color: #374151; }

        .ob-form-grid { display: flex; flex-direction: column; gap: 14px; }

        .ob-field label {
          display: block; font-size: 11.5px; font-weight: 600;
          color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 5px;
        }
        .ob-field input,
        .ob-field select {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13.5px; color: #111827;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ob-field input:focus,
        .ob-field select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px #eef2ff;
          background: #fff;
        }
        .ob-field input::placeholder { color: #c4c9d4; }

        .ob-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .ob-modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          margin-top: 22px;
        }
        .ob-btn-cancel {
          padding: 10px 20px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          background: #f3f4f6; color: #6b7280; border: none;
          transition: background 0.15s;
        }
        .ob-btn-cancel:hover { background: #e5e7eb; }
        .ob-btn-submit {
          padding: 10px 24px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
          transition: opacity 0.15s;
        }
        .ob-btn-submit:hover { opacity: 0.9; }

        .ob-empty {
          padding: 60px 20px; text-align: center;
          color: #d1d5db; font-size: 14px;
        }

        .count-badge {
          background: #eef2ff; color: #6366f1;
          font-size: 12px; font-weight: 700;
          padding: 2px 10px; border-radius: 99px;
          margin-left: 8px; font-family: 'Sora', sans-serif;
        }
      `}</style>

      <div className="ob-root" style={{ padding: "28px", background: "#f8f9fc", minHeight: "100vh" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
              HR Operations
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Onboarding</h1>
              <span className="count-badge">{data.length}</span>
            </div>
          </div>

          <button className="ob-btn-add" onClick={() => setShowForm(true)}>
            <FaUserPlus style={{ fontSize: 13 }} />
            Add Candidate
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="ob-card">
          <div className="ob-table-scroll">
            <table className="ob-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="ob-empty">
                      <div>
                        <FaUserTie style={{ fontSize: 32, marginBottom: 10, opacity: 0.25 }} />
                        <p style={{ margin: 0 }}>No onboarding candidates yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, i) => {
                    const [avatarBg, avatarFg] = avatarColor(item.name);
                    const isBgvDone = item.bgv === "Done";

                    return (
                      <tr key={i}>

                        {/* NAME */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div className="ob-avatar" style={{ background: avatarBg, color: avatarFg }}>
                              <FaUserTie />
                            </div>
                            <p className="ob-name">{item.name}</p>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td>
                          <span className="ob-text" style={{
                            maxWidth: 200, display: "block",
                            overflow: "hidden", textOverflow: "ellipsis"
                          }}>
                            {item.email}
                          </span>
                        </td>

                        {/* PHONE */}
                        <td><span className="ob-text">{item.phone}</span></td>

                        {/* CTC */}
                        <td>
                          <span style={{
                            fontSize: 13, fontWeight: 600, color: "#374151",
                            background: "#f3f4f6", padding: "3px 10px", borderRadius: 8
                          }}>
                            {item.ctc}
                          </span>
                        </td>

                        {/* DOJ */}
                        <td>
                          <span style={{
                            fontSize: 13, color: "#6366f1", fontWeight: 500,
                            background: "#eef2ff", padding: "3px 10px", borderRadius: 8
                          }}>
                            {item.doj}
                          </span>
                        </td>

                        {/* BGV */}
                        <td>
                          <span className="bgv-pill" style={{
                            background: isBgvDone ? "#d1fae5" : "#fef3c7",
                            color: isBgvDone ? "#059669" : "#b45309",
                          }}>
                            <span className="bgv-dot" style={{ background: isBgvDone ? "#059669" : "#f59e0b" }} />
                            {item.bgv}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER / PAGINATION */}
          {data.length > 0 && (
            <div className="ob-footer">
              <p className="ob-page-info">
                Showing <strong>{indexOfFirst + 1}–{Math.min(indexOfLast, data.length)}</strong> of <strong>{data.length}</strong> candidates
              </p>

              <div className="ob-page-btns">
                <button
                  className="ob-pg-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`ob-pg-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="ob-pg-btn"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="ob-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <div className="ob-modal">

              <div className="ob-modal-header">
                <h2 className="ob-modal-title">Add Candidate</h2>
                <button className="ob-close-btn" onClick={() => setShowForm(false)}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="ob-form-grid">

                  <div className="ob-field">
                    <label>Full Name</label>
                    <input
                      name="name" value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Ravi Sharma"
                      required
                    />
                  </div>

                  <div className="ob-field">
                    <label>Email</label>
                    <input
                      name="email" value={form.email} type="email"
                      onChange={handleChange}
                      placeholder="e.g. ravi@company.com"
                      required
                    />
                  </div>

                  <div className="ob-form-row">
                    <div className="ob-field">
                      <label>Phone</label>
                      <input
                        name="phone" value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label>CTC</label>
                      <input
                        name="ctc" value={form.ctc}
                        onChange={handleChange}
                        placeholder="e.g. 8 LPA"
                        required
                      />
                    </div>
                  </div>

                  <div className="ob-form-row">
                    <div className="ob-field">
                      <label>Date of Joining</label>
                      <input
                        name="doj" value={form.doj} type="date"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label>BGV Status</label>
                      <select name="bgv" value={form.bgv} onChange={handleChange}>
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>

                </div>

                <div className="ob-modal-footer">
                  <button type="button" className="ob-btn-cancel" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="ob-btn-submit">
                    Add Candidate
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Onboard;