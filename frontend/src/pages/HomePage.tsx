import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Info, Shirt as TShirt, Shield } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Button from '../components/ui/Button';
import ProductCard from '../components/shop/ProductCard';

const HomePage: React.FC = () => {
  const { products } = useShop();
  const featuredProducts = products.filter(product => product.inventory && product.inventory.length > 0 && product.inventory[0].quantity > 0).slice(0, 4);
  
  return (
    <div className="animate-rise">
      {/* Hero Section */}
      <section className="relative mt-6 text-white sm:mt-8">
        <div className="absolute inset-0 rounded-none bg-[url('/arles_group.jpg')] bg-cover bg-center sm:mx-4 sm:rounded-[2rem] lg:mx-6" />
        <div className="absolute inset-0 sm:mx-4 sm:rounded-[2rem] lg:mx-6" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-8 md:py-32">
          <div className="max-w-3xl">
            <p className="mb-5 inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
              Boutique CND
            </p>
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight md:text-6xl">
              Uniformes Scolaires
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-[#d6e7f5] md:text-2xl">
              Uniformes principalement d'occasion pour vos enfants. Économisez tout en soutenant l'école.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/shop">
                <Button
                variant="primary"
                size="lg"
                className="h-12 w-52 bg-white text-[#133b63] hover:bg-[#f0f6fb] hover:shadow-white/20"
                >
                <ShoppingBag className="mr-2" size={16} />
                <span className="text-sm">Voir nos Articles</span>
                </Button>
                </Link>

                
                <Link to="/info">
                <Button
                variant="outline"
                size="lg"
                className="h-12 w-52 border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                <Info className="mr-2" size={16} />
                <span className="text-sm">En Savoir Plus</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold text-[#1b2430]">Pourquoi Participer ?</h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Notre système d'échange d'uniformes scolaires fournit des vêtements en bon état tout en favorisant l'entraide et l'accessibilité pour toutes les familles de l'école.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="surface-panel p-6 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="mb-4 inline-block rounded-2xl bg-[#133b63]/12 p-3 text-[#133b63]">
                <TShirt size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Vêtements en Bon État</h3>
              <p className="text-slate-600">
                Tous nos uniformes d'occasion sont vérifiés et en bon état, prêts à être réutilisés par d'autres élèves.
              </p>
            </div>
            
            <div className="surface-panel p-6 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="mb-4 inline-block rounded-2xl bg-[#1d7a72]/12 p-3 text-[#1d7a72]">
                <Shield size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Durabilité</h3>
              <p className="text-slate-600">
                En réutilisant les uniformes, nous réduisons les déchets et favorisons des pratiques écologiques au sein de notre école.
              </p>
            </div>
            
            <div className="surface-panel p-6 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="mb-4 inline-block rounded-2xl bg-amber-100 p-3 text-amber-700">
                <ShoppingBag size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Accessibilité</h3>
              <p className="text-slate-600">
                Des prix très accessibles pour les uniformes d'occasion permettent à toutes les familles de l'école de s'équiper sans difficulté.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-[#1b2430]">Articles Disponibles</h2>
            <Link to="/shop" className="font-semibold text-[#133b63] hover:text-[#0f2f50]">
              Voir Tout →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;