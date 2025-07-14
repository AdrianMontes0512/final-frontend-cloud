import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Package } from 'lucide-react';
import { Purchase, ListarComprasUsuario } from '../services/purchases';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await ListarComprasUsuario();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <ShoppingBag className="text-orange-500" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Historial de Compras</h1>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No tienes compras aún</h2>
          <p className="text-gray-500">Cuando realices tu primera compra, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Compra #{purchase.id.slice(-8)}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(purchase.fecha)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                    <p className="text-2xl font-bold text-orange-600 mt-2">
                      ${purchase.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Productos:</h4>
                  <div className="space-y-2">
                    {purchase.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">
                            Producto ID: {item.product_id}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            (Cantidad: {item.cantidad})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">
                            ${item.precio_unitario.toFixed(2)} c/u
                          </span>
                          <div className="font-semibold text-gray-900">
                            ${(item.precio_unitario * item.cantidad).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${purchase.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
