import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OfflinePage from './pages/OfflinePage';
import Info from './pages/Info';
import CGV from './pages/CGV';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import AddEditProductPage from './pages/admin/AddEditProductPage';

// Composant pour vérifier l'état de la connexion
const ConnectionGuard: React.FC = () => {
  const { isOnline } = useAuth();
  const location = useLocation();
  
  // Pas de redirection si on est déjà sur la page offline ou si on est en ligne
  if (isOnline || location.pathname === '/offline') {
    return <Outlet />;
  }
  
  // Rediriger vers la page hors connexion
  return <Navigate to="/offline" replace state={{ from: location }} />;
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Page hors connexion (accessible même hors ligne) */}
                <Route path="/offline" element={<OfflinePage />} />
                
                {/* Routes protégées par ConnectionGuard */}
                <Route element={<ConnectionGuard />}>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Routes protégées avec ProtectedRoute */}
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    {/* Routes Admin */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductsPage />} />
                    <Route path="/admin/products/new" element={<AddEditProductPage />} />
                    <Route path="/admin/products/edit/:productId" element={<AddEditProductPage />} />
                    <Route path="/admin/orders" element={<OrdersPage />} />
                  </Route>
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;