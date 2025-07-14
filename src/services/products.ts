import axios from 'axios';

// API de productos
export const API_PRODUCTS = axios.create({
  baseURL: 'https://xzchxwffnl.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  sku?: string;
  tenant_id: string;
  token?: string;
  nombre: string;
  activeIngredient: string;
  dosageForm: string;
  precio: number;
  expirationDate: string;
  prescriptionRequired: boolean;
  createdAt?: string;
  // Mantenemos compatibilidad con campos anteriores
  producto_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  nombre: string;
  activeIngredient: string;
  dosageForm: string;
  precio: number;
  expirationDate: string;
  prescriptionRequired: boolean;
}

// Función helper para manejar respuestas con body JSON string
const parseResponse = (response: any) => {
  if (response.data && response.data.body) {
    try {
      return JSON.parse(response.data.body);
    } catch (error) {
      console.error('Error parsing response body:', error);
      return response.data;
    }
  }
  return response.data;
};

// Crear producto
export const CrearProducto = async (producto: CreateProductData): Promise<Product> => {
  try {
    const token = localStorage.getItem('token');
    
    const productData = {
      tenant_id: "inkafarma",
      token: token || '',
      ...producto
    };
    
    console.log('Enviando producto:', productData);
    const response = await API_PRODUCTS.post('/productos', productData);
    console.log('Respuesta crear producto:', response.data);
    
    return parseResponse(response);
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Listar productos
export const ListarProductos = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem('token');
    
    const requestData = {
      tenant_id: "inkafarma", // Puedes hacer esto configurable
      token: token || ''
    };
    
    console.log('Listando productos con:', requestData);
    const response = await API_PRODUCTS.post('/productos/listar', requestData);
    console.log('Respuesta listar productos:', response.data);
    
    const data = parseResponse(response);
    
    // Manejar la nueva estructura de respuesta con "items"
    if (data && data.items && Array.isArray(data.items)) {
      return data.items;
    }
    
    // Fallback para otras estructuras
    return Array.isArray(data) ? data : data.productos || [];
  } catch (error) {
    console.error('Error al listar productos:', error);
    throw error;
  }
};

// Función helper para filtrar productos localmente
const filterProducts = (products: Product[], query: string, type: 'fuzzy' | 'prefix' | 'autocomplete'): Product[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return products.filter(product => {
    const nombre = product.nombre.toLowerCase();
    const activeIngredient = product.activeIngredient.toLowerCase();
    const dosageForm = product.dosageForm.toLowerCase();
    
    switch (type) {
      case 'fuzzy':
        // Búsqueda difusa: busca caracteres en cualquier orden
        return nombre.includes(lowerQuery) || 
               activeIngredient.includes(lowerQuery) || 
               dosageForm.includes(lowerQuery) ||
               lowerQuery.split('').every(char => nombre.includes(char));
      
      case 'prefix':
        // Búsqueda por prefijo: debe empezar con la query
        return nombre.startsWith(lowerQuery) || 
               activeIngredient.startsWith(lowerQuery) || 
               dosageForm.startsWith(lowerQuery);
      
      case 'autocomplete':
        // Autocompletado: busca coincidencias parciales
        return nombre.includes(lowerQuery) || 
               activeIngredient.includes(lowerQuery) || 
               dosageForm.includes(lowerQuery);
      
      default:
        return false;
    }
  });
};

// Búsqueda fuzzy
export const BusquedaFuzzy = async (query: string): Promise<Product[]> => {
  try {
    const products = await ListarProductos();
    return filterProducts(products, query, 'fuzzy');
  } catch (error) {
    console.error('Error en búsqueda fuzzy:', error);
    throw error;
  }
};

// Búsqueda por prefijo
export const BusquedaPorPrefijo = async (query: string): Promise<Product[]> => {
  try {
    const products = await ListarProductos();
    return filterProducts(products, query, 'prefix');
  } catch (error) {
    console.error('Error en búsqueda por prefijo:', error);
    throw error;
  }
};

// Autocompletado
export const Autocompletado = async (query: string): Promise<Product[]> => {
  try {
    const products = await ListarProductos();
    return filterProducts(products, query, 'autocomplete').slice(0, 10); // Limitar a 10 resultados
  } catch (error) {
    console.error('Error en autocompletado:', error);
    throw error;
  }
};

// Búsqueda inteligente unificada
export const BusquedaInteligente = async (query: string): Promise<Product[]> => {
  try {
    if (!query.trim()) return [];
    
    const products = await ListarProductos();
    const lowerQuery = query.toLowerCase();
    
    // Resultados con diferentes niveles de relevancia
    const exactMatches: Product[] = [];
    const prefixMatches: Product[] = [];
    const partialMatches: Product[] = [];
    const fuzzyMatches: Product[] = [];
    
    products.forEach(product => {
      const nombre = product.nombre.toLowerCase();
      const activeIngredient = product.activeIngredient.toLowerCase();
      const dosageForm = product.dosageForm.toLowerCase();
      
      // Coincidencias exactas (mayor relevancia)
      if (nombre === lowerQuery || activeIngredient === lowerQuery || dosageForm === lowerQuery) {
        exactMatches.push(product);
      }
      // Coincidencias por prefijo (alta relevancia)
      else if (nombre.startsWith(lowerQuery) || activeIngredient.startsWith(lowerQuery) || dosageForm.startsWith(lowerQuery)) {
        prefixMatches.push(product);
      }
      // Coincidencias parciales (media relevancia)
      else if (nombre.includes(lowerQuery) || activeIngredient.includes(lowerQuery) || dosageForm.includes(lowerQuery)) {
        partialMatches.push(product);
      }
      // Búsqueda difusa (baja relevancia)
      else if (lowerQuery.split('').every(char => nombre.includes(char) || activeIngredient.includes(char))) {
        fuzzyMatches.push(product);
      }
    });
    
    // Combinar resultados por orden de relevancia, eliminando duplicados
    const allResults = [...exactMatches, ...prefixMatches, ...partialMatches, ...fuzzyMatches];
    const uniqueResults = allResults.filter((product, index, self) => 
      index === self.findIndex(p => (p.sku || p.producto_id) === (product.sku || product.producto_id))
    );
    
    return uniqueResults.slice(0, 20); // Limitar a 20 resultados
  } catch (error) {
    console.error('Error en búsqueda inteligente:', error);
    throw error;
  }
};

// Buscar producto por SKU
export const BuscarProducto = async (tenant_id: string, sku: string): Promise<Product | null> => {
  try {
    const token = localStorage.getItem('token');
    
    console.log(`Buscando producto: ${tenant_id}/${sku}`);
    const response = await API_PRODUCTS.get(`/productos/${tenant_id}/${sku}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Respuesta buscar producto:', response.data);
    
    return parseResponse(response);
  } catch (error) {
    console.error('Error al buscar producto:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Producto no encontrado
    }
    throw error;
  }
};

// Eliminar producto
export const EliminarProducto = async (tenant_id: string, sku: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    
    // Encode el SKU para manejar caracteres especiales
    const encodedSku = encodeURIComponent(sku);
    
    const requestData = {
      token: token || '',
      tenant_id: tenant_id
    };
    
    console.log(`Eliminando producto: tenant_id=${tenant_id}, sku=${sku}`);
    console.log(`URL: /productos/inkafarma/${encodedSku}`);
    console.log('Request data:', requestData);
    
    const response = await API_PRODUCTS.delete(`/productos/inkafarma/${encodedSku}`, {
      data: requestData
    });
    
    console.log('Respuesta eliminar producto:', response.status, response.data);
    
    return response.status === 200 || response.status === 204;
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// Obtener URL de carga para imágenes
export const ObtenerUrlCarga = async (): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    
    console.log('Obteniendo URL de carga');
    const response = await API_PRODUCTS.get('/productos/upload-url', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Respuesta URL de carga:', response.data);
    
    const data = parseResponse(response);
    return data.uploadUrl || data.url || '';
  } catch (error) {
    console.error('Error al obtener URL de carga:', error);
    throw error;
  }
};

// Actualizar producto (usando el endpoint de crear con el mismo SKU)
export const ActualizarProducto = async (producto: Product): Promise<Product> => {
  try {
    const token = localStorage.getItem('token');
    
    const productData = {
      tenant_id: "inkafarma",
      token: token || '',
      sku: producto.sku, // Include SKU for updates
      nombre: producto.nombre,
      activeIngredient: producto.activeIngredient,
      dosageForm: producto.dosageForm,
      precio: producto.precio,
      expirationDate: producto.expirationDate,
      prescriptionRequired: producto.prescriptionRequired
    };
    
    console.log('Actualizando producto:', productData);
    const response = await API_PRODUCTS.post('/productos', productData);
    console.log('Respuesta actualizar producto:', response.data);
    
    return parseResponse(response);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};
