import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import './Register.css'; // New scoped styles
import qrCode from '../assets/100.jpeg';

const VITE_IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    photo: null,
    payment: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showQr, setShowQr] = useState(false);
  const [photoName, setPhotoName] = useState('');
  const [payName, setPayName] = useState('');

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const uploadToImgBB = async (base64Image) => {
    try {
      const base64Data = base64Image.split(',')[1] || base64Image;
      const formData = new FormData();
      formData.append('image', base64Data);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data.display_url;
      } else {
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({...prev, [field]: 'File must be under 5MB'}));
        return;
      }

      if (field === 'photo') setPhotoName(file.name);
      if (field === 'payment') setPayName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result
        }));
        setErrors(prev => ({...prev, [field]: ''}));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = '10 digits required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (!formData.payment) newErrors.payment = 'Payment screenshot is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);
    let photoUrl = null;
    let paymentUrl = null;

    try {
      addToast('Uploading images to cloud...', 'info');
      try {
        const [pUrl, payUrl] = await Promise.all([
          uploadToImgBB(formData.photo),
          uploadToImgBB(formData.payment)
        ]);
        photoUrl = pUrl;
        paymentUrl = payUrl;
      } catch (uploadObjError) {
         throw new Error("Failed to upload images. Please try again.");
      }

      const passSuffix = formData.phone.slice(-4);
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const generatedVipNumber = `VIP-${passSuffix}-${randomId}-COMPS`;

      await addDoc(collection(db, 'registrations'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        year: formData.year,
        photoUrl: photoUrl,
        paymentUrl: paymentUrl,
        vipNumber: generatedVipNumber,
        status: 'pending',
        timestamp: serverTimestamp()
      });

      addToast('Registration successful! Redirecting...', 'success');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Registration error:', error);
      addToast(error.message || 'Error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-page-bg"></div>
      <div className="register-page-texture"></div>

      {/* Floating petals */}
      <div className="petals-container">
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
        <div className="petal"></div>
      </div>

      {/* Mandala BG decorations */}
      <svg className="mandala-bg left" width="320" height="320" viewBox="0 0 280 280">
        <g opacity="1">
          <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4"/>
          <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="60" fill="none" stroke="#F4831F" strokeWidth="0.5"/>
          <g fill="#F4831F">
            <polygon points="140,8 143,18 137,18" transform="rotate(0,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(30,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(60,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(90,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(120,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(150,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(180,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(210,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(240,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(270,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(300,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(330,140,140)"/>
          </g>
          <circle cx="140" cy="140" r="10" fill="#F4831F"/>
          <circle cx="140" cy="140" r="4" fill="#D4A017"/>
        </g>
      </svg>
      <svg className="mandala-bg right" width="320" height="320" viewBox="0 0 280 280">
        <g opacity="1">
          <circle cx="140" cy="140" r="132" fill="none" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="6 4"/>
          <circle cx="140" cy="140" r="96" fill="none" stroke="#C0392B" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="60" fill="none" stroke="#F4831F" strokeWidth="0.5"/>
          <g fill="#F4831F">
            <polygon points="140,8 143,18 137,18" transform="rotate(0,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(30,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(60,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(90,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(120,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(150,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(180,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(210,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(240,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(270,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(300,140,140)"/>
            <polygon points="140,8 143,18 137,18" transform="rotate(330,140,140)"/>
          </g>
          <circle cx="140" cy="140" r="10" fill="#F4831F"/>
          <circle cx="140" cy="140" r="4" fill="#D4A017"/>
        </g>
      </svg>

      {/* Nav */}
      <nav>
        <button onClick={() => navigate('/')} className="logo" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
            <polygon points="820,10 835,40 805,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="880,10 895,40 865,40" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="940,10 955,40 925,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="1000,10 1015,40 985,40" fill="#F4831F" opacity="0.9"/>
            <polygon points="1060,10 1075,40 1045,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="1120,10 1135,40 1105,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="1180,10 1195,40 1165,40" fill="#F4831F" opacity="0.9"/>
            <polygon points="1240,10 1255,40 1225,40" fill="#1A4A2E" opacity="0.9"/>
            <polygon points="1300,10 1315,40 1285,40" fill="#D4A017" opacity="0.9"/>
            <polygon points="1360,10 1375,40 1345,40" fill="#C0392B" opacity="0.9"/>
            <polygon points="1420,10 1435,40 1405,40" fill="#F4831F" opacity="0.9"/>
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
            <circle cx="850"  cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="910"  cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="970"  cy="46" r="7" fill="#1A4A2E" opacity="0.85"/>
            <circle cx="1030" cy="46" r="7" fill="#D4A017" opacity="0.85"/>
            <circle cx="1090" cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="1150" cy="46" r="7" fill="#F4831F" opacity="0.85"/>
            <circle cx="1210" cy="46" r="7" fill="#D4A017" opacity="0.85"/>
            <circle cx="1270" cy="46" r="7" fill="#1A4A2E" opacity="0.85"/>
            <circle cx="1330" cy="46" r="7" fill="#C0392B" opacity="0.85"/>
            <circle cx="1390" cy="46" r="7" fill="#F4831F" opacity="0.85"/>
          </g>
        </svg>
      </div>

      <div className="page-wrapper">
        <div className="reg-header">
          <div className="reg-diya-icon">
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
          <h1 className="reg-title">JOIN THE <span>CELEBRATION</span></h1>
          <p className="reg-subtitle">Nirantar '26 · COMPS Department</p>
        </div>

        <form onSubmit={handleSubmit} className="reg-card" id="regCard">
          
          <div className={`reg-field ${errors.name ? 'has-error' : ''}`}>
            <span className="reg-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </span>
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              className="reg-input" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={`reg-field ${errors.email ? 'has-error' : ''}`}>
            <span className="reg-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
            </span>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              className="reg-input" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={`reg-field ${errors.phone ? 'has-error' : ''}`}>
            <span className="reg-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
            </span>
            <input 
              type="tel" 
              name="phone"
              placeholder="WhatsApp Number (10 Digits)" 
              className="reg-input" 
              maxLength="10" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={`reg-field ${errors.year ? 'has-error' : ''}`}>
            <span className="reg-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4"/><path d="M22 10H2"/><path d="M12 10v11"/><path d="M2 10v10a2 2 0 002 2h16a2 2 0 002-2V10"/></svg>
            </span>
            <select 
              name="year" 
              className="reg-input reg-select" 
              value={formData.year}
              onChange={handleChange}
            >
              <option value="" disabled>Select Your Year</option>
              <option value="FE">First Year (FE)</option>
              <option value="SE">Second Year (SE)</option>
              <option value="TE">Third Year (TE)</option>
              <option value="BE">Fourth Year (BE)</option>
            </select>
          </div>

          <div className="reg-divider">
            <div className="reg-divider-line"></div>
            <span className="reg-divider-text">Complete Payment</span>
            <div className="reg-divider-line"></div>
          </div>

          <button 
            type="button" 
            className="reg-pay-btn" 
            onClick={() => setShowQr(!showQr)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            PAY ENTRY FEE ✦
          </button>

          <AnimatePresence>
            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="qr-container"
              >
                <img src={qrCode} alt="Payment QR" style={{ width: '180px', borderRadius: '4px' }} />
                <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--saffron)' }}>Registration Fee: ₹100</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="reg-uploads">
            <div className="reg-upload-group">
              <span className="reg-upload-label">Your Best Photo</span>
              <label className={`reg-upload-box ${formData.photo ? 'has-file' : ''} ${errors.photo ? 'has-error' : ''}`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>{formData.photo ? '✓ Selected' : 'Upload File'}</span>
                <span className="file-name" style={{ display: photoName ? 'block' : 'none' }}>{photoName}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFileChange(e, 'photo')}
                />
              </label>
            </div>
            
            <div className="reg-upload-group">
              <span className="reg-upload-label">Payment Screenshot</span>
              <label className={`reg-upload-box ${formData.payment ? 'has-file' : ''} ${errors.payment ? 'has-error' : ''}`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>{formData.payment ? '✓ Selected' : 'Upload File'}</span>
                <span className="file-name" style={{ display: payName ? 'block' : 'none' }}>{payName}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFileChange(e, 'payment')}
                />
              </label>
            </div>
          </div>

          <button type="submit" className="reg-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'PROCESSING...' : 'GRAB MY PASS 🪔'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="reg-footer">
        <span className="motif">✦ ❋ ✦ ❋ ✦</span>
        <p>© Nirantar '26 · COMPS Department · ViMEET · 08 April 2026</p>
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

export default Register;