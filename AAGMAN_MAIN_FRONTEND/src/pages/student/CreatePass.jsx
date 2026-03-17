import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Zap, 
  CalendarCheck,
  AlertCircle,
  Lock,
  Timer
} from 'lucide-react';
import { createPass } from '../../services/pass.service';
import { PASS_TYPES } from '../../utils/constants';
import ErrorMessage from '../../components/common/ErrorMessage';
import GlobalHeader from '../../components/common/GlobalHeader';

// --- Background ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const CreatePass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State
  const [passType, setPassType] = useState(PASS_TYPES.LOCAL);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(1);
  const [times, setTimes] = useState({ from: new Date(), to: new Date() });
  
  // Logic State
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [maxDuration, setMaxDuration] = useState(0);

  // --- 1. Time & Restriction Logic ---
  useEffect(() => {
    const updateTimeLogic = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Define Rules: 9 AM to 6 PM (18:00)
      const START_HOUR = 9;
      const END_HOUR = 18;
      
      const isOpen = currentHour >= START_HOUR && currentHour < END_HOUR;
      setIsGateOpen(isOpen);

      if (isOpen) {
        // Calculate remaining hours until 6 PM
        const minutesUntilClose = (END_HOUR * 60) - (currentHour * 60 + now.getMinutes());
        const hoursUntilClose = minutesUntilClose / 60;
        setMaxDuration(hoursUntilClose);
        
        // Reset duration if current selection exceeds remaining time
        if (duration > hoursUntilClose) {
          setDuration(1); 
        }

        // Update To/From times
        const future = new Date(now.getTime() + duration * 60 * 60 * 1000);
        setTimes({ from: now, to: future });
      } else {
        // Even if closed, keep clocks updating for display
        setTimes({ from: now, to: now });
      }
    };

    updateTimeLogic();
    const timer = setInterval(updateTimeLogic, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [duration]);


  // --- 2. Handlers ---
  const handlePassTypeChange = (e) => {
    const type = e.target.value;
    if (type === PASS_TYPES.OUT_OF_STATION) {
      navigate('/student/create-pass/out-of-station');
    } else {
      setPassType(type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isGateOpen) return;

    setError('');
    setLoading(true);

    const payload = {
      passType,
      reason,
      fromDate: times.from.toISOString(),
      toDate: times.to.toISOString()
    };

    try {
      await createPass(payload);
      navigate('/student/my-passes');
    } catch (err) {
      setError(err.message || 'Failed to generate pass.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-red-500/30 flex flex-col">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10 max-w-2xl">
        
        <button
          onClick={() => navigate('/student/dashboard')}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-red-400 mb-8 transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Cancel & Return</span>
        </button>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Status Bar */}
          <div className={`absolute top-0 left-0 w-full h-1 ${isGateOpen ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-600 to-rose-600'}`} />

          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Zap className={isGateOpen ? "text-emerald-500" : "text-red-500"} size={28} />
                Quick Pass
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Local gate passes are valid between <span className="text-white font-bold">09:00 AM - 06:00 PM</span>.
              </p>
            </div>
            
            {/* Live Status Badge */}
            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isGateOpen 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {isGateOpen ? (
                <> <Clock size={12} className="animate-pulse" /> Active </>
              ) : (
                <> <Lock size={12} /> Restricted </>
              )}
            </div>
          </div>

          <ErrorMessage message={error} />

          {/* --- GATE CLOSED STATE --- */}
          {!isGateOpen && (
            <div className="mb-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                <Lock className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Gate Passes Unavailable</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Local passes cannot be generated at this time. Please try again tomorrow between 09:00 AM and 06:00 PM.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Pass Type Selector (Always Active) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pass Type</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <select
                  value={passType}
                  onChange={handlePassTypeChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white appearance-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all cursor-pointer hover:bg-slate-900"
                >
                  <option value={PASS_TYPES.LOCAL}>Local Visit</option>
                  <option value={PASS_TYPES.TEA_COFFEE}>Tea/Coffee Break</option>
                  <option value={PASS_TYPES.OUT_OF_STATION}>Out of Station (Apply Here ↗)</option>
                </select>
              </div>
            </div>

            {/* --- REST OF FORM (Only if Open) --- */}
            <div className={`space-y-8 transition-opacity duration-300 ${!isGateOpen ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              
              {/* Time Display */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/30 border border-white/10 rounded-xl text-slate-300">
                  <Timer size={16} className="text-emerald-500" />
                  <span className="font-mono font-medium">NOW ({formatTime(times.from)})</span>
                </div>
              </div>

              {/* Smart Duration Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Duration</span>
                  <span className="text-slate-400">Must return by 6:00 PM</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 4, 6].map((hrs) => {
                    const isDisabled = hrs > maxDuration;
                    return (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setDuration(hrs)}
                        disabled={isDisabled}
                        className={`relative py-3 rounded-xl text-sm font-bold border transition-all duration-200 overflow-hidden ${
                          isDisabled
                            ? 'bg-slate-950/50 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                            : duration === hrs
                              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 transform scale-105'
                              : 'bg-slate-950/30 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/20'
                        }`}
                      >
                        {hrs} Hr
                        {/* Strike-through for disabled items */}
                        {isDisabled && (
                           <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-8 h-[1px] bg-slate-600 rotate-45"></div>
                           </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Duration warning if limiting happens */}
                {maxDuration < 6 && isGateOpen && (
                  <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={10} /> Long durations disabled due to 6 PM closing time.
                  </p>
                )}
              </div>

              {/* Reason Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
                  placeholder="Why do you need to leave?"
                  required
                />
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={loading || !isGateOpen}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-red-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CalendarCheck size={20} />
                    Generate Pass
                  </>
                )}
              </button>

              <div className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg">
                <AlertCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Valid until <span className="text-white font-bold">{formatTime(times.to)}</span>. 
                  Returns after 06:00 PM will be flagged automatically.
                </p>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePass;