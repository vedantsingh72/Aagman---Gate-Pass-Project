import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  BookOpenCheck, 
  Home as HomeIcon, 
  ShieldCheck, 
  LogIn, 
  ArrowRight,
  Sparkles,
  Globe2,
  Zap,
  User
} from 'lucide-react';
import GlobalHeader from '../components/common/GlobalHeader';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    // Main container with deep space background color
    <div className="min-h-screen bg-[#0A0F1E] font-sans text-white selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* ================= NEW NEBULA BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep space base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0F1E] to-[#0A0F1E]"></div>
        
        {/* Animated Aurora Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/5 to-transparent blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-emerald-500/5 to-transparent blur-[150px] animate-pulse-slow delay-1000"></div>
        
        {/* Starfield / Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay contrast-150 brightness-75"></div>
      </div>

      <div className="relative z-10">
        <GlobalHeader />

        {/* ================= HERO SECTION ================= */}
        <div className="container mx-auto px-4 pt-32 md:pt-40 pb-24 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md text-sm font-bold text-cyan-300 mb-8 hover:bg-cyan-900/40 transition-colors cursor-default shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles size={16} className="text-cyan-200" />
            <span className="tracking-wide uppercase text-xs">Next-Gen Campus Security</span>
          </div>

          {/* Headline with new gradient matching background */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-2xl">
            Campus Mobility, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300">
              Elevated.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light mix-blend-lighten">
            Experience a seamless, paperless entry system. Aagman connects students, faculty, and security in one unified, beautiful interface.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-[#0A0F1E] px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
            >
              <LogIn size={20} strokeWidth={2.5} />
              Login Portal
            </Link>
            <a
              href="#roles"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-lg font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              Register New ID
            </a>
          </div>

          {/* Mini Stats */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard icon={Globe2} label="Digital Access" value="100%" color="text-cyan-400" />
            <StatCard icon={Zap} label="Processing Time" value="< 2s" color="text-yellow-400" />
            <StatCard icon={ShieldCheck} label="Security Level" value="A+" color="text-emerald-400" />
          </div>
        </div>

        {/* ================= REGISTRATION SECTION ================= */}
        <div id="roles" className="container mx-auto px-4 pb-40">
          <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Select Your Role</h2>
              <p className="text-slate-400 text-lg">Choose your profile to access the dashboard.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student */}
            <RoleCard 
              title="Student"
              desc="Apply for passes, view history, and manage your digital ID."
              icon={GraduationCap}
              link="/register/student"
              theme="pink"
            />

            {/* Department */}
            <RoleCard 
              title="Department"
              desc="Approve academic requests and verify student attendance."
              icon={Building2}
              link="/register/department"
              theme="cyan"
            />

            {/* Academic */}
            <RoleCard 
              title="Academic Office"
              desc="Administrative oversight and final approval authority."
              icon={BookOpenCheck}
              link="/register/academic"
              theme="lime"
            />

            {/* Hostel */}
            <RoleCard 
              title="Hostel Office"
              desc="Manage residential leave permissions and local passes."
              icon={HomeIcon}
              link="/register/hosteloffice"
              theme="orange"
            />

            {/* Gate */}
            <RoleCard 
              title="Security Gate"
              desc="Scan QR codes and log real-time entry/exit data."
              icon={ShieldCheck}
              link="/register/gate"
              theme="violet"
            />
          </div>
        </div>

        {/* Created By Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link
            to="/creator"
            className="created-by-button inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <User size={18} />
            <span>Created By</span>
          </Link>
        </div>

        <Footer />
      </div>
    </div>
  );
};

/* --- SUB COMPONENTS --- */

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1">
    <Icon className={`mb-4 ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} size={32} />
    <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{label}</div>
  </div>
);

const RoleCard = ({ title, desc, icon: Icon, link, theme }) => {
  const themes = {
    pink:   { gradient: 'from-pink-500/20 to-rose-500/5', icon: 'text-pink-400', border: 'hover:border-pink-500/50', shadow: 'hover:shadow-pink-500/20' },
    cyan:   { gradient: 'from-cyan-500/20 to-indigo-500/5', icon: 'text-cyan-400', border: 'hover:border-cyan-500/50', shadow: 'hover:shadow-cyan-500/20' },
    lime:   { gradient: 'from-lime-500/20 to-emerald-500/5', icon: 'text-lime-400', border: 'hover:border-lime-500/50', shadow: 'hover:shadow-lime-500/20' },
    orange: { gradient: 'from-orange-500/20 to-amber-500/5', icon: 'text-orange-400', border: 'hover:border-orange-500/50', shadow: 'hover:shadow-orange-500/20' },
    violet: { gradient: 'from-violet-500/20 to-purple-500/5', icon: 'text-violet-400', border: 'hover:border-violet-500/50', shadow: 'hover:shadow-violet-500/20' },
  };

  const activeTheme = themes[theme];

  return (
    <Link 
      to={link}
      className={`group relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${activeTheme.border} ${activeTheme.shadow}`}
    >
      {/* Glossy Reflection */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>

      {/* Hover Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ${activeTheme.icon} shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]`}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-400 text-base leading-relaxed mb-10 group-hover:text-slate-300 transition-colors font-light">
          {desc}
        </p>

        <div className="flex items-center gap-3 text-sm font-bold text-white/50 group-hover:text-white transition-colors uppercase tracking-wider">
          Register Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default Home;