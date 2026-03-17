import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, 
  ShieldCheck, 
  ArrowRight,
  Bell,
  Clock,
  CheckCircle2,
  History
} from 'lucide-react';
import GlobalHeader from '../../components/common/GlobalHeader';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

// --- Background Component with Light Green Theme ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[100px]" />
  </div>
);

const GateDashboard = () => {
  // For future: could fetch recent scans/statistics
  const [loading] = useState(false);
  const [error] = useState('');

  // Mock stats - can be replaced with real API calls later
  const stats = [
    { label: 'Scans Today', value: '0', icon: ScanLine, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Valid Entries', value: '0', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Active Passes', value: '0', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-emerald-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Security Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Gate Dashboard</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Scan QR codes to validate student passes and log real-time entry/exit data.
            </p>
          </div>
          
          {/* Date Widget */}
          <div className="hidden md:block text-right">
            <p className="text-3xl font-bold text-white">
              {new Date().toLocaleDateString('en-US', { day: 'numeric' })}
            </p>
            <p className="text-sm text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'long', weekday: 'long' })}
            </p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-slate-800/40 transition-colors">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN ACTION AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Primary Action Card (2/3 width) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell size={18} className="text-emerald-400" /> Quick Actions
            </h2>
            
            <div className="group relative bg-gradient-to-br from-emerald-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                    <ScanLine size={12} /> Ready to Scan
                  </div>
                  <h3 className="text-2xl font-bold text-white">QR Code Scanner</h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg">
                    Open the scanner to validate student passes and record entry/exit times in real-time.
                  </p>
                </div>

                <Link 
                  to="/gate/scanner"
                  className="whitespace-nowrap flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 transition-all"
                >
                  Open Scanner <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group">
                <ShieldCheck className="text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">Security Logs</h4>
                <p className="text-sm text-slate-500 mt-1">View entry history</p>
              </button>
              
              <button className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group">
                <History className="text-slate-500 mb-3 group-hover:text-green-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">Activity Logs</h4>
                <p className="text-sm text-slate-500 mt-1">View past scans</p>
              </button>
            </div>
          </div>

          {/* Sidebar Info (1/3 width) */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-white mb-4">Quick Info</h2>
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
              
              {error && (
                <div className="pb-4 border-b border-white/5">
                  <ErrorMessage message={error} />
                </div>
              )}

              <div className="pb-4 border-b border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Scanner Status</p>
                <p className="text-sm text-slate-300">
                  Ready to scan QR codes.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Instructions</p>
                <p className="text-sm text-slate-300">
                  Point camera at student QR code to validate pass and log entry.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GateDashboard;
