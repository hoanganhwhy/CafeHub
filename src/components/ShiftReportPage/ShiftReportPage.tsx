import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/storage';
import { ArrowLeft, Printer, Clock, DollarSign, FileText, User, Calendar, TrendingUp } from 'lucide-react';

interface ShiftReportPageProps {
  shiftData: {
    totalOrders: number;
    totalRevenue: number;
    startTime: Date;
    endTime: Date;
    employeeName: string;
  };
  onClose: () => void;
}

const ShiftReportPage: React.FC<ShiftReportPageProps> = ({ shiftData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getShiftDuration = () => {
    const duration = shiftData.endTime.getTime() - shiftData.startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getAverageOrderValue = () => {
    return shiftData.totalOrders > 0 ? shiftData.totalRevenue / shiftData.totalOrders : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header - Only visible on screen */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 print:hidden sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="group flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-xl group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
              <span className="font-medium">Quay lại POS</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Báo cáo chốt ca
              </h1>
              <p className="text-gray-600">Tổng kết ca làm việc</p>
            </div>
            
            <button
              onClick={handlePrint}
              className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
            >
              <Printer className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              In báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
        <div className="bg-white rounded-2xl shadow-2xl print:shadow-none print:rounded-none print:bg-white border border-gray-200/50 overflow-hidden">
          <div className="p-8 print:p-4">
            {/* Header */}
            <div className="text-center mb-8 print:mb-4 border-b-2 border-orange-200 pb-6 print:pb-3">
              <h1 className="text-3xl print:text-2xl font-bold text-orange-600 mb-2 print:mb-1">
                CỬA HÀNG ABC
              </h1>
              <div className="space-y-1 text-gray-600 text-sm print:text-xs">
                <p>📍 123 Đường ABC, Quận XYZ, TP.HCM</p>
                <p>📞 Điện thoại: 0123.456.789</p>
              </div>
            </div>

            {/* Report Title */}
            <div className="text-center mb-6 print:mb-4">
              <h2 className="text-2xl print:text-xl font-bold text-orange-600 mb-2 print:mb-1">
                📊 BÁO CÁO CHỐT CA
              </h2>
              <div className="bg-orange-100 border border-orange-200 px-4 py-2 print:px-2 print:py-1 rounded-lg inline-block">
                <span className="text-orange-800 font-semibold text-sm print:text-xs">
                  Báo cáo được tạo lúc: {formatDate(new Date())}
                </span>
              </div>
            </div>

            {/* Employee & Shift Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 mb-6 print:mb-4">
              <div className="bg-blue-50 p-4 print:p-2 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3 print:mb-2 flex items-center gap-2 text-sm print:text-xs">
                  <User className="w-5 h-5" />
                  Thông tin nhân viên
                </h3>
                <div className="space-y-2 print:space-y-1 text-sm print:text-xs">
                  <p>
                    <span className="font-semibold">Tên nhân viên:</span> 
                    <span className="font-bold text-blue-700 ml-1">{shiftData.employeeName}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Thời gian làm việc:</span> 
                    <span className="ml-1">{getShiftDuration()}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 print:p-2 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-3 print:mb-2 flex items-center gap-2 text-sm print:text-xs">
                  <Calendar className="w-5 h-5" />
                  Thời gian ca làm việc
                </h3>
                <div className="space-y-2 print:space-y-1 text-sm print:text-xs">
                  <p>
                    <span className="font-semibold">Bắt đầu:</span> 
                    <span className="ml-1">{formatDate(shiftData.startTime)}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Kết thúc:</span> 
                    <span className="ml-1">{formatDate(shiftData.endTime)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 print:p-3 mb-6 print:mb-4">
              <h3 className="text-xl print:text-lg font-bold text-center text-yellow-800 mb-4 print:mb-3 flex items-center justify-center gap-2">
                <TrendingUp className="w-6 h-6 print:w-5 print:h-5" />
                TỔNG KẾT DOANH THU CA
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                <div className="text-center bg-white p-4 print:p-2 rounded-lg border border-blue-200">
                  <FileText className="w-8 h-8 print:w-6 print:h-6 text-blue-600 mx-auto mb-2 print:mb-1" />
                  <div className="text-2xl print:text-xl font-bold text-blue-600 mb-1">{shiftData.totalOrders}</div>
                  <div className="text-blue-800 font-semibold text-sm print:text-xs">Tổng đơn hàng</div>
                </div>
                
                <div className="text-center bg-white p-4 print:p-2 rounded-lg border border-green-200">
                  <DollarSign className="w-8 h-8 print:w-6 print:h-6 text-green-600 mx-auto mb-2 print:mb-1" />
                  <div className="text-2xl print:text-xl font-bold text-green-600 mb-1">
                    {formatCurrency(shiftData.totalRevenue)}
                  </div>
                  <div className="text-green-800 font-semibold text-sm print:text-xs">Tổng doanh thu</div>
                </div>
                
                <div className="text-center bg-white p-4 print:p-2 rounded-lg border border-purple-200">
                  <TrendingUp className="w-8 h-8 print:w-6 print:h-6 text-purple-600 mx-auto mb-2 print:mb-1" />
                  <div className="text-2xl print:text-xl font-bold text-purple-600 mb-1">
                    {formatCurrency(getAverageOrderValue())}
                  </div>
                  <div className="text-purple-800 font-semibold text-sm print:text-xs">Trung bình/đơn</div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-50 rounded-lg p-4 print:p-2 mb-6 print:mb-4 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 print:mb-2 text-base print:text-sm">📈 Hiệu suất ca làm việc</h3>
              <div className="grid grid-cols-2 gap-3 print:gap-2 text-sm print:text-xs">
                <div className="bg-white p-3 print:p-2 rounded-lg">
                  <span className="text-gray-600 font-medium">Đơn hàng/giờ:</span>
                  <div className="font-bold text-blue-600 text-base print:text-sm">
                    {(shiftData.totalOrders / (parseInt(getShiftDuration().split('h')[0]) || 1)).toFixed(1)}
                  </div>
                </div>
                <div className="bg-white p-3 print:p-2 rounded-lg">
                  <span className="text-gray-600 font-medium">Doanh thu/giờ:</span>
                  <div className="font-bold text-green-600 text-base print:text-sm">
                    {formatCurrency(shiftData.totalRevenue / (parseInt(getShiftDuration().split('h')[0]) || 1))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-3 print:space-y-2 border-t border-gray-200 pt-4 print:pt-3">
              <div className="bg-orange-50 p-4 print:p-2 rounded-lg border border-orange-200">
                <h3 className="text-lg print:text-base font-bold text-orange-600 mb-1">
                  🎉 Cảm ơn bạn đã làm việc chăm chỉ!
                </h3>
                <p className="text-gray-700 text-sm print:text-xs">Chúc bạn nghỉ ngơi vui vẻ!</p>
              </div>
              
              <div className="text-xs print:text-xs text-gray-600 bg-gray-50 p-3 print:p-2 rounded-lg border border-gray-200">
                <p>🕐 Báo cáo được tạo lúc: {formatDate(new Date())}</p>
                <p className="mt-1">💻 Hệ thống POS - Phiên bản 2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftReportPage;