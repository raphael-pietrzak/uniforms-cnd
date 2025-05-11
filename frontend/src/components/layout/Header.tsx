import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn, LogOut } from 'lucide-react';
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
  const activeLinkClass = "inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-900 border-b-2 border-blue-900";
  const inactiveLinkClass = "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-900 hover:border-b-2 hover:border-gray-300";
  
  // Classes pour les liens mobiles actifs et inactifs
  const activeMobileLinkClass = "block pl-3 pr-4 py-2 text-base font-medium text-blue-900 bg-gray-50 border-l-4 border-blue-900";
  const inactiveMobileLinkClass = "block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <img src={Logo} alt="Logo Cours Notre Dame" className="h-10 w-auto" />
                <span className="text-2xl font-bold text-blue-900">Cours Notre Dame</span>
              </Link>
            </div>
            
            {/* Navigation Bureau */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
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
            
            <div className="flex items-center">
              {/* Afficher le nom d'utilisateur si connecté */}
              {isAuthenticated && user && (
                <span className="mr-2 hidden md:inline text-sm text-gray-700">
                  {user.username}
                </span>
              )}
              
              {/* Bouton de connexion ou déconnexion */}
              {/* {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="mr-2 md:mr-4 p-2 rounded-full text-gray-500 hover:text-blue-900 focus:outline-none flex items-center"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="mr-2 md:mr-4 p-2 rounded-full text-gray-500 hover:text-blue-900 focus:outline-none flex items-center"
                  title="Connexion"
                >
                  <LogIn size={20} />
                </Link>
              )} */}
              
              {/* Panier */}
              <Link to="/cart" className={`mr-2 md:mr-0 p-2 rounded-full focus:outline-none relative ${isActive('/cart') ? 'text-blue-900' : 'text-gray-500 hover:text-blue-900'}`}>
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-800 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Bouton menu mobile */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-blue-900 focus:outline-none"
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
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
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
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
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