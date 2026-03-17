import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Calendar
} from 'lucide-react';
import GlobalHeader from '../../components/common/GlobalHeader';
import { useAuth } from '../../context/AuthContext';
import { getPendingPasses } from '../../services/department.service';
import { formatDate, getPassTypeLabel } from '../../utils/helpers';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

/**
 * Department Dashboard
 * Overview of department-specific gate pass statistics and actions.
 */
const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [pendingPasses, setPendingPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingPasses();
  }, []);

  const fetchPendingPasses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPendingPasses();
      const passes = response.data || [];
      setPendingPasses(passes);
    } catch (err) {
      setError(err.message || 'Failed to load pending passes.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const pendingCount = pendingPasses.length;
  const today = new Date().toDateString();
  const approvedToday = pendingPasses.filter(pass => {
    if (!pass.departmentApprovalDate) return false;
    const approvalDate = new Date(pass.departmentApprovalDate).toDateString();
    return approvalDate === today && pass.departmentStatus === 'APPROVED';
  }).length;
  const rejectedCount = pendingPasses.filter(pass => pass.departmentStatus === 'REJECTED').length;
  const totalRequests = pendingPasses.length;

  // Get recent requests (last 5, sorted by creation date)
  const recentRequests = [...pendingPasses]
    .sort((a, b) => new Date(b.createdAt || b.fromDate) - new Date(a.createdAt || a.fromDate))
    .slice(0, 5)
    .map(pass => ({
      id: pass._id,
      student: pass.student?.name || 'Unknown Student',
      roll: pass.student?.rollNo || 'N/A',
      type: getPassTypeLabel(pass.passType),
      status: pass.departmentStatus || 'PENDING',
      date: formatDate(pass.createdAt || pass.fromDate)
    }));

  const stats = [
    { label: 'Pending Review', value: pendingCount.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Approved Today', value: approvedToday.toString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Rejected', value: rejectedCount.toString(), icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'Total Requests', value: totalRequests.toString(), icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
  </div>
);

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-indigo-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {user?.department || 'Department'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Department Overview</h1>
            <p className="text-slate-400 mt-2">Manage approvals and monitor student movement.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-lg flex items-center gap-2">
              <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${stat.bg} ${stat.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-950/30 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                {index === 0 && <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>}
              </div>
              <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* --- MAIN CONTENT SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: ACTION AREA (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Action Card */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors group">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Pending Approvals
                  <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/20">Action Required</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  You have <span className="text-white font-bold">{pendingCount} request{pendingCount !== 1 ? 's' : ''}</span> waiting for review. 
                  Please verify academic schedules before approving outstation passes.
                </p>
              </div>
              <Link
                to="/department/pending"
                className="whitespace-nowrap px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform group-hover:scale-105"
              >
                Review List <ArrowRight size={18} />
              </Link>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Recent Requests</h3>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              {error && (
                <div className="p-4">
                  <ErrorMessage message={error} />
                </div>
              )}
              
              {recentRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No recent requests found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-slate-200 font-semibold uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Requested</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{req.student}</div>
                            <div className="text-xs opacity-70">{req.roll}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs border ${
                              req.type === 'Out of Station' 
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                            }`}>
                              {req.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">{req.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 ${
                              req.status === 'PENDING' ? 'text-amber-400' : 
                              req.status === 'APPROVED' ? 'text-emerald-400' :
                              'text-rose-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                req.status === 'PENDING' ? 'bg-amber-400' : 
                                req.status === 'APPROVED' ? 'bg-emerald-400' :
                                'bg-rose-400'
                              }`}></span>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link 
                              to="/department/pending" 
                              className="text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="p-4 border-t border-white/5 text-center">
                <Link to="/department/pending" className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                  View All Transactions
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (1/3) */}
          <div className="space-y-6">
            
            {/* Quick Search */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Find Student</h3>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by Roll No..." 
                  className="w-full bg-slate-950 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-cyan-400" /> 
                Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                  Outstation passes &gt;3 days require parent confirmation.
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                  Medical leaves must have attached prescription.
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                  Approve emergency requests within 2 hours.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default DepartmentDashboard;
