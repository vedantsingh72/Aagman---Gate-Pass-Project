import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  ScanLine,
  ChevronDown,
  Activity,
  CheckCircle2,
  Home as HomeIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi } from '../../services/auth.service';

const Login = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'user';
  
  const [formData, setFormData] = useState({
    role: roleFromUrl,
    identifier: '',
    password: '',
  });
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (roleFromUrl && ['user', 'department', 'academic', 'hosteloffice', 'gate'].includes(roleFromUrl)) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [roleFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginResponse = await loginApi(formData);
      const { token, role, user } = loginResponse.data;
      login(token, user, role);
      
      const roleRoutes = {
        user: '/student/dashboard',
        department: '/department/dashboard',
        academic: '/academic/dashboard',
        hosteloffice: '/hostel/dashboard',
        gate: '/gate/dashboard',
      };
      navigate(roleRoutes[role] || '/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getIdentifierLabel = () => {
    const labels = {
      user: 'Roll Number',
      department: 'Department ID',
      academic: 'Academic ID',
      hosteloffice: 'Office ID',
      gate: 'Gate ID',
    };
    return labels[formData.role] || 'Identifier';
  };

  // Role Configuration
  const roles = [
    { id: 'user', label: 'Student', icon: GraduationCap },
    { id: 'department', label: 'Department Faculty', icon: Briefcase },
    { id: 'academic', label: 'Academic Office', icon: Building2 },
    { id: 'hosteloffice', label: 'Hostel Warden', icon: HomeIcon },
    { id: 'gate', label: 'Security Gate', icon: ScanLine },
  ];

  // Helper to get current role icon
  const CurrentRoleIcon = roles.find(r => r.id === formData.role)?.icon || User;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#0A0F1E] font-sans">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0F1E] to-[#0A0F1E]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN GLASS CARD CONTAINER --- */}
      <div className="relative z-10 w-full max-w-5xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_0_rgba(0,0,0,0.3)] flex overflow-hidden min-h-[600px]">
        
        {/* --- LEFT SIDE: LOGIN FORM --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-slate-900/20">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm group">
               <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Home
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400">Secure access to Aagman Portal.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-200 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. ROLE DROPDOWN (Styled exactly like inputs) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Select Profile</label>
              <div 
                className={`relative group transition-all duration-300 rounded-xl border ${
                  focusedField === 'role' ? 'border-indigo-500 bg-slate-800/80 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
                }`}
              >
                {/* Left Icon (Changes based on selection) */}
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'role' ? 'text-indigo-400' : 'text-slate-500'}`}>
                  <CurrentRoleIcon size={20} />
                </div>
                
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('role')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent text-white rounded-xl py-4 pl-12 pr-10 focus:outline-none appearance-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200 py-2">
                      {r.label}
                    </option>
                  ))}
                </select>

                {/* Right Chevron Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* 2. IDENTIFIER INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">{getIdentifierLabel()}</label>
              <div 
                className={`relative group transition-all duration-300 rounded-xl border ${
                  focusedField === 'identifier' ? 'border-indigo-500 bg-slate-800/80 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
                }`}
              >
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'identifier' ? 'text-indigo-400' : 'text-slate-500'}`}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('identifier')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none placeholder:text-slate-600"
                  placeholder={`e.g. ${formData.role === 'user' ? '2024CS101' : 'ID-1234'}`}
                  required
                />
              </div>
            </div>

            {/* 3. PASSWORD INPUT */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div 
                className={`relative group transition-all duration-300 rounded-xl border ${
                  focusedField === 'password' ? 'border-indigo-500 bg-slate-800/80 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
                }`}
              >
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent text-white rounded-xl py-4 pl-12 pr-12 focus:outline-none placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-indigo-400 font-medium transition-colors">
                Register Now
              </Link>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUALIZATION (Hidden on Mobile) --- */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 relative items-center justify-center p-12 overflow-hidden border-l border-white/5">
          
          {/* Animated Grid Background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
          
          {/* Central Animated Shield */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              {/* Outer Glow Rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_3s_ease-in-out_infinite]"></div>
              <div className="absolute inset-[-15px] rounded-full border border-violet-500/20 animate-[ping_4s_ease-in-out_infinite_delay-700]"></div>
              
              {/* Main Shield Icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3 transition-transform hover:rotate-0 duration-500">
                <ShieldCheck className="text-white w-12 h-12" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              Institutional Grade Security
            </h3>
            <p className="text-indigo-200/70 text-center text-sm max-w-xs leading-relaxed">
              End-to-end encrypted gate pass management with real-time biometric verification support.
            </p>

            {/* Status Indicators */}
            <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</div>
                  <div className="text-sm font-semibold text-white">Online</div>
                </div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800/50 transition-colors">
                <ShieldCheck size={16} className="text-indigo-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Protocol</div>
                  <div className="text-sm font-semibold text-white">TLS 1.3</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      
      {/* Bottom Copyright */}
      <div className="absolute bottom-4 text-slate-600 text-xs text-center w-full z-10">
        &copy; {new Date().getFullYear()} Aagman Secure Systems. All rights reserved.
      </div>
    </div>
  );
};

export default Login;