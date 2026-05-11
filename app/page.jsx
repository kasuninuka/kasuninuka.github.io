"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GUESTS from "./guests.json";

// ── Palette & fonts ────────────────────────────────────────────────
const GOLD = "#B58A5A";
const GOLD_LIGHT = "#5B4332";
const GOLD_DARK = "#9C7A58";
const CREAM = "#FFFBF7";
const DEEP = "#FFFFFF";
const CHAMPAGNE = "#3F2F23";
const BLUSH = "#F8E9E4";
const INK = "#3B2A1E";
const MAP_GREEN = "#F4E5D6";
const MAP_GREEN_DARK = "#E8D1BF";
const MAP_TEXT = "#3B2A1E";
const MAP_OUTLINE = "#9C7A58";

const GALLERY = [
  { src: "/gallery1.jpg",     year: "2026", caption: "Forever begins" },
  { src: "/start1.jpeg",      year: "2020", caption: "The first meeting" },
  { src: "/adventure1.jpeg",  year: "2021", caption: "Adventures together" },
  { src: "/gallery2.jpg",     year: "2026", caption: "Two souls, one love" },
  { src: "/adventure2.jpeg",  year: "2021", caption: "Adventures together" },
  { src: "/start2.jpeg",      year: "2020", caption: "The first meeting" },
  { src: "/proposal1.jpeg",   year: "2026", caption: "The proposal" },
  { src: "/adventure3.jpeg",  year: "2021", caption: "Adventures together" },
];

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

  { id: "T17", x: 180, y: 590, label: "17" },
  { id: "T18", x: 340, y: 590, label: "18" },
  { id: "T19", x: 490, y: 590, label: "19" },
  { id: "T29", x: 650, y: 590, label: "29" },

  { id: "T13", x: 140, y: 680, label: "13" },
  { id: "T14", x: 220, y: 680, label: "14" },
  { id: "T15", x: 300, y: 680, label: "15" },
  { id: "T16", x: 380, y: 680, label: "16" },

  { id: "T20", x: 380, y: 770, label: "20" },

  { id: "T21", x: 450, y: 410, label: "21" },
  { id: "T22", x: 530, y: 410, label: "22" },
  { id: "T23", x: 610, y: 410, label: "23" },
  { id: "T24", x: 690, y: 410, label: "24" },

  { id: "T25", x: 450, y: 500, label: "25" },
  { id: "T26", x: 530, y: 500, label: "26" },
  { id: "T27", x: 610, y: 500, label: "27" },
  { id: "T28", x: 690, y: 500, label: "28" },

  { id: "T30", x: 450, y: 680, label: "30" },
  { id: "T31", x: 570, y: 680, label: "31" },
  { id: "T32", x: 690, y: 680, label: "32" },
];

const PILLARS = [];

// ── Timeline data ──────────────────────────────────────────────────
const TIMELINE = [
  { time: "8:30 AM", event: "Guest Arrival & Welcome", icon: "🥂" },
  { time: "9:00 AM", event: "Poruwa Ceremony", icon: "💍" },
  { time: "10:00 AM", event: "Signing of the Register", icon: "✍️" },
  // { time: "10:30 AM", event: "Photography & Group Photos", icon: "📸" },
  // { time: "11:00 AM", event: "Reception & Brunch", icon: "🍽️" },
  // { time: "12:30 PM", event: "Cake Cutting & Toasts", icon: "🎂" },
  // { time: "1:00 PM", event: "First Dance & Celebration", icon: "🎶" },
  // { time: "2:00 PM", event: "Farewell & Send-Off", icon: "✨" },
];

