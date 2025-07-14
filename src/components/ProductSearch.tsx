import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product, BusquedaInteligente } from '../services/products';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  onShowAllResults: (products: Product[]) => void;
}

export default function ProductSearch({ onProductSelect, onShowAllResults }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Realizar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await BusquedaInteligente(searchQuery);
      setSearchResults(results);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleShowAllResults = () => {
    onShowAllResults(searchResults);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos por nombre, ingrediente activo o forma farmacéutica..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto" style={{ backgroundColor: 'white !important' }}>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500" style={{ backgroundColor: 'white !important' }}>
                Buscando productos...
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="p-2 border-b border-gray-200" style={{ backgroundColor: 'white !important' }}>
                  <button
                    onClick={handleShowAllResults}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg"
                    style={{ backgroundColor: 'white !important' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff7ed !important'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white !important'}
                  >
                    Ver todos los resultados ({searchResults.length})
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto" style={{ backgroundColor: 'white !important' }}>
                  {searchResults.slice(0, 10).map((product) => (
                    <button
                      key={product.sku || product.producto_id || product.nombre}
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      style={{ backgroundColor: 'white !important' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb !important'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white !important'}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e5e7eb !important' }}>
                            <span className="text-xs font-medium text-gray-600">
                              {product.dosageForm.substring(0, 3).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500 truncate">
                            {product.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {product.activeIngredient} - {product.dosageForm}
                          </p>
                          <p className="text-sm font-semibold text-orange-600">
                            ${product.precio.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500" style={{ backgroundColor: 'white !important' }}>
                No se encontraron productos
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
