import React, { useEffect, useState } from 'react';
import OrdersTable from '../../components/admin/OrdersTable';
import { Order } from '../../types';
import { ordersApi } from '../../services/api';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les commandes au montage du composant
  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Appliquer les filtres
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
      // Au premier chargement, initialiser également les commandes filtrées
      if (statusFilter === 'all') {
        setFilteredOrders(data);
      } else {
        setFilteredOrders(data.filter(order => order.status === statusFilter));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur lors du chargement des commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      // Mettre à jour l'interface utilisateur sans recharger la page
      const updatedOrder = await ordersApi.getAll(); // On recharge toutes les commandes pour être sûr
      setOrders(updatedOrder);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError('Erreur lors de la mise à jour du statut de la commande.');
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
            onClick={fetchOrders}
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