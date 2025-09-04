import React from 'react';
import { Coffee, UtensilsCrossed, IceCream, Grid3X3 } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Đồ uống':
        return <Coffee className="w-5 h-5" />;
      case 'Món ăn':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Tráng miệng':
        return <IceCream className="w-5 h-5" />;
      default:
        return <Grid3X3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Danh mục món ăn
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className={`transition-transform duration-300 ${selectedCategory === category ? 'rotate-12' : 'group-hover:rotate-12'}`}>
              {getCategoryIcon(category)}
            </div>
            <span>{category}</span>
            {selectedCategory === category && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;