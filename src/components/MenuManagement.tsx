import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';
import { getMenuItems, saveMenuItems, formatCurrency } from '../utils/storage';
import { 
  ArrowLeft, Plus, Edit, Trash2,
  Coffee, UtensilsCrossed, IceCream,
  Save, X, AlertCircle, CheckCircle
} from 'lucide-react';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const categories = ['Đồ uống', 'Món ăn', 'Tráng miệng'];

  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      showNotification('error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const updatedItems = [...menuItems];
      
      if (isEditing) {
        const index = updatedItems.findIndex(item => item.id === isEditing);
        if (index !== -1) {
          updatedItems[index] = { ...updatedItems[index], ...formData } as MenuItem;
          showNotification('success', 'Cập nhật món thành công!');
        }
      } else {
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: formData.name!,
          price: Number(formData.price!),
          category: formData.category!,
          description: formData.description || '',
        };
        updatedItems.push(newItem);
        showNotification('success', 'Thêm món mới thành công!');
      }

      setMenuItems(updatedItems);
      saveMenuItems(updatedItems);
      resetForm();
      setIsLoading(false);
    }, 600);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa món "${name}"?`)) {
      setIsLoading(true);
      setTimeout(() => {
        const updatedItems = menuItems.filter(item => item.id !== id);
        setMenuItems(updatedItems);
        saveMenuItems(updatedItems);
        showNotification('success', 'Xóa món thành công!');
        setIsLoading(false);
      }, 400);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setIsEditing(item.id);
    setFormData(item);
    setIsAddingNew(false);
  };

  const resetForm = () => {
    setFormData({});
    setIsEditing(null);
    setIsAddingNew(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Đồ uống':
        return <Coffee className="w-5 h-5" />;
      case 'Món ăn':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Tráng miệng':
        return <IceCream className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Đồ uống': return '☕';
      case 'Món ăn': return '🍜';
      case 'Tráng miệng': return '🍨';
      default: return '🍽️';
    }
  };

  const groupedItems = categories.map(category => ({
    category,
    items: menuItems.filter(item => item.category === category)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border-2 transform transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } animate-slide-in-right`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
              <span className="font-medium">Quay lại POS</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Quản lý Menu
              </h1>
              <p className="text-gray-600 font-medium">Thêm, sửa, xóa các món ăn</p>
            </div>
            
            <button
              onClick={() => setIsAddingNew(true)}
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              <span className="font-medium">Thêm món mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Add/Edit Form */}
        {(isAddingNew || isEditing) && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8 animate-bounce-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                {isEditing ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditing ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSaveItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Tên món *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                    placeholder="Nhập tên món ăn..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Giá *
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                    placeholder="Nhập giá..."
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryEmoji(category)} {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                    placeholder="Mô tả món ăn..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="group flex items-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      {isEditing ? 'Cập nhật món' : 'Thêm món mới'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bảng theo danh mục */}
        <div className="space-y-8">
          {groupedItems.map(({ category, items }, categoryIndex) => (
            <div 
              key={category} 
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 200}ms` }}
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                      {getCategoryIcon(category)}
                      <div className="text-white"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span>{getCategoryEmoji(category)}</span>
                        {category}
                      </h2>
                      <p className="text-gray-600">Quản lý các món trong danh mục này</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                    {items.length} món
                  </div>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4 opacity-50">{getCategoryEmoji(category)}</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có món nào</h3>
                  <p className="text-gray-500">Thêm món đầu tiên cho danh mục này</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Tên món
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {items.map((item, index) => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getCategoryEmoji(category)}</span>
                              <div className="font-bold text-gray-900 text-lg">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200">
                              <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-gray-600 max-w-xs">
                              {item.description || (
                                <span className="italic text-gray-400">Chưa có mô tả</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                                disabled={isLoading}
                              >
                                <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                <span className="font-medium">Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                <span className="font-medium">Xóa</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
