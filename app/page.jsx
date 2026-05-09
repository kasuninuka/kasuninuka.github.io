"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Palette & fonts ────────────────────────────────────────────────
const GOLD = "#B58A5A";
const GOLD_LIGHT = "#5B4332";
const GOLD_DARK = "#9C7A58";
const CREAM = "#FFFBF7";
const DEEP = "#FFFFFF";
const CHAMPAGNE = "#3F2F23";
const BLUSH = "#F8E9E4";
const INK = "#3B2A1E";
const MAP_GREEN = "#3BC8A0";
const MAP_GREEN_DARK = "#1F8F73";
const MAP_TEXT = "#C7332E";
const MAP_OUTLINE = "#2B2B2B";

// ── Mock guest data ────────────────────────────────────────────────
const TABLES = [
  { id: "T01", x: 140, y: 320, label: "01" },
  { id: "T02", x: 220, y: 320, label: "02" },
  { id: "T03", x: 300, y: 320, label: "03" },
  { id: "T04", x: 380, y: 320, label: "04" },

  { id: "T05", x: 140, y: 410, label: "05" },
  { id: "T06", x: 220, y: 410, label: "06" },
  { id: "T07", x: 300, y: 410, label: "07" },
  { id: "T08", x: 380, y: 410, label: "08" },

  { id: "T09", x: 140, y: 500, label: "09" },
  { id: "T10", x: 220, y: 500, label: "10" },
  { id: "T11", x: 300, y: 500, label: "11" },
  { id: "T12", x: 380, y: 500, label: "12" },

  { id: "T13", x: 140, y: 640, label: "13" },
  { id: "T14", x: 220, y: 640, label: "14" },
  { id: "T15", x: 300, y: 640, label: "15" },
  { id: "T16", x: 380, y: 640, label: "16" },

  { id: "T17", x: 140, y: 730, label: "17" },
  { id: "T18", x: 220, y: 730, label: "18" },
  { id: "T19", x: 300, y: 730, label: "19" },
  { id: "T20", x: 380, y: 730, label: "20" },

  { id: "T21", x: 480, y: 410, label: "21" },
  { id: "T22", x: 560, y: 410, label: "22" },
  { id: "T23", x: 640, y: 410, label: "23" },
  { id: "T24", x: 720, y: 410, label: "24" },

  { id: "T25", x: 480, y: 500, label: "25" },
  { id: "T26", x: 560, y: 500, label: "26" },
  { id: "T27", x: 640, y: 500, label: "27" },
  { id: "T28", x: 720, y: 500, label: "28" },

  { id: "T29", x: 480, y: 640, label: "29" },
  { id: "T30", x: 560, y: 640, label: "30" },
  { id: "T31", x: 640, y: 640, label: "31" },
  { id: "T32", x: 720, y: 640, label: "32" },
];

const PILLARS = [
  { id: 17, name: "Quinn Aldridge", table: "T09", seat: "S2", group: "College Friends", initials: "QA" },
  { id: 18, name: "Rosalind Foley", table: "T09", seat: "S5", group: "College Friends", initials: "RF" },
  { id: 19, name: "Sebastian Crane", table: "T10", seat: "S1", group: "Work Colleagues", initials: "SC" },
  { id: 20, name: "Theodora Nash", table: "T10", seat: "S3", group: "Work Colleagues", initials: "TN" },
  { id: 21, name: "Ursula Fontaine", table: "T11", seat: "S2", group: "Childhood Friends", initials: "UF" },
  { id: 22, name: "Victor Hale", table: "T11", seat: "S4", group: "Childhood Friends", initials: "VH" },
  { id: 23, name: "Winifred Cross", table: "T12", seat: "S1", group: "Bride's Family", initials: "WC" },
  { id: 24, name: "Xavier Drummond", table: "T12", seat: "S3", group: "Bride's Family", initials: "XD" },
  { id: 25, name: "Yvette Marchetti", table: "T13", seat: "S2", group: "VIP Guests", initials: "YM" },
  { id: 26, name: "Zachary Pemberton", table: "T13", seat: "S5", group: "VIP Guests", initials: "ZP" },
  { id: 27, name: "Arabella Spencer", table: "T14", seat: "S1", group: "Groom's Family", initials: "AS" },
  { id: 28, name: "Byron Kessler", table: "T14", seat: "S4", group: "Groom's Family", initials: "BK" },
  { id: 29, name: "Celeste Navarro", table: "T15", seat: "S2", group: "College Friends", initials: "CN" },
  { id: 30, name: "Desmond Fairfax", table: "T15", seat: "S3", group: "College Friends", initials: "DF" },
];


