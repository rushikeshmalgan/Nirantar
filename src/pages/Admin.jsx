import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import './Admin.css'; // Importing the custom styles provided by the user

function ToastStack({ toasts }) {
  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80 }}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: "'Rajdhani', sans-serif",
              backgroundColor: t.type === 'error' ? '#2b0c06' : '#1a0e04',
              border: `1px solid ${t.type === 'error' ? '#e06c28' : '#d4840a'}`,
              color: '#f5e6c8',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{t.type === 'error' ? '⚠️' : '🎉'}</span>
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId,         setAdminId]         = useState('');
  const [adminPass,       setAdminPass]       = useState('');
  const [loginError,      setLoginError]      = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState('');
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
      fetchRegistrations();
    } else {
      setLoginError(true);
      addToast('Invalid credentials', 'error');
      setTimeout(() => setLoginError(false), 2000);
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
      addToast("Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const toggleVerification = async (user) => {
    try {
      const newStatus = !user.verified;
      await updateDoc(doc(db, "registrations", user.id), { verified: newStatus });
      setRegistrations(prev => prev.map(r => r.id === user.id ? { ...r, verified: newStatus } : r));

      if (newStatus && user.phone) {
        let rawPhone = user.phone.replace(/\D/g, '');
        if (rawPhone.length === 10) {
          const message = `Hi ${user.name}! 🎉\n\nYour VIP Pass for NIRANTAR '26 has been Verified!\n\nGet your invite here: https://your-site.vercel.app/login`;
          const url = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
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
    const matchSearch = !s || r.name?.toLowerCase().includes(s) || r.phone?.includes(s) || r.email?.toLowerCase().includes(s) || r.vipNumber?.toLowerCase().includes(s);
    const matchStatus = !filterStatus || (filterStatus === 'verified' ? r.verified : !r.verified);
    // Removed department filter logic
    return matchSearch && matchStatus;
  }), [registrations, search, filterStatus]);

  const verifiedCount = registrations.filter(r => r.verified).length;
  const pendingCount  = registrations.filter(r => !r.verified).length;
  const revenue       = verifiedCount * 100;

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ToastStack toasts={toasts} />
        <div className="admin-login-wrapper">
          <h1>Admin Login</h1>
          <p>Nirantar '26 Dashboard</p>
          <form onSubmit={handleAdminLogin}>
            <input 
              type="text" 
              placeholder="Admin ID" 
              className="admin-login-input" 
              value={adminId} 
              onChange={e => setAdminId(e.target.value)} 
              autoFocus 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="admin-login-input" 
              value={adminPass} 
              onChange={e => setAdminPass(e.target.value)} 
            />
            <button type="submit" className="admin-login-btn">ENTER DASHBOARD</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <ToastStack toasts={toasts} />
      
      <div className="admin-wrapper">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Admin <span>Dashboard</span></h1>
            <div className="admin-breadcrumb">
              <span className="dot">✦</span>
              <span>Nirantar 2026</span>
              <span>·</span>
              <span>Registrations</span>
              <span className="dot">✦</span>
            </div>
          </div>
          <button className="admin-refresh-btn" onClick={() => fetchRegistrations(true)} disabled={refreshing}>
            <svg className={refreshing ? 'spin-icon' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon entries">📋</div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Total Entries</span>
              <span className="admin-stat-value">{registrations.length}</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon verified">✅</div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Verified</span>
              <span className="admin-stat-value">{verifiedCount}</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon pending">🎯</div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Pending</span>
              <span className="admin-stat-value">{pendingCount}</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon coin">🪙</div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Total Collection</span>
              <span className="admin-stat-value currency">₹{revenue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters-row">
          <div className="admin-search-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c4884a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          {/* Removed Department Filter */}
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <span className="admin-col-label">Student</span>
            <span className="admin-col-label">VIP Pass</span> {/* Replaced Department with VIP Pass to keep it useful but match column counts conceptually, or just stick to exactly what user code gave but adapted. The HTML had Contact, Files, Status, Action. I will use 5 columns: Student, Contact, Files, Status, Action. */}
            <span className="admin-col-label">Contact</span>
            <span className="admin-col-label">Status</span>
            <span className="admin-col-label">Action</span>
          </div>
          <div className="admin-table-body">
            {isLoading ? (
              <div className="admin-empty-state">
                <span className="flower">⏳</span>
                <p>Loading records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty-state">
                <span className="flower">🌸</span>
                <p>No registrations found</p>
              </div>
            ) : (
              filtered.map(reg => (
                <div className="admin-table-row" key={reg.id}>
                  <div>
                    <div className="admin-student-name">{reg.name}</div>
                    <div className="admin-student-email">{reg.email}</div>
                    <div className="admin-student-id">{reg.vipNumber || `VIP-${reg.phone?.slice(-4)}-${reg.department?.toUpperCase()}`}</div>
                  </div>
                  
                  <div className="admin-contact-text">{reg.phone}</div>
                  
                  <div className="admin-files-links">
                    {reg.paymentUrl && <a href={reg.paymentUrl} target="_blank" rel="noreferrer">Payment Receipt</a>}
                    {reg.photoUrl && <a href={reg.photoUrl} target="_blank" rel="noreferrer">ID Photo</a>}
                    {!reg.paymentUrl && !reg.photoUrl && <span style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>No files</span>}
                  </div>
                  
                  <div>
                    <span className={`admin-badge ${reg.verified ? 'verified' : 'pending'}`}>
                      <span className="admin-badge-dot"></span>
                      {reg.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="admin-actions">
                    <button 
                      className={`admin-action-btn ${reg.verified ? 'revoke' : ''}`}
                      onClick={() => toggleVerification(reg)}
                    >
                      {reg.verified ? 'Revoke' : 'Verify'}
                    </button>
                    <button 
                      className="admin-delete-btn"
                      onClick={() => deleteRegistration(reg.id, reg.name)}
                      title="Delete Record"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;