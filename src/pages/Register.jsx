// ================= Backend Imports =================
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ================= React Imports =================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ================= Assets =================
import qr50 from '../assets/50.png';
import qr75 from '../assets/75.png';

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

// ── File Upload Zone ───────────────────────────────────────────────────────
function FileZone({ label, name, accept, value, onChange, error, icon }) {
  return (
    <div>
      <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{label}</label>
      <label
        htmlFor={`file-${name}`}
        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all
          ${value
            ? 'border-indigo-500/50 bg-indigo-500/5'
            : error
              ? 'border-red-500/40 bg-red-500/3 hover:border-red-500/60'
              : 'border-white/10 bg-white/2 hover:border-pink-500/40 hover:bg-pink-500/5'
          }`}
      >
        <span className="text-2xl">{value ? '✅' : icon}</span>
        <span className={`text-[10px] font-semibold text-center leading-tight ${value ? 'text-indigo-400' : 'text-white/30'}`}>
          {value ? (value.name.length > 18 ? value.name.substring(0, 18) + '…' : value.name) : 'Upload File'}
        </span>
        <input id={`file-${name}`} type="file" name={name} accept={accept} onChange={onChange} className="hidden" />
      </label>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-red-400 text-[10px] mt-1.5 font-semibold ml-1">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── InputField ─────────────────────────────────────────────────────────────
function InputField({ id, type = 'text', name, placeholder, value, onChange, error, icon }) {
  return (
    <div>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink-400 transition-colors text-base select-none">{icon}</span>
        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-white/20 outline-none focus:ring-2 transition-all font-medium text-sm
            ${error
              ? 'border-red-500/50 focus:ring-red-500/15 focus:border-red-500/60'
              : 'border-white/10 hover:border-white/18 focus:border-pink-500/55 focus:ring-pink-500/15'
            }`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-red-400 text-[10px] mt-1.5 font-semibold ml-1">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', photo: null, payment: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, [name]: 'Data fragment exceeds 5MB limit.' }));
      return;
    }
    setFormData(p => ({ ...p, [name]: file }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email is required.';
    if (!/^\d{10}$/.test(formData.phone)) e.phone = '10-digit WhatsApp number required.';
    if (!formData.department) e.department = 'Please select your department.';
    if (!formData.photo) e.photo = 'Profile photo is required.';
    if (!formData.payment) e.payment = 'Payment screenshot is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const max = 600; 
          if (width > height && width > max) {
            height *= max / width; width = max;
          } else if (height > max) {
            width *= max / height; height = max;
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const [photoUrl, paymentUrl] = await Promise.all([
        processImage(formData.photo),
        processImage(formData.payment),
      ]);
      const fee = formData.department === "comps" ? 50 : 75;
      await addDoc(collection(db, "registrations"), {
        ...formData, photoUrl, paymentUrl, feePaid: fee,
        verified: false, timestamp: serverTimestamp(), photo: null, payment: null,
      });
      addToast("Successfully registered! Awaiting admin verification.", 'success');
      setTimeout(() => navigate("/login"), 2200);
    } catch (error) {
      console.error(error);
      addToast("Registration failed. Please try again.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPayment = formData.phone.length === 10 && formData.department;
  const fee = formData.department === 'comps' ? 50 : 75;

  return (
    <div className="min-h-screen bg-[#050507] overflow-hidden relative">
      <ToastStack toasts={toasts} />

      {/* Background orbs */}
      <div className="fixed top-0 -left-20 w-[600px] h-[600px] bg-purple-700/15 blur-[140px] rounded-full aurora-orb pointer-events-none" />
      <div className="fixed bottom-0 -right-20 w-[500px] h-[500px] bg-pink-700/10 blur-[120px] rounded-full aurora-orb pointer-events-none" style={{ animationDelay: '5s' }} />

      <div className="relative flex items-start justify-center min-h-screen p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          {/* ── Event Header ── */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl mb-5 floating"
            >
              <span className="text-4xl">🎉</span>
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
              JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">PARTY</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-3">Nirantar '26 · COMPS Department</p>
          </div>

          {/* ── Form Card ── */}
          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-r from-purple-500/15 via-pink-500/8 to-indigo-500/15 rounded-[34px] blur-sm" />
            <div className="relative glass rounded-[32px] p-6 md:p-8 shadow-[0_0_100px_rgba(139,92,246,0.07)]">
              <form onSubmit={handleSubmit} className="space-y-4">

                <InputField id="name-input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name} icon="👤" />
                <InputField id="email-input" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} icon="✉️" />
                <InputField id="phone-input" name="phone" type="tel" placeholder="WhatsApp Number (10 Digits)" value={formData.phone} onChange={handleChange} error={errors.phone} icon="�" />

                {/* Sector Select */}
                <div>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1-2 text-white/20 group-focus-within:text-pink-400 transition-colors text-base">🎓</span>
                    <select
                      id="dept-select" name="department" value={formData.department} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-[#0e0c15] border rounded-2xl outline-none focus:ring-2 transition-all font-medium text-sm appearance-none
                        ${formData.department ? 'text-white' : 'text-white/25'}
                        ${errors.department ? 'border-red-500/50 focus:ring-red-500/15' : 'border-white/10 hover:border-white/18 focus:border-pink-500/55 focus:ring-pink-500/15'}`}
                    >
                      <option value="" className="bg-[#0e0c15] text-white/40">Select Your Department</option>
                      <option value="comps" className="bg-[#0e0c15] text-white">COMPS (₹50 Entry Fee)</option>
                      <option value="aiml" className="bg-[#0e0c15] text-white">AI/ML (₹75 Entry Fee)</option>
                      <option value="extc" className="bg-[#0e0c15] text-white">EXTC (₹75 Entry Fee)</option>
                      <option value="mech" className="bg-[#0e0c15] text-white">Mechanical (₹75 Entry Fee)</option>
                      <option value="civil" className="bg-[#0e0c15] text-white">Civil (₹75 Entry Fee)</option>
                      <option value="electrical" className="bg-[#0e0c15] text-white">Electrical (₹75 Entry Fee)</option>
                    </select>
                  </div>
                  <AnimatePresence>
                    {errors.department && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-red-400 text-[10px] mt-1.5 font-semibold ml-1">{errors.department}</motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Contribution Protocol ── */}
                <AnimatePresence>
                  {showPayment && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="overflow-hidden">
                      <div className="p-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-amber-500/3">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-yellow-400/80 font-black text-[10px] uppercase tracking-[0.15em]">Registration Fee</p>
                          <span className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 px-3 py-1 rounded-full text-sm font-black">₹{fee}</span>
                        </div>

                        <div className="flex justify-center mb-3">
                          <img 
                            src={fee === 50 ? qr50 : qr75} 
                            alt={`QR ₹${fee}`} 
                            className="w-44 h-44 rounded-xl border-4 border-white/10 shadow-2xl brightness-110"
                          />
                        </div>
                        <p className="text-white/40 text-[10px] text-center font-bold tracking-widest mt-2 uppercase">Scan to Pay via UPI</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Data Fragments ── */}
                <div className="grid grid-cols-2 gap-3">
                  <FileZone label="Your Best Photo" name="photo" accept="image/*" value={formData.photo} onChange={handleFileChange} error={errors.photo} icon="�" />
                  <FileZone label="Payment Screenshot" name="payment" accept="image/*" value={formData.payment} onChange={handleFileChange} error={errors.payment} icon="�" />
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit" disabled={isSubmitting}
                  className="relative w-full py-4 mt-2 rounded-2xl font-black text-sm overflow-hidden group disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 group-hover:brightness-110 transition-all" />
                  <span className="relative z-10 text-white flex items-center justify-center gap-2.5 uppercase tracking-widest">
                    {isSubmitting ? 'Registering...' : 'Grab My Pass 🎟️'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-white/40 text-xs font-semibold mt-6">
            Already got your pass?{' '}
            <button onClick={() => navigate('/login')} className="text-pink-400 hover:text-pink-300 font-bold transition-colors ml-1">
              Check Invite →
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;