// ── Timeline data ──────────────────────────────────────────────────
const TIMELINE = [
  { time: "3:00 PM", event: "Guest Arrival & Welcome Drinks", icon: "🥂" },
  { time: "4:00 PM", event: "Ceremony Begins", icon: "💍" },
  { time: "5:00 PM", event: "Cocktail Hour & Photography", icon: "📸" },
  { time: "6:30 PM", event: "Grand Reception Entrance", icon: "✨" },
  { time: "7:00 PM", event: "First Dance & Dinner Service", icon: "🍽️" },
  { time: "9:00 PM", event: "Cake Cutting & Toasts", icon: "🎂" },
  { time: "10:00 PM", event: "Dancing & Celebration", icon: "🎶" },
  { time: "12:00 AM", event: "Farewell & Send-Off", icon: "🌙" },
];

const WISHES = [
  { name: "Elena & Marco", message: "Wishing you a lifetime of love, laughter, and endless adventures together. You two are truly made for each other.", date: "May 2026" },
  { name: "The Williams Family", message: "May your love grow stronger with every passing year. So happy to celebrate this beautiful day with you both!", date: "May 2026" },
  { name: "Sophie Chen", message: "You've both found your forever in each other. Here's to a marriage full of joy and all the good things life has to offer.", date: "May 2026" },
];

// ── Fuzzy search ───────────────────────────────────────────────────
function fuzzySearch(query, items) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return items
    .filter(g => g.name.toLowerCase().includes(q) || g.group.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aStart - bStart;
    })
    .slice(0, 6);
}

// ── Particle component ─────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.4,
    })));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: var(--p-op); }
          90% { opacity: var(--p-op); }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          bottom: 0,
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: GOLD,
          "--p-op": p.opacity,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  );
}

