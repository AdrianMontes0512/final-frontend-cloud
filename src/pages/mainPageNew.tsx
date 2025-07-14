import { useState, useEffect } from 'react';
import { ShoppingCart, Package, History, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { ValidateToken } from '../services/auth';
import { Product, ListarProductos } from '../services/products';
import { useCart } from '../hooks/useCart';
import ProductSearch from '../components/ProductSearch';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import ProductManagement from '../components/ProductManagement';
import PurchaseHistory from '../components/PurchaseHistory';

export default function MainPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
  } = useCart();

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      if (!token) {
        navigate('/');
        return;
      }

      if (userId) {
        setCurrentUserId(userId);
      }

      try {
        await ValidateToken(token);
        setIsValidatingToken(false);
        loadProducts();
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/');
      }
    };

    validateSession();
  }, [navigate]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productList = await ListarProductos();
      setProducts(productList);
      setHasMore(false); // Como no hay paginación, no hay más páginas
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    // Como no hay paginación en el API actual, esta función no hace nada
    console.log('Carga de más productos no disponible sin paginación en el API');
  };

  const handleProductSelect = (product: Product) => {
    addToCart(product, 1);
  };

  const handleShowAllResults = (results: Product[]) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  const tabs = [
    { id: 'products', name: 'Productos', icon: <Package size={18} /> },
    { id: 'history', name: 'Mis Compras', icon: <History size={18} /> },
    { id: 'admin', name: 'Administrar', icon: <Settings size={18} /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('cart');
    navigate('/');
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="tuFarma" className="h-20 w-auto mx-auto mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`min-h-screen w-screen bg-gray-50 ${isCartModalOpen || isProductModalOpen ? 'blur-sm' : ''}`}
        style={{ 
          overflowX: 'hidden', 
          maxWidth: '100vw',
          backgroundColor: '#f8f9fa',
          backgroundImage: `
            linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="tuFarma" className="h-20 w-auto mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">tuFarma</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User size={20} />
                <span className="font-medium">{currentUserId || 'Usuario'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ShoppingCart size={20} />
                <span className="font-medium">{getTotalItems()} items</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white px-6 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF6B35' }}
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="shadow-lg" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-12 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-3 px-5 rounded-lg font-semibold text-base transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white transform scale-105 shadow-lg'
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-102'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#FF6B35' } : {}}
              >
                <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white' : 'bg-gray-600'}`}>
                  <div className={activeTab === tab.id ? 'text-orange-600' : 'text-gray-300'}>
                    {tab.icon}
                  </div>
                </div>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <div>
            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
              <ProductSearch 
                onProductSelect={handleProductSelect}
                onShowAllResults={handleShowAllResults}
              />
            </div>

            {/* Search Results */}
            {showSearchResults && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Resultados de Búsqueda ({searchResults.length})
                  </h3>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    Mostrar todos los productos
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product) => (
                    <ProductCard 
                      key={product.sku || product.producto_id} 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {loading && products.length === 0 && !showSearchResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-1.5 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-3">
                            <div className="flex-1 pr-3">
                              <div className="h-5 bg-gray-200 rounded mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            </div>
                            <div className="w-20 h-9 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="flex space-x-2 mb-3">
                            <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                            <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="h-10 bg-gray-200 rounded w-32"></div>
                          <div className="h-10 bg-gray-200 rounded w-28"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!loading && !showSearchResults && (            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.sku || product.producto_id} 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && !showSearchResults && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🏪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                <p className="text-gray-600 mb-6">Agrega productos desde la sección de gestión de productos.</p>
                <button
                  onClick={() => setActiveTab('productos')}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Gestionar Productos
                </button>
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Cargar Más Productos'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <PurchaseHistory />
        )}

        {activeTab === 'admin' && (
          <ProductManagement onModalChange={setIsProductModalOpen} />
        )}
      </main>
      </div>

      <Cart
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        getTotal={getTotal}
        getTotalItems={getTotalItems}
        onCartModalChange={setIsCartModalOpen}
      />
    </>
  );
}
