import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Smile, Meh, Frown, GraduationCap, Smartphone, History } from "lucide-react";

const COLORS = { "Got it": "#10b981", Following: "#0ea5e9", Lost: "#f43f5e" };
const genCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const seedStudents = () => {
  const names = ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa"];
  const statuses = ["Got it","Got it","Following","Following","Following","Lost","Got it","Following","Lost","Following"];
  return names.map((n,i)=>({ id: `sim-${i}`, name: `Student ${n}`, status: statuses[i], lastUpdated: Date.now() }));
};

const JoinScreen = ({ sessionCode, codeInput, setCodeInput, joinError, onJoin }) => (
  <div style={{ maxWidth:380, margin:"0 auto" }}>
    <div style={{ background:"#fff", borderRadius:24, padding:28, border:"1px solid #f1f5f9", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", margin:"0 auto 16px" }}>
        <Smartphone size={28}/>
      </div>
      <div style={{ fontWeight:800, fontSize:18, color:"#1e293b", marginBottom:4 }}>Join Session</div>
      <div style={{ fontSize:12, color:"#94a3b8", marginBottom:20 }}>Enter the 4-digit code shown by your teacher.</div>
      <input
        autoFocus
        value={codeInput}
        onChange={e => setCodeInput(e.target.value.replace(/\D/g,"").slice(0,4))}
        placeholder="e.g. 1234"
        style={{ width:"100%", textAlign:"center", fontSize:28, fontWeight:900, fontFamily:"monospace", padding:"14px", borderRadius:14, border:"1px solid #e2e8f0", background:"#f8fafc", marginBottom:12, outline:"none", boxSizing:"border-box" }}
      />
      {joinError && <div style={{ color:"#e11d48", fontSize:12, fontWeight:600, marginBottom:8 }}>{joinError}</div>}
      <button onClick={onJoin}
        style={{ width:"100%", padding:14, borderRadius:14, border:"none", cursor:"pointer", fontWeight:800, fontSize:14, color:"#fff", background:"linear-gradient(90deg,#6366f1,#8b5cf6)" }}>
        Join Session →
      </button>
    </div>
  </div>
);

export default function App() {
  const [sessionCode] = useState(genCode());
  const [view, setView] = useState("split"); // split | teacher | student
  const [students, setStudents] = useState(seedStudents());
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const meId = useRef("me");
  const [myStatus, setMyStatus] = useState(null);
  const [autoSim, setAutoSim] = useState(true);
  const [chartRunning, setChartRunning] = useState(true);
  const [joined, setJoined] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const addLog = (name, status) => {
    setLogs(prev => [...prev.slice(-29), { id: Date.now()+Math.random(), name, status, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}) }]);
  };

  const updateStatus = (id, status, name) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status, lastUpdated: Date.now() } : s));
    addLog(name, status);
  };

  // student "me" tap
  const handleMyTap = (status) => {
    setMyStatus(status);
    setStudents(prev => {
      const exists = prev.find(s => s.id === "me");
      if (exists) return prev.map(s => s.id === "me" ? {...s, status, lastUpdated: Date.now()} : s);
      return [...prev, { id: "me", name: "You (Anonymous)", status, lastUpdated: Date.now() }];
    });
    addLog("You (Anonymous)", status);
  };

  // simulate other students randomly + record history every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoSim) {
        setStudents(prev => prev.map(s => {
          if (s.id === "me") return s;
          if (Math.random() < 0.25) {
            const opts = ["Got it","Following","Lost"];
            const newStatus = opts[Math.floor(Math.random()*opts.length)];
            if (newStatus !== s.status) addLog(s.name, newStatus);
            return { ...s, status: newStatus, lastUpdated: Date.now() };
          }
          return s;
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoSim]);

  // record history snapshot every 3s based on current students state
  useEffect(() => {
    const t = setInterval(() => {
      if (!chartRunning) return;
      setStudents(curr => {
        const counts = { "Got it":0, Following:0, Lost:0 };
        curr.forEach(s => counts[s.status]++);
        const time = new Date().toLocaleTimeString([], {minute:"2-digit", second:"2-digit"});
        setHistory(h => [...h.slice(-19), { time, ...counts }]);
        return curr;
      });
    }, 3000);
    return () => clearInterval(t);
  }, [chartRunning]);

  const counts = { "Got it":0, Following:0, Lost:0 };
  students.forEach(s => counts[s.status]++);
  const total = students.length;
  const barData = [
    { name: "Got it", value: counts["Got it"], color: COLORS["Got it"] },
    { name: "Following", value: counts.Following, color: COLORS.Following },
    { name: "Lost", value: counts.Lost, color: COLORS.Lost },
  ];

  const TeacherView = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
            <GraduationCap size={24}/>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#6366f1", letterSpacing:1 }}>ACTIVE CLASSROOM</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#1e293b" }}>Teacher Console</div>
          </div>
        </div>
        <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:14, padding:"10px 18px" }}>
          <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8", marginRight:8 }}>SESSION CODE</span>
          <span style={{ fontSize:22, fontWeight:900, color:"#6366f1", fontFamily:"monospace" }}>{sessionCode}</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
        {[
          { label:"Active Students", value: total, color:"#1e293b", bg:"#f8fafc", icon:null },
          { label:"Got it", value: `${counts["Got it"]} (${total?Math.round(counts["Got it"]/total*100):0}%)`, color:"#059669", bg:"#ecfdf5", icon:<Smile size={20}/> },
          { label:"Following", value: `${counts.Following} (${total?Math.round(counts.Following/total*100):0}%)`, color:"#0284c7", bg:"#f0f9ff", icon:<Meh size={20}/> },
          { label:"Lost", value: `${counts.Lost} (${total?Math.round(counts.Lost/total*100):0}%)`, color:"#e11d48", bg:"#fff1f2", icon:<Frown size={20}/> },
        ].map((c,i) => (
          <div key={i} style={{ background:c.bg, borderRadius:18, padding:16, border:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:11, fontWeight:700, color:c.color, opacity:0.8 }}>{c.label}</div>
            <div style={{ fontSize:24, fontWeight:900, color:c.color, marginTop:4 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: "2fr 1fr", gap:16, minWidth:0 }}>
        <div style={{ background:"#fff", borderRadius:20, padding:16, border:"1px solid #f1f5f9", height:280 }}>
          <div style={{ fontWeight:800, color:"#1e293b", marginBottom:8 }}>Live Comprehension Trend</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Area type="monotone" dataKey="Got it" stroke={COLORS["Got it"]} fill={COLORS["Got it"]} fillOpacity={0.15} />
              <Area type="monotone" dataKey="Following" stroke={COLORS.Following} fill={COLORS.Following} fillOpacity={0.15} />
              <Area type="monotone" dataKey="Lost" stroke={COLORS.Lost} fill={COLORS.Lost} fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:"#fff", borderRadius:20, padding:16, border:"1px solid #f1f5f9", height:280 }}>
          <div style={{ fontWeight:800, color:"#1e293b", marginBottom:8 }}>Right Now</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {barData.map((e,i)=><Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:"#fff", borderRadius:20, padding:16, border:"1px solid #f1f5f9" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, fontWeight:800, color:"#1e293b" }}>
          <History size={16}/> Live Feed
        </div>
        <div style={{ maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
          {logs.length === 0 && <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:20 }}>Waiting for signals...</div>}
          {logs.slice().reverse().map(l => (
            <div key={l.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#475569", padding:"4px 0", borderBottom:"1px solid #f8fafc" }}>
              <span><strong>{l.name}</strong> marked <span style={{ color: COLORS[l.status], fontWeight:700 }}>{l.status}</span></span>
              <span style={{ color:"#cbd5e1", fontFamily:"monospace", fontSize:11 }}>{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StudentView = () => {
    if (!joined) {
      return (
        <JoinScreen
          sessionCode={sessionCode}
          codeInput={codeInput}
          setCodeInput={setCodeInput}
          joinError={joinError}
          onJoin={() => {
            if (codeInput === sessionCode) { setJoined(true); setJoinError(""); setMyStatus("Following"); handleMyTap("Following"); }
            else setJoinError(`Incorrect code. Try ${sessionCode} for this demo.`);
          }}
        />
      );
    }
    return (
    <div style={{ maxWidth:380, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:24, border:"1px solid #f1f5f9", textAlign:"center", position:"relative" }}>
        <button onClick={() => { setJoined(false); setCodeInput(""); }}
          style={{ position:"absolute", top:12, right:12, fontSize:11, fontWeight:700, color:"#94a3b8", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:10, padding:"4px 10px", cursor:"pointer" }}>
          Exit
        </button>
        <div style={{ fontSize:10, fontWeight:700, color:"#8b5cf6", letterSpacing:1, background:"#f5f3ff", display:"inline-block", padding:"4px 12px", borderRadius:20, marginBottom:8 }}>INTERACTIVE FEEDBACK</div>
        <div style={{ fontWeight:800, fontSize:18, color:"#1e293b" }}>How's the lecture going?</div>
        <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>Tap anytime your understanding changes. Fully anonymous.</div>
      </div>
      {[
        { key:"Got it", icon:<Smile size={22}/>, desc:"I completely understand this.", grad:"linear-gradient(90deg,#10b981,#14b8a6)", bg:"#ecfdf5", color:"#059669" },
        { key:"Following", icon:<Meh size={22}/>, desc:"I'm following along okay.", grad:"linear-gradient(90deg,#0ea5e9,#3b82f6)", bg:"#f0f9ff", color:"#0284c7" },
        { key:"Lost", icon:<Frown size={22}/>, desc:"I'm confused, need help.", grad:"linear-gradient(90deg,#f43f5e,#ec4899)", bg:"#fff1f2", color:"#e11d48" },
      ].map(opt => {
        const active = myStatus === opt.key;
        return (
          <button key={opt.key} onClick={() => handleMyTap(opt.key)}
            style={{
              display:"flex", alignItems:"center", gap:14, padding:16, borderRadius:18, border:"none", cursor:"pointer",
              textAlign:"left", background: active ? opt.grad : opt.bg, color: active ? "#fff" : "#334155",
              transition:"all .2s", boxShadow: active ? "0 8px 20px -8px rgba(0,0,0,0.3)" : "none"
            }}>
            <div style={{ width:44, height:44, borderRadius:12, background: active ? "rgba(255,255,255,0.2)" : "#fff", display:"flex", alignItems:"center", justifyContent:"center", color: active ? "#fff" : opt.color }}>
              {opt.icon}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>{opt.key}</div>
              <div style={{ fontSize:11, opacity:0.85, marginTop:2 }}>{opt.desc}</div>
            </div>
          </button>
        );
      })}
      <div style={{ fontSize:11, color:"#94a3b8", textAlign:"center" }}>
        Session <strong style={{ fontFamily:"monospace" }}>{sessionCode}</strong> · Silence is privacy — only tallies are shown to the teacher.
      </div>
    </div>
    );
  };

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#f8fafc", minHeight:"100%", padding:20 }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div style={{ display:"flex", gap:8, marginBottom:16, background:"#fff", padding:6, borderRadius:14, border:"1px solid #f1f5f9", width:"fit-content" }}>
          {["split","teacher","student"].map(v => (
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"8px 16px", borderRadius:10, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                background: view===v ? "#6366f1" : "transparent", color: view===v ? "#fff" : "#64748b" }}>
              {v === "split" ? "Split View" : v === "teacher" ? "Teacher" : "Student"}
            </button>
          ))}
          <button onClick={()=>setAutoSim(s=>!s)}
            style={{ padding:"8px 16px", borderRadius:10, border:"1px solid #f1f5f9", cursor:"pointer", fontSize:12, fontWeight:700, background: autoSim ? "#fef3c7" : "#fff", color:"#92400e" }}>
            {autoSim ? "🎲 Simulation: ON" : "🎲 Simulation: OFF"}
          </button>
          <button onClick={()=>setChartRunning(s=>!s)}
            style={{ padding:"8px 16px", borderRadius:10, border:"1px solid #f1f5f9", cursor:"pointer", fontSize:12, fontWeight:700, background: chartRunning ? "#dbeafe" : "#fff", color:"#1d4ed8" }}>
            {chartRunning ? "📈 Graph: Live" : "⏸ Graph: Paused"}
          </button>
        </div>

        {view === "split" && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
            <TeacherView />
            <div>
              <div style={{ textAlign:"center", fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:8, letterSpacing:1 }}>STUDENT DEVICE</div>
              <div style={{ border:"6px solid #1e293b", borderRadius:28, padding:12, background:"#f8fafc" }}>
                <StudentView />
              </div>
            </div>
          </div>
        )}
        {view === "teacher" && <TeacherView />}
        {view === "student" && <StudentView />}
      </div>
    </div>
  );
}
