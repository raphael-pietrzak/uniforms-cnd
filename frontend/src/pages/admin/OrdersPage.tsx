import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import OrdersTable from '../../components/admin/OrdersTable';
import { Order } from '../../types';
import { ordersApi } from '../../services/api';

const OrdersPage: React.FC = () => {
  const { orders, loading, error } = useShop();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Appliquer les filtres
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      // Mettre à jour l'interface utilisateur
      // Dans une vraie application, vous devriez recharger les commandes depuis le serveur
      // ou gérer la mise à jour de l'état local de façon plus robuste
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut de la commande.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        <div className="flex space-x-2">
          <select
            className="form-select rounded-md border-gray-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Toutes les commandes</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
            <option value="ready">Prêtes</option>
            <option value="collected">Récupérées</option>
          </select>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Actualiser
          </button>
        </div>
      </div>

      {loading && <p className="text-center py-4">Chargement des commandes...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <OrdersTable 
            orders={filteredOrders} 
            onUpdateStatus={handleUpdateStatus} 
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;