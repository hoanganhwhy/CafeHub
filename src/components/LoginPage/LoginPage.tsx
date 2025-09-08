import React, { useState } from 'react';
import { User } from '../../types';
import { login } from '../../utils/auth';
import { Coffee, Lock, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = login(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('nhanvien');
      setPassword('nv123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full border border-gray-200/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-2xl">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            CỬA HÀNG ABC
          </h1>
          <p className="text-gray-600 text-lg font-medium">Đăng nhập vào hệ thống POS</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 animate-bounce-in">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Tên đăng nhập
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                placeholder="Nhập tên đăng nhập..."
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                placeholder="Nhập mật khẩu..."
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!username || !password || isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 font-bold text-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Quick Login Buttons */}
        <div className="mt-8 space-y-3">
          <div className="text-center text-sm font-medium text-gray-600 mb-4">
            Đăng nhập nhanh:
          </div>
          
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="w-full p-4 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200 text-red-800 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-300 transform hover:scale-105 font-medium"
            disabled={isLoading}
          >
            👑 Đăng nhập Admin (admin/admin123)
          </button>
          
          <button
            type="button"
            onClick={() => handleQuickLogin('employee')}
            className="w-full p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 text-green-800 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 font-medium"
            disabled={isLoading}
          >
            👤 Đăng nhập Nhân viên (nhanvien/nv123)
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">Thông tin hệ thống</span>
          </div>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>• <strong>Admin:</strong> Quản lý menu + xem báo cáo</p>
            <p>• <strong>Nhân viên:</strong> Bán hàng + xem đơn hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;