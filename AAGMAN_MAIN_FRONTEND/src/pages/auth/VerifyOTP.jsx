import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../services/auth.service';
import { 
  ShieldCheck, 
  Mail, 
  RefreshCw, 
  ArrowLeft, 
  Rocket, 
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import GlobalHeader from '../../components/common/GlobalHeader';

// --- Dynamic Background ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black" />
    <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
    {/* Grid Overlay for "Terminal" feel */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register/student');
    }
    // Auto-focus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP({ email, otp });
      setSuccess('Identity Verified. Initializing session...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Verification successful! Welcome aboard.' }
        });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Invalid code. Access denied.');
      setOtp(''); // Clear on error for dramatic effect
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await resendOTP({ email });
      setSuccess('New code transmitted. Check your inbox.');
      setTimeout(() => setSuccess(''), 5000); // Clear success msg after 5s
    } catch (err) {
      setError('Signal failed. Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-indigo-500/30 flex flex-col">
      <DynamicBackground />
      <GlobalHeader />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        
        {/* Main Glass Card */}
        <div className="w-full max-w-md perspective-1000">
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden group">
            
            {/* Top decorative glow */}
            <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${
              success ? 'bg-emerald-500' : error ? 'bg-rose-500' : 'bg-indigo-500'
            }`} />

            {/* --- HEADER --- */}
            <div className="text-center mb-8">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                success 
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : error 
                    ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
              }`}>
                {success ? <ShieldCheck size={32} /> : error ? <Lock size={32} /> : <Rocket size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Security Check</h2>
              <p className="text-slate-400 text-sm mt-2">Enter the authorization code sent to your comms channel.</p>
            </div>

            {/* --- EMAIL BADGE --- */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/50 border border-white/10 text-sm text-slate-300">
                <Mail size={14} className="text-indigo-400" />
                <span className="font-mono tracking-wide">{email}</span>
              </div>
            </div>

            {/* --- STATUS MESSAGES --- */}
            {success && (
              <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={16} /> {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="relative">
              
              {/* The Visual Split Input */}
              <div 
                className="flex justify-between gap-2 mb-8 cursor-text"
                onClick={() => inputRef.current.focus()}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const digit = otp[index] || '';
                  const isActive = isFocused && otp.length === index;
                  const isFilled = digit !== '';
                  
                  return (
                    <div 
                      key={index}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200
                        ${isFilled 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : isActive
                            ? 'border-indigo-400/80 bg-slate-800 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                            : 'border-white/10 bg-slate-900/50 text-slate-600'
                        }
                        ${error ? 'border-rose-500/50 text-rose-400' : ''}
                      `}
                    >
                      {digit}
                    </div>
                  );
                })}
              </div>

              {/* Hidden Real Input */}
              <input
                ref={inputRef}
                type="text"
                value={otp}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={6}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                autoComplete="one-time-code"
              />

              {/* Action Button */}
              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${otp.length === 6 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/25 hover:scale-[1.02]' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Verify & Launch <Rocket size={20} className={otp.length === 6 ? 'animate-bounce' : ''} />
                  </>
                )}
              </button>
            </form>

            {/* --- FOOTER --- */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <RefreshCw size={14} className={`group-hover:rotate-180 transition-transform duration-500 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Transmitting...' : 'Resend Code'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/register/student')}
                className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Return to Registration
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;