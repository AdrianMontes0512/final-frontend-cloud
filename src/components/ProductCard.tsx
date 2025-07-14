import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../services/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with gradient background */}
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
      
      <div className="p-5">
        {/* Product Icon/Avatar */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors duration-300">
              <span className="text-lg font-bold text-orange-600">💊</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-900 transition-colors duration-200">
                  {product.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-medium">{product.activeIngredient}</p>
              </div>
              
              {/* Price Badge */}
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full shadow-md">
                  <span className="text-lg font-bold">${product.precio.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">por unidad</p>
              </div>
            </div>
            
            {/* Product Info Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                {product.dosageForm}
              </span>
              
              {product.prescriptionRequired ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                  Receta requerida
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Sin receta
                </span>
              )}
            </div>
            
            {/* Expiration Date */}
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Vence: {new Date(product.expirationDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Quantity Selector and Add to Cart */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Cantidad:</span>
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 text-gray-600 hover:text-orange-600"
                >
                  <Minus size={14} />
                </button>
                <div className="px-3 py-2 bg-white border-x border-gray-200 min-w-[3rem] text-center">
                  <span className="font-semibold text-gray-900">{quantity}</span>
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-orange-600"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="group/btn flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium"
            >
              <ShoppingCart size={16} className="group-hover/btn:animate-bounce" />
              <span>Agregar</span>
            </button>
          </div>
          
          {/* SKU Info */}
          {product.sku && (
            <div className="mt-3 text-xs text-gray-400">
              <span className="font-medium">SKU:</span> {product.sku.substring(0, 8)}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
