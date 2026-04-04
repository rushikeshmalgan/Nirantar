import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, borderColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass rounded-2xl p-5 border ${borderColor} flex items-center gap-4`}
    >
      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">{label}</p>
        <p className="text-white text-2xl font-black leading-none mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

// ── Toast Stack ────────────────────────────────────────────────────────────
function ToastStack({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl backdrop-blur-2xl border max-w-[280px]
              ${t.type === 'error'
                ? 'bg-red-950/90 border-red-500/30 text-red-200'
                : 'bg-indigo-950/90 border-indigo-500/30 text-indigo-200'
              }`}
          >
            <span className="text-base flex-shrink-0">{t.type === 'error' ? '⚠️' : '🎉'}</span>
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Skeleton Row ───────────────────────────────────────────────────────────
function SkeletonRow({ i }) {
  return (
    <tr className="border-b border-white/5">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-white/5 rounded-md animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
            <div className="h-2 w-20 bg-white/5 rounded-md animate-pulse" style={{ animationDelay: `${i * 0.05 + 0.1}s` }} />
          </div>
        </div>
      </td>
      {[80, 60, 70, 90, 70].map((w, j) => (
        <td key={j} className="px-5 py-4">
          <div className="h-3 bg-white/5 rounded-md animate-pulse" style={{ width: w, animationDelay: `${j * 0.07}s` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Dept badge styling ─────────────────────────────────────────────────────
const DEPT_STYLES = {
  comps:      'bg-blue-500/15 text-blue-300 border-blue-500/25',
  aiml:       'bg-purple-500/15 text-purple-300 border-purple-500/25',
  extc:       'bg-green-500/15 text-green-300 border-green-500/25',
  mech:       'bg-orange-500/15 text-orange-300 border-orange-500/25',
  civil:      'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  electrical: 'bg-red-500/15 text-red-300 border-red-500/25',
};

const TABLE_HEADERS = ['Student', 'Department', 'Contact', 'Files', 'Status', 'Action'];

// ── Main Component ─────────────────────────────────────────────────────────
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId,         setAdminId]         = useState('');
  const [adminPass,       setAdminPass]       = useState('');
  const [loginError,      setLoginError]      = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [filterDept,    setFilterDept]    = useState('all');
  const [refreshing,    setRefreshing]    = useState(false);
  const [toasts,        setToasts]        = useState([]);

  const addToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminId === 'Nirantar26' && adminPass === 'COMPS26') {
      setIsAuthenticated(true);
      fetchRegistrations(); // Only fetch data if logged in
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000); // 2 second error animation
    }
  };

  const fetchRegistrations = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const snap = await getDocs(collection(db, "registrations"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
      setRegistrations(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Remove the automatic fetch on mount since it happens post-login
  // useEffect(() => { fetchRegistrations(); }, []);

  const toggleVerification = async (user) => {
    try {
      const newStatus = !user.verified;
      await updateDoc(doc(db, "registrations", user.id), { verified: newStatus });
      setRegistrations(prev => prev.map(r => r.id === user.id ? { ...r, verified: newStatus } : r));

      // Enhanced WhatsApp Notification on Approval Logic
      if (newStatus && user.phone) {
        // Strip everything except numbers
        let rawPhone = user.phone.replace(/\D/g, '');
        
        // Only trigger WhatsApp if it resembles a valid Indian 10-digit number
        if (rawPhone.length === 10) {
          const message = `Hi ${user.name}! 🎉\n\nYour VIP Pass for NIRANTAR '26 has been Verified!\n\nGet your invite here: https://your-site.vercel.app/login`;
          const url = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          console.warn('Phone number invalid length. WhatsApp notification aborted.');
        }
      }
    } catch (err) {
      console.error("Error updating:", err);
      addToast("Failed to update status.", "error");
    }
  };

  const deleteRegistration = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s registration? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "registrations", id));
        setRegistrations(prev => prev.filter(r => r.id !== id));
        addToast(`${name} has been removed.`, "success");
      } catch (err) {
        console.error("Error deleting:", err);
        addToast("Failed to delete record.", "error");
      }
    }
  };

  const filtered = useMemo(() => registrations.filter(r => {
    const s = search.toLowerCase();
    const matchSearch = !s || r.name?.toLowerCase().includes(s) || r.phone?.includes(s) || r.email?.toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'verified' ? r.verified : !r.verified);
    const matchDept   = filterDept === 'all' || r.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  }), [registrations, search, filterStatus, filterDept]);

  const verified  = registrations.filter(r => r.verified).length;
  const pending   = registrations.filter(r => !r.verified).length;
  const revenue   = registrations.filter(r => r.verified).reduce((acc, r) => acc + (r.feePaid || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center relative p-4 overflow-hidden">
        {/* Background orbs */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-700/10 blur-[150px] rounded-full aurora-orb pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm glass rounded-[32px] p-8 md:p-10 shadow-[0_0_80px_rgba(99,102,241,0.08)] z-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 floating">
              <span role="img" aria-label="shield">🛡️</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">ADMIN LOGIN</h1>
            <p className="text-white/30 text-xs font-semibold mt-1">Nirantar '26 Dashboard</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">👤</span>
              <input
                type="text"
                placeholder="Admin ID"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3.5 bg-[#0e0c15] border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 hover:border-white/20 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
              />
            </div>
            
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">🔑</span>
              <input
                type="password"
                placeholder="Password"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#0e0c15] border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 hover:border-white/20 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Login to Dashboard
            </button>
          </form>

          {/* Login Error Notification inline for simplicity */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 left-0 right-0 mx-auto w-fit bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md"
              >
                ⚠️ Incorrect Credentials.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507]">
      <ToastStack toasts={toasts} />

      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-700/10 blur-[150px] rounded-full aurora-orb pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-700/10 blur-[120px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto p-5 md:p-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              Admin <span className="shimmer-text">Dashboard</span>
            </h1>
            <p className="text-white/25 text-sm font-medium mt-1.5">Manage registrations for Nirantar 2026</p>
          </div>
          <button
            id="refresh-btn"
            onClick={() => fetchRegistrations(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 glass border border-white/12 text-white/50 hover:text-white rounded-xl font-semibold text-sm transition-all hover:border-white/25 disabled:opacity-50"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Entries" value={registrations.length} icon="📋" borderColor="border-white/8" delay={0} />
          <StatCard label="Verified" value={verified} icon="✅" borderColor="border-green-500/20" delay={0.07} />
          <StatCard label="Pending" value={pending} icon="⏳" borderColor="border-yellow-500/20" delay={0.14} />
          <StatCard label="Total Collection" value={`₹${revenue}`} icon="💰" borderColor="border-pink-500/20" delay={0.21} />
        </div>

        {/* ── Search & Filters ── */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm select-none">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass border border-white/10 rounded-xl text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all font-medium text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 glass border border-white/10 rounded-xl text-white bg-[#0e0c15] outline-none focus:border-purple-500/50 font-medium text-sm"
          >
            <option value="all" className="bg-[#0e0c15]">All Status</option>
            <option value="verified" className="bg-[#0e0c15]">Verified</option>
            <option value="pending" className="bg-[#0e0c15]">Pending</option>
          </select>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-4 py-3 glass border border-white/10 rounded-xl text-white bg-[#0e0c15] outline-none focus:border-purple-500/50 font-medium text-sm"
          >
            <option value="all" className="bg-[#0e0c15]">All Departments</option>
            {['comps','aiml','extc','mech','civil','electrical'].map(d => (
              <option key={d} value={d} className="bg-[#0e0c15] uppercase">{d.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass border border-white/8 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  {TABLE_HEADERS.map(h => (
                    <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} i={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="text-5xl mb-3">📁</div>
                      <p className="text-white/25 font-semibold">No registrations found</p>
                      {search && <p className="text-white/15 text-sm mt-1">Try a different search term</p>}
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      className="hover:bg-white/[0.025] transition-colors"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600">
                            {user.photoUrl
                              ? <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-white text-sm font-black">{user.name?.[0]?.toUpperCase()}</div>
                            }
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm leading-tight">{user.name}</p>
                            <p className="text-white/25 text-[10px] mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Dept */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${DEPT_STYLES[user.department] || 'bg-white/10 text-white/50 border-white/10'}`}>
                          {user.department}
                        </span>
                        <p className="text-pink-400 font-bold text-[11px] mt-1.5">₹{user.feePaid}</p>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-white/60 font-medium text-sm">{user.phone}</p>
                      </td>

                      {/* Files */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <a href={user.paymentUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[9px] px-2.5 py-1 bg-green-500/12 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/25 transition-colors font-black w-fit">
                            🧾 Payment
                          </a>
                          <a href={user.photoUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[9px] px-2.5 py-1 bg-blue-500/12 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/25 transition-colors font-black w-fit">
                            📸 Photo
                          </a>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black rounded-full border tracking-wider
                          ${user.verified
                            ? 'bg-green-500/12 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/12 text-yellow-400 border-yellow-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.verified ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                          {user.verified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleVerification(user)}
                            className={`px-4 py-2 text-[11px] font-black rounded-xl transition-all
                              ${user.verified
                                ? 'bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/25'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:brightness-110 shadow-lg shadow-green-500/15'
                              }`}
                          >
                            {user.verified ? 'Revoke Pass 🛑' : 'Verify Pass ☑️'}
                          </button>
                          
                          <button
                            onClick={() => deleteRegistration(user.id, user.name)}
                            title="Delete Record"
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-md shadow-red-500/5 group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-white/20 text-[10px] font-medium">
                Showing <span className="text-white/40 font-bold">{filtered.length}</span> of <span className="text-white/40 font-bold">{registrations.length}</span> entries
              </p>
              <p className="text-white/20 text-[10px] font-medium">
                ✅ {verified} verified · ⏳ {pending} pending
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default Admin;