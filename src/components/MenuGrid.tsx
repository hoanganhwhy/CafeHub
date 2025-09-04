  import React from 'react';
  import { MenuItem } from '../types';
  import { getOrders } from '../utils/storage';
  import MenuCard from './MenuCard/MenuCard';

  interface MenuGridProps {
    items: MenuItem[];
    selectedCategory: string;
    onAddToCart: (item: MenuItem) => void;
  }

  const MenuGrid: React.FC<MenuGridProps> = ({ items, selectedCategory, onAddToCart }) => {
    // Tính tổng số lượng bán của từng món (toàn cục)
    const getItemSales = (): Record<string, number> => {
      const orders = getOrders();
      const itemSales: Record<string, number> = {};
      orders.forEach(order => {
        order.items.forEach(orderItem => {
          itemSales[orderItem.id] = (itemSales[orderItem.id] || 0) + orderItem.quantity;
        });
      });
      return itemSales;
    };

    const itemSales = getItemSales();

    // Lọc món theo category
    const filteredItems = selectedCategory === 'Tất cả' 
      ? items 
      : items.filter(item => item.category === selectedCategory);

    // Sắp xếp theo số lượng bán (nhiều nhất lên đầu)
    const sortedItems = filteredItems.sort((a, b) => {
      const salesA = itemSales[a.id] || 0;
      const salesB = itemSales[b.id] || 0;
      return salesB - salesA;
    });

    // Tính rank cho top 3 trong danh sách đã lọc
    const getBestSellerRank = (itemId: string, index: number): number => {
      // Chỉ top 3 đầu tiên trong danh sách đã sắp xếp mới có rank
      if (index < 3 && (itemSales[itemId] || 0) > 0) {
        return index + 1;
      }
      return 0;
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedItems.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            index={index}
            bestSellerRank={getBestSellerRank(item.id, index)}
          />
        ))}
        
        {sortedItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có món nào</h3>
            <p className="text-gray-500">Thử chọn danh mục khác hoặc thêm món mới</p>
          </div>
        )}
      </div>
    );
  };

  export default MenuGrid;