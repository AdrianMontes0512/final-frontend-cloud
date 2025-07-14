import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { CartItem } from '../hooks/useCart';
import { RegistrarCompra } from '../services/purchases';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  onCartModalChange?: (isOpen: boolean) => void;
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  getTotal,
  getTotalItems,
  onCartModalChange,
}: CartProps) {
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShowCart = (show: boolean) => {
    setShowCart(show);
    onCartModalChange?.(show);
  };

  const handlePurchase = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      console.log('=== DEBUG COMPRA ===');
      console.log('Token del localStorage:', token);
      console.log('User ID del localStorage:', userId);
      console.log('Items del carrito:', cartItems);
      console.log('Total calculado:', getTotal().toFixed(2));
      
      const purchaseData = {
        token: token || '',
        tenant_id: "inkafarma",
        user_id: userId || '',
        products: cartItems.map(item => ({
          product_id: item.product.sku || item.product.producto_id!,
          name: item.product.nombre,
          quantity: item.quantity,
          price: item.product.precio,
        })),
        total: getTotal(), // Usar el total original
      };

      console.log('=== DATOS DE COMPRA COMPLETOS ===');
      console.log('Estructura enviada:', JSON.stringify(purchaseData, null, 2));
      console.log('Endpoint:', 'https://k843m5c37g.execute-api.us-east-1.amazonaws.com/dev/compras/registrar-compra');
      
      await RegistrarCompra(purchaseData);
      onClearCart();
      handleShowCart(false);
      alert('¡Compra realizada exitosamente!');
    } catch (error: any) {
      console.error('=== ERROR EN COMPRA ===');
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert('Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      
      {/* Botón del carrito */}
      <button
        onClick={() => handleShowCart(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-40"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </div>
      </button>

      {/* Modal del carrito */}
      {showCart && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="text-center animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
                <h2 className="text-2xl font-bold text-gray-900">Carrito de Compras</h2>
                <p className="text-gray-600 mt-1">Revisa y confirma tu pedido</p>
              </div>
              <button
                onClick={() => handleShowCart(false)}
                className="text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto max-h-96 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.sku || item.product.producto_id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.nombre}</h3>
                        <p className="text-sm text-gray-600">{item.product.activeIngredient}</p>
                        <p className="text-sm text-gray-500">Forma: {item.product.dosageForm}</p>
                        <p className="text-lg font-bold text-orange-600">
                          ${item.product.precio.toFixed(2)} c/u
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.sku || item.product.producto_id!, item.quantity - 1)}
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium text-black">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.sku || item.product.producto_id!, item.quantity + 1)}
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${(item.product.precio * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => onRemoveItem(item.product.sku || item.product.producto_id!)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClearCart}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Limpiar Carrito
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Procesando...' : 'Realizar Compra'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