// ── Fuzzy search ───────────────────────────────────────────────────
function fuzzySearch(query, items) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return items
    .filter(g => g.name.toLowerCase().includes(q) || (g.surname || "").toLowerCase().includes(q))
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
        const scale = 2.35;
        const viewBoxWidth = 800;
        const viewBoxHeight = 900;
        const xRatio = svgW / viewBoxWidth;
        const yRatio = svgH / viewBoxHeight;
        const tableCenterX = (t.x + 26) * xRatio;
        const tableCenterY = (t.y + 26) * yRatio;
        setTransform({
          x: svgW / 2 - tableCenterX * scale,
          y: svgH / 2 - tableCenterY * scale,
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
        @keyframes selectedRingBreathe {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.75; }
        }
        @keyframes selectedHaloBreathe {
          0%, 100% { opacity: 0.10; }
          50%      { opacity: 0.22; }
        }
        @keyframes selectedTableGlow {
          0%, 100% { filter: drop-shadow(0 0 2px ${GOLD}40); }
          50%      { filter: drop-shadow(0 0 8px ${GOLD}90); }
        }
        @keyframes selectedTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%      { opacity: 1; transform: scale(1); }
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
            <stop offset="100%" stopColor="#FFF7F0" />
          </radialGradient>
        </defs>

        {/* Hall floor */}
        <rect x="60" y="60" width="710" height="780" rx="16" fill="url(#hallGrad)" stroke={GOLD_DARK} strokeWidth="1" />

        {/* Title */}
        <text x="400" y="48" textAnchor="middle" fill={INK} fontSize="22" fontFamily="Georgia, serif" letterSpacing="3">
          TABLE PLAN
        </text>

        {/* Service areas */}
        <text x="85" y="85" fill={INK} fontSize="10" fontFamily="Georgia, serif">Service area</text>
        <text x="650" y="85" fill={INK} fontSize="10" fontFamily="Georgia, serif">Service area</text>

        {/* Settee back */}
        <rect x="250" y="90" width="300" height="60" fill={BLUSH} stroke={GOLD_DARK} strokeWidth="1" />
        <text x="400" y="125" textAnchor="middle" fill={INK} fontSize="16" fontFamily="Georgia, serif">Settee Back</text>

        {/* Poruwa */}
        <g transform="rotate(-20 140 165)">
          <rect x="90" y="130" width="100" height="70" fill={BLUSH} stroke={GOLD_DARK} strokeWidth="1" />
          <text x="140" y="170" textAnchor="middle" fill={INK} fontSize="12" fontFamily="Georgia, serif">Poruwa</text>
        </g>

        {/* S and B circles */}
        <circle cx="600" cy="120" r="26" fill={CREAM} stroke={GOLD_DARK} strokeWidth="1" />
        <circle cx="680" cy="120" r="26" fill={CREAM} stroke={GOLD_DARK} strokeWidth="1" />
        <text x="600" y="127" textAnchor="middle" fill={INK} fontSize="14" fontFamily="Georgia, serif">S</text>
        <text x="680" y="127" textAnchor="middle" fill={INK} fontSize="14" fontFamily="Georgia, serif">B</text>

        {/* Dance floor */}
        <rect x="520" y="180" width="110" height="150" fill={BLUSH} stroke={GOLD_DARK} strokeWidth="1" />
        <text x="525" y="270" textAnchor="middle" fill={INK} fontSize="12" fontFamily="Georgia, serif" transform="rotate(90 555 285)">
          DANCE FLOOR
        </text>

        {/* Band */}
        <rect x="650" y="180" width="60" height="150" fill={CREAM} stroke={GOLD_DARK} strokeWidth="1" />
        <text x="675" y="215" textAnchor="middle" fill={INK} fontSize="11" fontFamily="Georgia, serif" transform="rotate(90 655 235)">
          Band
        </text>

        {/* Pillars */}
        {PILLARS.map(pillar => (
          <circle key={pillar.id} cx={pillar.x} cy={pillar.y} r="18" fill="#FFFDFB" stroke={GOLD_DARK} strokeWidth="1" />
        ))}

        {/* Bar */}
        <rect x="520" y="770" width="160" height="40" fill={BLUSH} stroke={GOLD_DARK} strokeWidth="1" />
        <text x="600" y="795" textAnchor="middle" fill={INK} fontSize="14" fontFamily="Georgia, serif">Bar</text>
        {[540, 570, 600, 630].map((x, i) => (
          <g key={i} transform={`translate(${x}, 740)`}>
            <polygon points="0,0 10,0 5,12" fill={GOLD_LIGHT} stroke={GOLD_DARK} strokeWidth="0.6" />
            <polygon points="0,24 10,24 5,12" fill={GOLD_LIGHT} stroke={GOLD_DARK} strokeWidth="0.6" />
          </g>
        ))}

        {/* Entrance labels */}
        {/* <text x="400" y="830" textAnchor="middle" fill={INK} fontSize="12" fontFamily="Georgia, serif">ENTRANCE</text>
        <text x="90" y="830" textAnchor="middle" fill={INK} fontSize="9" fontFamily="Georgia, serif" transform="rotate(-90 90 830)">
          ENTRANCE TO RED GARDEN
        </text> */}

        {/* Tables */}
        {TABLES.map(table => {
          const isSelected = table.id === selectedTable;

          return (
          <g
            key={table.id}
            onClick={() => onTableClick(table.id)}
            style={{ cursor: "pointer" }}
            transform={`translate(${table.x}, ${table.y})`}
          >
            {isSelected && (
              <>
                {/* Soft static halo, breathes opacity only */}
                <circle
                  r="32" fill={GOLD}
                  style={{
                    filter: "blur(8px)",
                    animation: "selectedHaloBreathe 2.6s ease-in-out infinite",
                  }}
                />
                {/* Thin gold ring just outside the table — holds position, breathes */}
                <circle
                  r="27" fill="none" stroke={GOLD} strokeWidth="1"
                  style={{ animation: "selectedRingBreathe 2.6s ease-in-out infinite" }}
                />
              </>
            )}
            <circle
              r="22"
              fill={isSelected ? BLUSH : CREAM}
              stroke={isSelected ? GOLD : GOLD_DARK}
              strokeWidth={isSelected ? 2 : 1}
              style={isSelected ? {
                animation: "selectedTableGlow 2.6s ease-in-out infinite",
                transformOrigin: "center",
              } : undefined}
            />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill={MAP_TEXT}
              fontSize="12" fontFamily="Georgia, serif" fontWeight={isSelected ? "700" : "600"}>
              {table.label}
            </text>
            {isSelected && (
              <text
                x="0" y="-30" textAnchor="middle" dominantBaseline="central"
                fill={GOLD} fontSize="9"
                style={{ animation: "selectedTwinkle 2.6s ease-in-out infinite" }}
              >✦</text>
            )}
          </g>
        );
        })}

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
    `Welcome to our celebration, ${guest.name}! Your presence makes this day even more special.`,
    `So glad you could join us, ${guest.name}! Here's to an unforgettable evening together.`,
    `${guest.name}, thank you for being part of our love story. We're so happy you're here!`,
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
      </div>

      {/* Details */}
      <div style={{
        background: "rgba(201,168,76,0.08)", border: `1px solid ${GOLD_DARK}40`,
        borderRadius: 10, padding: 14, marginBottom: 14,
      }}>
        {[
          { label: "Table", value: guest.table },
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
          — Kasuni & Inuka
        </p>
      </div>
    </div>
  );
}

function Gallery({ items }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const tiles = root.querySelectorAll(".gallery-tile");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    tiles.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [items]);

  return (
    <div ref={containerRef} className="gallery-mason">
      {items.map((it, i) => (
        <figure
          key={it.src}
          className="gallery-tile"
          style={{ transitionDelay: `${(i % 6) * 90}ms` }}
        >
          <div className="gallery-frame">
            <img src={it.src} alt={it.caption || ""} loading="lazy" />
          </div>
        </figure>
      ))}
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

  const navItems = [
    { id: "hero", label: "Welcome" },
    { id: "finder", label: "Find My Table" },
    { id: "story", label: "Our Story" },
    { id: "timeline", label: "Schedule" },
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
        @keyframes pulsePin { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181,138,90,0.55); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(181,138,90,0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181,138,90,0); } }
        .nav-link { transition: color 0.3s, opacity 0.3s; }
        .nav-link:hover { color: ${GOLD} !important; opacity: 1 !important; }
        .search-input:focus { outline: none; border-color: ${GOLD} !important; box-shadow: 0 0 20px ${GOLD}20 !important; }
        .result-item:hover { background: rgba(181,138,90,0.12) !important; }
        .cta-btn:hover { background: ${GOLD} !important; color: ${INK} !important; transform: scale(1.02); }
        .table-row:hover { background: rgba(181,138,90,0.07) !important; }
        .nav-bar { gap: 16px; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links button { white-space: nowrap; }
        .finder-grid { display: grid; }
        .hero-date { text-align: center; }
        .gallery-mason {
          column-count: 3;
          column-gap: 18px;
        }
        .gallery-tile {
          position: relative;
          break-inside: avoid;
          margin: 0 0 18px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid ${GOLD_DARK}30;
          box-shadow: 0 14px 28px rgba(91,67,50,0.08), 0 2px 6px rgba(91,67,50,0.04);
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.9s ease,
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.4s ease;
          cursor: zoom-in;
          background: #FFF7F0;
        }
        .gallery-tile.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .gallery-tile:hover {
          box-shadow: 0 22px 44px rgba(91,67,50,0.16), 0 4px 10px rgba(91,67,50,0.08);
        }
        .gallery-frame {
          overflow: hidden;
          line-height: 0;
        }
        .gallery-tile img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .gallery-tile:hover img { transform: scale(1.06); }
        @media (max-width: 900px) {
          .gallery-mason { column-count: 2; column-gap: 14px; }
          .gallery-tile { margin-bottom: 14px; }
        }
        @media (max-width: 520px) {
          .gallery-mason { column-count: 1; }
        }
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
          .nav-bar { flex-wrap: wrap; justify-content: center !important; padding: 8px 12px !important; }
          .nav-brand { width: 100%; text-align: center; }
          .nav-links { width: 100%; justify-content: center; flex-wrap: wrap; overflow-x: visible !important; gap: 6px 10px !important; }
          .nav-links button { font-size: 10px !important; letter-spacing: 1.2px !important; padding: 3px 4px !important; }
          .hero-section { padding: 90px 16px 72px !important; }
          .finder-section { padding: 72px 0 !important; }
          .timeline-grid { grid-template-columns: 1fr !important; }
          .venue-stack { gap: 16px !important; }
        }
        @media (max-width: 520px) {
          .map-shell { height: 340px !important; }
          .guest-card-wrap { width: 100% !important; }
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
        <div className="hero-date" style={{
          fontSize: 11, letterSpacing: 6, color: INK, opacity: 0.75,
          fontFamily: "Georgia, serif",
          animation: "fadeUp 1s 0.3s both",
          marginBottom: 20,
        }}>
          13 MAY 2026
          <br />
          BALMORAL BALLROOM
          <br />
          THE KINGSBURY HOTEL
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
          animation: "fadeUp 1s 1.5s both",
          boxShadow: `0 0 24px ${GOLD}25`,
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
        padding: "96px 0",
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
              boxShadow: `0 18px 48px rgba(91,67,50,0.14), 0 2px 8px rgba(91,67,50,0.06)`,
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
                      <div style={{ color: GOLD, fontSize: 10, opacity: 0.7 }}>Table {guest.table}</div>
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
                background: "rgba(255,253,250,0.92)",
                padding: "22px 32px",
                borderRadius: 12,
                border: `1px solid ${GOLD_DARK}40`,
                boxShadow: "0 12px 32px rgba(91,67,50,0.08)",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 1, background: GOLD_DARK, opacity: 0.6 }} />
                  <span style={{ color: GOLD, fontSize: 12, letterSpacing: 2 }}>✦</span>
                  <div style={{ width: 22, height: 1, background: GOLD_DARK, opacity: 0.6 }} />
                </div>
                <div style={{ color: INK, fontSize: 12, opacity: 0.78, fontFamily: "Georgia, serif", letterSpacing: 0.5 }}>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── OUR STORY (Gallery) ── */}
      <section ref={el => sections.current["story"] = el} style={{
        padding: "96px 24px",
        background: `linear-gradient(to bottom, #FFF3EB, ${DEEP})`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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

          <Gallery items={GALLERY} />
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section ref={el => sections.current["timeline"] = el} style={{
        padding: "96px 24px",
        background: `radial-gradient(ellipse at 50% 0%, #FFF2E6 0%, ${DEEP} 60%)`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 800, margin: "0 auto 48px" }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: GOLD, opacity: 0.6, marginBottom: 12 }}>13 MAY 2026</p>
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
          <a
            href="https://maps.app.goo.gl/qHFX7MpsLS4LnKWz8"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
            aria-label="Open pinned location in Google Maps"
            title="Open in Google Maps"
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${GOLD_DARK}`,
              color: GOLD,
              marginBottom: 16,
              background: "rgba(255,253,250,0.85)",
            }}>
              📍
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              color: INK, fontSize: 24, fontWeight: 300, margin: "0 0 8px",
            }}>Balmoral Ballroom, THE KINGSBURY HOTEL</h3>
          </a>
          <div style={{
            width: "100%",
            height: 260,
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid ${GOLD_DARK}40`,
            marginBottom: 18,
            background: "#fff",
          }}>
            <div style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,253,250,0.92)",
              border: `1px solid ${GOLD_DARK}`,
              color: INK,
              fontSize: 11,
              letterSpacing: 1.5,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              pointerEvents: "none",
            }}>
              <span style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: GOLD,
                animation: "pulsePin 1.8s infinite",
              }} />
              Pinned location
            </div>
            <iframe
              title="Balmoral Ballroom, THE KINGSBURY HOTEL Google Map"
              src="https://www.google.com/maps?q=6.93302329927967,79.84191913867275&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* <div className="venue-stack" style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
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
          </div> */}
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 56, height: 1, background: `linear-gradient(to right, transparent, ${GOLD_DARK})`, opacity: 0.7 }} />
          <span style={{ color: GOLD, opacity: 0.7, fontSize: 12, letterSpacing: 4 }}>✦</span>
          <div style={{ width: 56, height: 1, background: `linear-gradient(to left, transparent, ${GOLD_DARK})`, opacity: 0.7 }} />
        </div>
        {/* <p style={{ color: INK, fontSize: 11, opacity: 0.6, margin: 0 }}>
          Made with love by Kasuni & Inuka. Please join us in celebrating our special day!
        </p> */}
      </footer>
    </div>
  );
}
