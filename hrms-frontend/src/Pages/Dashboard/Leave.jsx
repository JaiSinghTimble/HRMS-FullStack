import React, { useState } from "react";
import MainLayout from "../Layouts/Mainlayout";
import { useEffect } from "react";
import {
  getEmployeesApi,
  addEmployeeApi,
  markAttendanceApi,
  getAttendanceApi
} from "../../api/leave";
// ─── OFFICE HOLIDAY LOGIC ─────────────────────────────────────────────────────
// Off days: ALL Sundays + 2nd Saturday of every month
function isOffDay(y, m, d) {
  const date    = new Date(y, m, d);
  const weekday = date.getDay(); // 0=Sun, 6=Sat

  if (weekday === 0) return { off: true, reason: "Sunday" };

  if (weekday === 6) {
    // Find which Saturday of the month this is
    let satCount = 0;
    for (let i = 1; i <= d; i++) {
      if (new Date(y, m, i).getDay() === 6) satCount++;
    }
    if (satCount === 2) return { off: true, reason: "2nd Saturday" };
  }

  return { off: false, reason: null };
}

const GOVT_HOLIDAYS = [
  "2026-01-26",
  "2026-03-14",
  "2026-04-10", // example → ADD YOUR REAL DATES
  "2026-08-15",
  "2026-10-02",
  "2026-11-08",
  "2026-12-25"
];

const isSunday = (date) => date.getDay() === 0;

const isSecondSaturday = (date) => {
  return date.getDay() === 6 && Math.ceil(date.getDate() / 7) === 2;
};

const isGovtHoliday = (date) => {
  const d = date.toISOString().split("T")[0];
  return GOVT_HOLIDAYS.includes(d);
};

