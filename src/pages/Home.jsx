import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050507] overflow-hidden relative flex flex-col">
      {/* ── Background Orbs ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-700/20 blur-[150px] rounded-full aurora-orb pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-700/15 blur-[130px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* ── Nav Header ── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 md:px-12 py-6 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">⚡</div>
          <span className="text-white font-black tracking-widest text-lg uppercase">NIRANTAR<span className="text-pink-500">26</span></span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 glass rounded-xl text-white text-xs font-bold border border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest"
        >
          Access Vault
        </button>
      </motion.nav>

      {/* ── Hero Content ── */}
      <main className="flex-1 flex items-center justify-center z-10 px-4 py-12 md:py-0">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full glass border border-white/10"
          >
            <span className="text-pink-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" /> COMPS DEPT. EXCLUSIVE
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-6"
          >
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 blur-[1px]">FUTURE</span><br/>
            UNLOCKED
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/60 text-base md:text-lg max-w-xl mx-auto font-medium mb-12 tracking-wide leading-relaxed"
          >
            A high-frequency experience curated by the COMPS Department. 
            Request your digital keycard below and wait for authentication.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-3 group uppercase tracking-widest text-sm"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">💎</span> Get VIP Pass
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 glass text-white font-black rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-sm"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🔑</span> My Invite
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-6"
          >
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <button
              onClick={() => navigate('/admin')}
              className="group flex items-center gap-3 px-5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/20 text-white/20 hover:text-white/40 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-pink-500 transition-colors" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Control Center</span>
            </button>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ── */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full text-center py-6 text-white/10 text-[10px] font-bold tracking-[0.4em] uppercase z-10"
      >
        // SYSTEM STATUS: ONLINE // COMPS DEPT 2026
      </motion.footer>

    </div>
  );
}

export default Home;