// ── Wedding Hall SVG Map ───────────────────────────────────────────
function HallMap({ selectedTable, onTableClick, highlightGuests }) {
  const svgRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);

  useEffect(() => {
    if (selectedTable) {
      const t = TABLES.find(t => t.id === selectedTable);
      if (t && svgRef.current) {
        const svgW = svgRef.current.clientWidth;
        const svgH = svgRef.current.clientHeight;
        const scale = 2.2;
        setTransform({
          x: svgW / 2 - t.x * scale,
          y: svgH / 2 - t.y * scale,
          scale,
        });
      }
    } else {
      setTransform({ x: 0, y: 0, scale: 1 });
    }
  }, [selectedTable]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setTransform(prev => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      return { ...prev, scale: Math.max(0.5, Math.min(4, prev.scale * delta)) };
    });
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [transform]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  return (
    <div
      ref={svgRef}
      style={{
        width: "100%", height: "100%", overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        background: "linear-gradient(135deg, #FFF7F0 0%, #FFF2E8 50%, #FFF9F4 100%)",
        position: "relative",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <style>{`
        @keyframes tablePulse {
          0%, 100% { filter: drop-shadow(0 0 8px ${GOLD}) drop-shadow(0 0 16px ${GOLD}40); }
          50% { filter: drop-shadow(0 0 20px ${GOLD}) drop-shadow(0 0 40px ${GOLD}80); }
        }
        @keyframes tableGlow {
          0%, 100% { opacity: 0.6; r: 38; }
          50% { opacity: 1; r: 46; }
        }
      `}</style>

      <svg
        viewBox="0 0 800 900"
        width="100%" height="100%"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          userSelect: "none",
        }}
      >
        <defs>
          <radialGradient id="hallGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF8F0" />
          </radialGradient>
        </defs>

        {/* Hall floor */}
        <rect x="60" y="60" width="680" height="780" rx="16" fill="url(#hallGrad)" stroke={MAP_OUTLINE} strokeWidth="1" />

        {/* Title */}
        <text x="400" y="48" textAnchor="middle" fill={MAP_OUTLINE} fontSize="22" fontFamily="Georgia, serif" letterSpacing="3">
          TABLE PLAN
        </text>

        {/* Service areas */}
        <text x="85" y="85" fill={MAP_OUTLINE} fontSize="10" fontFamily="Georgia, serif">Service area</text>
        <text x="650" y="85" fill={MAP_OUTLINE} fontSize="10" fontFamily="Georgia, serif">Service area</text>

        {/* Settee back */}
        <rect x="250" y="90" width="300" height="60" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <text x="400" y="125" textAnchor="middle" fill={MAP_OUTLINE} fontSize="16" fontFamily="Georgia, serif">Settee Back</text>

        {/* Poruwa */}
        <g transform="rotate(-20 140 165)">
          <rect x="90" y="130" width="100" height="70" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
          <text x="140" y="170" textAnchor="middle" fill={MAP_OUTLINE} fontSize="12" fontFamily="Georgia, serif">Poruwa</text>
        </g>

        {/* S and B circles */}
        <circle cx="560" cy="150" r="26" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <circle cx="680" cy="150" r="26" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <text x="560" y="156" textAnchor="middle" fill={MAP_OUTLINE} fontSize="14" fontFamily="Georgia, serif">S</text>
        <text x="680" y="156" textAnchor="middle" fill={MAP_OUTLINE} fontSize="14" fontFamily="Georgia, serif">B</text>

        {/* Dance floor */}
        <rect x="520" y="210" width="120" height="200" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <text x="580" y="310" textAnchor="middle" fill={MAP_OUTLINE} fontSize="14" fontFamily="Georgia, serif" transform="rotate(90 580 310)">
          DANCE FLOOR 18 x 18
        </text>

        {/* Band */}
        <rect x="660" y="230" width="70" height="180" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <text x="695" y="320" textAnchor="middle" fill={MAP_OUTLINE} fontSize="12" fontFamily="Georgia, serif" transform="rotate(90 695 320)">
          Band 18 x 8
        </text>

        {/* Pillars */}
        {PILLARS.map(pillar => (
          <circle key={pillar.id} cx={pillar.x} cy={pillar.y} r="18" fill="#FFFFFF" stroke={MAP_OUTLINE} strokeWidth="1" />
        ))}

        {/* Bar */}
        <rect x="520" y="770" width="160" height="40" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
        <text x="600" y="795" textAnchor="middle" fill={MAP_OUTLINE} fontSize="14" fontFamily="Georgia, serif">Bar</text>
        {[540, 570, 600, 630].map((x, i) => (
          <g key={i} transform={`translate(${x}, 740)`}>
            <polygon points="0,0 10,0 5,12" fill="#F5D74D" stroke={MAP_OUTLINE} strokeWidth="0.6" />
            <polygon points="0,24 10,24 5,12" fill="#F5D74D" stroke={MAP_OUTLINE} strokeWidth="0.6" />
          </g>
        ))}

        {/* Entrance labels */}
        <text x="400" y="830" textAnchor="middle" fill={MAP_OUTLINE} fontSize="12" fontFamily="Georgia, serif">ENTRANCE</text>
        <text x="90" y="830" textAnchor="middle" fill={MAP_OUTLINE} fontSize="9" fontFamily="Georgia, serif" transform="rotate(-90 90 830)">
          ENTRANCE TO RED GARDEN
        </text>

        {/* Tables */}
        {TABLES.map(table => (
          <g
            key={table.id}
            onClick={() => onTableClick(table.id)}
            style={{ cursor: "pointer" }}
            transform={`translate(${table.x}, ${table.y})`}
          >
            <circle r="26" fill={MAP_GREEN} stroke={MAP_OUTLINE} strokeWidth="1" />
            <text x="0" y="5" textAnchor="middle" fill={MAP_TEXT}
              fontSize="12" fontFamily="Georgia, serif" fontWeight="600">
              {table.label}
            </text>
          </g>
        ))}

        {/* Decorative corner ornaments */}
        {[[80, 80], [680, 80], [80, 760], [680, 760]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.3" />
            <circle cx={cx} cy={cy} r="3" fill={GOLD} opacity="0.3" />
          </g>
        ))}
      </svg>

      {/* Zoom controls */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        {[
          { label: "+", action: () => setTransform(p => ({ ...p, scale: Math.min(4, p.scale * 1.3) })) },
          { label: "⊙", action: () => setTransform({ x: 0, y: 0, scale: 1 }) },
          { label: "−", action: () => setTransform(p => ({ ...p, scale: Math.max(0.5, p.scale / 1.3) })) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action} style={{
            width: 32, height: 32, borderRadius: 6,
            background: "rgba(255,247,240,0.9)", border: `1px solid ${GOLD_DARK}`,
            color: GOLD, fontSize: 16, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif",
          }}>
            {btn.label}
          </button>
        ))}
      </div>

    </div>
  );
}

