import React, { useState, useRef, useEffect } from 'react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/storage';
import { Minus, Plus, Trash2, StickyNote, Edit3 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes
}) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // ===== Inline edit quantity =====
  const [editing, setEditing] = useState(false);
  const [tempQty, setTempQty] = useState(item.quantity.toString());
  const qtyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setTempQty(item.quantity.toString());
      qtyInputRef.current?.focus();
      qtyInputRef.current?.select();
    }
  }, [editing, item.quantity]);

  const commitQuantity = () => {
    const n = parseInt(tempQty, 10);
    if (Number.isFinite(n)) {
      onUpdateQuantity(item.id, Math.max(1, n)); // chỉ cần >=1
    }
    setEditing(false);
  };
  // ===========================================

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemoveItem(item.id);
    }, 300);
  };

  return (
    <div
      className={`bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg transform ${
        isRemoving ? 'animate-pulse scale-95 opacity-50' : 'hover:scale-102'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600">{formatCurrency(item.price)} / món</p>
        </div>
        <button
          onClick={handleRemove}
          className="group text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
        >
          <Trash2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        </button>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-md border border-gray-100">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="group bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </button>

          {/* Số lượng – double-click để nhập */}
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-lg shadow-lg
                       text-center w-14 h-10 flex items-center justify-center select-none"
            onDoubleClick={() => setEditing(true)}
            title="Nhấp đúp để nhập số lượng"
          >
            {editing ? (
              <input
                ref={qtyInputRef}
                type="text"
                value={tempQty}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setTempQty(raw); // không giới hạn max
                }}
                onBlur={commitQuantity}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitQuantity();
                  if (e.key === 'Escape') setEditing(false);
                }}
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0
                           text-white font-bold text-lg text-center w-full caret-white tabular-nums"
                style={{ lineHeight: 1 }}
              />
            ) : (
              <span className="cursor-text tabular-nums">{item.quantity}</span>
            )}
          </div>

          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} // bỏ min/max
            className="group bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/30"
          >
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </button>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {formatCurrency(item.price * item.quantity)}
          </div>
          <div className="text-xs text-gray-500">Thành tiền</div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className={`group flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            item.notes
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 hover:from-yellow-200 hover:to-orange-200'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
          }`}
        >
          <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          <span>Ghi chú</span>
          {item.notes && (
            <div className="flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">✓</span>
            </div>
          )}
        </button>

        {notesOpen && (
          <div className="animate-fade-in">
            <textarea
              value={item.notes || ''}
              onChange={(e) => onUpdateNotes(item.id, e.target.value)}
              placeholder="Thêm ghi chú đặc biệt cho món này..."
              className="w-full p-3 text-sm border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              rows={3}
            />
          </div>
        )}

        {item.notes && !notesOpen && (
          <div className="text-sm text-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border-l-4 border-orange-400 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Edit3 className="w-3 h-3 text-orange-500" />
              <span className="font-medium text-orange-700">Ghi chú:</span>
            </div>
            {item.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
