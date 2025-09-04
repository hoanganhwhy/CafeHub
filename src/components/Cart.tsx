import React from 'react';
import { CartItem as CartItemType } from '../types';
import { formatCurrency } from '../utils/storage';
import { ShoppingCart, Sparkles, CreditCard } from 'lucide-react';
import CartItem from './CartItem/CartItem';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onCheckout: () => void;
  total: number;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onCheckout,
  total
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Giỏ hàng</h2>
            <p className="text-blue-100 text-sm">Quản lý đơn hàng của bạn</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="font-bold text-lg">
              {items.length}
            </span>
          </div>
        </div>
      </div>
      
      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-300" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500">Thêm món từ menu để bắt đầu</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onUpdateNotes={onUpdateNotes}
            />
          ))
        )}
      </div>
      
      {/* Checkout Section */}
      {items.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          {/* Summary */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Số món:</span>
              <span className="font-bold text-gray-900">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
          
          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 flex items-center justify-center gap-3"
          >
            <CreditCard className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-lg">Thanh toán ngay</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;