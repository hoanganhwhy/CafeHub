import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuItem, CartItem, Order } from './types';
import { getMenuItems, saveMenuItems, saveOrder, generateOrderId } from './utils/storage';
import { sampleMenuItems } from './data/sampleMenu';
import Header from './components/Header/Header';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import InvoicePage from './components/InvoicePage';
import OrderHistory from './components/OrderHistory';
import MenuManagement from './components/MenuManagement';
import { useNavigate } from 'react-router-dom';

const POSMain: React.FC = () => {
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
      item.id === id ? { ...item, notes } : item
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
      <Header />

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

              {/* Menu Grid */}
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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<POSMain />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/menu-management" element={<MenuManagement />} />
      </Routes>
    </Router>
  );
};

export default App;