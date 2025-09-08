import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { MenuItem, CartItem, Order, User } from './types';
import { getMenuItems, saveMenuItems, saveOrder, formatCurrency, generateOrderId } from './utils/storage';
import { getCurrentUser, logout, isAdmin } from './utils/auth';
import { sampleMenuItems } from './data/sampleMenu';

import Header from './components/Header/Header';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import InvoicePage from './components/InvoicePage';
import OrderHistory from './components/OrderHistory';
import MenuManagement from './components/MenuManagement';
import LoginPage from './components/LoginPage/LoginPage';
import ShiftReportPage from './components/ShiftReportPage/ShiftReportPage';

// 👉 import Dashboard của bạn (đặt file tại: src/components/Dashboard/Dashboard.tsx)
import Dashboard from './components/Dashboard/Dashboard';

interface POSMainProps {
  currentUser: User;
  onLogout: () => void;
}

const POSMain: React.FC<POSMainProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const storedItems = getMenuItems();
    if (storedItems.length === 0) {
      saveMenuItems(sampleMenuItems);
      setMenuItems(sampleMenuItems);
    } else {
      setMenuItems(storedItems);
    }
  }, []);

  const categories = ['Tất cả', ...new Set(menuItems.map(item => item.category))];

  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateNotes = (id: string, notes: string) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, notes } as CartItem : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = (payment: number, change: number) => {
    const order: Order = {
      id: generateOrderId(),
      items: cartItems,
      total: calculateTotal(),
      payment,
      change,
      createdAt: new Date(),
    };

    saveOrder(order);
    setCartItems([]);
    setIsPaymentModalOpen(false);
    navigate(`/invoice?id=${order.id}`);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header currentUser={currentUser} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <div className="p-6">
                <MenuGrid
                  items={menuItems}
                  selectedCategory={selectedCategory}
                  onAddToCart={addToCart}
                />
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onUpdateNotes={updateNotes}
              onCheckout={() => setIsPaymentModalOpen(true)}
              total={total}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        onPayment={handlePayment}
      />
    </div>
  );
};

const ShiftReportWrapper: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const shiftData = location?.state?.shiftData;

  if (!shiftData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">Không có dữ liệu ca</h1>
          <p className="text-gray-600 mb-6">Hãy chốt ca từ Header để tạo báo cáo.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return <ShiftReportPage shiftData={shiftData} onClose={() => navigate(-1)} />;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('pos-shift-start', new Date().toISOString());
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // Chưa đăng nhập
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        {/* ✅ Admin vào thẳng Dashboard, nhân viên vào POS */}
        <Route
          path="/"
          element={
            isAdmin(currentUser)
              ? <Dashboard currentUser={currentUser} onLogout={handleLogout} />
              : <POSMain currentUser={currentUser} onLogout={handleLogout} />
          }
        />

        {/* Tuỳ chọn: route tường minh cho Dashboard (admin) */}
        <Route
          path="/dashboard"
          element={
            isAdmin(currentUser)
              ? <Dashboard currentUser={currentUser} onLogout={handleLogout} />
              : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-600">Chỉ admin mới có thể xem Dashboard</p>
                  </div>
                </div>
              )
          }
        />

        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/shift-report" element={<ShiftReportWrapper />} />

        <Route
          path="/orders"
          element={<OrderHistory currentUser={currentUser} onLogout={handleLogout} />}
        />

        <Route
          path="/menu-management"
          element={
            isAdmin(currentUser)
              ? <MenuManagement />
              : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-600">Chỉ admin mới có thể quản lý menu</p>
                  </div>
                </div>
              )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
