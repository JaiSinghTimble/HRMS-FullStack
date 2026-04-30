import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts/Mainlayout";
import {
  createJobApi,
  getJobsApi,
  deleteJobApi,
  updateJobApi,
} from "../../api/jobApi";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaLayerGroup,
  FaPlus,
  FaTrash,
  FaTimes,
  FaPen,
} from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    role: "",
    category: "Engineering",
    location: "",
    type: "Full-time",
    experience: "",
    about: "",
    responsibilities: [""],
    requirements: [""],
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getJobsApi();
    setJobs(res.data.jobs || []);
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm({
      role: "",
      category: "Engineering",
      location: "",
      type: "Full-time",
      experience: "",
      about: "",
      responsibilities: [""],
      requirements: [""],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateJobApi(editId, form);
        alert("Job Updated");
      } else {
        await createJobApi(form);
        alert("Job Created");
      }
      fetchJobs();
      closeModal();
    } catch (err) {
      alert("Error");
    }
  };

  const handleDelete = async (id) => {
    await deleteJobApi(id);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditId(job._id);
    setForm({
      role: job.role,
      category: job.category,
      location: job.location,
      type: job.type,
      experience: job.experience,
      about: job.about,
      responsibilities: job.responsibilities || [""],
      requirements: job.requirements || [""],
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleArrayChange = (index, field, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addField = (field) => setForm({ ...form, [field]: [...form[field], ""] });

  const removeField = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated });
  };

  const typeColor = (type) => {
    switch (type) {
      case "Full-time": return { bg: "#d1fae5", color: "#059669" };
      case "Part-time": return { bg: "#fef3c7", color: "#b45309" };
      case "Contract":  return { bg: "#ede9fe", color: "#7c3aed" };
      case "Remote":    return { bg: "#dbeafe", color: "#2563eb" };
      default:          return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Active": return { bg: "#d1fae5", color: "#059669" };
      case "Closed": return { bg: "#fee2e2", color: "#dc2626" };
      default:       return { bg: "#fef3c7", color: "#b45309" };
    }
  };

  const cols = ["Role", "Category", "Location", "Type", "Experience", "Status", "Actions"];

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .jb-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .jb-root h1, .jb-root h2, .jb-root h3 { font-family: 'Sora', sans-serif; }
        .jb-root { overflow-x: hidden; width: 100%; }

        /* ADD BUTTON */
        .jb-btn-add {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none;
          padding: 10px 20px; border-radius: 12px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s;
          box-shadow: 0 2px 10px rgba(99,102,241,0.35);
          white-space: nowrap;
        }
        .jb-btn-add:hover { opacity: 0.9; }

        /* CARD */
        .jb-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          overflow: hidden; width: 100%; min-width: 0;
        }

        /* TABLE SCROLL */
        .jb-table-scroll {
          overflow-x: auto; overflow-y: visible; width: 100%;
          scrollbar-width: thin; scrollbar-color: #e0e0e0 transparent;
        }
        .jb-table-scroll::-webkit-scrollbar { height: 5px; }
        .jb-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .jb-table-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

        .jb-table {
          width: 100%; min-width: 860px;
          border-collapse: collapse; font-size: 13.5px;
        }
        .jb-table thead tr { background: #fafafa; border-bottom: 1.5px solid #f0f0f0; }
        .jb-table thead th {
          padding: 13px 18px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #9ca3af; white-space: nowrap; text-align: left;
        }
        .jb-table tbody tr { border-bottom: 1px solid #f9f9f9; transition: background 0.15s; }
        .jb-table tbody tr:last-child { border-bottom: none; }
        .jb-table tbody tr:hover { background: #fafbff; }
        .jb-table td { padding: 14px 18px; white-space: nowrap; color: #374151; vertical-align: middle; }

        .jb-role { font-weight: 600; color: #111827; font-size: 13.5px; }
        .jb-meta { color: #6b7280; font-size: 13px; }

        .jb-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 99px;
          font-size: 11.5px; font-weight: 600; white-space: nowrap;
        }
        .jb-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ACTION BTNS */
        .jb-btn-edit {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eef2ff; color: #6366f1;
          border: 1.5px solid #c7d2fe;
          padding: 6px 13px; border-radius: 9px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .jb-btn-edit:hover { background: #e0e7ff; border-color: #a5b4fc; }

        .jb-btn-del {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff5f5; color: #dc2626;
          border: 1.5px solid #fecaca;
          padding: 6px 13px; border-radius: 9px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .jb-btn-del:hover { background: #fee2e2; border-color: #fca5a5; }

        .jb-empty { padding: 60px 20px; text-align: center; color: #d1d5db; font-size: 14px; }

        .count-badge {
          background: #eef2ff; color: #6366f1;
          font-size: 12px; font-weight: 700;
          padding: 2px 10px; border-radius: 99px;
          margin-left: 8px;
        }

        /* MODAL */
        .jb-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 20px;
        }
        .jb-modal {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 680px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: jb-in 0.2s ease;
        }
        @keyframes jb-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .jb-modal::-webkit-scrollbar { width: 5px; }
        .jb-modal::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

        .jb-modal-inner { padding: 28px; }

        .jb-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px;
        }
        .jb-modal-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
        .jb-close-btn {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: #f3f4f6; border: none; cursor: pointer;
          color: #6b7280; font-size: 13px; transition: background 0.15s;
        }
        .jb-close-btn:hover { background: #e5e7eb; }

        .jb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 540px) { .jb-form-grid { grid-template-columns: 1fr; } }

        .jb-field { display: flex; flex-direction: column; gap: 5px; }
        .jb-field label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af;
        }
        .jb-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          background: #fafafa; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .jb-input-wrap:focus-within {
          border-color: #6366f1; box-shadow: 0 0 0 3px #eef2ff; background: #fff;
        }
        .jb-input-icon {
          padding: 0 12px; color: #9ca3af; font-size: 13px; flex-shrink: 0;
        }
        .jb-input-wrap input,
        .jb-input-wrap select {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 13.5px; color: #111827; padding: 10px 12px 10px 0;
          font-family: 'DM Sans', sans-serif;
        }
        .jb-input-wrap select { cursor: pointer; }

        .jb-textarea {
          width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px;
          background: #fafafa; padding: 12px 14px;
          font-size: 13.5px; color: #111827; outline: none;
          resize: vertical; min-height: 90px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .jb-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px #eef2ff; background: #fff; }
        .jb-textarea::placeholder { color: #c4c9d4; }

        .jb-section { margin-top: 20px; }
        .jb-section-title {
          font-size: 13px; font-weight: 600; color: #374151;
          margin: 0 0 10px; font-family: 'Sora', sans-serif;
          display: flex; align-items: center; gap: 8px;
        }
        .jb-section-title::after {
          content: ''; flex: 1; height: 1px; background: #f0f0f0;
        }

        .jb-list-item {
          display: flex; gap: 8px; margin-bottom: 8px; align-items: center;
        }
        .jb-list-input {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 9px;
          padding: 9px 13px; font-size: 13px; color: #111827;
          background: #fafafa; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .jb-list-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px #eef2ff; background: #fff; }
        .jb-remove-btn {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: #fff5f5; color: #dc2626; border: 1.5px solid #fecaca;
          border-radius: 8px; cursor: pointer; font-size: 11px;
          transition: all 0.15s;
        }
        .jb-remove-btn:hover { background: #fee2e2; }
        .jb-add-more {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 600; color: #6366f1;
          background: #eef2ff; border: none; border-radius: 8px;
          padding: 6px 12px; cursor: pointer; margin-top: 2px;
          transition: background 0.15s;
        }
        .jb-add-more:hover { background: #e0e7ff; }

        .jb-modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        .jb-btn-cancel {
          padding: 10px 20px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          background: #f3f4f6; color: #6b7280; border: none;
          transition: background 0.15s;
        }
        .jb-btn-cancel:hover { background: #e5e7eb; }
        .jb-btn-submit {
          padding: 10px 26px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
          transition: opacity 0.15s;
        }
        .jb-btn-submit:hover { opacity: 0.9; }
      `}</style>

      <div className="jb-root" style={{ padding: "28px", background: "#f8f9fc", minHeight: "100vh" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
              Recruitment
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0, fontFamily: "'Sora', sans-serif" }}>
                Job Listings
              </h1>
              <span className="count-badge">{jobs.length}</span>
            </div>
          </div>

          <button className="jb-btn-add" onClick={openModal}>
            <FaPlus style={{ fontSize: 11 }} /> Add Job
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="jb-card">
          <div className="jb-table-scroll">
            <table className="jb-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c} style={{ textAlign: c === "Actions" ? "center" : "left" }}>{c}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="jb-empty">
                      <div>
                        <FaBriefcase style={{ fontSize: 32, marginBottom: 10, opacity: 0.25 }} />
                        <p style={{ margin: 0 }}>No job listings yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => {
                    const tc = typeColor(job.type);
                    const sc = statusColor(job.status);
                    return (
                      <tr key={job._id}>

                        {/* ROLE */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 9,
                              background: "#eef2ff", color: "#6366f1",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, flexShrink: 0,
                            }}>
                              <FaBriefcase />
                            </div>
                            <span className="jb-role">{job.role}</span>
                          </div>
                        </td>

                        <td><span className="jb-meta">{job.category}</span></td>

                        {/* LOCATION */}
                        <td>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13 }}>
                            <FaMapMarkerAlt style={{ fontSize: 11, color: "#a5b4fc" }} />
                            {job.location}
                          </span>
                        </td>

                        {/* TYPE */}
                        <td>
                          <span className="jb-pill" style={{ background: tc.bg, color: tc.color }}>
                            <span className="jb-dot" style={{ background: tc.color }} />
                            {job.type}
                          </span>
                        </td>

                        {/* EXP */}
                        <td>
                          <span style={{
                            fontSize: 13, fontWeight: 500, color: "#374151",
                            background: "#f3f4f6", padding: "3px 10px", borderRadius: 8
                          }}>
                            {job.experience}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span className="jb-pill" style={{ background: sc.bg, color: sc.color }}>
                            <span className="jb-dot" style={{ background: sc.color }} />
                            {job.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
                            <button className="jb-btn-edit" onClick={() => handleEdit(job)}>
                              <FaPen style={{ fontSize: 10 }} /> Edit
                            </button>
                            <button className="jb-btn-del" onClick={() => handleDelete(job._id)}>
                              <FaTrash style={{ fontSize: 10 }} /> Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="jb-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="jb-modal">
              <div className="jb-modal-inner">

                <div className="jb-modal-header">
                  <h2 className="jb-modal-title">{editId ? "Edit Job" : "Add New Job"}</h2>
                  <button className="jb-close-btn" onClick={closeModal}><FaTimes /></button>
                </div>

                {/* GRID FIELDS */}
                <div className="jb-form-grid">
                  <div className="jb-field">
                    <label>Role</label>
                    <div className="jb-input-wrap">
                      <span className="jb-input-icon"><FaBriefcase /></span>
                      <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Frontend Engineer" />
                    </div>
                  </div>

                  <div className="jb-field">
                    <label>Location</label>
                    <div className="jb-input-wrap">
                      <span className="jb-input-icon"><FaMapMarkerAlt /></span>
                      <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore / Remote" />
                    </div>
                  </div>

                  <div className="jb-field">
                    <label>Job Type</label>
                    <div className="jb-input-wrap">
                      <span className="jb-input-icon"><FaClock /></span>
                      <select name="type" value={form.type} onChange={handleChange}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>

                  <div className="jb-field">
                    <label>Experience</label>
                    <div className="jb-input-wrap">
                      <span className="jb-input-icon"><FaLayerGroup /></span>
                      <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 2–4 years" />
                    </div>
                  </div>
                </div>

                {/* ABOUT */}
                <div className="jb-field" style={{ marginTop: 14 }}>
                  <label>About the Role</label>
                  <textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    placeholder="Describe the role, team, and impact…"
                    className="jb-textarea"
                  />
                </div>

                {/* RESPONSIBILITIES */}
                <div className="jb-section">
                  <p className="jb-section-title">Responsibilities</p>
                  {form.responsibilities.map((item, index) => (
                    <div key={index} className="jb-list-item">
                      <input
                        className="jb-list-input"
                        value={item}
                        onChange={(e) => handleArrayChange(index, "responsibilities", e.target.value)}
                        placeholder={`Responsibility ${index + 1}`}
                      />
                      {form.responsibilities.length > 1 && (
                        <button className="jb-remove-btn" onClick={() => removeField("responsibilities", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="jb-add-more" onClick={() => addField("responsibilities")}>
                    <FaPlus style={{ fontSize: 10 }} /> Add More
                  </button>
                </div>

                {/* REQUIREMENTS */}
                <div className="jb-section">
                  <p className="jb-section-title">Requirements</p>
                  {form.requirements.map((item, index) => (
                    <div key={index} className="jb-list-item">
                      <input
                        className="jb-list-input"
                        value={item}
                        onChange={(e) => handleArrayChange(index, "requirements", e.target.value)}
                        placeholder={`Requirement ${index + 1}`}
                      />
                      {form.requirements.length > 1 && (
                        <button className="jb-remove-btn" onClick={() => removeField("requirements", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="jb-add-more" onClick={() => addField("requirements")}>
                    <FaPlus style={{ fontSize: 10 }} /> Add More
                  </button>
                </div>

                {/* FOOTER */}
                <div className="jb-modal-footer">
                  <button className="jb-btn-cancel" onClick={closeModal}>Cancel</button>
                  <button className="jb-btn-submit" onClick={handleSubmit}>
                    {editId ? "Update Job" : "Publish Job"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Jobs;