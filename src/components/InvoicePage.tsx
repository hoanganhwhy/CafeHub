import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { getOrders, formatCurrency, formatDate } from '../utils/storage';
import { ArrowLeft, Printer, Download, Share2, CheckCircle, Sparkles } from 'lucide-react';

const InvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('id');
    if (orderId) {
      setTimeout(() => {
        const orders = getOrders();
        const foundOrder = orders.find(o => o.id === orderId);
        setOrder(foundOrder || null);
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-2 right-2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Đang tải hóa đơn...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-gray-200/50">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy hóa đơn</h2>
          <p className="text-gray-600 mb-6">Hóa đơn này có thể đã bị xóa hoặc không tồn tại</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Header - Only visible on screen */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 print:hidden sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/orders')}
              className="group flex items-center gap-3 text-gray-600 hover:text-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-xl group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
              <span className="font-medium">Quay lại danh sách</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Hóa đơn #{order.id}
              </h1>
              <p className="text-gray-600">Chi tiết đơn hàng</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
              >
                {isPrinting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang in...
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    In hóa đơn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Invoice Content */}
      <div className="max-w-3xl mx-auto p-8 print:p-0 print:max-w-none">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl print:shadow-none print:rounded-none border border-gray-200/50 overflow-hidden">
          <div className="p-10 print:p-6">
            {/* Enhanced Header */}
            <div className="text-center mb-10 border-b-2 border-gradient-to-r from-blue-200 to-purple-200 pb-8">
              <div className="relative mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  CỬA HÀNG ABC
                </h1>
                <div className="absolute -top-2 -right-4">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">📍 123 Đường ABC, Quận XYZ, TP.HCM</p>
                <p className="font-medium">📞 Điện thoại: 0123.456.789</p>
                <p className="font-medium">✉️ Email: info@cuahangabc.com</p>
              </div>
            </div>

            {/* Success Badge */}
            <div className="flex justify-center mb-8 print:hidden">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 px-6 py-3 rounded-2xl flex items-center gap-3 animate-bounce-in">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-bold">Thanh toán thành công!</span>
              </div>
            </div>

            {/* Enhanced Invoice Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-6 uppercase bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🧾 Hóa Đơn Bán Hàng
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    📋 Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Mã đơn hàng:</span> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{order.id}</span></p>
                    <p><span className="font-semibold">Ngày tạo:</span> {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    👤 Thông tin khách hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Thu ngân:</span> Admin</p>
                    <p><span className="font-semibold">Khách hàng:</span> Khách lẻ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Items Table */}
            <div className="mb-8 overflow-hidden rounded-2xl border-2 border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-blue-100">
                    <th className="text-left py-4 px-4 font-bold text-gray-800">STT</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-800">Tên món</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800">SL</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-800">Đơn giá</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-800">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <span className="text-xl">
                              {item.category === 'Đồ uống' ? '☕' : item.category === 'Món ăn' ? '🍜' : '🍨'}
                            </span>
                            {item.name}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-gray-600 italic bg-yellow-50 px-3 py-1 rounded-lg mt-2 border border-yellow-200">
                              📝 Ghi chú: {item.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-xl font-bold text-blue-800">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-700">{formatCurrency(item.price)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="font-bold text-yellow-800 text-lg">Ghi chú đơn hàng</h3>
                </div>
                <p className="text-yellow-800 font-medium">{order.notes}</p>
              </div>
            )}

            {/* Enhanced Total Section */}
            <div className="border-t-4 border-gradient-to-r from-blue-300 to-purple-300 pt-6 mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex justify-end">
                  <div className="w-80 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span className="font-bold text-gray-700 text-lg">Tổng cộng:</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-medium">💰 Tiền nhận:</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(order.payment)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 bg-gradient-to-r from-green-50 to-emerald-50 px-4 rounded-xl">
                      <span className="font-bold text-green-800 text-lg">💸 Tiền thừa:</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatCurrency(order.change)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="text-center space-y-4 border-t-2 border-gray-200 pt-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">🙏</span>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Cảm ơn quý khách!
                  </h3>
                </div>
                <p className="text-gray-700 font-medium">Hẹn gặp lại quý khách trong những lần tới!</p>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="font-medium">🕐 Hóa đơn được in lúc: {formatDate(new Date())}</p>
                <p className="mt-1">💻 Hệ thống POS - Phiên bản 2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;