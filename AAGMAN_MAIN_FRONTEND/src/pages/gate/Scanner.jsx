import { useState } from 'react';
import { Link } from 'react-router-dom';
import QRScanner from '../../components/qr/QRScanner';
import { scanQRCode } from '../../services/gate.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, getPassTypeLabel } from '../../utils/helpers';
import GlobalHeader from '../../components/common/GlobalHeader';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Building2,
  MapPin,
  AlertCircle,
  ScanLine
} from 'lucide-react';

// --- Dynamic Background with Light Green Theme ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-black" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
  </div>
);

/**
 * Scanner Page
 * QR code scanner for gate staff to validate passes
 */
const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = async (qrCode) => {
    try {
      setError('');
      setLoading(true);
      const response = await scanQRCode(qrCode);
      setScanResult(response.data);
    } catch (err) {
      setError(err.message || 'Invalid QR code or pass not found.');
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (err) => {
    console.error('Scan error:', err);
    setError('Failed to access camera. Please check permissions.');
  };

  const handleReset = () => {
    setScanResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 relative selection:bg-emerald-500/30">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <Link to="/gate/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-400 mb-2 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">QR Code Scanner</h1>
            <p className="text-slate-400 mt-1">
              Scan student QR codes to validate passes and log entry/exit.
            </p>
          </div>
        </div>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Scanner Section */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ScanLine className="text-emerald-400" size={20} />
              <h2 className="text-xl font-bold text-white">Camera Scanner</h2>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />
            </div>
            {loading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <p className="mt-2 text-slate-400 text-sm">Validating pass...</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={20} />
              Scan Result
            </h2>

            {!scanResult && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-slate-900 rounded-full mb-4 text-slate-600">
                  <ScanLine size={40} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to Scan</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Point your camera at a student's QR code to validate their pass.
                </p>
              </div>
            )}

            {scanResult && (
              <div className="space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-xl border ${
                  scanResult.isUsed 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {scanResult.isUsed ? (
                      <>
                        <XCircle size={20} />
                        <p className="font-bold">Entry Denied - Pass Already Used</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        <p className="font-bold">✓ Entry Allowed</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {scanResult.student?.name ? scanResult.student.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {scanResult.student?.name || 'Unknown Student'}
                      </h3>
                      <div className="flex items-center text-slate-400 text-sm mt-1">
                        <User size={14} className="mr-1" />
                        {scanResult.student?.rollNo || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {scanResult.student?.department && (
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5 text-xs text-slate-300">
                        <Building2 size={12} className="text-emerald-400" />
                        <span className="font-medium">{scanResult.student.department}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pass Details Card */}
                <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Pass Details</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Type:</span>
                      <span className="text-sm font-medium text-white">
                        {getPassTypeLabel(scanResult.passType)}
                      </span>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-emerald-400" size={16} />
                        <span className="text-xs text-slate-500 uppercase font-bold">Travel Dates</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">
                          <span className="text-slate-500">From:</span> {formatDate(scanResult.fromDate)}
                        </span>
                        <span className="text-slate-600 mx-2">→</span>
                        <span className="text-slate-300">
                          <span className="text-slate-500">To:</span> {formatDate(scanResult.toDate)}
                        </span>
                      </div>
                    </div>

                    {scanResult.reason && (
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="text-emerald-400" size={14} />
                          <span className="text-xs text-slate-500 uppercase font-bold">Reason</span>
                        </div>
                        <p className="text-sm text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-white/5">
                          {scanResult.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-sm text-slate-400">Status:</span>
                      <span className={`text-sm font-bold ${
                        scanResult.isUsed ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {scanResult.isUsed ? 'Already Used' : 'Valid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <ScanLine size={18} />
                  Scan Another
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
