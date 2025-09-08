import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/storage';
import { X, Clock, DollarSign, FileText, Printer, CheckCircle } from 'lucide-react';

interface ShiftEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
}

const ShiftEndModal: React.FC<ShiftEndModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  employeeName 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm();
      setIsProcessing(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto transform animate-scale-in overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Chốt ca làm việc</h2>
                <p className="text-orange-100">Kết thúc ca của {employeeName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận chốt ca?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn kết thúc ca làm việc không? 
              Hệ thống sẽ tạo báo cáo doanh thu cho ca này.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">Sau khi chốt ca:</span>
            </div>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• Tạo báo cáo doanh thu ca làm việc</li>
              <li>• Có thể in báo cáo để nộp cho quản lý</li>
              <li>• Dữ liệu ca sẽ được lưu vào hệ thống</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300 transform hover:scale-105"
              disabled={isProcessing}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Xác nhận chốt ca'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftEndModal;