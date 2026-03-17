import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  FileCheck, 
  History, 
  ArrowRight, 
  Bell, 
  Clock,
  Search
} from 'lucide-react';
import GlobalHeader from '../../components/common/GlobalHeader';
import { getPendingPasses } from '../../services/hostel.service';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
  </div>
);

const HostelDashboard = () => {
  const [pendingPasses, setPendingPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPendingPasses();
      setPendingPasses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = pendingPasses.length;
  const today = new Date().toDateString();
  const processedToday = pendingPasses.filter(pass => {
    if (!pass.hostelApprovalDate) return false;
    const approvalDate = new Date(pass.hostelApprovalDate).toDateString();
    return approvalDate === today && pass.hostelStatus === 'APPROVED';
  }).length;

  const stats = [
    { label: 'Pending Reviews', value: pendingCount.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Processed Today', value: processedToday.toString(), icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Requests', value: pendingPasses.length.toString(), icon: HomeIcon, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-orange-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Hostel Office</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Manage residential permissions and approve local passes for students.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-3xl font-bold text-white">
              {new Date().toLocaleDateString('en-US', { day: 'numeric' })}
            </p>
            <p className="text-sm text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'long', weekday: 'long' })}
            </p>
          </div>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell size={18} className="text-orange-400" /> Priority Actions
            </h2>
            
            <div className="group relative bg-gradient-to-br from-orange-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
              
              <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase">
                    <Clock size={12} /> Action Required
                  </div>
                  <h3 className="text-2xl font-bold text-white">Pending Local Pass Approvals</h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg">
                    You have <span className="text-white font-bold">{pendingCount} pass{pendingCount !== 1 ? 'es' : ''}</span> that are awaiting your approval for local leave permissions.
                  </p>
                </div>

                <Link 
                  to="/hostel/pending"
                  className="whitespace-nowrap flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-all"
                >
                  Review Passes <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group">
                <Search className="text-slate-500 mb-3 group-hover:text-orange-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">Student Lookup</h4>
                <p className="text-sm text-slate-500 mt-1">Check residential history</p>
              </button>
              
              <button className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-left hover:bg-slate-800/50 hover:border-white/20 transition-all group">
                <History className="text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors" size={24} />
                <h4 className="text-white font-bold">Approval Logs</h4>
                <p className="text-sm text-slate-500 mt-1">View past transactions</p>
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
              
              {error && (
                <div className="pb-4 border-b border-white/5">
                  <ErrorMessage message={error} />
                </div>
              )}

              <div className="pb-4 border-b border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Actions</p>
                <p className="text-sm text-slate-300">
                  {pendingCount} pass{pendingCount !== 1 ? 'es' : ''} awaiting your review.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Today's Activity</p>
                <p className="text-sm text-slate-300">
                  {processedToday} pass{processedToday !== 1 ? 'es' : ''} processed today.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HostelDashboard;
