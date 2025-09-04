import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/storage';
import { Plus, Sparkles } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  index: number;
  bestSellerRank?: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart, index, bestSellerRank = 0 }) => {
  const [isAdding, setIsAdding] = useState(false);

  const getItemEmoji = (category: string) => {
    switch (category) {
      case 'Đồ uống': return '☕';
      case 'Món ăn': return '🍜';
      case 'Tráng miệng': return '🍨';
      default: return '🍽️';
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(item);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const getBestSellerStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          border: 'border-4 border-yellow-400 shadow-2xl shadow-yellow-500/40',
          badge: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          emoji: '🥇'
        };
      case 2:
        return {
          border: 'border-4 border-gray-400 shadow-2xl shadow-gray-500/40',
          badge: 'bg-gradient-to-r from-gray-400 to-slate-500',
          emoji: '🥈'
        };
      case 3:
        return {
          border: 'border-4 border-orange-400 shadow-2xl shadow-orange-500/40',
          badge: 'bg-gradient-to-r from-orange-400 to-amber-500',
          emoji: '🥉'
        };
      default:
        return {
          border: 'border border-gray-100 hover:border-blue-200',
          badge: '',
          emoji: ''
        };
    }
  };

  const bestSellerStyle = getBestSellerStyle(bestSellerRank);

  return (
    <div 
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${bestSellerStyle.border} relative`}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Best Seller Badge */}
      {bestSellerRank > 0 && (
        <div className={`absolute -top-3 -right-3 ${bestSellerStyle.badge} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 transform group-hover:scale-110 transition-transform duration-300`}>
          {bestSellerRank}
        </div>
      )}

      {/* Best Seller Emoji */}
      {bestSellerRank > 0 && (
        <div className="absolute top-2 left-2 text-2xl z-10 animate-bounce">
          {bestSellerStyle.emoji}
        </div>
      )}

      {/* Image Section */}
      <div className={`relative h-36 ${bestSellerRank > 0 ? 'bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100' : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <span className="text-5xl transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 relative z-10">
          {getItemEmoji(item.category)}
        </span>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute bottom-6 left-6 w-3 h-3 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute top-8 left-8 w-2 h-2 text-blue-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Plus className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title - Fixed height */}
        <div className="h-16 mb-3 flex flex-col justify-start">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed overflow-hidden" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '2.5rem'
          }}>
            {item.description}
          </p>
        </div>
        
        {/* Price section - Fixed position */}
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              {formatCurrency(item.price)}
            </div>
            <div className="text-xs text-gray-500 font-medium">{item.category}</div>
          </div>
          
          <button
            className={`relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:shadow-blue-500/30 ${
              isAdding ? 'animate-pulse scale-110' : ''
            }`}
            onClick={handleAddToCart}
          >
            <Plus className={`w-5 h-5 transition-transform duration-300 ${isAdding ? 'rotate-180' : ''}`} />
            
            {/* Success ripple effect */}
            {isAdding && (
              <div className="absolute inset-0 bg-green-400 rounded-xl animate-ping opacity-75"></div>
            )}
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
    </div>
  );
};

export default MenuCard;