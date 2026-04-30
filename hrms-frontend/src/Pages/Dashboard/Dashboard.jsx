import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/Mainlayout";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaBriefcase,
} from "react-icons/fa";
import { getDashboardStatsApi } from "../../api/dashboardApi";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    selected: 0,
    rejected: 0,
    openJobs: 0,
  });

  const hiringData = stats.hiringTrends || [];
  const pieData = stats.distribution || [];
  const activities = stats.recentActivity || [];

  const pipeline = [
    { label: "Applied", value: stats.pipeline?.applied || 0, color: "#6366f1" },
    { label: "Interview", value: stats.pipeline?.interview || 0, color: "#8b5cf6" },
    { label: "Offer", value: stats.pipeline?.offer || 0, color: "#a78bfa" },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStatsApi();
      setStats(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const COLORS = ["#6366f1", "#f43f5e", "#8b5cf6"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "10px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          fontSize: "13px",
          color: "#374151"
        }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
          <p style={{ color: "#6366f1" }}>{payload[0].value} hires</p>
        </div>
      );
    }
    return null;
  };

  const cards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: <FaUsers size={16} />,
      bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
      iconColor: "#7c3aed",
      accent: "#7c3aed",
      badge: "+12%",
    },
    {
      title: "Selected",
      value: stats.selected,
      icon: <FaCheckCircle size={16} />,
      bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      iconColor: "#059669",
      accent: "#059669",
      badge: "+8%",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <FaTimesCircle size={16} />,
      bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
      iconColor: "#dc2626",
      accent: "#dc2626",
      badge: "-3%",
    },
    {
      title: "Open Jobs",
      value: stats.openJobs,
      icon: <FaBriefcase size={16} />,
      bg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      iconColor: "#0284c7",
      accent: "#0284c7",
      badge: "+5%",
    },
  ];

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        .dash-root * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
        .dash-root h1, .dash-root h2, .dash-root .display-text {
          font-family: 'Sora', sans-serif;
        }

        .stat-card {
          background: #fff;
          border-radius: 18px;
          padding: 22px 22px 20px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 18px 0 80px;
          opacity: 0.5;
        }

        .panel {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 24px;
        }

        .activity-item {
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          color: #4b5563;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid transparent;
        }
        .activity-item:hover {
          background: #f5f3ff;
          border-color: #ede9fe;
          color: #4338ca;
        }
        .activity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #a5b4fc;
          flex-shrink: 0;
        }

        .pipeline-bar-track {
          width: 100%;
          background: #f3f4f6;
          height: 8px;
          border-radius: 99px;
          overflow: hidden;
          margin-top: 6px;
        }
        .pipeline-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.8s cubic-bezier(.4,0,.2,1);
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 99px;
          letter-spacing: 0.02em;
        }

        .section-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .chart-panel-title {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 18px;
        }
      `}</style>

      <div className="dash-root" style={{ background: "#f8f9fc", minHeight: "100vh", padding: "28px 28px" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Recruitment HQ
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>
              Dashboard Overview
            </h1>
          </div>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 13,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <span style={{ fontSize: 18 }}>👋</span>
            <span style={{ fontWeight: 500, color: "#374151" }}>Welcome back</span>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 24 }}>
          {cards.map((item, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{
                  width: 38, height: 38,
                  borderRadius: 12,
                  background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.iconColor,
                }}>
                  {item.icon}
                </div>
                <span className="badge" style={{
                  background: item.badge.startsWith("+") ? "#f0fdf4" : "#fef2f2",
                  color: item.badge.startsWith("+") ? "#16a34a" : "#dc2626",
                }}>
                  {item.badge}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>{item.title}</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0, fontFamily: "'Sora', sans-serif" }}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18, marginBottom: 24 }}>

          {/* AREA CHART */}
          <div className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p className="chart-panel-title" style={{ margin: 0 }}>Hiring Trends</p>
              <span style={{
                fontSize: 11.5, fontWeight: 600, color: "#6366f1",
                background: "#eef2ff", borderRadius: 8, padding: "3px 10px"
              }}>This Year</span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={hiringData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#e5e7eb"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hires"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#hiresGrad)"
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#4338ca", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* DONUT CHART */}
          <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
            <p className="chart-panel-title">Distribution</p>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={72}
                    dataKey="value"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      fontSize: 13,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 4 }}>
                {pieData.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: "#6b7280" }}>{entry.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* LOWER SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>

          {/* ACTIVITY */}
          <div className="panel">
            <p className="chart-panel-title">Recent Activity</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {activities.length > 0 ? activities.map((item, i) => (
                <li key={i} className="activity-item">
                  <div className="activity-dot" />
                  {item}
                </li>
              )) : (
                <li style={{ color: "#d1d5db", fontSize: 13.5, textAlign: "center", padding: "24px 0" }}>
                  No recent activity
                </li>
              )}
            </ul>
          </div>

          {/* PIPELINE */}
          <div className="panel">
            <p className="chart-panel-title">Hiring Pipeline</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {pipeline.map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{item.label}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: item.color,
                      background: `${item.color}14`,
                      padding: "2px 9px",
                      borderRadius: 8,
                    }}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="pipeline-bar-track">
                    <div
                      className="pipeline-bar-fill"
                      style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}aa, ${item.color})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              marginTop: 24,
              padding: "14px 16px",
              background: "#f5f3ff",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6366f1" }}>Total in Pipeline</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#4338ca", fontFamily: "'Sora', sans-serif" }}>
                {(pipeline[0].value || 0) + (pipeline[1].value || 0) + (pipeline[2].value || 0)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;