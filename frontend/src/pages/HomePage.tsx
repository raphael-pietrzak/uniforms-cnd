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
    <div>
      {/* Hero Section */}
      <section className="relative text-white">
        <div className="absolute inset-0 bg-[url('/arles_group.jpg')] bg-cover bg-center "></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Uniformes Scolaires à Prix Abordables
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Uniformes principalement d'occasion pour vos enfants. Économisez tout en soutenant notre communauté scolaire.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/shop">
                <Button
                variant="primary"
                size="lg"
                className="bg-blue-900 text-white hover:shadow-lg w-48 h-12 flex items-center justify-center"
                >
                <ShoppingBag className="mr-2" size={16} />
                <span className="text-sm">Voir nos Articles</span>
                </Button>
                </Link>

                
                <Link to="/info">
                <Button
                variant="outline"
                size="lg"
                className="backdrop-blur-md bg-white/20 border border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all w-48 h-12 flex items-center justify-center shadow-lg"
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Participer ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre système d'échange d'uniformes scolaires fournit des vêtements en bon état tout en favorisant l'entraide et l'accessibilité pour toutes les familles de l'école.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-3 bg-blue-100 rounded-full text-blue-800 mb-4">
                <TShirt size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vêtements en Bon État</h3>
              <p className="text-gray-600">
                Tous nos uniformes d'occasion sont vérifiés et en bon état, prêts à être réutilisés par d'autres élèves.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-3 bg-green-100 rounded-full text-green-800 mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Durabilité</h3>
              <p className="text-gray-600">
                En réutilisant les uniformes, nous réduisons les déchets et favorisons des pratiques écologiques au sein de notre école.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-3 bg-yellow-100 rounded-full text-yellow-800 mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
              <p className="text-gray-600">
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
            <h2 className="text-3xl font-bold text-gray-900">Articles Disponibles</h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
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