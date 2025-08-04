import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, BarChart3, Package, Clock } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { productsApi, ordersApi } from '../../services/api';
import { Product, Order } from '../../types';

// Helper function to format order IDs safely
const formatOrderId = (id: any): string => {
  const stringId = String(id || '');
  return stringId.length > 8 ? `${stringId.substring(0, 8)}...` : stringId;
};

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Charger les données au montage du composant
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Charger les produits et les commandes en parallèle
        const [productsData, ordersData] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll()
        ]);
        
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Exécuter une seule fois au montage
  
  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const usedProducts = products.filter(p => p.condition === 'used').length;
  
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  
  const totalRevenue = orders.length > 0 
    ? orders
        .filter(o => o.status === 'paid' || o.status === 'ready' || o.status === 'collected')
        .reduce((sum, order) => sum + (order.total ? parseFloat(order.total.toString()) : 0), 0) 
    : 0;
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
        <div className="flex space-x-3">
          <Link to="/admin/products/new">
            <Button variant="primary">
              Ajouter un Nouveau Produit
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Produits</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-green-600 font-medium">{inStockProducts}</span> en stock
              </div>
              <div>
                <span className="text-red-600 font-medium">{outOfStockProducts}</span> rupture de stock
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900">{Number(totalRevenue).toFixed(2)}&nbsp;€</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-gray-600 font-medium">{orders.length}</span> commandes
              </div>
              <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800">
                Voir tout
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes en Attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-yellow-600 font-medium">{readyOrders}</span> prêtes au retrait
              </div>
              <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800">
                Gérer
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800 mr-4">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Articles d'Occasion</p>
                <p className="text-2xl font-bold text-gray-900">{usedProducts}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-purple-600 font-medium">{Math.round((usedProducts / totalProducts) * 100)}%</span> de l'inventaire
              </div>
              <Link to="/admin/products" className="text-blue-600 hover:text-blue-800">
                Voir tout
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Commandes Récentes</h2>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir Tout
            </Link>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Pas encore de commandes
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatOrderId(order.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {Number(order.total).toFixed(2)}&nbsp;€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status === 'paid' ? 'Payée' : 
                         order.status === 'pending' ? 'En Attente' : 
                         order.status === 'ready' ? 'Prête' : 
                         order.status === 'collected' ? 'Récupérée' : 
                         order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin/products" className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Gérer les Produits</h3>
                <p className="text-sm text-gray-600">Ajouter, modifier ou supprimer des produits</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin/orders" className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Gérer les Commandes</h3>
                <p className="text-sm text-gray-600">Voir et mettre à jour l'état des commandes</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin/reports" className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800 mr-4">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rapports</h3>
                <p className="text-sm text-gray-600">Consulter les rapports de ventes et d'inventaire</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;