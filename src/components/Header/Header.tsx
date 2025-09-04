import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, History, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <History className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-medium">Đơn hàng</span>
            </button>
            <button
              onClick={() => navigate('/menu-management')}
              className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              <span className="font-medium">Quản lý</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;