import { useState, useEffect } from 'react';
import { getStudentLeaves } from '../../services/academic.service';
import { DEPARTMENTS } from '../../utils/constants';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';


const AcademicStudentLeaves = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('CSE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentLeaves();
  }, []);

  useEffect(() => {
    if (selectedDepartment === 'ALL') {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(allStudents.filter(s => s.department === selectedDepartment));
    }
  }, [selectedDepartment, allStudents]);

  const fetchStudentLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentLeaves();
      setAllStudents(response.data || []);
      setFilteredStudents(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load student leave statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading student leave statistics..." />;
  }

  // Calculate summary statistics for filtered students
  const totalStudents = filteredStudents.length;
  const totalLeaves = filteredStudents.reduce((sum, s) => sum + (s.totalLeaves || 0), 0);
  const flaggedStudents = filteredStudents.filter(s => s.isFlagged).length;
  const avgLeaves = totalStudents > 0 ? (totalLeaves / totalStudents).toFixed(2) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Leave Statistics</h1>
        
        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Total Students</h3>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Total Leaves</h3>
          <p className="text-2xl font-bold text-blue-600">{totalLeaves}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Average Leaves</h3>
          <p className="text-2xl font-bold text-green-600">{avgLeaves}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Flagged Students</h3>
          <p className="text-2xl font-bold text-red-600">{flaggedStudents}</p>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Leaves
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out of Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No student leave data available for selected department
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.studentId}
                    className={student.isFlagged ? 'bg-red-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.year ? `${student.year}st Year` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {student.totalLeaves || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.outOfStation || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.local || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.isFlagged ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          ⚠ Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademicStudentLeaves;

