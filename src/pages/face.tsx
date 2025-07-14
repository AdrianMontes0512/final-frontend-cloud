import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Pill, Stethoscope, Clock, Shield, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { Login, Register } from '../services/auth';

export default function FacePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    return () => {
      document.body.style.overflow = '';
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.body.style.maxWidth = '';
      document.documentElement.style.maxWidth = '';
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('Intentando login con:', { user_id: loginEmail, password: loginPassword });
      const data = await Login({ user_id: loginEmail, password: loginPassword });
      console.log('Respuesta del login:', data);
      
      let token = null;
      let userId = null;
      
      // Manejar diferentes estructuras de respuesta
      if (data && data.statusCode === 200) {
        if (data.body) {
          // El body es un string JSON, necesitamos parsearlo
          try {
            const parsedBody = JSON.parse(data.body);
            token = parsedBody.token;
            userId = parsedBody.user_id;
            console.log('Token extraído del body parseado:', token);
            console.log('User ID extraído del body parseado:', userId);
          } catch (parseError) {
            console.error('Error al parsear el body:', parseError);
          }
        } else if (data.token) {
          // Token directo en la respuesta
          token = data.token;
          userId = data.user_id;
          console.log('Token extraído directamente:', token);
          console.log('User ID extraído directamente:', userId);
        }
      }
      
      if (token) {
        localStorage.setItem('token', token);
        if (userId) {
          localStorage.setItem('user_id', userId);
        }
        console.log('Token guardado:', localStorage.getItem('token'));
        console.log('User ID guardado:', localStorage.getItem('user_id'));
        setSuccessMessage('¡Inicio de sesión exitoso!');
        setShowLoginModal(false);
        // Navegar inmediatamente
        navigate('/mainPage');
      } else {
        console.error('Estructura de respuesta inesperada:', data);
        setErrorMessage('No se recibió un token válido del servidor');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response) {
        setErrorMessage(error.response.data?.message || 'Error del servidor');
      } else if (error.request) {
        setErrorMessage('No se pudo conectar con el servidor');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('Intentando registro con:', { user_id: signupEmail, password: signupPassword });
      const data = await Register({ user_id: signupEmail, password: signupPassword });
      console.log('Respuesta del registro:', data);
      
      if (data) {
        setShowSignupModal(false);
        setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Limpiar campos
        setSignupEmail('');
        setSignupPassword('');
        // Mostrar modal de login después de un momento
        setTimeout(() => {
          setSuccessMessage('');
          setShowLoginModal(true);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.response) {
        setErrorMessage(error.response.data?.message || 'Error en el registro');
      } else if (error.request) {
        setErrorMessage('No se pudo conectar con el servidor');
      } else {
        setErrorMessage('Error en el registro. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Pill size={48} />,
      title: "Medicamentos Originales",
      description: "Amplio catálogo de medicamentos con receta y de venta libre, todos originales y certificados"
    },
    {
      icon: <Stethoscope size={48} />,
      title: "Online las 24 Horas",
      description: "Compra tus medicamentos y productos de salud en cualquier momento, sin esperas ni complicaciones"
    },
    {
      icon: <Clock size={48} />,
      title: "Entrega Rápida",
      description: "Entrega express en 30 minutos para urgencias y entregas programadas para mayor comodidad"
    },
    {
      icon: <Heart size={48} />,
      title: "Cuidado Personal",
      description: "Productos de higiene, cosmética y cuidado personal de las mejores marcas"
    },
    {
      icon: <Shield size={48} />,
      title: "Compra Segura",
      description: "Pagos seguros, datos protegidos y garantía de calidad en todos nuestros productos"
    },
    {
      icon: <ShoppingCart size={48} />,
      title: "Fácil Pedido",
      description: "Interfaz intuitiva para realizar pedidos rápidos y gestionar tus recetas médicas"
    }
  ];

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
      <div 
        className={`min-h-screen w-screen overflow-x-hidden ${(showLoginModal || showSignupModal) ? 'blur-sm' : ''}`}
        style={{
          backgroundColor: '#f8f9fa',
          backgroundImage: `
            linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          position: 'relative',
          maxWidth: '100vw',
          boxSizing: 'border-box',
        }}
      >
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src={logo} alt="tuFarma" className="h-20 w-auto mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">tuFarma</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="bg-gray-600  text-white px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setShowSignupModal(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Registrarse
              </button>
            
            </div>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Tu <span style={{ color: '#FF6B35' }}>Farmacia</span> de Confianza
            <br />
            <span style={{ color: '#FF6B35' }}>Online las 24 Horas</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Encuentra todos tus medicamentos, productos de cuidado personal y 
            bienestar con entrega rápida y segura a tu hogar.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowLoginModal(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Comenzar Compra
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Medicamentos a un Click de Distancia
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Busca tus medicamentos, sube tu receta médica y recibe todo 
                lo que necesitas en la comodidad de tu hogar.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF6B35' }}></div>
                  <span className="text-gray-700">Medicamentos con y sin receta</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF6B35' }}></div>
                  <span className="text-gray-700">Productos de cuidado personal</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF6B35' }}></div>
                  <span className="text-gray-700">Entrega express y programada</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-green-400 text-sm space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span>💊 Paracetamol 500mg</span>
                  <span className="text-orange-400">$12.50</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span>🧴 Shampoo Anticaspa</span>
                  <span className="text-orange-400">$25.90</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span>💉 Vitamina C 1000mg</span>
                  <span className="text-orange-400">$18.75</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span>🩹 Vendas Elásticas</span>
                  <span className="text-orange-400">$8.30</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-orange-400">🛒 Agregar al Carrito</span>
              </div>
              <div className="mt-4 bg-white rounded p-4">
                <div className="text-xs text-gray-800 text-center">
                  � Entrega estimada: 30 minutos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Tu Salud es Nuestra Prioridad
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos el mejor servicio farmacéutico con productos 
              de calidad y atención personalizada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-4" style={{ color: '#FF6B35' }}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para Cuidar tu Salud?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de usuarios que confían en nosotros para 
            el cuidado de su salud y bienestar.
          </p>
          <button
            onClick={() => {
              setShowSignupModal(true);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Registrarse Ahora
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logo} alt="tuFarma" className="h-8 w-auto mr-3" />
              <span className="text-xl font-bold">tuFarma</span>
            </div>
            <p className="text-gray-400">
              © 2025 tuFarma. Tu salud es nuestra prioridad.
            </p>
          </div>
        </div>
      </footer>
      </div>     
      {showLoginModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
              <img src={logo} alt="tuFarma" className="h-16 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
              <p className="text-gray-600 mt-2">Accede a tu cuenta de tuFarma</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: '#FF6B35' }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-500 delay-500">
              <span className="text-gray-600">¿No tienes cuenta? </span>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
              <img src={logo} alt="tuFarma" className="h-16 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
              <p className="text-gray-600 mt-2">Únete a la comunidad de tuFarma</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-gray-200 animate-in fade-in duration-500 delay-500">
              <span className="text-gray-600">¿Ya tienes cuenta? </span>
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}