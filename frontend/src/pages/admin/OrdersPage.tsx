import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import OrdersTable from '../../components/admin/OrdersTable';
import { Order } from '../../types';
import { ordersApi } from '../../services/api';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    orderId: string;
    oldStatus: Order['status'];
    newStatus: Order['status'];
  }>({ show: false, orderId: '', oldStatus: 'pending', newStatus: 'pending' });
  
  // État pour la confirmation de suppression
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    show: boolean;
    orderId: string;
  }>({ show: false, orderId: '' });

  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
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
    const currentOrder = orders.find(order => order.id === orderId);
    if (!currentOrder) return;
    
    setConfirmModal({
      show: true,
      orderId,
      oldStatus: currentOrder.status,
      newStatus
    });
  };

  const confirmStatusUpdate = async () => {
    try {
      await ordersApi.updateStatus(confirmModal.orderId, confirmModal.newStatus);
      const updatedOrder = await ordersApi.getAll(); 
      setOrders(updatedOrder);
      setConfirmModal({ show: false, orderId: '', oldStatus: 'pending', newStatus: 'pending' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError('Erreur lors de la mise à jour du statut de la commande.');
    }
  };

  const cancelStatusUpdate = () => {
    setConfirmModal({ show: false, orderId: '', oldStatus: 'pending', newStatus: 'pending' });
  };
  
  // Fonction pour ouvrir la modale de confirmation de suppression
  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirmModal({
      show: true,
      orderId
    });
  };
  
  // Fonction pour confirmer et exécuter la suppression
  const confirmDeleteOrder = async () => {
    try {
      await ordersApi.delete(deleteConfirmModal.orderId);
      setOrders(orders.filter(order => order.id !== deleteConfirmModal.orderId));
      setDeleteConfirmModal({ show: false, orderId: '' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      setError('Erreur lors de la suppression de la commande.');
    }
  };
  
  // Fonction pour annuler la suppression
  const cancelDeleteOrder = () => {
    setDeleteConfirmModal({ show: false, orderId: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin" className="flex items-center text-gray-600 hover:text-blue-800 mb-2">
            <ArrowLeft size={18} className="mr-1" />
            Retour au Tableau de Bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        </div>
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
        </div>
      </div>

      {loading && <p className="text-center py-4">Chargement des commandes...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {confirmModal.show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirmation du changement de statut
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Voulez-vous vraiment changer le statut de cette commande 
                        de "{confirmModal.oldStatus}" à "{confirmModal.newStatus}" ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmStatusUpdate}
                >
                  Confirmer
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelStatusUpdate}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {deleteConfirmModal.show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Supprimer la commande
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDeleteOrder}
                >
                  Supprimer
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelDeleteOrder}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <OrdersTable 
            orders={filteredOrders} 
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;