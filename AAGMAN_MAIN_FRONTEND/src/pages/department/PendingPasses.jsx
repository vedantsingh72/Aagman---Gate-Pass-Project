import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Calendar, 
  User, 
  Clock, 
  MapPin, 
  AlertCircle,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPendingPasses, approvePass, rejectPass } from '../../services/department.service';
import { formatDate, getPassTypeLabel } from '../../utils/helpers';
import GlobalHeader from '../../components/common/GlobalHeader';

// --- Skeleton Loader (Dark Theme) ---
const SkeletonCard = () => (
  <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-800 rounded w-32"></div>
          <div className="h-3 bg-slate-800 rounded w-20"></div>
        </div>
      </div>
      <div className="h-6 bg-slate-800 rounded w-16"></div>
    </div>
    <div className="space-y-3 mt-4">
      <div className="h-10 bg-slate-950/50 rounded-lg w-full"></div>
      <div className="h-3 bg-slate-800 rounded w-3/4"></div>
      <div className="h-3 bg-slate-800 rounded w-1/2"></div>
    </div>
  </div>
);

const PendingPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const response = await getPendingPasses();
      setPasses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pending passes.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (passId) => {
    try {
      setProcessing(passId);
      await approvePass(passId);
      setPasses((prev) => prev.filter((p) => p._id !== passId));
    } catch (err) {
      setError(err.message || 'Failed to approve pass.');
      fetchPasses();
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (passId) => {
    try {
      setProcessing(passId);
      await rejectPass(passId);
      setPasses((prev) => prev.filter((p) => p._id !== passId));
    } catch (err) {
      setError(err.message || 'Failed to reject pass.');
      fetchPasses();
    } finally {
      setProcessing(null);
    }
  };

  // Filter passes based on search
  const filteredPasses = passes.filter(pass => 
    pass.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pass.student?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <Link to="/department/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-400 mb-2 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Pending Approvals</h1>
            <p className="text-slate-400 mt-1">
              Reviewing <span className="text-white font-medium">{passes.length}</span> request{passes.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-slate-900/40 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/60 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* --- CONTENT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredPasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-white/5 rounded-2xl border-dashed">
            <div className="p-4 bg-slate-900 rounded-full mb-4 text-slate-500">
              <Check size={40} />
            </div>
            <h3 className="text-xl font-bold text-white">All caught up!</h3>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              {searchTerm ? 'No students found matching your search.' : 'There are no pending gate pass requests at this time.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasses.map((pass) => (
              <div 
                key={pass._id} 
                className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Decoration Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {pass.student?.name ? pass.student.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight truncate max-w-[140px]">
                          {pass.student?.name || 'Unknown'}
                        </h3>
                        <div className="flex items-center text-slate-500 text-xs mt-1 font-medium">
                          <User size={12} className="mr-1" />
                          {pass.student?.rollNo || 'N/A'}
                        </div>
                      </div>
                    </div>
                    {/* Badge */}
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {getPassTypeLabel(pass.passType)}
                    </span>
                  </div>

                  {/* Date Block */}
                  <div className="bg-slate-950/30 rounded-xl p-3 mb-5 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-indigo-400">
                          <Calendar size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Duration</span>
                          <span className="text-sm font-medium text-slate-200">
                            {formatDate(pass.fromDate)} <span className="text-slate-600 mx-1">→</span> {formatDate(pass.toDate)}
                          </span>
                        </div>
                     </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <MapPin size={12} /> Reason
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 bg-slate-900/20 p-3 rounded-lg border border-white/5">
                      "{pass.reason}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleReject(pass._id)}
                      disabled={processing === pass._id}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === pass._id ? (
                        <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-400 rounded-full animate-spin" />
                      ) : (
                        <>
                          <X size={16} /> Reject
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleApprove(pass._id)}
                      disabled={processing === pass._id}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === pass._id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={16} /> Approve
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingPasses;