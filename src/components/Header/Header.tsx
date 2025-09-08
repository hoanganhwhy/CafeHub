import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee, History, Settings, LogOut, User, CheckCircle } from 'lucide-react';
import { User as UserType } from '../../types';
import { isAdmin } from '../../utils/auth';
import ShiftEndModal from '../ShiftEndModal/ShiftEndModal';

interface HeaderProps {
  currentUser: UserType;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = isAdmin(currentUser);

  const [openShiftModal, setOpenShiftModal] = useState(false);

  const baseBtn =
    'group flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg';
  const grayBtn =
    'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700';
  const purpleBtn =
    'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-purple-50 hover:to-purple-100 hover:text-purple-700';
  const dangerBtn =
    'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 hover:text-red-800';

  const isOrders = location.pathname.startsWith('/orders');
  const isManage = location.pathname.startsWith('/menu-management');

  // Chốt ca -> điều hướng sang trang báo cáo ca (shift-report)
  const handleConfirmShift = () => {
    const startIso = localStorage.getItem('pos-shift-start');
    const now = new Date();
    const startTime = startIso ? new Date(startIso) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const shiftData = {
      totalOrders: 0,          // để tránh phụ thuộc, trang report sẽ tự tính nếu bạn muốn
      totalRevenue: 0,         // (hoặc bạn có thể tính từ localStorage đơn hàng như bản trước)
      startTime,
      endTime: now,
      employeeName: currentUser.name,
    };

    setOpenShiftModal(false);
    navigate('/shift-report', { state: { shiftData } });
    localStorage.setItem('pos-shift-start', now.toISOString());
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-4 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <div className="transform transition-all duration-300 group-hover:translate-x-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CỬA HÀNG ABC
              </h1>
              <p className="text-sm text-gray-600 font-medium">Hệ thống POS thông minh</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">{currentUser.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                admin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {admin ? 'ADMIN' : 'NHÂN VIÊN'}
              </span>
            </div>

            {/* Đơn hàng – cho cả NV & Admin */}
            <button
              onClick={() => navigate('/orders')}
              className={`${baseBtn} ${grayBtn} ${isOrders ? 'ring-2 ring-blue-300' : ''}`}
              title="Lịch sử đơn hàng"
            >
              <History className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium">Đơn hàng</span>
            </button>

            {/* Chốt ca – cho cả NV & Admin */}
            <button
              onClick={() => setOpenShiftModal(true)}
              className={`${baseBtn} ${grayBtn}`}
              title="Chốt ca"
            >
              <CheckCircle className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium">Chốt ca</span>
            </button>

            {/* Quản lý – chỉ Admin */}
            {admin && (
              <button
                onClick={() => navigate('/menu-management')}
                className={`${baseBtn} ${purpleBtn} ${isManage ? 'ring-2 ring-purple-300' : ''}`}
                title="Quản lý menu"
              >
                <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                <span className="font-medium">Quản lý</span>
              </button>
            )}

            {/* Đăng xuất */}
            <button
              onClick={onLogout}
              className={`${baseBtn} ${dangerBtn}`}
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal chốt ca */}
      <ShiftEndModal
        isOpen={openShiftModal}
        onClose={() => setOpenShiftModal(false)}
        onConfirm={handleConfirmShift}
        employeeName={currentUser.name}
      />
    </div>
  );
};

export default Header;
