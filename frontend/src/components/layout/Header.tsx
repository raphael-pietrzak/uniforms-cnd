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

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const activeLinkClass = 'inline-flex items-center rounded-md bg-accent-soft px-3 py-2 text-sm font-medium text-accent';
  const inactiveLinkClass = 'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink';

  const activeMobileLinkClass = 'block rounded-md bg-accent-soft px-4 py-3 text-base font-medium text-accent';
  const inactiveMobileLinkClass = 'block rounded-md px-4 py-3 text-base font-medium text-ink-muted hover:bg-canvas';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex flex-shrink-0 items-center gap-2">
            <img src={Logo} alt="Logo Cours Notre Dame" className="h-9 w-auto" />
            <span className="hidden text-base font-semibold text-ink sm:inline">Cours Notre Dame</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
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
            {isAuthenticated && user && (
              <span className="mr-1 hidden rounded-md bg-canvas px-3 py-1 text-xs font-medium text-ink-muted md:inline">
                {user.username}
              </span>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mr-1 flex items-center rounded-md p-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus:outline-none"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            )}

            <Link to="/cart" className={`relative mr-1 rounded-md p-2 focus:outline-none ${isActive('/cart') ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink focus:outline-none md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-line bg-surface px-4 py-3 md:hidden">
          <div className="space-y-1">
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
                className="block w-full rounded-md px-4 py-3 text-left text-base font-medium text-ink-muted hover:bg-canvas"
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
