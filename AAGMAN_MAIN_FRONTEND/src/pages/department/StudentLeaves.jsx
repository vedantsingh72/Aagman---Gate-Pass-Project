import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter,
  ArrowUpDown,
  Download,
  MoreVertical
} from 'lucide-react';
import { getStudentLeaves } from '../../services/department.service';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import GlobalHeader from '../../components/common/GlobalHeader';

// --- Dynamic Background Component ---
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Base Gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black" />
    
    {/* Ambient Light Orbs (Dynamic feel) */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
  </div>
);

const StudentLeaves = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'totalLeaves', direction: 'desc' });

  useEffect(() => {
    fetchStudentLeaves();
  }, []);

  const fetchStudentLeaves = async () => {
    try {
      setLoading(true);
      const response = await getStudentLeaves();
      setStudents(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load student leave statistics');
    } finally {
      setLoading(false);
    }
  };

  // --- Process Data (Filter & Sort) ---
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 1. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name?.toLowerCase().includes(lowerTerm) || 
        s.rollNo?.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Filter Flagged
    if (showFlaggedOnly) {
      result = result.filter(s => s.isFlagged);
    }

    // 3. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, searchTerm, showFlaggedOnly, sortConfig]);

  // --- Statistics ---
  const totalStudents = students.length;
  const totalLeaves = students.reduce((sum, s) => sum + (s.totalLeaves || 0), 0);
  const flaggedStudents = students.filter(s => s.isFlagged).length;
  const avgLeaves = totalStudents > 0 ? (totalLeaves / totalStudents).toFixed(1) : 0;

  // Handler for sorting
  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <Loading message="Analyzing leave data..." />;

  return (
    <div className="min-h-screen text-slate-200 font-sans relative">
      <DynamicBackground />
      <GlobalHeader />

      <main className="container mx-auto px-4 py-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Student Attendance Insights</h1>
            <p className="text-slate-400 mt-1">Monitor leave patterns and identify at-risk students.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors backdrop-blur-md">
            <Download size={16} /> Export Report
          </button>
        </div>

        <ErrorMessage message={error} />

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Students" 
            value={totalStudents} 
            icon={Users} 
            color="text-blue-400" 
            bg="from-blue-500/20 to-blue-600/5" 
          />
          <StatCard 
            label="Total Leaves" 
            value={totalLeaves} 
            icon={Calendar} 
            color="text-indigo-400" 
            bg="from-indigo-500/20 to-indigo-600/5" 
          />
          <StatCard 
            label="Avg Leaves / Student" 
            value={avgLeaves} 
            icon={TrendingUp} 
            color="text-emerald-400" 
            bg="from-emerald-500/20 to-emerald-600/5" 
          />
          <StatCard 
            label="Flagged (High Risk)" 
            value={flaggedStudents} 
            icon={AlertTriangle} 
            color="text-rose-400" 
            bg="from-rose-500/20 to-rose-600/5" 
            border="border-rose-500/30"
          />
        </div>

        {/* --- Main Data Table Section --- */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or roll number..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all w-full justify-center sm:w-auto ${
                  showFlaggedOnly 
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' 
                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Filter size={16} />
                {showFlaggedOnly ? 'Showing Flagged' : 'Filter Flagged'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-300 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4 hidden md:table-cell">Year</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => requestSort('totalLeaves')}>
                    <div className="flex items-center gap-1">
                      Total Leaves <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Distribution</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-500">
                        <Search size={40} className="mb-3 opacity-50" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedStudents.map((student) => (
                    <tr 
                      key={student.studentId} 
                      className={`group hover:bg-white/5 transition-colors ${student.isFlagged ? 'bg-rose-500/5' : ''}`}
                    >
                      {/* Name & Roll */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
                            student.isFlagged 
                              ? 'bg-gradient-to-br from-rose-600 to-orange-700' 
                              : 'bg-gradient-to-br from-indigo-600 to-blue-700'
                          }`}>
                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-medium text-white">{student.name || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{student.rollNo || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                          {student.year ? `${student.year} Year` : 'N/A'}
                        </span>
                      </td>

                      {/* Total Leaves with Visual Bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 max-w-[120px]">
                          <span className={`text-base font-bold ${student.isFlagged ? 'text-rose-400' : 'text-white'}`}>
                            {student.totalLeaves || 0}
                          </span>
                          {/* Mini Progress Bar (Cap at 20 for visual scale) */}
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                student.isFlagged ? 'bg-rose-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min(((student.totalLeaves || 0) / 20) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Breakdown (Local vs Outstation) */}
                      <td className="px-6 py-4">
                        <div className="flex gap-4 text-xs">
                          <div>
                            <span className="block text-slate-500">Outstation</span>
                            <span className="font-medium text-purple-300">{student.outOfStation || 0}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500">Local</span>
                            <span className="font-medium text-cyan-300">{student.local || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        {student.isFlagged ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                            <AlertTriangle size={12} /> FLAGGED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Helper Component for Stats ---
const StatCard = ({ label, value, icon: Icon, color, bg, border = 'border-white/10' }) => (
  <div className={`relative overflow-hidden p-6 rounded-2xl border ${border} bg-slate-900/40 backdrop-blur-md group hover:bg-slate-800/40 transition-all duration-300`}>
    <div className={`absolute top-0 right-0 p-16 rounded-full bg-gradient-to-br ${bg} blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`} />
    
    <div className="relative z-10">
      <div className={`inline-flex p-3 rounded-xl bg-slate-950/50 mb-4 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-400">{label}</p>
    </div>
  </div>
);

export default StudentLeaves;