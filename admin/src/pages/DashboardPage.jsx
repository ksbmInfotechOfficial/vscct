import { useState, useEffect } from 'react';
import { Users, Bell, TrendingUp, MapPin, RefreshCw } from 'lucide-react';
import { adminApi } from '../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to VSSCT Admin Panel</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-orange-500"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtext={`${stats?.activeUsers || 0} active`}
        />
        <StatCard
          icon={TrendingUp}
          label="Complete Profiles"
          value={stats?.completeProfiles || 0}
          color="bg-gradient-to-br from-green-500 to-green-600"
          subtext={`${Math.round((stats?.completeProfiles / stats?.totalUsers) * 100) || 0}% completion`}
        />
        <StatCard
          icon={Bell}
          label="Notifications Sent"
          value={stats?.totalNotifications || 0}
          color="bg-gradient-to-br from-orange-500 to-amber-500"
        />
        <StatCard
          icon={MapPin}
          label="States Covered"
          value={stats?.usersByState?.length || 0}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Users by State */}
      {stats?.usersByState?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Users by State</h2>
          <div className="space-y-3">
            {stats.usersByState.map((item, index) => (
              <div key={item.state} className="flex items-center gap-4 animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="w-32 text-sm text-gray-600 truncate">{item.state}</div>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-end px-3 transition-all duration-500"
                    style={{ width: `${(item.count / stats.usersByState[0].count) * 100}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