const getDefaultStatus = (date) => {
  if (isSunday(date)) return "SUN";
  if (isSecondSaturday(date)) return "2S";
  if (isGovtHoliday(date)) return "L";
  return "P";
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CYCLE = ["P", "A", "L", "SL", "HL", "WL"];

const STATUS_CONFIG = {
  P:  { label: "Present",         short: "P",  hex: "#059669", lightBg: "#ecfdf5", textColor: "#065f46", borderColor: "#6ee7b7", barColor: "#10b981" },
  A:  { label: "Absent",          short: "A",  hex: "#e11d48", lightBg: "#fff1f2", textColor: "#9f1239", borderColor: "#fda4af", barColor: "#f43f5e" },
  L:  { label: "Leave",           short: "L",  hex: "#d97706", lightBg: "#fffbeb", textColor: "#78350f", borderColor: "#fcd34d", barColor: "#f59e0b" },
  SL: { label: "Sick Leave",      short: "SL", hex: "#7c3aed", lightBg: "#f5f3ff", textColor: "#4c1d95", borderColor: "#c4b5fd", barColor: "#8b5cf6" },
  HL: { label: "Half Day",        short: "HL", hex: "#0284c7", lightBg: "#f0f9ff", textColor: "#0c4a6e", borderColor: "#7dd3fc", barColor: "#0ea5e9" },
  WL: { label: "Work From Home",  short: "WL", hex: "#4f46e5", lightBg: "#eef2ff", textColor: "#312e81", borderColor: "#a5b4fc", barColor: "#6366f1" },
};

const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const DEPT_PALETTE = {
  IT:      { bg:"#dbeafe", text:"#1e40af" },
  HR:      { bg:"#fce7f3", text:"#9d174d" },
  Finance: { bg:"#dcfce7", text:"#166534" },
  Design:  { bg:"#ede9fe", text:"#5b21b6" },
  Sales:   { bg:"#ffedd5", text:"#9a3412" },
};
const AVATAR_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#e11d48","#8b5cf6","#ec4899","#0d9488"];

const INIT_EMPLOYEES = [
  { id:1, name:"Rahul Sharma",  department:"IT",      role:"Senior Developer",   totalLeaves:18, avatar:"RS" },
  { id:2, name:"Amit Kumar",    department:"HR",      role:"HR Manager",          totalLeaves:15, avatar:"AK" },
  { id:3, name:"Priya Singh",   department:"Finance", role:"Finance Analyst",     totalLeaves:20, avatar:"PS" },
  { id:4, name:"Neha Verma",    department:"Design",  role:"UI/UX Lead",          totalLeaves:18, avatar:"NV" },
  { id:5, name:"Rohan Mehta",   department:"Sales",   role:"Sales Executive",     totalLeaves:15, avatar:"RM" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getDaysInMonth  = (y, m) => new Date(y, m+1, 0).getDate();
const getFirstWeekday = (y, m) => new Date(y, m, 1).getDay();
const todayObj        = () => { const t=new Date(); return {y:t.getFullYear(),m:t.getMonth(),d:t.getDate()}; };
const dKey = (id, y, m, d) => `${id}|${y}|${m}|${d}`;
function getStats(emp, attendance) {
  const counts = { P:0, A:0, L:0, SL:0, HL:0, WL:0 };
  Object.entries(attendance).forEach(([k,v]) => {
    if (k.startsWith(`${emp._id}|`) && counts[v] !== undefined) counts[v]++;
  });
  const leaveUsed = counts.L + counts.SL + counts.HL * 0.5;
  return { ...counts, leaveUsed, remaining: Math.max(0, emp.totalLeaves - leaveUsed) };
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputStyle = {
  border:"1px solid #e2e8f0", padding:"0 12px", borderRadius:9,
  fontSize:13, outline:"none", height:38, background:"#fff",
  color:"#1e293b", fontFamily:"inherit",
};

const cardBase = {
  background:"#fff", borderRadius:16,
  border:"1px solid #e2e8f0",
  boxShadow:"0 1px 4px rgba(15,23,42,0.06)",
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, idx=0, size=40 }) => (
  <div style={{
    width:size, height:size, borderRadius:"50%",
    background:AVATAR_COLORS[idx % AVATAR_COLORS.length],
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#fff", fontWeight:800, fontSize:size*0.33,
    flexShrink:0, letterSpacing:"0.04em",
  }}>{initials}</div>
);

// ─── NAV BUTTON ───────────────────────────────────────────────────────────────
const NavBtn = ({ onClick, children }) => (
  <button onClick={onClick} style={{
    width:32, height:32, borderRadius:8, border:"1px solid #e2e8f0",
    background:"#fff", cursor:"pointer", fontSize:18, color:"#64748b",
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"all 0.12s",
  }}
    onMouseEnter={e=>{ e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#1e293b"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background="#fff";    e.currentTarget.style.color="#64748b"; }}
  >{children}</button>
);

// ─── BIG CALENDAR ─────────────────────────────────────────────────────────────
function BigCalendar({ emp, attendance, onToggle }) {
  const t = todayObj();
  const [y, setY] = useState(t.y);
  const [m, setM] = useState(t.m);

  const daysInMonth = getDaysInMonth(y, m);
  const firstDay    = getFirstWeekday(y, m);

  const prev = () => { if(m===0){setM(11);setY(v=>v-1);}else setM(v=>v-1); };
  const next = () => { if(m===11){setM(0);setY(v=>v+1);}else setM(v=>v+1); };

  // Build cells: leading nulls + day numbers + trailing nulls
  const cells = Array(firstDay).fill(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(d);
  while(cells.length % 7 !== 0) cells.push(null);

  // Count working days in this month (for summary)
  let workingDays = 0;
  for(let d=1; d<=daysInMonth; d++) {
    if(!isOffDay(y,m,d).off) workingDays++;
  }



  return (
    <div style={{ ...cardBase, overflow:"hidden", display:"flex", flexDirection:"column" }}>

      {/* ── Calendar Header ── */}
      <div style={{
        padding:"16px 22px", borderBottom:"1px solid #f1f5f9",
        background:"linear-gradient(135deg,#f8fafc,#f1f5f9)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <NavBtn onClick={prev}>‹</NavBtn>

        <div style={{ textAlign:"center" }}>
          <div style={{ fontWeight:800, fontSize:18, color:"#0f172a", letterSpacing:"-0.02em" }}>
            {MONTHS[m]} {y}
          </div>
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
            {workingDays} working days · click to toggle status
          </div>
        </div>

        <NavBtn onClick={next}>›</NavBtn>
      </div>

      {/* ── Weekday Headers ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
        {WEEKDAYS.map(d => {
          const isWknd = d==="Sun";
          return (
            <div key={d} style={{
              textAlign:"center", padding:"10px 0",
              fontSize:10, fontWeight:800, letterSpacing:"0.08em",
              textTransform:"uppercase",
              color: isWknd ? "#f87171" : "#94a3b8",
            }}>{d}</div>
          );
        })}
      </div>

      {/* ── Date Grid ── */}
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(7,1fr)",
        gap:1, background:"#e2e8f0", flex:1,
      }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} style={{ background:"#f8fafc", minHeight:80 }} />;

          const key       = dKey(emp._id, y, m, d);
          const offInfo   = isOffDay(y, m, d);
          const isOff     = offInfo.off;
const dateObj = new Date(y, m, d);
const status = attendance[key] || getDefaultStatus(dateObj);
          const cfg       = status ? STATUS_CONFIG[status] : null;
          const isToday   = d===t.d && m===t.m && y===t.y;
          const isSunday  = new Date(y,m,d).getDay() === 0;
          const is2ndSat  = offInfo.reason === "2nd Saturday";

          return (
            <div key={d}
              onClick={() => !isOff && onToggle(y, m, d)}
              onMouseEnter={e => { if(!isOff) e.currentTarget.style.filter="brightness(0.93)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter="none"; }}
              style={{
                background: isOff
                  ? (isSunday ? "#fef2f2" : is2ndSat ? "#fff7ed" : "#fff")
                  : cfg ? cfg.lightBg : "#fff",
                minHeight:80,
                cursor: isOff ? "default" : "pointer",
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"6px 3px", position:"relative",
                transition:"filter 0.1s",
                outline: isToday ? "2.5px solid #6366f1" : "none",
                outlineOffset:"-2.5px",
              }}
            >
              {/* Date number */}
              <span style={{
                fontSize:13, lineHeight:1,
                fontWeight: isToday ? 800 : 500,
                color: isToday
                  ? "#4f46e5"
                  : isSunday ? "#ef4444"
                  : is2ndSat ? "#f97316"
                  : isOff ? "#d1d5db"
                  : "#1e293b",
                marginBottom:5,
              }}>{d}</span>

              {/* Status badge for working day */}
              {!isOff && cfg && (
                <span style={{
                  background:cfg.hex, color:"#fff",
                  fontSize:9, fontWeight:800,
                  padding:"2px 7px", borderRadius:6,
                  letterSpacing:"0.05em",
                }}>{cfg.short}</span>
              )}

              {/* Off-day label */}
              {isOff && (
                <span style={{
                  fontSize:8, fontWeight:700,
                  color: isSunday ? "#fca5a5" : "#fdba74",
                  letterSpacing:"0.05em", textTransform:"uppercase",
                  marginTop:1,
                }}>{offInfo.reason}</span>
              )}

              {/* Today dot */}
              {isToday && (
                <span style={{
                  position:"absolute", top:5, right:6,
                  width:5, height:5, borderRadius:"50%", background:"#6366f1"
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding:"9px 18px", background:"#f8fafc", borderTop:"1px solid #f1f5f9",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6
      }}>
        <div style={{ display:"flex", gap:12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#ef4444", fontWeight:600 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:"#fef2f2", border:"1px solid #fca5a5", display:"inline-block" }}/>
            Sunday
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#f97316", fontWeight:600 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:"#fff7ed", border:"1px solid #fdba74", display:"inline-block" }}/>
            2nd Saturday
          </span>
        </div>
        <span style={{ fontSize:10, color:"#94a3b8" }}>
          Click day → P → A → L → SL → HL → WL
        </span>
      </div>
    </div>
  );
}

// ─── STAT ROW ─────────────────────────────────────────────────────────────────
function StatRow({ st, count, total }) {
  const cfg = STATUS_CONFIG[st];
  const pct = total > 0 ? Math.round((count/total)*100) : 0;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{
            width:30, height:20, borderRadius:5, background:cfg.hex,
            color:"#fff", fontSize:9, fontWeight:800, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            letterSpacing:"0.04em",
          }}>{cfg.short}</span>
          <span style={{ fontSize:12, color:"#374151", fontWeight:500 }}>{cfg.label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:14, fontWeight:700, color:cfg.textColor }}>{count}</span>
          <span style={{ fontSize:10, color:"#cbd5e1" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height:4, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", background:cfg.barColor, borderRadius:99, width:`${pct}%`, transition:"width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Leave = () => {
const [employees, setEmployees] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [attendance, setAttendance] = useState({});
  const [showForm, setShowForm]     = useState(false);
  const [search, setSearch]         = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [newEmp, setNewEmp]         = useState({ name:"", department:"", role:"", totalLeaves:18 });

  const departments = ["All", ...Array.from(new Set(employees.map(e => e.department)))];

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (deptFilter==="All" || emp.department===deptFilter)
  );


  const fetchAttendance = async (id) => {
  try {
    const res = await getAttendanceApi(id);

    const formatted = {};

    res.data.attendance.forEach(item => {
const date = new Date(item.date);

const key = `${id}|${date.getUTCFullYear()}|${date.getUTCMonth()}|${date.getUTCDate()}`;
       formatted[key] = item.status;
    });

    setAttendance(formatted);

  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  if (selected) {
    fetchAttendance(selected._id);
  }
}, [selected]);
const handleToggle = async (y, m, d) => {
  if (!selected) return;

  const dateObj = new Date(y, m, d);

  // ❌ DO NOT ALLOW CHANGE ON HOLIDAYS
  if (
    isSunday(dateObj) ||
    isSecondSaturday(dateObj) ||
    isGovtHoliday(dateObj)
  ) return;

const key = `${selected._id}|${y}|${m}|${d}`;  const cur = attendance[key] || getDefaultStatus(dateObj);

  const nxt = STATUS_CYCLE[
    (STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length
  ];

  // instant UI update
  setAttendance(prev => ({
    ...prev,
    [key]: nxt
  }));

  await markAttendanceApi({
    employeeId: selected._id,
date: new Date(y, m, d).toISOString(),
    status: nxt
  });
};


const calculateStats = (emp, attendance) => {
  if (!emp) return null;

  const t = new Date();
  const year = t.getFullYear();
  const month = t.getMonth();

  let stats = {
    P: 0,
    A: 0,
    L: 0,
    SL: 0,
    HL: 0,
    WL: 0
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = `${emp._id}|${year}|${month}|${d}`;

    const status =
      attendance[key] || getDefaultStatus(dateObj);

    if (stats[status] !== undefined) {
      stats[status]++;
    }
  }

  // ✅ ADD THIS PART (IMPORTANT)
  const leaveUsed =
    stats.L +
    stats.SL +
    stats.HL * 0.5;

  const remaining = Math.max(
    0,
    emp.totalLeaves - leaveUsed
  );

  return {
    ...stats,
    leaveUsed,
    remaining
  };
};

 const handleAdd = async () => {
  if (!newEmp.name.trim()) return;

  try {
    await addEmployeeApi(newEmp);
    fetchEmployees();

    setShowForm(false);
    setNewEmp({ name:"", department:"", role:"", totalLeaves:18 });

  } catch (err) {
    console.log(err);
  }
};
const stats = selected ? calculateStats(selected, attendance) : null;
const totalMarked = stats
  ? Object.values(stats).reduce((a, b) => a + b, 0)
  : 0;useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {
  try {
    const res = await getEmployeesApi();
setEmployees(res.data.employees || res.data);  } catch (err) {
    console.log(err);
  }
};
  return (
    <MainLayout>
      <div style={{ padding:"24px 28px", background:"#f1f5f9", minHeight:"100vh", fontFamily:"'DM Sans','Nunito',system-ui,sans-serif" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div>
            {selected ? (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>setSelected(null)}
                  style={{ width:34, height:34, borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:16, color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="#f1f5f9"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; }}
                >←</button>
                <div>
                  <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>{selected.name}</h1>
                  <p style={{ margin:0, fontSize:13, color:"#94a3b8" }}>{selected.department} · {selected.role}</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>Leave Management</h1>
                <p style={{ margin:"3px 0 0", fontSize:13, color:"#94a3b8" }}>
                  Office hours: Mon–Fri + 1st,3rd,4th,5th Sat · 2nd Sat & Sundays off
                </p>
              </div>
            )}
          </div>

          {!selected && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <input type="text" placeholder="Search employee…" value={search}
                onChange={e=>setSearch(e.target.value)} style={inputStyle} />
              <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={inputStyle}>
                {departments.map(d=><option key={d}>{d}</option>)}
              </select>
              <button onClick={()=>setShowForm(true)}
                style={{ background:"#4f46e5", color:"#fff", border:"none", padding:"0 18px", height:38, borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#4338ca"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#4f46e5"; }}
              >
                <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add Employee
              </button>
            </div>
          )}
        </div>

        {/* ── LEGEND STRIP ── */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {STATUS_CYCLE.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <span key={s} style={{
                display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px",
                borderRadius:20, background:cfg.lightBg, color:cfg.textColor,
                border:`1px solid ${cfg.borderColor}`, fontSize:11, fontWeight:700,
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.hex, flexShrink:0 }} />
                {cfg.label}
              </span>
            );
          })}
          <span style={{
            display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px",
            borderRadius:20, background:"#fff7ed", color:"#9a3412",
            border:"1px solid #fdba74", fontSize:11, fontWeight:700,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", flexShrink:0 }} />
            2nd Sat Off
          </span>
          <span style={{
            display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px",
            borderRadius:20, background:"#fef2f2", color:"#991b1b",
            border:"1px solid #fca5a5", fontSize:11, fontWeight:700,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
            Sunday Off
          </span>
        </div>

        {/* ── EMPLOYEE GRID ── */}
        {!selected && (
          filtered.length === 0
            ? (
              <div style={{ textAlign:"center", padding:"80px 0", color:"#94a3b8" }}>
                <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
                <p style={{ margin:0, fontWeight:600, fontSize:15 }}>No employees found</p>
                <p style={{ margin:"4px 0 0", fontSize:13 }}>Try a different search or department</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(258px,1fr))", gap:14 }}>
                {filtered.map((emp, i) => {
                  const s   = getStats(emp, attendance);
                  const pct = Math.min(100, Math.round((s.leaveUsed / emp.totalLeaves) * 100));
                  const dp  = DEPT_PALETTE[emp.department] || { bg:"#f1f5f9", text:"#475569" };
                  return (
                    <div key={emp._id} onClick={()=>setSelected(emp)}
                      onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(15,23,42,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(15,23,42,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}
                      style={{ ...cardBase, padding:20, cursor:"pointer", transition:"all 0.15s" }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
<Avatar initials={emp.avatar || emp.name.split(" ").map(n=>n[0]).join("").slice(0,2)} />                        <div style={{ minWidth:0 }}>
                          <p style={{ margin:0, fontWeight:800, fontSize:14, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{emp.name}</p>
                          <p style={{ margin:"2px 0 0", fontSize:12, color:"#94a3b8" }}>{emp.role}</p>
                        </div>
                      </div>

                      <span style={{ background:dp.bg, color:dp.text, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                        {emp.department}
                      </span>

                      {/* Leave bar */}
                      <div style={{ marginTop:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", marginBottom:5 }}>
                          <span>Leave Quota</span>
                          <span style={{ fontWeight:700, color:"#334155" }}>{s.leaveUsed} / {emp.totalLeaves} days</span>
                        </div>
                        <div style={{ height:5, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
                          <div style={{
                            height:"100%", borderRadius:99, transition:"width 0.4s",
                            background: pct>80 ? "#ef4444" : pct>50 ? "#f59e0b" : "#6366f1",
                            width:`${pct}%`
                          }} />
                        </div>
                      </div>

                      {/* Status pills */}
                      <div style={{ marginTop:10, display:"flex", gap:4, flexWrap:"wrap" }}>
                        {STATUS_CYCLE.filter(st=>s[st]>0).map(st=>(
                          <span key={st} style={{
                            background:STATUS_CONFIG[st].lightBg, color:STATUS_CONFIG[st].textColor,
                            fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:6,
                            border:`1px solid ${STATUS_CONFIG[st].borderColor}`,
                          }}>{STATUS_CONFIG[st].short} {s[st]}</span>
                        ))}
                        {totalMarked===0 && s.leaveUsed===0 && (
                          <span style={{ fontSize:11, color:"#cbd5e1" }}>No records yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
        )}

        {/* ── CALENDAR + RIGHT PANEL ── */}
        {selected && stats && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:18, alignItems:"stretch" }}>

            {/* LEFT: Big Calendar */}
            <BigCalendar emp={selected} attendance={attendance} onToggle={handleToggle} />

            {/* RIGHT: Info + Stats */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* ── Employee Info Card ── */}
              <div style={{ ...cardBase, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
<Avatar initials={selected.avatar || selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)} />                  <div>
                    <p style={{ margin:0, fontWeight:800, fontSize:15, color:"#0f172a" }}>{selected.name}</p>
                    <p style={{ margin:"3px 0 5px", fontSize:12, color:"#94a3b8" }}>{selected.role}</p>
                    <span style={{
                      background:(DEPT_PALETTE[selected.department]||{bg:"#f1f5f9"}).bg,
                      color:(DEPT_PALETTE[selected.department]||{text:"#475569"}).text,
                      fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                    }}>{selected.department}</span>
                  </div>
                </div>

                {/* 3-col summary */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                  {[
                    { label:"Total",  val:selected.totalLeaves,                   color:"#334155", bg:"#f8fafc" },
                    { label:"Used",   val:+(stats.leaveUsed.toFixed(1)),           color:"#d97706", bg:"#fffbeb" },
                    { label:"Left",   val:+(stats.remaining.toFixed(1)),           color:stats.remaining<3?"#e11d48":"#059669", bg:stats.remaining<3?"#fff1f2":"#ecfdf5" },
                  ].map(item=>(
                    <div key={item.label} style={{ background:item.bg, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                      <p style={{ margin:0, fontSize:19, fontWeight:800, color:item.color }}>{item.val}</p>
                      <p style={{ margin:"2px 0 0", fontSize:10, color:"#94a3b8", fontWeight:600 }}>{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Balance bar */}
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", marginBottom:5 }}>
                    <span style={{ fontWeight:600 }}>Leave Balance</span>
                    <span style={{ fontWeight:700, color:"#334155" }}>
                      {Math.min(100, Math.round((stats.leaveUsed/selected.totalLeaves)*100))}% used
                    </span>
                  </div>
                  <div style={{ height:7, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:99, transition:"width 0.6s ease",
                      background:"linear-gradient(90deg,#818cf8,#4f46e5)",
                      width:`${Math.min(100, Math.round((stats.leaveUsed/selected.totalLeaves)*100))}%`
                    }} />
                  </div>
                </div>
              </div>

              {/* ── Attendance Breakdown ── */}
              <div style={{ ...cardBase, padding:20, flex:1, display:"flex", flexDirection:"column" }}>
                <p style={{ margin:"0 0 14px", fontWeight:800, fontSize:13, color:"#0f172a" }}>Attendance Breakdown</p>
                <div style={{ display:"flex", flexDirection:"column", gap:11, flex:1, justifyContent:"space-between" }}>
                  {STATUS_CYCLE.map(st => (
                    <StatRow key={st} st={st} count={stats[st]||0} total={totalMarked} />
                  ))}
                </div>
              </div>

              {/* ── Status Guide ── */}
              <div style={{ ...cardBase, padding:18 }}>
                <p style={{ margin:"0 0 10px", fontWeight:800, fontSize:13, color:"#0f172a" }}>Status Guide</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {STATUS_CYCLE.map(st => {
                    const cfg = STATUS_CONFIG[st];
                    return (
                      <div key={st} style={{
                        display:"flex", alignItems:"center", gap:7,
                        background:cfg.lightBg, borderRadius:8, padding:"6px 9px",
                        border:`1px solid ${cfg.borderColor}`,
                      }}>
                        <span style={{
                          width:26, height:18, borderRadius:4, background:cfg.hex, color:"#fff",
                          fontSize:8, fontWeight:800, display:"flex", alignItems:"center",
                          justifyContent:"center", flexShrink:0, letterSpacing:"0.04em",
                        }}>{cfg.short}</span>
                        <span style={{ fontSize:10, color:cfg.textColor, fontWeight:700, whiteSpace:"nowrap" }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                  {/* Off days */}
                  {[
                    { short:"SUN", label:"Sunday Off",    bg:"#ef4444", lbg:"#fef2f2", tc:"#991b1b", bc:"#fca5a5" },
                    { short:"2S",  label:"2nd Sat Off",   bg:"#f97316", lbg:"#fff7ed", tc:"#9a3412", bc:"#fdba74" },
                  ].map(item=>(
                    <div key={item.short} style={{
                      display:"flex", alignItems:"center", gap:7,
                      background:item.lbg, borderRadius:8, padding:"6px 9px",
                      border:`1px solid ${item.bc}`,
                    }}>
                      <span style={{
                        width:26, height:18, borderRadius:4, background:item.bg, color:"#fff",
                        fontSize:7, fontWeight:800, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0,
                      }}>{item.short}</span>
                      <span style={{ fontSize:10, color:item.tc, fontWeight:700, whiteSpace:"nowrap" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── ADD EMPLOYEE MODAL ── */}
        {showForm && (
          <div style={{
            position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", backdropFilter:"blur(5px)",
            display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:16,
          }}>
            <div style={{ background:"#fff", borderRadius:22, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 24px 64px rgba(15,23,42,0.25)" }}>
              <div style={{ background:"linear-gradient(135deg,#4338ca,#6366f1)", padding:"22px 26px" }}>
                <h2 style={{ margin:0, color:"#fff", fontSize:18, fontWeight:800, letterSpacing:"-0.02em" }}>Add New Employee</h2>
                <p style={{ margin:"4px 0 0", color:"#c7d2fe", fontSize:12 }}>Fill in the details to onboard a team member</p>
              </div>
              <div style={{ padding:24, display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { k:"name",       ph:"Full Name *"                    },
                  { k:"role",       ph:"Job Role (e.g. Developer)"       },
                  { k:"department", ph:"Department (IT, HR, Finance…)"   },
                ].map(({k,ph})=>(
                  <input key={k} placeholder={ph} value={newEmp[k]}
                    onChange={e=>setNewEmp(p=>({...p,[k]:e.target.value}))}
                    style={{ ...inputStyle, width:"100%", boxSizing:"border-box" }}
                  />
                ))}
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:5 }}>Annual Leave Quota (days)</label>
                  <input type="number" min="0" max="60" value={newEmp.totalLeaves}
                    onChange={e=>setNewEmp(p=>({...p,totalLeaves:+e.target.value}))}
                    style={{ ...inputStyle, width:"100%", boxSizing:"border-box" }}
                  />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, padding:"0 24px 24px" }}>
                <button onClick={()=>setShowForm(false)} style={{
                  flex:1, padding:"11px 0", borderRadius:10, border:"1px solid #e2e8f0",
                  background:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:"#475569",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="#f8fafc"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; }}
                >Cancel</button>
                <button onClick={handleAdd} style={{
                  flex:1, padding:"11px 0", borderRadius:10, border:"none",
                  background:"#4f46e5", cursor:"pointer", fontSize:13, fontWeight:700, color:"#fff",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="#4338ca"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="#4f46e5"; }}
                >Add Employee</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Leave;