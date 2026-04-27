import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/cnd_logo.svg';

const Header: React.FC = () => {
  const { cart } = useShop();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  // Classes pour les liens actifs et inactifs
  const activeLinkClass = 'inline-flex items-center rounded-full bg-[#133b63]/10 px-4 py-2 text-sm font-semibold text-[#133b63]';
  const inactiveLinkClass = 'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-[#133b63]';
  
  // Classes pour les liens mobiles actifs et inactifs
  const activeMobileLinkClass = 'block rounded-xl bg-[#133b63]/10 px-4 py-3 text-base font-semibold text-[#133b63]';
  const inactiveMobileLinkClass = 'block rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-100';

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-7xl rounded-2xl">
        <div className="flex h-16 justify-between px-3 sm:px-5">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 rounded-full p-1">
                <img src={Logo} alt="Logo Cours Notre Dame" className="h-10 w-auto" />
                <span className="hidden text-lg font-bold text-[#133b63] sm:inline">Cours Notre Dame</span>
              </Link>
            </div>
            
            {/* Navigation Bureau */}
            <nav className="hidden md:ml-6 md:flex md:space-x-1">
              <Link to="/" className={isActive('/') ? activeLinkClass : inactiveLinkClass}>
                Accueil
              </Link>
              <Link to="/shop" className={isActive('/shop') ? activeLinkClass : inactiveLinkClass}>
                Boutique
              </Link>
              <Link to="/info" className={isActive('/info') ? activeLinkClass : inactiveLinkClass}>
                Informations
              </Link>
              {isAuthenticated && isAdmin && (
                <Link to="/admin" className={isActive('/admin') ? activeLinkClass : inactiveLinkClass}>
                  Administration
                </Link>
              )}
            </nav>
            
            <div className="flex items-center gap-1">
              {/* Afficher le nom d'utilisateur si connecté */}
              {isAuthenticated && user && (
                <span className="mr-2 hidden rounded-full bg-[#133b63]/10 px-3 py-1 text-xs font-semibold text-[#133b63] md:inline">
                  {user.username}
                </span>
              )}
              
              {/* Bouton de connexion ou déconnexion */}
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="mr-1 flex items-center rounded-full p-2 text-slate-500 transition-colors hover:bg-white/80 hover:text-[#133b63] focus:outline-none"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              )}

              {/* : (
                <Link 
                  to="/login"
                  className="mr-2 md:mr-4 p-2 rounded-full text-gray-500 hover:text-blue-900 focus:outline-none flex items-center"
                  title="Connexion"
                >
                  <LogIn size={20} />
                </Link>
              )} */}
              
              {/* Panier */}
              <Link to="/cart" className={`relative mr-1 rounded-full p-2 focus:outline-none ${isActive('/cart') ? 'bg-[#133b63]/10 text-[#133b63]' : 'text-slate-500 hover:bg-white/80 hover:text-[#133b63]'}`}>
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-[#1d7a72] px-2 py-1 text-xs font-bold leading-none text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Bouton menu mobile */}
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-white/80 hover:text-[#133b63] focus:outline-none md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="mx-2 mt-2 md:hidden sm:mx-6 lg:mx-8">
          <div className="glass-panel space-y-1 rounded-2xl p-3">
            <Link
              to="/"
              className={isActive('/') ? activeMobileLinkClass : inactiveMobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              className={isActive('/shop') ? activeMobileLinkClass : inactiveMobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Boutique
            </Link>
            <Link
              to="/info"
              className={isActive('/info') ? activeMobileLinkClass : inactiveMobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Informations
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={isActive('/admin') ? activeMobileLinkClass : inactiveMobileLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Administration
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-slate-600 hover:bg-slate-100"
              >
                Déconnexion
              </button>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className={isActive('/login') ? activeMobileLinkClass : inactiveMobileLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;