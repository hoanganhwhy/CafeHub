import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { getOrders, formatCurrency } from '../../utils/storage';
import { 
  TrendingUp, Calendar, DollarSign, ShoppingBag, 
  BarChart3, PieChart, History, Settings, LogOut,
  ArrowUp, ArrowDown, Coffee
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    today: { orders: 0, revenue: 0 },
    week: { orders: 0, revenue: 0 },
    month: { orders: 0, revenue: 0 },
    total: { orders: 0, revenue: 0 }
  });

  useEffect(() => {
    const allOrders = getOrders();
    setOrders(allOrders);
    calculateStats(allOrders);
  }, []);

  const calculateStats = (allOrders: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = allOrders.filter(order => new Date(order.createdAt) >= today);
    const weekOrders = allOrders.filter(order => new Date(order.createdAt) >= weekStart);
    const monthOrders = allOrders.filter(order => new Date(order.createdAt) >= monthStart);

    setStats({
      today: {
        orders: todayOrders.length,
        revenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
      },
      week: {
        orders: weekOrders.length,
        revenue: weekOrders.reduce((sum, order) => sum + order.total, 0)
      },
      month: {
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, order) => sum + order.total, 0)
      },
      total: {
        orders: allOrders.length,
        revenue: allOrders.reduce((sum, order) => sum + order.total, 0)
      }
    });
  };

  const getRevenueChart = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      last7Days.push({
        day: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        revenue,
        orders: dayOrders.length
      });
    }
    return last7Days;
  };

  const chartData = getRevenueChart();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Coffee className="w-7 h-7 text-white" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DASHBOARD ADMIN
                </h1>
                <p className="text-sm text-gray-600 font-medium">Thống kê doanh thu và quản lý</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl">
                <span className="font-medium text-gray-700">{currentUser.name}</span>
                <span className="text-xs px-2 py-1 rounded-full font-bold bg-red-100 text-red-700">
                  ADMIN
                </span>
              </div>

              <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300 font-medium"
              >
                <History className="w-4 h-4" />
                <span>Đơn hàng</span>
              </button>

              <button
                onClick={() => navigate('/menu-management')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>Quản lý</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-300 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Hôm nay</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.today.orders} đơn</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.today.revenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tuần này</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.week.orders} đơn</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(stats.week.revenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tháng này</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.month.orders} đơn</p>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(stats.month.revenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tổng cộng</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.total.orders} đơn</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.total.revenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Biểu đồ doanh thu 7 ngày qua</h2>
          </div>

          <div className="grid grid-cols-7 gap-4 h-64">
            {chartData.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex-1 flex flex-col justify-end w-full">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-purple-600 relative group"
                    style={{ 
                      height: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0}%`,
                      minHeight: day.revenue > 0 ? '20px' : '4px'
                    }}
                  >
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(day.revenue)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-bold text-gray-900">{day.day}</div>
                  <div className="text-xs text-gray-600">{day.orders} đơn</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <History className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lịch sử đơn hàng</h3>
            </div>
            <p className="text-gray-600">Xem và quản lý tất cả đơn hàng</p>
          </button>

          <button
            onClick={() => navigate('/menu-management')}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quản lý menu</h3>
            </div>
            <p className="text-gray-600">Thêm, sửa, xóa các món ăn</p>
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trung bình/đơn</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.total.orders > 0 ? stats.total.revenue / stats.total.orders : 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;