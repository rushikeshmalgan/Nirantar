import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 space-y-3 w-max max-w-xs pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl backdrop-blur-2xl border
              ${t.type === 'error'
                ? 'bg-red-950/80 border-red-500/30 text-red-200'
                : 'bg-green-950/80 border-green-500/30 text-green-200'
              }`}
          >
            <span className="text-base">{t.type === 'error' ? '⚠️' : '✅'}</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
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
          if (userData.verified) {
            setWaitingForSignal(false);
            unsubscribe();
            addToast("Pass Confirmed! Entering the party...", 'success');
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
    if (unsubscribeFn) unsubscribeFn();
    setWaitingForSignal(false);
    setIsLoading(false);
  };

  if (waitingForSignal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#050507] overflow-hidden relative">
        {/* Animated background orbs */}
        <div className="fixed top-1/4 -left-32 w-[550px] h-[550px] bg-purple-700/20 blur-[130px] rounded-full aurora-orb pointer-events-none" />
        <div className="fixed bottom-1/4 -right-32 w-[450px] h-[450px] bg-pink-700/15 blur-[120px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '4s' }} />

        {/* Toasts */}
        <Toast toasts={toasts} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center max-w-md w-full glass p-10 rounded-[32px] border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.08)]"
        >
          {/* Radar / Loading icon */}
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-purple-500/50 rounded-full animate-pulse" />
            <div className="absolute inset-4 border-2 border-indigo-500/60 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 flex items-center justify-center text-4xl">📡</div>
          </div>
          
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">
            Checking VIP List...
          </h2>
          <p className="text-pink-400 font-mono text-sm mb-8 h-12 flex items-center justify-center">
            <span className="animate-pulse mr-2 font-black text-lg">_</span> Looking up your number in the guest list...
          </p>

          <button
            onClick={handleAbort}
            className="px-6 py-3 border border-red-500/30 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Cancel Wait
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#050507] overflow-hidden relative">

      {/* Animated background orbs */}
      <div className="fixed top-1/4 -left-32 w-[550px] h-[550px] bg-purple-700/20 blur-[130px] rounded-full aurora-orb pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-[450px] h-[450px] bg-pink-700/15 blur-[120px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '4s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-700/10 blur-[100px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Toasts */}
      <Toast toasts={toasts} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-indigo-500/20 rounded-[34px] blur-sm" />

        {/* Card */}
        <div className="relative glass rounded-[32px] p-8 md:p-10 shadow-[0_0_100px_rgba(139,92,246,0.08)]">

          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-xl shadow-amber-500/30 mb-5 floating"
            >
              <span className="text-3xl">🎟️</span>
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">CHECK V.I.P STATUS</h1>
            <p className="text-white/35 text-xs font-bold tracking-widest uppercase mt-2">Enter your registered WhatsApp number</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-pink-400 transition-colors text-base select-none">📱</span>
              <input
                id="phone-input"
                type="tel"
                placeholder="WhatsApp Number (10 Digits)"
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/15 transition-all text-base font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 font-black text-base rounded-2xl overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 group-hover:brightness-110 transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-xl" />
              <span className="relative z-10 text-white flex items-center justify-center gap-2.5">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    VERIFYING PASS...
                  </>
                ) : '🎫 VIEW MY INVITE'}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-8 font-bold">
            Don't have a pass?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-pink-400 hover:text-pink-300 font-black transition-colors ml-1"
            >
              Get Yours Now →
            </button>
          </p>
        </div>

        <p className="text-center text-white/15 text-[10px] mt-5 font-bold tracking-[0.4em] uppercase">
          COMPS DEPT · FRESHERS 2026
        </p>
      </motion.div>
    </div>
  );
}

export default Login;