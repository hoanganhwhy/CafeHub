import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order, User } from "../types";
import { getOrders, formatCurrency, formatDate } from "../utils/storage";
import { isAdmin } from "../utils/auth";
import {
  Search,
  Eye,
  Printer,
  ArrowLeft,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Filter,
  Settings,
} from "lucide-react";
import StatsCard from "./StatsCard/StatsCard";

interface OrderHistoryProps {
  currentUser: User;
  onLogout: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  currentUser,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
    setFilteredOrders(loadedOrders);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, dateFilter, orders]);

  const handleViewInvoice = (orderId: string) => {
    navigate(`/invoice?id=${orderId}`);
  };

  const handlePrintInvoice = (orderId: string) => {
    const invoiceWindow = window.open(`/invoice?id=${orderId}`, "_blank");
    if (invoiceWindow) {
      invoiceWindow.addEventListener("load", () => {
        invoiceWindow.print();
      });
    }
  };

  const getTodayOrders = () => {
    const today = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    });
  };

  const getTodayRevenue = () => {
    return getTodayOrders().reduce((sum, order) => sum + order.total, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-2 right-2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {!isAdmin(currentUser) && (
              <button
                onClick={() => navigate("/")}
                className="group flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
                <span className="font-medium">Quay lại POS</span>
              </button>
            )}

            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isAdmin(currentUser) ? "Quản lý đơn hàng" : "Lịch sử đơn hàng"}
              </h1>
              <p className="text-gray-600 font-medium">
                Theo dõi và quản lý tất cả đơn hàng
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl">
                <span className="text-green-700 font-bold">
                  {orders.length}
                </span>
                <span className="text-green-600 text-sm ml-1">đơn hàng</span>
              </div>
              {isAdmin(currentUser) && (
                <button
                  onClick={() => navigate("/menu-management")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Quản lý menu</span>
                  </div>
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-300 font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={FileText}
            title="Tổng đơn hàng"
            value={orders.length}
            color="blue"
          />
          <StatsCard
            icon={Calendar}
            title="Đơn hôm nay"
            value={getTodayOrders().length}
            color="green"
          />
          <StatsCard
            icon={DollarSign}
            title="Doanh thu hôm nay"
            value={formatCurrency(getTodayRevenue())}
            color="orange"
          />
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tìm kiếm
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo mã đơn hàng, ghi chú, tên món..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Lọc theo ngày
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                />
              </div>
            </div>
          </div>

          {(searchTerm || dateFilter) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-300 transform hover:scale-105"
              >
                <span>Xóa bộ lọc</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Orders List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/2 transform translate-x-8 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {orders.length === 0
                  ? "Chưa có đơn hàng nào"
                  : "Không tìm thấy đơn hàng"}
              </h3>
              <p className="text-gray-600 text-lg">
                {orders.length === 0
                  ? "Các đơn hàng sẽ hiển thị ở đây sau khi bạn tạo đơn đầu tiên."
                  : "Thử điều chỉnh bộ lọc để tìm đơn hàng khác."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Mã đơn hàng
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Thời gian
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Món ăn
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Tổng tiền
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-3 h-3 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">
                              {order.id}
                            </div>
                            {order.notes && (
                              <div className="text-sm text-gray-500 bg-yellow-50 px-2 py-1 rounded-lg mt-1">
                                💬 {order.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 rounded-xl">
                          <div className="text-sm font-bold text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item, itemIndex) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white px-3 py-2 rounded-lg"
                            >
                              <span className="text-2xl">
                                {itemIndex === 0 ? "🍜" : "☕"}
                              </span>
                              <div className="flex-1">
                                <span className="font-medium text-gray-900">
                                  {item.name}
                                </span>
                                <span className="text-blue-600 font-bold ml-2">
                                  x{item.quantity}
                                </span>
                                {item.notes && (
                                  <div className="text-xs text-gray-500 italic">
                                    📝 {item.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-center py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                              <span className="text-blue-600 font-bold">
                                +{order.items.length - 2} món khác
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {formatCurrency(order.total)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 space-y-1">
                            <div>
                              💰 Nhận:{" "}
                              <span className="font-medium">
                                {formatCurrency(order.payment)}
                              </span>
                            </div>
                            <div>
                              💸 Thừa:{" "}
                              <span className="font-medium">
                                {formatCurrency(order.change)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewInvoice(order.id)}
                            className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                          >
                            <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-medium">Xem</span>
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(order.id)}
                            className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
                          >
                            <Printer className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                            <span className="font-medium">In</span>
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
      </div>
    </div>
  );
};

export default OrderHistory;
