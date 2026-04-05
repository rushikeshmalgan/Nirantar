import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import './Login.css';

function Login() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForSignal, setWaitingForSignal] = useState(false);
  const [unsubscribeFn, setUnsubscribeFn] = useState(null);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const addToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      addToast("Please enter a valid 10-digit number", 'error');
      return;
    }

    setIsLoading(true);
    try {
      const q = query(collection(db, "registrations"), where("phone", "==", phone));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setIsLoading(false);
        if (snapshot.empty) {
          addToast("Number not found. Grab your pass first!", 'error');
          unsubscribe();
          setWaitingForSignal(false);
        } else {
          const userData = snapshot.docs[0].data();
          if (userData.status === 'verified' || userData.verified) {
            setWaitingForSignal(false);
            unsubscribe();
            addToast("Pass Confirmed! Entering the celebration...", 'success');
            setTimeout(() => navigate('/invite', { state: { user: userData } }), 1000);
          } else {
            setWaitingForSignal(true);
          }
        }
      }, (error) => {
        console.error(error);
        setIsLoading(false);
        setWaitingForSignal(false);
        addToast("Connection failed. Please try again.", 'error');
      });

      setUnsubscribeFn(() => unsubscribe);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setWaitingForSignal(false);
      addToast("Login error. Please try again.", 'error');
    }
  };

  const handleAbort = () => {
    if (unsubscribeFn) {
      unsubscribeFn();
    }
    setWaitingForSignal(false);
    setIsLoading(false);
  };

  if (waitingForSignal) {
    return (
      <div className="login-page">
        <div className="login-page-bg"></div>
        <div className="login-page-texture"></div>
        
        {/* Mandala BG decorations */}
        <svg className="mandala-bg left" width="320" height="320" viewBox="0 0 280 280">
          <g opacity="1">
            <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4"/>
            <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5"/>
            <circle cx="140" cy="140" r="60" fill="none" stroke="#F4831F" strokeWidth="0.5"/>
            <circle cx="140" cy="140" r="10" fill="#F4831F"/>
            <circle cx="140" cy="140" r="4" fill="#D4A017"/>
          </g>
        </svg>

        {/* Floating petals */}
        <div className="petals-container">
          <div className="petal"></div><div className="petal"></div><div className="petal"></div>
          <div className="petal"></div><div className="petal"></div><div className="petal"></div>
        </div>

        <nav>
          <button onClick={() => navigate('/')} className="logo">
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke="#D4A017" strokeWidth="1"/>
              <path d="M22 6L24.5 14L32 14L26 18.5L28.5 26.5L22 22L15.5 26.5L18 18.5L12 14L19.5 14Z" fill="#F4831F"/>
              <circle cx="22" cy="22" r="4" fill="#D4A017"/>
            </svg>
            <span className="logo-text">NIRANTAR<span>26</span></span>
          </button>
        </nav>

        <div className="page-wrapper" style={{ justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="login-card"
            style={{ textAlign: 'center', alignItems: 'center' }}
          >
            <div className="login-diya-icon">
              <svg width="80" height="80" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="45" cy="26" rx="11" ry="16" fill="rgba(244,200,50,0.15)"/>
                <ellipse cx="45" cy="31" rx="4.5" ry="8"  fill="#FFE066" opacity="0.95"/>
                <ellipse cx="45" cy="33" rx="2.8" ry="5"  fill="white"   opacity="0.7"/>
                <rect x="43.5" y="38" width="2.5" height="5" rx="1" fill="#8B6914"/>
                <path d="M28 44 Q30 57 45 59 Q60 57 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#C4521A"/>
                <path d="M28 44 Q35 42 45 42 Q55 42 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#D4A017"/>
                <path d="M60 44 Q67 42 69 47 Q66 51 60 48Z" fill="#C4521A"/>
                <ellipse cx="38" cy="44" rx="4" ry="1.5" fill="rgba(255,255,255,0.18)" transform="rotate(-10,38,44)"/>
              </svg>
            </div>
            
            <h2 className="login-title" style={{ fontSize: '1.8rem', padding: '0 1rem' }}>VERIFICATION <br/> <span>PENDING</span></h2>
            
            <p style={{ fontSize: '0.88rem', color: 'rgba(250,243,224,0.6)', lineHeight: '1.7', marginTop: '1rem', fontStyle: 'italic' }}>
              We are verifying your payment and pass details.<br/>
              Please wait while the COMPS team approves it!
            </p>

            <button
              onClick={handleAbort}
              style={{
                marginTop: '1.5rem',
                background: 'transparent',
                border: '1px solid rgba(250,243,224,0.3)',
                color: 'var(--turmeric)',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.8rem 1.6rem',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Cancel Request
            </button>
          </motion.div>
        </div>

        {/* Toasts */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence>
            {toasts.map(toast => (
              <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(x => x.id !== toast.id))} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-page-bg"></div>
      <div className="login-page-texture"></div>

      {/* Floating petals */}
      <div className="petals-container">
        <div className="petal"></div><div className="petal"></div><div className="petal"></div>
        <div className="petal"></div><div className="petal"></div><div className="petal"></div>
      </div>

      {/* Mandala BG decorations */}
      <svg className="mandala-bg left" width="320" height="320" viewBox="0 0 280 280">
        <g opacity="1">
          <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4"/>
          <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="60" fill="none" stroke="#F4831F" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="10" fill="#F4831F"/>
          <circle cx="140" cy="140" r="4" fill="#D4A017"/>
        </g>
      </svg>
      <svg className="mandala-bg right" width="320" height="320" viewBox="0 0 280 280">
        <g opacity="1">
          <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4"/>
          <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="60" fill="none" stroke="#F4831F" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="10" fill="#F4831F"/>
          <circle cx="140" cy="140" r="4" fill="#D4A017"/>
        </g>
      </svg>

      {/* Nav */}
      <nav>
        <button onClick={() => navigate('/')} className="logo">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="#D4A017" strokeWidth="1"/>
            <path d="M22 6L24.5 14L32 14L26 18.5L28.5 26.5L22 22L15.5 26.5L18 18.5L12 14L19.5 14Z" fill="#F4831F"/>
            <circle cx="22" cy="22" r="4" fill="#D4A017"/>
          </svg>
          <span className="logo-text">NIRANTAR<span>26</span></span>
        </button>
        <button onClick={() => navigate('/')} className="nav-back">← Back to Home</button>
      </nav>

      {/* Toran garland */}
      <div className="toran-bar" style={{ marginTop: '60px' }}>
        <svg className="toran-svg" viewBox="0 0 1440 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="t-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B1A1A"/>
              <stop offset="100%" stopColor="#4A1010"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="70" fill="url(#t-grad)"/>
          <line x1="0" y1="10" x2="1440" y2="10" stroke="#D4A017" strokeWidth="1" opacity="0.5"/>
          <g fill="none">
            <polygon points="40,10 55,40 25,40"  fill="#C0392B" opacity="0.9"/>
            <polygon points="100,10 115,40 85,40"  fill="#F4831F" opacity="0.9"/>
            <polygon points="160,10 175,40 145,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="220,10 235,40 205,40" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="280,10 295,40 265,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="340,10 355,40 325,40" fill="#F4831F" opacity="0.9"/>
            <polygon points="400,10 415,40 385,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="460,10 475,40 445,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="520,10 535,40 505,40" fill="#F4831F" opacity="0.9"/>
            <polygon points="580,10 595,40 565,40" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="640,10 655,40 625,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="700,10 715,40 685,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="760,10 775,40 745,40" fill="#F4831F" opacity="0.9"/>
            <circle cx="70"   cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="130"  cy="46" r="7" fill="#D4A017" opacity="0.85"/>
            <circle cx="190"  cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="250"  cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="310"  cy="46" r="7" fill="#1A4A2E" opacity="0.85"/>
            <circle cx="370"  cy="46" r="7" fill="#D4A017" opacity="0.85"/>
            <circle cx="430"  cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="490"  cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="550"  cy="46" r="7" fill="#D4A017" opacity="0.85"/>
            <circle cx="610"  cy="46" r="7" fill="#1A4A2E" opacity="0.85"/>
            <circle cx="670"  cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="730"  cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="790"  cy="46" r="7" fill="#D4A017" opacity="0.85"/>
          </g>
        </svg>
      </div>

      {/* Page content */}
      <div className="page-wrapper">

        <div className="login-header">
          <div className="login-diya-icon">
            <svg width="80" height="80" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="45" cy="26" rx="11" ry="16" fill="rgba(244,200,50,0.15)"/>
              <ellipse cx="45" cy="31" rx="4.5" ry="8"  fill="#FFE066" opacity="0.95"/>
              <ellipse cx="45" cy="33" rx="2.8" ry="5"  fill="white"   opacity="0.7"/>
              <rect x="43.5" y="38" width="2.5" height="5" rx="1" fill="#8B6914"/>
              <path d="M28 44 Q30 57 45 59 Q60 57 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#C4521A"/>
              <path d="M28 44 Q35 42 45 42 Q55 42 62 44 Q55 48 45 48 Q35 48 28 44Z" fill="#D4A017"/>
              <path d="M60 44 Q67 42 69 47 Q66 51 60 48Z" fill="#C4521A"/>
              <ellipse cx="38" cy="44" rx="4" ry="1.5" fill="rgba(255,255,255,0.18)" transform="rotate(-10,38,44)"/>
            </svg>
          </div>
          <h1 className="login-title">CHECK <span>VIP</span> STATUS</h1>
          <p className="login-subtitle">Enter your registered WhatsApp number</p>
        </div>

        <form onSubmit={handleLogin} className="login-card">
          <div className="login-field">
            <span className="login-field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
            </span>
            <input 
              type="tel" 
              placeholder="WhatsApp Number (10 Digits)" 
              className="login-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-submit-btn">
            {isLoading ? 'VERIFYING...' : 'VIEW MY INVITE 🪔'}
          </button>

          <p className="link-text">
            Don't have a pass? <span onClick={() => navigate('/register')}>Get Yours Now →</span>
          </p>
        </form>

      </div>

      <footer className="login-footer">
        <span className="motif">✦ ❋ ✦ ❋ ✦</span>
        <p>COMPS DEPT · FRESHERS 2026</p>
      </footer>

      {/* Toasts */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(x => x.id !== toast.id))} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default Login;