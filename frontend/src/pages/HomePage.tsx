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
      <section className="relative text-white">
        <div className="absolute inset-0 bg-[url('/arles_group.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-8 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Boutique CND
            </p>
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight md:text-5xl">
              Uniformes Scolaires
            </h1>
            <p className="mb-8 max-w-xl text-base text-white/80 md:text-lg">
              Uniformes principalement d'occasion pour vos enfants. Économisez tout en soutenant l'école.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full !bg-white !text-ink hover:!bg-white/90 sm:w-auto"
                >
                  <ShoppingBag className="mr-2" size={16} />
                  Voir nos Articles
                </Button>
              </Link>

              <Link to="/info">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full !border-white/30 !bg-transparent !text-white hover:!bg-white/10 sm:w-auto"
                >
                  <Info className="mr-2" size={16} />
                  En Savoir Plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold text-ink md:text-3xl">Pourquoi Participer ?</h2>
            <p className="text-base text-ink-muted">
              Notre système d'échange d'uniformes scolaires fournit des vêtements en bon état tout en favorisant l'entraide et l'accessibilité pour toutes les familles de l'école.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-line p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <TShirt size={22} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">Vêtements en Bon État</h3>
              <p className="text-sm text-ink-muted">
                Tous nos uniformes d'occasion sont vérifiés et en bon état, prêts à être réutilisés par d'autres élèves.
              </p>
            </div>

            <div className="rounded-xl border border-line p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Shield size={22} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">Durabilité</h3>
              <p className="text-sm text-ink-muted">
                En réutilisant les uniformes, nous réduisons les déchets et favorisons des pratiques écologiques au sein de notre école.
              </p>
            </div>

            <div className="rounded-xl border border-line p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <ShoppingBag size={22} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">Accessibilité</h3>
              <p className="text-sm text-ink-muted">
                Des prix très accessibles pour les uniformes d'occasion permettent à toutes les familles de l'école de s'équiper sans difficulté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Articles Disponibles</h2>
            <Link to="/shop" className="text-sm font-medium text-accent hover:text-accent-hover">
              Voir Tout →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
