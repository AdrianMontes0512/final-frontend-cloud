import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPageNew';
import ProtectedRoute from './utilities/ProtectedRoute';
import FacePage from './pages/face';
import ProductManagement from './components/ProductManagement';

export default function App() {

  return (
    <Routes>
      <Route path='/' element={<FacePage />}/>
      <Route
        path="/mainPage"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}