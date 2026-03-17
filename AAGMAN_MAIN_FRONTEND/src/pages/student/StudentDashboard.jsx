import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  FileCheck, 
  Clock, 
  ArrowRight, 
  Plus, 
  History,
  CheckCircle
} from 'lucide-react';
import GlobalHeader from '../../components/common/GlobalHeader';
import { getMyPasses } from '../../services/pass.service';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

// --- Background Component (Consistent with previous pages) ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyPasses();
      setPasses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const totalPasses = passes.length;
  const pendingPasses = passes.filter(pass => 
    pass.departmentStatus === 'PENDING' || 
    pass.academicStatus === 'PENDING' || 
    pass.hostelStatus === 'PENDING'
  ).length;
  const approvedPasses = passes.filter(pass => 
    pass.departmentStatus === 'APPROVED' && 
    pass.academicStatus === 'APPROVED' && 
    (pass.passType === 'LOCAL' || pass.hostelStatus === 'APPROVED')
  ).length;

  const stats = [
    { label: 'Total Passes', value: totalPasses.toString(), icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Pending Reviews', value: pendingPasses.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Approved Passes', value: approvedPasses.toString(), icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-red-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
                Student Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Welcome, {user?.name || 'Student'}!
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Create and manage your gate passes. Track the status of your requests and stay updated on approvals.
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
              <Plus size={18} className="text-red-400" /> Quick Actions
            </h2>
            
            <div className="group relative bg-gradient-to-br from-red-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
              
              <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase">
                    <Plus size={12} /> New Request
                  </div>
                  <h3 className="text-2xl font-bold text-white">Create New Gate Pass</h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg">
                    Request a new gate pass for out-of-station travel, local visits, or tea/coffee breaks. Fill out the form and submit for approval.
                  </p>
                </div>

                <Link 
                  to="/student/create-pass"
                  className="whitespace-nowrap flex items-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 transform group-hover:scale-105 transition-all"
                >
                  Create Pass <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link 
                to="/student/my-passes"
                className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group"
              >
                <FileText className="text-slate-500 mb-3 group-hover:text-red-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">My Passes</h4>
                <p className="text-sm text-slate-500 mt-1">View all your passes</p>
              </Link>
              
              <button className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group">
                <History className="text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">Pass History</h4>
                <p className="text-sm text-slate-500 mt-1">View past requests</p>
              </button>
            </div>
          </div>

          {/* Sidebar Info (1/3 width) */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
              
              {error && (
                <div className="pb-4 border-b border-white/5">
                  <ErrorMessage message={error} />
                </div>
              )}

              <div className="pb-4 border-b border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Passes</p>
                <p className="text-sm text-slate-300">
                  You have {totalPasses} pass{totalPasses !== 1 ? 'es' : ''} in total.
                </p>
              </div>

              <div className="pb-4 border-b border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Approval</p>
                <p className="text-sm text-slate-300">
                  {pendingPasses} pass{pendingPasses !== 1 ? 'es' : ''} awaiting review.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Approved</p>
                <p className="text-sm text-slate-300">
                  {approvedPasses} pass{approvedPasses !== 1 ? 'es' : ''} approved and ready.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
