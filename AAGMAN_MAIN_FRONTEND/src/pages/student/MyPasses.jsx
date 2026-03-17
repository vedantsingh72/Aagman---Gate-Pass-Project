import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  QrCode, 
  Search,
  Calendar,
  MapPin,
  Filter,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyPasses } from '../../services/pass.service';
import QRDisplay from '../../components/qr/QRDisplay';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import GlobalHeader from '../../components/common/GlobalHeader';
import { formatDate, getPassTypeLabel } from '../../utils/helpers';

// --- Background ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

// --- Status Logic Helper ---
const getPassStatus = (pass) => {
  const deptStatus = pass.departmentApproval?.status || pass.departmentStatus || 'PENDING';
  const academicStatus = pass.academicApproval?.status || pass.academicStatus || 'PENDING';
  const hostelStatus = pass.hostelApproval?.status || pass.hostelStatus || 'PENDING';

  const isRejected = [deptStatus, academicStatus, hostelStatus].includes('REJECTED');
  
  // Logic varies by pass type, but generally:
  if (isRejected) return 'REJECTED';

  if (pass.passType === 'OUT_OF_STATION') {
    return (deptStatus === 'APPROVED' && academicStatus === 'APPROVED') ? 'APPROVED' : 'PENDING';
  } else {
    // Local passes usually need Dept + Hostel (or just Dept depending on logic)
    // Assuming simple logic for UI demo:
    return (deptStatus === 'APPROVED') ? 'APPROVED' : 'PENDING';
  }
};

const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]' },
    PENDING: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.1)]' },
    REJECTED: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'shadow-none' }
  };

  const style = config[status] || config.PENDING;
  const Icon = style.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${style.bg} ${style.border} ${style.color} ${style.glow}`}>
      <Icon size={12} />
      <span className="text-[10px] font-bold tracking-wider">{status}</span>
    </div>
  );
};

const MyPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPass, setSelectedPass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, APPROVED, PENDING
  const navigate = useNavigate();

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const response = await getMyPasses();
      setPasses(response.data || []);
      // Auto-select first active pass if exists
      const firstActive = response.data?.find(p => getPassStatus(p) === 'APPROVED');
      if (firstActive) setSelectedPass(firstActive);
    } catch (err) {
      setError(err.message || 'Failed to load passes.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const processedPasses = useMemo(() => {
    return passes.filter(pass => {
      const status = getPassStatus(pass);
      const matchesSearch = 
        getPassTypeLabel(pass.passType).toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'ALL' || status === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [passes, searchQuery, filterType]);

  if (loading) return <Loading message="Retrieving pass history..." />;

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-red-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10 max-w-7xl">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="group inline-flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-white tracking-tight">Pass History</h1>
            <p className="text-slate-400 mt-2">Manage your gate access and view approval status.</p>
          </div>

          <button
            onClick={() => navigate('/student/create-pass')}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Zap size={18} fill="currentColor" /> Create New Pass
          </button>
        </div>

        <ErrorMessage message={error} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: LIST (7/12) --- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/40 backdrop-blur-md p-2 rounded-2xl border border-white/5">
              {/* Tabs */}
              <div className="flex bg-slate-950/50 rounded-xl p-1">
                {['ALL', 'APPROVED', 'PENDING'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      filterType === tab 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search passes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/30 transition-all"
                />
              </div>
            </div>

            {/* List */}
            {processedPasses.length === 0 ? (
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center border-dashed">
                <FileText className="mx-auto mb-4 text-slate-600" size={48} />
                <p className="text-slate-400">No passes found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {processedPasses.map((pass) => {
                  const status = getPassStatus(pass);
                  const isSelected = selectedPass?._id === pass._id;

                  return (
                    <div
                      key={pass._id}
                      onClick={() => setSelectedPass(pass)}
                      className={`group relative bg-slate-900/60 backdrop-blur-md border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isSelected 
                          ? 'border-red-500/50 bg-slate-800/80 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                          : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Active Indicator Strip */}
                      {isSelected && <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full"></div>}

                      <div className="flex justify-between items-start mb-4 pl-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-lg">
                              {getPassTypeLabel(pass.passType)}
                            </h3>
                            {pass.passType === 'OUT_OF_STATION' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                                LONG DISTANCE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-1">{pass.reason || 'Reason not specified'}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      {/* Time Line */}
                      <div className="flex items-center gap-3 pl-2 text-sm bg-slate-950/30 p-3 rounded-xl border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 uppercase font-bold">From</span>
                          <span className="text-white font-medium">{formatDate(pass.fromDate)}</span>
                        </div>
                        <div className="flex-1 h-[1px] bg-slate-700 mx-2 relative">
                           <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-slate-700"></div>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-slate-500 uppercase font-bold">To</span>
                          <span className="text-white font-medium">{formatDate(pass.toDate)}</span>
                        </div>
                      </div>

                      <div className="mt-3 pl-2 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono">ID: {pass._id.slice(-6).toUpperCase()}</span>
                        <ChevronRight size={16} className={`text-slate-500 transition-transform ${isSelected ? 'translate-x-1 text-red-400' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: DETAILS / QR (5/12) --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {selectedPass ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-right-4 fade-in duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Pass</span>
                    <h2 className="text-xl font-bold text-white mt-1">{getPassTypeLabel(selectedPass.passType)}</h2>
                  </div>
                  <button onClick={() => setSelectedPass(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                {/* QR Section */}
                <div className="flex flex-col items-center justify-center py-6 relative">
                  {getPassStatus(selectedPass) === 'APPROVED' ? (
                    selectedPass.qrCode ? (
                      <div className="relative group">
                        {/* Scanner Beam Animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10 animate-[scan_2s_ease-in-out_infinite] opacity-50 pointer-events-none"></div>
                        
                        <div className="p-4 bg-white rounded-xl shadow-lg">
                          <QRDisplay qrCode={selectedPass.qrCode} passId={selectedPass._id} />
                        </div>
                        <p className="text-center text-xs text-emerald-400 mt-4 font-mono font-bold flex items-center justify-center gap-1">
                          <Zap size={10} fill="currentColor" /> ACTIVE FOR SCANNING
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Loading message="Generating QR..." />
                      </div>
                    )
                  ) : (
                    <div className="text-center py-10 opacity-50">
                      <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <QrCode size={40} className="text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm">QR Code unavailable.</p>
                      <p className="text-xs text-slate-600 mt-1">Pass status is {getPassStatus(selectedPass)}</p>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="bg-slate-950/50 rounded-xl p-5 mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-red-500 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Destination / Reason</p>
                      <p className="text-white text-sm leading-relaxed mt-1">{selectedPass.placeWhereGoing || selectedPass.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-red-500 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Valid Until</p>
                      <p className="text-white text-sm mt-1">{formatDate(selectedPass.toDate)}</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="hidden lg:flex h-96 flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                  <QrCode size={32} className="text-slate-600" />
                </div>
                <h3 className="text-white font-bold text-lg">Pass Details</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs">Select a pass from the list to view full details and access your QR code.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Add Custom Scan Animation Style */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MyPasses;