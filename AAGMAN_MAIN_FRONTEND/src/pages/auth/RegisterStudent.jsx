import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Hash, 
  FileDigit, 
  Building2, 
  Calendar,
  Home, 
  Mail,
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  GraduationCap, 
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { registerStudent } from '../../services/auth.service';
import { DEPARTMENTS } from '../../utils/constants';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    registrationNo: '',
    department: '',
    year: '',
    hostel: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await registerStudent(registerData);
      
      const isVerified = response?.data?.isVerified || false;
      const message = response?.message || 'Registration successful!';
      
      if (isVerified || message.includes('development mode')) {
        navigate('/login', { 
          state: { message: 'Registration successful! You can login now.' } 
        });
      } else {
        navigate('/verify-otp', { 
          state: { email: formData.email, message: 'Registration successful! Please verify your email.' } 
        });
      }
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err?.message) errorMessage = err.message;
      else if (err?.data?.message) errorMessage = err.data.message;
      else if (typeof err === 'string') errorMessage = err;
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper for Input Fields - Using useCallback to create stable reference
  const InputField = useCallback(({ name, type = "text", placeholder, icon: Icon, value, onChange, required = true }) => {
    return (
      <div 
        className={`relative group transition-all duration-300 rounded-xl border ${
          focusedField === name ? 'border-indigo-500 bg-slate-800/80 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
        }`}
      >
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === name ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Icon size={18} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          className="w-full bg-transparent text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none placeholder:text-slate-600 text-sm"
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  }, [focusedField]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#0A0F1E] font-sans">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0F1E] to-[#0A0F1E]"></div>
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-6xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_0_rgba(0,0,0,0.3)] flex overflow-hidden min-h-[700px]">
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full lg:w-3/5 p-8 md:p-10 flex flex-col justify-center relative bg-slate-900/30">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Student Registration 
              <span className="hidden sm:inline-flex text-xs font-normal px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Aagman Portal
              </span>
            </h2>
            <p className="text-slate-400 text-sm">Create your student profile to access digital gate passes.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-200 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Full Name</label>
              <InputField 
                name="name" 
                placeholder="e.g. Rahul Sharma" 
                icon={User} 
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>

            {/* 2. IDs Row (Roll & Reg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Roll Number</label>
                <InputField 
                  name="rollNo" 
                  placeholder="21CS001" 
                  icon={Hash} 
                  value={formData.rollNo} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Registration No</label>
                <InputField 
                  name="registrationNo" 
                  placeholder="1900543" 
                  icon={FileDigit} 
                  value={formData.registrationNo} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* 3. Department & Year Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Department</label>
                <div className={`relative group transition-all duration-300 rounded-xl border ${focusedField === 'department' ? 'border-indigo-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'department' ? 'text-indigo-400' : 'text-slate-500'}`}>
                    <Building2 size={18} />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('department')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none appearance-none text-sm cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-500">Select Dept</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-slate-900 text-white">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Year</label>
                <div className={`relative group transition-all duration-300 rounded-xl border ${focusedField === 'year' ? 'border-indigo-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'year' ? 'text-indigo-400' : 'text-slate-500'}`}>
                    <Calendar size={18} />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('year')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none appearance-none text-sm cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-500">Select Year</option>
                    <option value="1" className="bg-slate-900 text-white">1st Year</option>
                    <option value="2" className="bg-slate-900 text-white">2nd Year</option>
                    <option value="3" className="bg-slate-900 text-white">3rd Year</option>
                    <option value="4" className="bg-slate-900 text-white">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Hostel & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Hostel</label>
                <InputField 
                  name="hostel" 
                  placeholder="Hostel Name" 
                  icon={Home} 
                  value={formData.hostel} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Email (College ID)</label>
                <InputField 
                  name="email" 
                  type="email"
                  placeholder="student@college.edu" 
                  icon={Mail} 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* 5. Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Password</label>
                <div className={`relative group transition-all duration-300 rounded-xl border ${focusedField === 'password' ? 'border-indigo-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white rounded-xl py-3.5 pl-11 pr-10 focus:outline-none placeholder:text-slate-600 text-sm"
                    placeholder="Min 6 chars"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Confirm</label>
                <InputField 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat Password" 
                  icon={Lock} 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create Student Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUAL (Hidden on Mobile) --- */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-bl from-indigo-900/40 to-slate-900/40 relative items-center justify-center p-12 overflow-hidden border-l border-white/5">
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-500/50 transition-all duration-500"></div>
              <div className="relative w-32 h-32 bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <GraduationCap className="text-indigo-400 w-16 h-16 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 animate-bounce delay-700">
                <Sparkles className="text-yellow-300 w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">
              One ID, Total Access
            </h3>
            
            <div className="space-y-4 text-left w-full max-w-xs">
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Instant Gate Pass</p>
                  <p className="text-slate-500 text-xs">No more paper slips</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Real-time Approval</p>
                  <p className="text-slate-500 text-xs">Track status live</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Secure Verification</p>
                  <p className="text-slate-500 text-xs">OTP & Email protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterStudent;