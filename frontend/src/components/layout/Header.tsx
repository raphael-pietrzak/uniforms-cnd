import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Button from '../ui/Button';
import Logo from '../../assets/cnd_logo.svg';

const Header: React.FC = () => {
  const { cart, isAdmin, setIsAdmin } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              {/* <Link to="/" className="text-2xl font-bold text-blue-900">
                UniformeScolaire
              </Link> */}
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <img src={Logo} alt="Logo Cours Notre Dame" className="h-10 w-auto" />
                <span className="text-2xl font-bold text-blue-900">Cours Notre Dame</span>
              </Link>
            </div>
            
            {/* Navigation Bureau */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-800 hover:text-blue-900">
                Accueil
              </Link>
              <Link to="/shop" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-900">
                Boutique
              </Link>
              <Link to="/info" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-900">
                Informations
              </Link>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-900">
                  Administration
                </Link>
              )}
            </nav>
            
            <div className="flex items-center">
              {/* Basculer Admin (pour démonstration) */}
              <button 
                onClick={() => setIsAdmin(!isAdmin)} 
                className="mr-2 md:mr-4 p-2 rounded-full text-gray-500 hover:text-blue-900 focus:outline-none"
              >
                <User size={20} />
              </button>
              
              {/* Panier */}
              <Link to="/cart" className="mr-2 md:mr-0 p-2 rounded-full text-gray-500 hover:text-blue-900 focus:outline-none relative">
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
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Boutique
            </Link>
            <Link
              to="/info"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Informations
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Administration
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;