// ── Guest Info Card ────────────────────────────────────────────────
function GuestCard({ guest, onClose }) {
  if (!guest) return null;
  const messages = [
    `Welcome to our celebration, ${guest.name.split(" ")[0]}! Your presence makes this day even more special.`,
    `So glad you could join us, ${guest.name.split(" ")[0]}! Here's to an unforgettable evening together.`,
    `${guest.name.split(" ")[0]}, thank you for being part of our love story. We're so happy you're here!`,
  ];
  const message = messages[guest.id % 3];

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,247,240,0.95) 0%, rgba(248,236,221,0.98) 100%)",
      border: `1px solid ${GOLD_DARK}`,
      borderRadius: 16,
      padding: 24,
      backdropFilter: "blur(20px)",
      position: "relative",
      animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Close button */}
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 12,
        background: "none", border: `1px solid ${GOLD_DARK}`,
        color: GOLD, width: 24, height: 24, borderRadius: "50%",
        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
      }}>✕</button>

      {/* Avatar */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, fontFamily: "Georgia, serif", color: INK,
        fontWeight: "bold", margin: "0 auto 16px",
        boxShadow: `0 0 20px ${GOLD}40`,
      }}>
        {guest.initials}
      </div>

      {/* Name */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          color: GOLD, fontSize: 18, fontFamily: "Georgia, serif",
          fontStyle: "italic", marginBottom: 4,
          background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_DARK})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 3s linear infinite",
        }}>
          {guest.name}
        </div>
        <div style={{ color: GOLD_LIGHT, fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: 2, opacity: 0.85 }}>
          {guest.group.toUpperCase()}
        </div>
      </div>

      {/* Details */}
      <div style={{
        background: "rgba(201,168,76,0.08)", border: `1px solid ${GOLD_DARK}40`,
        borderRadius: 10, padding: 14, marginBottom: 14,
      }}>
        {[
          { label: "Table", value: guest.table },
          { label: "Seat", value: guest.seat },
          { label: "Group", value: guest.group },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 0", borderBottom: `1px solid ${GOLD_DARK}20`,
          }}>
            <span style={{ color: GOLD_LIGHT, fontSize: 11, fontFamily: "Georgia, serif", opacity: 0.75, letterSpacing: 1 }}>
              {label.toUpperCase()}
            </span>
            <span style={{ color: INK, fontSize: 13, fontFamily: "Georgia, serif" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Welcome message */}
      <div style={{
        background: "rgba(201,168,76,0.05)", borderLeft: `2px solid ${GOLD}`,
        padding: "10px 14px", borderRadius: "0 8px 8px 0",
      }}>
        <p style={{
          color: CHAMPAGNE, fontSize: 12, fontFamily: "Georgia, serif",
          fontStyle: "italic", lineHeight: 1.6, margin: 0,
        }}>
          "{message}"
        </p>
        <p style={{ color: GOLD, fontSize: 10, margin: "6px 0 0", fontFamily: "Georgia, serif", opacity: 0.7 }}>
          — Sophia & Alexander
        </p>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function WeddingApp() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [showDropdown, setShowDropdown] = useState(false);
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState(WISHES);
  const [wishName, setWishName] = useState("");
  const [wishSent, setWishSent] = useState(false);
  const [mapHints, setMapHints] = useState(true);
  const inputRef = useRef(null);
  const sections = useRef({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setResults(fuzzySearch(query, GUESTS));
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
    setSelectedTable(guest.table);
    setQuery(guest.name);
    setShowDropdown(false);
    setMapHints(false);
    setTimeout(() => {
      sections.current["finder"]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleTableClick = (tableId) => {
    const tableGuests = GUESTS.filter(g => g.table === tableId);
    if (tableGuests.length > 0) {
      setSelectedGuest(tableGuests[0]);
      setSelectedTable(tableId);
    }
  };

  const scrollTo = (id) => {
    sections.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const handleSendWish = () => {
    if (!wishText.trim() || !wishName.trim()) return;
    setWishes(prev => [{ name: wishName, message: wishText, date: "May 2026" }, ...prev]);
    setWishText("");
    setWishName("");
    setWishSent(true);
    setTimeout(() => setWishSent(false), 3000);
  };

  const navItems = [
    { id: "hero", label: "Welcome" },
    { id: "finder", label: "Find My Table" },
    { id: "story", label: "Our Story" },
    { id: "timeline", label: "Schedule" },
    { id: "wishes", label: "Wishes" },
  ];

  if (!mounted) {
    return <div style={{ background: DEEP, minHeight: "100vh" }} />;
  }

  return (
    <div className="page-shell" style={{
      background: DEEP,
      color: INK,
      fontFamily: "Georgia, serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FFF7F0; }
        ::-webkit-scrollbar-thumb { background: ${GOLD_DARK}; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gentle-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 20px ${GOLD}30; } 50% { box-shadow: 0 0 40px ${GOLD}60; } }
        .nav-link { transition: color 0.3s, opacity 0.3s; }
        .nav-link:hover { color: ${GOLD} !important; opacity: 1 !important; }
        .search-input:focus { outline: none; border-color: ${GOLD} !important; box-shadow: 0 0 20px ${GOLD}20 !important; }
        .result-item:hover { background: rgba(181,138,90,0.12) !important; }
        .cta-btn:hover { background: ${GOLD} !important; color: ${INK} !important; transform: scale(1.02); }
        .wish-btn:hover { background: ${GOLD} !important; color: ${INK} !important; }
        .table-row:hover { background: rgba(181,138,90,0.07) !important; }
        .nav-bar { gap: 16px; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links button { white-space: nowrap; }
        .finder-grid { display: grid; }
        .story-row { display: flex; gap: 24px; }
        .timeline-grid { display: grid; }
        @media (max-width: 980px) {
          .nav-bar { padding: 10px 16px !important; }
          .nav-links { gap: 12px; overflow-x: auto; scrollbar-width: none; }
          .nav-links::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 840px) {
          .finder-grid { grid-template-columns: 1fr !important; }
          .map-shell { height: 420px !important; }
        }
        @media (max-width: 720px) {
          .nav-bar { flex-wrap: wrap; justify-content: center !important; }
          .nav-brand { width: 100%; text-align: center; }
          .nav-links { width: 100%; justify-content: center; }
          .hero-section { padding: 90px 16px 72px !important; }
          .finder-section { padding: 72px 0 32px !important; }
          .story-row { flex-direction: column; align-items: center; text-align: center; }
          .story-year { width: auto !important; text-align: center !important; }
          .timeline-grid { grid-template-columns: 1fr !important; }
          .venue-stack { gap: 16px !important; }
        }
        @media (max-width: 520px) {
          .map-shell { height: 340px !important; }
          .guest-card-wrap { width: 100% !important; }
          .wishes-card { padding: 20px !important; }
          .cta-btn { width: 100%; max-width: 280px; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,253,250,0.92)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${GOLD_DARK}30`,
        padding: "12px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div className="nav-brand" style={{ color: GOLD, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", letterSpacing: 2 }}>
          K & I
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 20 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link" style={{
              background: "none", border: "none", cursor: "pointer",
              color: activeSection === item.id ? GOLD : INK,
              fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: 2,
              opacity: activeSection === item.id ? 1 : 0.7,
              transition: "all 0.3s",
              padding: "4px 8px",
            }}>
              {item.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: GOLD,
          animation: "gentle-bob 3s ease-in-out infinite",
        }} />
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="hero-section" ref={el => sections.current["hero"] = el} style={{
        minHeight: "100vh", position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 30%, #FFF2E6 0%, rgba(253, 245, 238, 0.7) 40%, ${DEEP} 100%)`,
      }}>
        <Particles />

        {/* Decorative rings */}
        {[200, 300, 420, 560].map((r, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: r, height: r, borderRadius: "50%",
            border: `1px solid ${GOLD}`,
            opacity: 0.05 + i * 0.03,
          }} />
        ))}

        {/* Ornament top */}
        <div style={{
          fontSize: 20, color: GOLD, opacity: 0.6,
          animation: "fadeIn 2s ease",
          letterSpacing: 16, marginBottom: 24,
        }}>✦ ✦ ✦</div>

        {/* Date */}
        <div style={{
          fontSize: 11, letterSpacing: 6, color: INK, opacity: 0.75,
          fontFamily: "Georgia, serif",
          animation: "fadeUp 1s 0.3s both",
          marginBottom: 20,
        }}>
          13 MAY 2026 · At the Balmoral Ballroom, THE KINGSBURY HOTEL
        </div>

        {/* Main heading */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(52px, 8vw, 96px)",
          fontWeight: 300,
          fontStyle: "italic",
          color: INK,
          textAlign: "center",
          lineHeight: 1,
          animation: "fadeUp 1s 0.5s both",
          marginBottom: 12,
        }}>
          Kasuni
        </div>
        <div style={{
          fontSize: "clamp(20px, 3vw, 32px)",
          color: GOLD, letterSpacing: 12,
          fontFamily: "Georgia, serif",
          opacity: 0.6,
          animation: "fadeUp 1s 0.7s both",
          marginBottom: 12,
        }}>
          &amp;
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(52px, 8vw, 96px)",
          fontWeight: 300,
          fontStyle: "italic",
          color: INK,
          textAlign: "center",
          lineHeight: 1,
          animation: "fadeUp 1s 0.9s both",
          marginBottom: 32,
        }}>
          Inuka
        </div>

        {/* Separator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 32,
          animation: "fadeUp 1s 1.1s both",
        }}>
          <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
          <span style={{ color: GOLD, fontSize: 16 }}>✦</span>
          <div style={{ width: 60, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
        </div>

        {/* Subtitle */}
        <p style={{
          color: INK, fontSize: 15, fontStyle: "italic", letterSpacing: 2,
          opacity: 0.75, marginBottom: 48, textAlign: "center",
          animation: "fadeUp 1s 1.3s both",
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          "Two souls, one love, one forever"
        </p>

        {/* CTA */}
        <button onClick={() => scrollTo("finder")} className="cta-btn" style={{
          background: "transparent",
          border: `1px solid ${GOLD}`,
          color: GOLD,
          padding: "14px 40px",
          fontSize: 11, letterSpacing: 4,
          fontFamily: "Georgia, serif",
          cursor: "pointer",
          borderRadius: 2,
          transition: "all 0.4s",
          animation: "fadeUp 1s 1.5s both, glow-pulse 3s 2s infinite",
        }}>
          FIND YOUR TABLE
        </button>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "gentle-bob 2s ease-in-out infinite",
          opacity: 0.4,
        }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: INK }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </div>
      </section>

      {/* ── TABLE FINDER SECTION ── */}
      <section className="finder-section" ref={el => sections.current["finder"] = el} style={{
        minHeight: "100vh", padding: "80px 0 40px",
        background: `linear-gradient(to bottom, ${DEEP}, #FFF3EB)`,
      }}>
        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: GOLD, opacity: 0.6, marginBottom: 12 }}>WELCOME GUEST</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, fontStyle: "italic",
            color: INK, margin: "0 0 12px",
          }}>
            Find Your Table
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
            <span style={{ color: GOLD, fontSize: 12 }}>✦</span>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          maxWidth: 560, margin: "0 auto 32px", padding: "0 24px",
          position: "relative",
        }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              color: GOLD, fontSize: 16, opacity: 0.6,
            }}>🔍</span>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search your name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => query && setShowDropdown(true)}
              style={{
                width: "100%", padding: "14px 16px 14px 44px",
                background: "rgba(255,253,250,0.9)",
                border: `1px solid ${GOLD_DARK}`,
                borderRadius: 8, color: INK,
                fontSize: 14, fontFamily: "Georgia, serif",
                transition: "all 0.3s",
              }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setSelectedGuest(null); setSelectedTable(null); }} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 16, opacity: 0.5,
              }}>✕</button>
            )}
          </div>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 24, right: 24,
              background: "rgba(255,253,250,0.98)", border: `1px solid ${GOLD_DARK}`,
              borderRadius: 8, overflow: "hidden", zIndex: 50,
              backdropFilter: "blur(16px)",
              boxShadow: `0 16px 40px rgba(0,0,0,0.6)`,
            }}>
              {results.map(guest => (
                <div
                  key={guest.id}
                  className="result-item"
                  onClick={() => handleSelectGuest(guest)}
                  style={{
                    padding: "12px 16px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: `1px solid ${GOLD_DARK}20`,
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: INK, fontWeight: "bold",
                    }}>
                      {guest.initials}
                    </div>
                    <div>
                      <div style={{ color: INK, fontSize: 13 }}>{guest.name}</div>
                      <div style={{ color: GOLD, fontSize: 10, opacity: 0.7 }}>{guest.group}</div>
                    </div>
                  </div>
                  <div style={{
                    background: `rgba(201,168,76,0.15)`, border: `1px solid ${GOLD_DARK}`,
                    borderRadius: 4, padding: "2px 8px", color: GOLD, fontSize: 11,
                  }}>
                    {guest.table}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showDropdown && results.length === 0 && query.length > 1 && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 24, right: 24,
              background: "rgba(255,253,250,0.98)", border: `1px solid ${GOLD_DARK}`,
              borderRadius: 8, padding: 24, textAlign: "center", zIndex: 50,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✦</div>
              <div style={{ color: INK, fontSize: 13, opacity: 0.75 }}>No guest found. Please try a different name.</div>
            </div>
          )}
        </div>

        {/* Main layout: map + card */}
        <div className="finder-grid" style={{
          display: "grid",
          gridTemplateColumns: selectedGuest ? "1fr 360px" : "1fr",
          gap: 20, padding: "0 24px",
          maxWidth: 1200, margin: "0 auto",
          transition: "all 0.4s",
        }}>
          {/* Hall map */}
          <div className="map-shell" style={{
            height: 540,
            background: "#FFFBF7",
            borderRadius: 12, overflow: "hidden",
            border: `1px solid ${GOLD_DARK}40`,
            position: "relative",
          }}>
            {mapHints && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10, textAlign: "center", pointerEvents: "none",
                background: "rgba(255,253,250,0.9)", padding: "20px 30px",
                borderRadius: 12, border: `1px solid ${GOLD_DARK}30`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.6 }}>🔍</div>
                <div style={{ color: INK, fontSize: 12, opacity: 0.75, fontFamily: "Georgia, serif" }}>
                  Search your name above to find your table
                </div>
              </div>
            )}
            <HallMap
              selectedTable={selectedTable}
              onTableClick={handleTableClick}
              highlightGuests={selectedGuest ? [selectedGuest.table] : []}
            />
          </div>

          {/* Guest card */}
          {selectedGuest && (
            <div className="guest-card-wrap">
              <GuestCard guest={selectedGuest} onClose={() => { setSelectedGuest(null); setSelectedTable(null); }} />

              {/* Table guests list */}
              <div style={{
                marginTop: 16,
                background: "rgba(255,253,250,0.9)", border: `1px solid ${GOLD_DARK}40`,
                borderRadius: 12, padding: 16,
              }}>
                <div style={{ color: GOLD, fontSize: 10, letterSpacing: 3, marginBottom: 12, opacity: 0.7 }}>
                  GUESTS AT {selectedTable}
                </div>
                {GUESTS.filter(g => g.table === selectedTable).map(g => (
                  <div key={g.id} className="table-row" style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "6px 0", borderBottom: `1px solid ${GOLD_DARK}15`,
                    cursor: "pointer", transition: "background 0.2s", borderRadius: 4,
                  }} onClick={() => setSelectedGuest(g)}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: g.id === selectedGuest.id ? `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})` : "rgba(201,168,76,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: g.id === selectedGuest.id ? INK : GOLD, fontWeight: "bold",
                    }}>
                      {g.initials}
                    </div>
                    <div>
                      <div style={{ color: INK, fontSize: 12 }}>{g.name}</div>
                      <div style={{ color: GOLD, fontSize: 10, opacity: 0.6 }}>{g.seat}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section ref={el => sections.current["story"] = el} style={{
        padding: "80px 24px",
        background: `linear-gradient(to bottom, #FFF3EB, ${DEEP})`,
        maxWidth: 800, margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: GOLD, opacity: 0.6, marginBottom: 12 }}>A LOVE STORY</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, fontStyle: "italic",
            color: INK, margin: "0 0 16px",
          }}>Our Journey</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
            <span style={{ color: GOLD }}>✦</span>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
          </div>
        </div>

        {[
          { year: "2019", title: "The First Meeting", desc: "Fate brought two strangers together at a rainy evening gallery opening in Colombo. A shared umbrella and a shared laugh became the beginning of everything.", icon: "✨" },
          { year: "2021", title: "Adventures Together", desc: "From cobblestone streets in Lisbon to sunrise hikes in the highlands, every adventure deepened our love and built a treasure trove of shared memories.", icon: "🗺️" },
          { year: "2023", title: "The Proposal", desc: "Under a canopy of stars at their favourite seaside restaurant, Alexander got down on one knee. Through happy tears, Sophia said yes.", icon: "💍" },
          { year: "2026", title: "Forever Begins Today", desc: "Today, surrounded by everyone who has loved and supported us, we make our promise to each other — for all of time.", icon: "♥" },
        ].map((item, i) => (
          <div key={i} className="story-row" style={{
            display: "flex", gap: 24, marginBottom: 40, alignItems: "flex-start",
          }}>
            <div className="story-year" style={{ textAlign: "right", width: 80, flexShrink: 0, paddingTop: 4 }}>
              <div style={{ color: GOLD, fontSize: 13, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{item.year}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `radial-gradient(circle, ${GOLD_DARK}40, transparent)`,
                border: `1px solid ${GOLD}60`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ width: 1, flex: 1, background: `linear-gradient(to bottom, ${GOLD}40, transparent)`, marginTop: 8 }} />
            </div>
            <div style={{ flex: 1, paddingBottom: 32 }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: INK, fontSize: 20, fontWeight: 400, margin: "0 0 8px",
              }}>{item.title}</h3>
              <p style={{ color: INK, opacity: 0.78, fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── TIMELINE ── */}
      <section ref={el => sections.current["timeline"] = el} style={{
        padding: "80px 24px",
        background: `radial-gradient(ellipse at 50% 0%, #FFF2E6 0%, ${DEEP} 60%)`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 800, margin: "0 auto 48px" }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: GOLD, opacity: 0.6, marginBottom: 12 }}>17 MAY 2026</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, fontStyle: "italic",
            color: INK, margin: "0 0 16px",
          }}>Day of Celebration</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
            <span style={{ color: GOLD }}>✦</span>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
          </div>
        </div>

        <div className="timeline-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16, maxWidth: 1000, margin: "0 auto",
        }}>
          {TIMELINE.map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,247,240,0.6)", border: `1px solid ${GOLD_DARK}30`,
              borderRadius: 12, padding: "20px 24px",
              borderTop: `2px solid ${GOLD}40`,
              transition: "border-color 0.3s, transform 0.3s",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ color: GOLD, fontSize: 12, fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 6 }}>
                {item.time}
              </div>
              <div style={{ color: INK, fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
                {item.event}
              </div>
            </div>
          ))}
        </div>

        {/* Venue info */}
        <div style={{
          maxWidth: 700, margin: "48px auto 0",
          background: "rgba(255,247,240,0.6)", border: `1px solid ${GOLD_DARK}40`,
          borderRadius: 16, padding: 32, textAlign: "center",
        }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>📍</div>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: INK, fontSize: 24, fontWeight: 300, margin: "0 0 8px",
          }}>Balmoral Estate</h3>
          <p style={{ color: INK, opacity: 0.75, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
            42 Galle Face Terrace, Colombo 03, Sri Lanka
          </p>
          <div className="venue-stack" style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Dress Code", value: "Black Tie Optional" },
              { label: "Parking", value: "Complimentary Valet" },
              { label: "Contact", value: "+94 77 123 4567" },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ color: GOLD, fontSize: 9, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ color: INK, fontSize: 12, opacity: 0.8 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WISHES ── */}
      <section ref={el => sections.current["wishes"] = el} style={{
        padding: "80px 24px",
        background: `linear-gradient(to bottom, ${DEEP}, #FFF3EB)`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: GOLD, opacity: 0.6, marginBottom: 12 }}>SHARE YOUR LOVE</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, fontStyle: "italic",
            color: INK, margin: "0 0 16px",
          }}>Wishes & Messages</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
            <span style={{ color: GOLD }}>✦</span>
            <div style={{ width: 40, height: 1, background: GOLD_DARK }} />
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Submit form */}
          <div className="wishes-card" style={{
            background: "rgba(255,247,240,0.8)", border: `1px solid ${GOLD_DARK}`,
            borderRadius: 16, padding: 28, marginBottom: 32,
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              color: INK, fontSize: 18, fontWeight: 300, margin: "0 0 20px",
            }}>Leave Your Wishes</h3>
            <input
              type="text" placeholder="Your name..."
              value={wishName} onChange={e => setWishName(e.target.value)}
              style={{
                width: "100%", padding: "12px 14px", marginBottom: 12,
                background: "rgba(255,253,250,0.8)", border: `1px solid ${GOLD_DARK}`,
                borderRadius: 8, color: INK, fontSize: 13, fontFamily: "Georgia, serif",
              }}
            />
            <textarea
              placeholder="Write your heartfelt wishes for the couple..."
              value={wishText} onChange={e => setWishText(e.target.value)}
              rows={4}
              style={{
                width: "100%", padding: "12px 14px", marginBottom: 16,
                background: "rgba(255,253,250,0.8)", border: `1px solid ${GOLD_DARK}`,
                borderRadius: 8, color: INK, fontSize: 13, fontFamily: "Georgia, serif",
                resize: "vertical",
              }}
            />
            <button onClick={handleSendWish} className="wish-btn" style={{
              padding: "12px 32px",
              background: "transparent", border: `1px solid ${GOLD}`,
              color: GOLD, fontSize: 11, letterSpacing: 3,
              fontFamily: "Georgia, serif", cursor: "pointer", borderRadius: 4,
              transition: "all 0.3s",
            }}>
              {wishSent ? "✦ WISH SENT ✦" : "SEND WISHES"}
            </button>
          </div>

          {/* Wishes list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {wishes.map((wish, i) => (
              <div key={i} style={{
                background: "rgba(255,247,240,0.6)", border: `1px solid ${GOLD_DARK}30`,
                borderRadius: 12, padding: 20,
                borderLeft: `2px solid ${GOLD}50`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: INK, fontSize: 13, fontStyle: "italic" }}>{wish.name}</span>
                  <span style={{ color: GOLD, fontSize: 10, opacity: 0.6 }}>{wish.date}</span>
                </div>
                <p style={{
                  color: INK, fontSize: 13, opacity: 0.8, lineHeight: 1.7, margin: 0,
                  fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif",
                }}>
                  "{wish.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "48px 24px",
        background: "#FFFBF7",
        textAlign: "center",
        borderTop: `1px solid ${GOLD_DARK}30`,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32, fontWeight: 300, fontStyle: "italic",
          color: INK, marginBottom: 8, opacity: 0.85,
        }}>
          Kasuni & Inuka
        </div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: GOLD, opacity: 0.5, marginBottom: 20 }}>
          13 MAY 2026
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
          {["✦", "♥", "✦"].map((s, i) => (
            <span key={i} style={{ color: GOLD, opacity: 0.5, fontSize: 12 }}>{s}</span>
          ))}
        </div>
        <p style={{ color: INK, fontSize: 11, opacity: 0.6, margin: 0 }}>
          Made with love by Kasuni & Inuka. Please join us in celebrating our special day!
        </p>
      </footer>
    </div>
  );
}
