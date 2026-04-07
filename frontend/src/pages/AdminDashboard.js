import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { FiUsers, FiBriefcase, FiCalendar, FiClock, FiCheck, FiX, FiStar, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editSkills, setEditSkills] = useState('');
  const [editAvailable, setEditAvailable] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboard();
    fetchWorkers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    }
  };

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getWorkers();
      setWorkers(data);
    } catch (error) {
      toast.error('Failed to fetch workers');
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const loadingToast = toast.loading('Approving worker...');
    try {
      await adminAPI.approveWorker(id);
      toast.success('Worker approved successfully!', { id: loadingToast });
      fetchWorkers();
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to approve worker', { id: loadingToast });
    }
  };

  const handleEdit = (worker) => {
    setEditModal(worker);
    setEditSkills(worker.skills.join(', '));
    setEditAvailable(worker.isAvailable);
  };

  const handleUpdate = async () => {
    const loadingToast = toast.loading('Updating worker...');
    try {
      await adminAPI.updateWorker(editModal._id, {
        skills: editSkills.split(',').map(s => s.trim()).filter(s => s),
        isAvailable: editAvailable
      });
      toast.success('Worker updated successfully!', { id: loadingToast });
      setEditModal(null);
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to update worker', { id: loadingToast });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will also delete their user account and all bookings.`)) {
      return;
    }
    const loadingToast = toast.loading('Deleting worker...');
    try {
      await adminAPI.deleteWorker(id);
      toast.success('Worker deleted successfully!', { id: loadingToast });
      fetchWorkers();
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to delete worker', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage workers and monitor platform activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiUsers size={24} />
              </div>
              <span className="text-3xl font-bold">{stats.totalUsers || 0}</span>
            </div>
            <h3 className="text-blue-100 text-sm font-medium">Total Users</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiBriefcase size={24} />
              </div>
              <span className="text-3xl font-bold">{stats.totalWorkers || 0}</span>
            </div>
            <h3 className="text-purple-100 text-sm font-medium">Total Workers</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiCalendar size={24} />
              </div>
              <span className="text-3xl font-bold">{stats.totalBookings || 0}</span>
            </div>
            <h3 className="text-green-100 text-sm font-medium">Total Bookings</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiClock size={24} />
              </div>
              <span className="text-3xl font-bold">{stats.pendingApprovals || 0}</span>
            </div>
            <h3 className="text-orange-100 text-sm font-medium">Pending Approvals</h3>
          </div>
        </div>

        {/* Workers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Workers Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and approve worker registrations</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading workers...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">👷</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Workers Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Workers will appear here once they register</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Worker</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {workers.map(worker => (
                    <tr key={worker._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {worker.userId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white">{worker.userId?.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{worker.userId?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <FiMapPin size={14} />
                          <span className="text-sm">{worker.userId?.city || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <FiStar className="text-yellow-500" size={16} fill="currentColor" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{worker.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({worker.totalRatings})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {worker.isApproved ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold">
                            <FiCheck size={14} /> <span>Approved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 rounded-full text-sm font-semibold">
                            <FiClock size={14} /> <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {!worker.isApproved && (
                            <button
                              onClick={() => handleApprove(worker._id)}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 text-sm"
                            >
                              <FiCheck size={14} /> <span>Approve</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(worker)}
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 text-sm"
                          >
                            <FiEdit2 size={14} /> <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(worker._id, worker.userId?.name)}
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition transform hover:scale-105 text-sm"
                          >
                            <FiTrash2 size={14} /> <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Worker</h3>
              <button onClick={() => setEditModal(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Worker Name</label>
                <input
                  type="text"
                  value={editModal.userId?.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Electrician, Plumber, Carpenter"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={editAvailable}
                  onChange={(e) => setEditAvailable(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="available" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available for work</label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition"
              >
                Update Worker
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
