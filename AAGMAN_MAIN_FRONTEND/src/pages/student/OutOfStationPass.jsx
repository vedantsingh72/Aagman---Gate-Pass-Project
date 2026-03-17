import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Home, 
  Car,
  FileText,
  Send,
  AlertTriangle,
  ShieldCheck,
  Plane,
  Train,
  Bus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createPass } from '../../services/pass.service';
import { PASS_TYPES } from '../../utils/constants';
import ErrorMessage from '../../components/common/ErrorMessage';
import GlobalHeader from '../../components/common/GlobalHeader';

// --- Dynamic Background ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const OutOfStationPass = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    passType: PASS_TYPES.OUT_OF_STATION,
    reasonForLeave: '',
    placeWhereGoing: '',
    fromDate: '',
    toDate: '',
    contactNumber: '',
    guardianContactNumber: '',
    addressDuringLeave: '',
    travelMode: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
  });

  useEffect(() => {
    if (user && !user.department) {
      setError('Profile Incomplete: Department information is missing.');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      setError('Student contact number must be 10 digits.');
      return false;
    }
    if (formData.guardianContactNumber && !/^\d{10}$/.test(formData.guardianContactNumber)) {
      setError('Guardian contact number must be 10 digits.');
      return false;
    }
    if (formData.fromDate && formData.toDate) {
      if (new Date(formData.fromDate) >= new Date(formData.toDate)) {
        setError('Return date must be after departure date.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    if (!user?.department) {
      setError('Cannot proceed without department information.');
      return;
    }

    setLoading(true);

    try {
      await createPass(formData);
      navigate('/student/my-passes', {
        state: { message: 'Out of Station pass application submitted successfully!' }
      });
    } catch (err) {
      setError(err?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get icon for travel mode
  const getTravelIcon = () => {
    switch(formData.travelMode) {
      case 'Flight': return <Plane size={18} className="text-red-400" />;
      case 'Train': return <Train size={18} className="text-red-400" />;
      case 'Bus': return <Bus size={18} className="text-red-400" />;
      default: return <Car size={18} className="text-red-400" />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-red-500/30 flex flex-col">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10 max-w-6xl">
        
        {/* --- Header --- */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/student/create-pass')}
              className="group inline-flex items-center gap-2 text-slate-500 hover:text-red-400 mb-4 transition-colors"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Selection</span>
            </button>
            <h1 className="text-4xl font-bold text-white tracking-tight">Out of Station Application</h1>
            <p className="text-slate-400 mt-2">Request permission for long-distance travel and leave.</p>
          </div>
          
          {/* Profile Badge (Digital ID Look) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 min-w-[280px]">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
             </div>
             <div>
               <p className="text-white font-bold text-sm">{user?.name || 'Loading...'}</p>
               <div className="flex items-center gap-2 text-xs text-slate-400">
                 <span className="bg-slate-800 px-1.5 py-0.5 rounded text-red-300">{user?.department || 'NO DEPT'}</span>
                 <span>•</span>
                 <span>{user?.rollNo || 'N/A'}</span>
               </div>
             </div>
          </div>
        </div>

        <ErrorMessage message={error} />

        {/* --- Main Form Grid --- */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Trip Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50"></div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-red-500" size={20} /> Itinerary & Reason
              </h3>

              <div className="space-y-6">
                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason for Leave *</label>
                  <textarea
                    name="reasonForLeave"
                    value={formData.reasonForLeave}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
                    placeholder="Detailed reason for travel..."
                    required
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="placeWhereGoing"
                      value={formData.placeWhereGoing}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                      placeholder="City, State"
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departure *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="datetime-local"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Return *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="datetime-local"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Travel Mode */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travel Mode</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getTravelIcon()}
                    </div>
                    <select
                      name="travelMode"
                      value={formData.travelMode}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                    >
                      <option value="">Select Mode (Optional)</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Flight">Flight</option>
                      <option value="Personal">Personal Vehicle</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact & Safety (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1 h-full bg-rose-500/50"></div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-rose-500" size={20} /> Contact & Safety
              </h3>

              <div className="space-y-6">
                {/* Contact Numbers */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Contact (10 Digits) *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                        placeholder="9876543210"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guardian Contact (10 Digits) *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="tel"
                        name="guardianContactNumber"
                        value={formData.guardianContactNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                        placeholder="Parent/Guardian"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address During Leave *</label>
                  <div className="relative">
                     <Home className="absolute left-4 top-4 text-slate-500" size={18} />
                    <textarea
                      name="addressDuringLeave"
                      value={formData.addressDuringLeave}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
                      placeholder="Full residential address..."
                      required
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 bg-slate-950/30 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-rose-400 mb-2">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold uppercase">Emergency Contact (Optional)</span>
                  </div>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:border-rose-500/50 transition-all"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:border-rose-500/50 transition-all"
                    placeholder="Relation (e.g. Uncle)"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={loading || !user?.department}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-red-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Application 
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default OutOfStationPass;