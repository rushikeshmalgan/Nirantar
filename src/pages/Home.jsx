import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-page-bg"></div>
      <div className="home-page-texture"></div>

      {/* Floating petals */}
      <div className="petals-container">
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
      </div>

      {/* Navigation */}
      <nav>
        <a href="#" className="logo">
          <svg className="logo-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="20" stroke="#D4A017" strokeWidth="1"/>
            <circle cx="22" cy="22" r="14" stroke="#F4831F" strokeWidth="0.5" strokeDasharray="3 2"/>
            <path d="M22 6 L24.5 14 L32 14 L26 18.5 L28.5 26.5 L22 22 L15.5 26.5 L18 18.5 L12 14 L19.5 14 Z" fill="#F4831F"/>
            <circle cx="22" cy="22" r="4" fill="#D4A017"/>
          </svg>
          <span className="logo-text">NIRANTAR<span>26</span></span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#events">Events</a></li>
          <li><button onClick={() => navigate('/admin')} style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(250,243,224,0.75)' }}>Admin</button></li>
          <li><button onClick={() => navigate('/register')} className="nav-cta">Register</button></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        {/* Corner ornaments */}
        <svg className="corner corner-tl" viewBox="0 0 60 60"><path d="M5 55 L5 5 L55 5" stroke="#D4A017" strokeWidth="0.8" fill="none" opacity="0.5"/><circle cx="5" cy="5" r="3" fill="#D4A017" opacity="0.6"/><path d="M10 20 L10 10 L20 10" stroke="#F4831F" strokeWidth="0.5" fill="none" opacity="0.4"/></svg>
        <svg className="corner corner-tr" viewBox="0 0 60 60"><path d="M5 55 L5 5 L55 5" stroke="#D4A017" strokeWidth="0.8" fill="none" opacity="0.5"/><circle cx="5" cy="5" r="3" fill="#D4A017" opacity="0.6"/><path d="M10 20 L10 10 L20 10" stroke="#F4831F" strokeWidth="0.5" fill="none" opacity="0.4"/></svg>
        <svg className="corner corner-bl" viewBox="0 0 60 60"><path d="M5 55 L5 5 L55 5" stroke="#D4A017" strokeWidth="0.8" fill="none" opacity="0.5"/><circle cx="5" cy="5" r="3" fill="#D4A017" opacity="0.6"/><path d="M10 20 L10 10 L20 10" stroke="#F4831F" strokeWidth="0.5" fill="none" opacity="0.4"/></svg>
        <svg className="corner corner-br" viewBox="0 0 60 60"><path d="M5 55 L5 5 L55 5" stroke="#D4A017" strokeWidth="0.8" fill="none" opacity="0.5"/><circle cx="5" cy="5" r="3" fill="#D4A017" opacity="0.6"/><path d="M10 20 L10 10 L20 10" stroke="#F4831F" strokeWidth="0.5" fill="none" opacity="0.4"/></svg>

        {/* Diya row */}
        <div className="diya-row">
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
          <div className="diya"><div className="flame"></div><div className="diya-body"></div></div>
        </div>

        <div className="event-badge">
          <span className="badge-dot"></span>
          Annual Cultural Celebration · 2026
        </div>

        <div className="hero-diya">
          <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="45" cy="28" rx="10" ry="14" fill="rgba(244,200,50,0.18)"/>
            <ellipse cx="45" cy="32" rx="4" ry="7" fill="#FFE066" opacity="0.95"/>
            <ellipse cx="45" cy="34" rx="2.5" ry="4.5" fill="white" opacity="0.7"/>
            <rect x="44" y="37" width="2" height="5" rx="1" fill="#8B6914"/>
            <path d="M28 44 Q30 56 45 58 Q60 56 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#C4521A"/>
            <path d="M28 44 Q35 42 45 42 Q55 42 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#D4A017"/>
            <path d="M60 44 Q66 42 68 46 Q65 50 60 48Z" fill="#C4521A"/>
            <ellipse cx="38" cy="44" rx="4" ry="1.5" fill="rgba(255,255,255,0.18)" transform="rotate(-10,38,44)"/>
          </svg>
        </div>

        <h1 className="hero-headline">
          <span className="headline-line1">NIRANTAR</span>
          <span className="headline-line2"><span>✦</span> निरंतर <span>✦</span></span>
        </h1>

        <div className="rangoli-divider">
          <div className="rangoli-line"></div>
          <span className="rangoli-motif">✦ ❋ ✦</span>
          <div className="rangoli-line right"></div>
        </div>

        <p className="hero-sub">
          A celebration of tradition, rhythm, and colours — where ancient art meets joyful chaos. 
          Dance, music, food, and festivity woven into one timeless evening.
        </p>

        <div className="cta-group">
          <button onClick={() => navigate('/register')} className="btn-primary">
            🪔 Get Your Pass
          </button>
          <a href="#events" className="btn-secondary">
            Explore Events →
          </a>
        </div>

        <div className="scroll-hint">
          <div className="scroll-dot"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Toran / Garland decoration */}
      <div className="toran-bar">
        <svg className="toran-svg" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B1A1A"/>
              <stop offset="100%" stopColor="#4A1010"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="80" fill="url(#bg-grad)"/>
          <line x1="0" y1="12" x2="1440" y2="12" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
          <g fill="none">
            <polygon points="40,12 55,45 25,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="100,12 115,45 85,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="160,12 175,45 145,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="220,12 235,45 205,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="280,12 295,45 265,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="340,12 355,45 325,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="400,12 415,45 385,45" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="460,12 475,45 445,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="520,12 535,45 505,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="580,12 595,45 565,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="640,12 655,45 625,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="700,12 715,45 685,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="760,12 775,45 745,45" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="820,12 835,45 805,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="880,12 895,45 865,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="940,12 955,45 925,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="1000,12 1015,45 985,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="1060,12 1075,45 1045,45" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="1120,12 1135,45 1105,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="1180,12 1195,45 1165,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="1240,12 1255,45 1225,45" fill="#D4A017" opacity="0.9"/>
            <polygon points="1300,12 1315,45 1285,45" fill="#C0392B" opacity="0.9"/>
            <polygon points="1360,12 1375,45 1345,45" fill="#F4831F" opacity="0.9"/>
            <polygon points="1420,12 1435,45 1405,45" fill="#D4A017" opacity="0.9"/>
            
            <circle cx="70" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="130" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="190" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="250" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="310" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="370" cy="50" r="8" fill="#1A4A2E" opacity="0.8"/>
            <circle cx="430" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="490" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="550" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="610" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="670" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="730" cy="50" r="8" fill="#1A4A2E" opacity="0.8"/>
            <circle cx="790" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="850" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="910" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="970" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="1030" cy="50" r="8" fill="#1A4A2E" opacity="0.8"/>
            <circle cx="1090" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="1150" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="1210" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
            <circle cx="1270" cy="50" r="8" fill="#C0392B" opacity="0.8"/>
            <circle cx="1330" cy="50" r="8" fill="#F4831F" opacity="0.8"/>
            <circle cx="1390" cy="50" r="8" fill="#D4A017" opacity="0.8"/>
          </g>
        </svg>
      </div>

      {/* Info Band */}
      <div className="info-band">
        <div className="info-inner">
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-label">Date</span>
            <span className="info-value">08th April 2026</span>
          </div>
          <div className="info-item" style={{ borderRight: 'none' }}>
            <span className="info-icon">📍</span>
            <span className="info-label">Venue</span>
            <span className="info-value">Old Seminar Hall (ViMEET)</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-text">
          <span className="section-tag">✦ Our Story</span>
          <h2>Where tradition <em>dances</em> with joy</h2>
          <p>
            Nirantar — meaning "continuous" or "eternal" — is more than a fest. It's a living thread that ties generations together through music, art, laughter, and the shared memory of our roots.
          </p>
          <p>
            From the soulful beats of dhol to the vibrant sprinkle of colours, from classical Kathak to boisterous dumb charades — Nirantar is a canvas of celebration painted by everyone who shows up.
          </p>
          <a href="#events" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Explore the Lineup →</a>
        </div>

        {/* Animated Mandala */}
        <div className="mandala-art">
          <div className="mandala-glow"></div>
          <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
            <g style={{ transformOrigin: '140px 140px', animation: 'spinSlow 40s linear infinite' }}>
              <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4"/>
              <g fill="#F4831F" opacity="0.6">
                <polygon points="140,8 143,18 137,18" transform="rotate(0, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(30, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(60, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(90, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(120, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(150, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(180, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(210, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(240, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(270, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(300, 140, 140)"/>
                <polygon points="140,8 143,18 137,18" transform="rotate(330, 140, 140)"/>
              </g>
            </g>
            <g style={{ transformOrigin: '140px 140px', animation: 'spin 20s linear infinite' }}>
              <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5" opacity="0.35"/>
              <g fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.5">
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(0, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(45, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(90, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(135, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(180, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(225, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(270, 140, 140)"/>
                <ellipse cx="140" cy="44" rx="8" ry="14" transform="rotate(315, 140, 140)"/>
              </g>
            </g>
            <g style={{ transformOrigin: '140px 140px', animation: 'spinSlow 15s linear infinite reverse' }}>
              <circle cx="140" cy="140" r="60" fill="rgba(244,131,31,0.06)" stroke="#F4831F" strokeWidth="0.5" opacity="0.5"/>
              <g fill="#C0392B" opacity="0.5">
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(0, 140, 140)"/>
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(60, 140, 140)"/>
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(120, 140, 140)"/>
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(180, 140, 140)"/>
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(240, 140, 140)"/>
                <ellipse cx="140" cy="88" rx="7" ry="16" transform="rotate(300, 140, 140)"/>
              </g>
            </g>
            <circle cx="140" cy="140" r="22" fill="rgba(244,131,31,0.15)" stroke="#F4831F" strokeWidth="1" opacity="0.7"/>
            <circle cx="140" cy="140" r="10" fill="#F4831F" opacity="0.8"/>
            <circle cx="140" cy="140" r="4" fill="#D4A017"/>
          </svg>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-header">
          <span className="section-tag">✦ What's On</span>
          <h2>A <em>lineup</em> of festivities</h2>
        </div>

        <div className="events-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="event-card">
            <h3>Powada</h3>
            <p>A rousing ballad tradition — performers narrate tales of valour, history, and pride through this powerful Marathi art form.</p>
          </div>
          <div className="event-card">
            <h3>Traditional Ramp Walk</h3>
            <p>Tradition meets style — participants showcase traditional attire with grace, confidence, and a walk that commands the stage.</p>
          </div>
          <div className="event-card">
            <h3>Solo/Group Performances</h3>
            <p>From synchronised group acts to solo spotlights — dance, music, and expression take centre stage in every form.</p>
          </div>
          <div className="event-card">
            <h3>Fun Activities</h3>
            <p>Games, challenges, and interactive moments — something lively around every corner to keep the energy high.</p>
          </div>
          <div className="event-card" style={{ gridColumn: '3' }}>
            <h3>Surprise Awaits</h3>
            <p>We're keeping this one close to our chest. Show up, and let the moment unfold.</p>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="register-section">
        <h2>Join the <span>celebration</span></h2>
        <p>Secure your spot at Nirantar 2026 — passes go fast and each one comes with more than entry.</p>
        <div className="cta-group" style={{ justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} className="btn-primary">🪷 Get VIP Pass</button>
          <button onClick={() => navigate('/login')} className="btn-secondary">🔑 My Invite</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© Nirantar 2026 — An Eternal Celebration</p>
        <span className="footer-motif">✦ ❋ ✦ ❋ ✦</span>
        <p>Made with 🪔 by the COMPS Dept.</p>
      </footer>
    </div>
  );
}

export default Home;