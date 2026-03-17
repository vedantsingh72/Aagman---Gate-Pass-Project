import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail,
  Building2,
  Hash,
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { registerDepartment } from '../../services/auth.service';
import { DEPARTMENTS } from '../../utils/constants';

const RegisterDepartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    departmentId: '',
    password: '',
    confirmPassword: '',
    codeword: '',
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
      
      const response = await registerDepartment(registerData);
      
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
          focusedField === name ? 'border-cyan-500 bg-slate-800/80 shadow-[0_0_0_4px_rgba(6,182,212,0.1)]' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'
        }`}
      >
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === name ? 'text-cyan-400' : 'text-slate-500'}`}>
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0A0F1E] to-[#0A0F1E]"></div>
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-6xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_0_rgba(0,0,0,0.3)] flex overflow-hidden min-h-[700px]">
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full lg:w-3/5 p-8 md:p-10 flex flex-col justify-center relative bg-slate-900/30">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Department Registration 
              <span className="hidden sm:inline-flex text-xs font-normal px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Aagman Portal
              </span>
            </h2>
            <p className="text-slate-400 text-sm">Register as a department head to approve academic requests.</p>
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
                placeholder="e.g. Dr. John Smith" 
                icon={User} 
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>

            {/* 2. Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Email</label>
              <InputField 
                name="email" 
                type="email"
                placeholder="dept@college.edu" 
                icon={Mail} 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            {/* 3. Department & Department ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Department</label>
                <div className={`relative group transition-all duration-300 rounded-xl border ${focusedField === 'department' ? 'border-cyan-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'department' ? 'text-cyan-400' : 'text-slate-500'}`}>
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

              {/* Department ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Department ID</label>
                <InputField 
                  name="departmentId" 
                  placeholder="DEPT001" 
                  icon={Hash} 
                  value={formData.departmentId} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* 4. Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Password</label>
                <div className={`relative group transition-all duration-300 rounded-xl border ${focusedField === 'password' ? 'border-cyan-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-slate-500'}`}>
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

            {/* 5. Authorization Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider">Authorization Code</label>
              <InputField 
                name="codeword" 
                placeholder="Enter authorization code" 
                icon={Key} 
                value={formData.codeword} 
                onChange={handleChange} 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create Department Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-cyan-400 font-medium transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUAL (Hidden on Mobile) --- */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-bl from-cyan-900/40 to-slate-900/40 relative items-center justify-center p-12 overflow-hidden border-l border-white/5">
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl group-hover:bg-cyan-500/50 transition-all duration-500"></div>
              <div className="relative w-32 h-32 bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <Building2 className="text-cyan-400 w-16 h-16 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 animate-bounce delay-700">
                <Sparkles className="text-yellow-300 w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">
              Approve with Authority
            </h3>
            
            <div className="space-y-4 text-left w-full max-w-xs">
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Review Requests</p>
                  <p className="text-slate-500 text-xs">Approve academic passes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Verify Students</p>
                  <p className="text-slate-500 text-xs">Check attendance records</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-bold">Digital Workflow</p>
                  <p className="text-slate-500 text-xs">Streamlined approvals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterDepartment;
