import axios from 'axios';

export const API_PURCHASES = axios.create({
  baseURL: 'https://k843m5c37g.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  compra_id: string;
  user_id: string;
  products: ProductItem[];
  total: number;
  fecha: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface PurchaseRequest {
  token: string;
  tenant_id: string;
  user_id: string;
  products: ProductItem[];
  total: number;
}

// Registrar compra
export const RegistrarCompra = async (compra: PurchaseRequest): Promise<Purchase> => {
  try {
    console.log('Enviando compra:', compra);
    const response = await API_PURCHASES.post('/compras/registrar-compra', compra);
    console.log('Respuesta registrar compra:', response.data);
    
    // Manejar si la respuesta tiene el formato con body JSON string
    if (response.data && response.data.body) {
      const parsedBody = JSON.parse(response.data.body);
      return parsedBody;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al registrar compra:', error);
    throw error;
  }
};

// Listar compras del usuario
export const ListarComprasUsuario = async (): Promise<Purchase[]> => {
  try {
    const token = localStorage.getItem('token');
    
    const requestData = {
      token: token || '',
      tenant_id: "inkafarma", // Usar el mismo tenant_id que en productos
    };
    
    console.log('Listando compras con:', requestData);
    const response = await API_PURCHASES.post('/compras/listar-compras', requestData);
    console.log('Respuesta listar compras:', response.data);
    
    // Manejar si la respuesta tiene el formato con body JSON string
    if (response.data && response.data.body) {
      const parsedBody = JSON.parse(response.data.body);
      return parsedBody.compras || parsedBody;
    }
    
    return response.data.compras || response.data;
  } catch (error) {
    console.error('Error al listar compras:', error);
    throw error;
  }
};
