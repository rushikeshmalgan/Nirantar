import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ── Confetti Piece ──────────────────────────────────────────────────────────
function ConfettiPiece({ delay, color, left, size }) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 1, x: 0, rotate: 0 }}
      animate={{ y: '110vh', opacity: 0, x: (Math.random() - 0.5) * 100, rotate: 720 }}
      transition={{ duration: 3.5 + Math.random() * 2, delay, ease: 'linear' }}
      className="fixed top-0 rounded-sm pointer-events-none z-50"
      style={{ left: `${left}%`, backgroundColor: color, width: size, height: size * 2 }}
    />
  );
}

// ── Dept config ─────────────────────────────────────────────────────────────
const DEPT_STYLES = {
  comps:      { gradient: 'from-blue-500 to-cyan-400',     label: 'COMPS'      },
  aiml:       { gradient: 'from-purple-500 to-pink-500',   label: 'AI & ML'    },
  extc:       { gradient: 'from-green-500 to-teal-400',    label: 'EXTC'       },
  mech:       { gradient: 'from-orange-500 to-red-500',    label: 'MECH'       },
  civil:      { gradient: 'from-yellow-400 to-amber-500',  label: 'CIVIL'      },
  electrical: { gradient: 'from-yellow-400 to-orange-500', label: 'ELECTRICAL' },
};

const CONFETTI_COLORS = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316', '#ffffff'];

// ── Component ────────────────────────────────────────────────────────────────
function Invite() {
  const location = useLocation();
  const navigate  = useNavigate();
  const user = location.state?.user;

  const [showConfetti, setShowConfetti] = useState(true);
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1.8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    size: 4 + Math.random() * 6,
  }));

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(t);
  }, []);

  /* ── Access Denied ─────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050507] p-4 overflow-hidden relative">
        <div className="fixed top-1/3 -left-20 w-96 h-96 bg-purple-700/15 blur-[120px] rounded-full aurora-orb pointer-events-none" />
        <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-pink-700/10 blur-[100px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '3s' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 glass rounded-[32px] p-10 text-center max-w-sm w-full border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.08)]"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/20 flex items-center justify-center text-3xl mx-auto mb-5">🔒</div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">ACCESS DENIED</h2>
          <p className="text-white/35 text-[10px] font-bold tracking-widest uppercase mb-7 leading-relaxed">
            You haven't registered or your pass isn't verified yet.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-pink-500/20 uppercase tracking-tight"
          >
            Check VIP Status →
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 mt-3 text-white/30 hover:text-white/60 text-[10px] uppercase tracking-widest font-bold transition-colors"
          >
            Register for the Party
          </button>
        </motion.div>
      </div>
    );
  }

  const dept = DEPT_STYLES[user.department] || { gradient: 'from-pink-500 to-purple-500', label: user.department?.toUpperCase() };

  /* ── Invite Card ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050507] overflow-hidden relative p-4 py-10">
      {/* Confetti */}
      {showConfetti && confetti.map(p => <ConfettiPiece key={p.id} {...p} />)}

      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full aurora-orb pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-pink-600/15 blur-[130px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {/* Holographic outer glow ring */}
        <div className="absolute -inset-[3px] bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-yellow-400 rounded-[44px] opacity-70 blur-md animate-pulse" />
        <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-[44px] opacity-50" />

        {/* Ticket card */}
        <div className="relative w-[320px] bg-gradient-to-b from-[#17131f] to-[#0b090f] rounded-[42px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]">

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10" />

          {/* ✦ Top header band */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/8 border-b border-yellow-500/15 px-8 pt-8 pb-5 text-center">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-yellow-400/90 font-black uppercase text-[9px] mb-2 tracking-[0.4em]"
            >
              ✦ Official VIP Pass ✦
            </motion.p>
            <h1 className="text-white text-[2rem] font-black tracking-widest leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>NIRANTAR</h1>
            <p className="text-yellow-500/70 font-bold text-xs tracking-[0.25em] mt-1">FRESHERS 2026</p>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center px-8 py-6">
            {/* Spinning avatar ring */}
            <div className="relative mb-4">
              <div className="absolute -inset-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full spin-slow" />
              <div className="relative w-[108px] h-[108px] rounded-full border-[3px] border-[#17131f] overflow-hidden bg-gradient-to-br from-purple-800 to-pink-900">
                {user.photoUrl
                  ? <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">{user.name?.[0]?.toUpperCase()}</div>
                }
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[1.4rem] font-black text-white uppercase tracking-tight mb-2 leading-tight text-center"
            >
              {user.name}
            </motion.h2>

            {/* Dept pill */}
            <span className={`bg-gradient-to-r ${dept.gradient} text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] mb-1 shadow-lg`}>
              SECTOR {dept.label}
            </span>
            <p className="text-white/20 text-[11px] font-medium mt-1">{user.email}</p>
          </div>

          {/* Perforated ticket divider */}
          <div className="flex items-center mb-5 relative">
            <div className="absolute -left-4 w-8 h-8 bg-[#050507] rounded-full z-20" />
            <div className="flex-1 border-t-2 border-dashed border-white/10 mx-5" />
            <div className="absolute -right-4 w-8 h-8 bg-[#050507] rounded-full z-20" />
          </div>

          {/* Entry code */}
          <div className="px-8 mb-5">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.35em] text-center mb-2.5">Entry Ticket Code</p>
            <div className="bg-black/50 border border-white/8 rounded-2xl py-4 px-5 text-center">
              <p className="text-white font-mono text-lg font-bold tracking-[0.15em]">
                {user.vipNumber || `VIP-${user.phone?.slice(-4)}-${user.department?.toUpperCase()}`}
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="px-8 pb-6 text-center">
            <p className="text-yellow-400/50 text-[11px] italic font-medium leading-relaxed">
              "The biggest freshers bash of the year awaits!"
            </p>
          </div>

          {/* Bottom holographic stripe */}
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-indigo-400" />
        </div>
      </motion.div>

      {/* Screenshot hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/20 text-[10px] font-black tracking-[0.4em] text-center uppercase mt-7"
      >
        📸 Take a screenshot of your VIP pass
      </motion.p>
    </div>
  );
}

export default Invite;