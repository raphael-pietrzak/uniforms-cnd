import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, X } from 'lucide-react';
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

  // État pour les détails de la commande
  const [orderDetails, setOrderDetails] = useState<{
    show: boolean;
    loading: boolean;
    order: Order | null;
  }>({ 
    show: false, 
    loading: false, 
    order: null 
  });

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
      
      // Mettre à jour les détails de la commande si elle est actuellement affichée
      if (orderDetails.show && orderDetails.order && orderDetails.order.id === confirmModal.orderId) {
        fetchOrderDetails(confirmModal.orderId);
      }
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
      
      // Fermer la modale des détails si la commande supprimée est celle affichée
      if (orderDetails.show && orderDetails.order && orderDetails.order.id === deleteConfirmModal.orderId) {
        setOrderDetails({ show: false, loading: false, order: null });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      setError('Erreur lors de la suppression de la commande.');
    }
  };
  
  // Fonction pour annuler la suppression
  const cancelDeleteOrder = () => {
    setDeleteConfirmModal({ show: false, orderId: '' });
  };

  // Fonction pour afficher les détails d'une commande
  const handleViewOrderDetails = async (orderId: string) => {
    fetchOrderDetails(orderId);
  };
  
  // Fonction pour récupérer les détails d'une commande
  const fetchOrderDetails = async (orderId: string) => {
    setOrderDetails({
      show: true,
      loading: true,
      order: null
    });
    
    try {
      // Récupérer les détails de la commande depuis l'API
      const orderData = await ordersApi.getById(orderId);
      setOrderDetails({
        show: true,
        loading: false,
        order: orderData
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande:', error);
      setError('Erreur lors de la récupération des détails de la commande.');
      setOrderDetails({
        show: false,
        loading: false,
        order: null
      });
    }
  };
  
  // Fonction pour fermer la modale des détails
  const closeOrderDetails = () => {
    setOrderDetails({
      show: false,
      loading: false,
      order: null
    });
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
      
      {/* Modal des détails de la commande */}
      {orderDetails.show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeOrderDetails}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Détails de la Commande
                  </h3>
                  <button 
                    onClick={closeOrderDetails}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {orderDetails.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Chargement des détails...</p>
                  </div>
                ) : orderDetails.order ? (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Informations Client */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2">Informations Client</h4>
                        <p className="text-sm mb-1"><span className="font-medium">Nom:</span> {orderDetails.order.customer_name}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Email:</span> {orderDetails.order.customer_email}</p>
                      </div>
                      
                      {/* Informations Commande */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2">Informations Commande</h4>
                        <p className="text-sm mb-1"><span className="font-medium">ID:</span> {orderDetails.order.id}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Date:</span> {new Date(orderDetails.order.created_at).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Statut:</span> 
                          <span 
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              orderDetails.order.status === 'paid'
                                ? 'bg-blue-100 text-blue-800'
                                : orderDetails.order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : orderDetails.order.status === 'ready'
                                ? 'bg-green-100 text-green-800'
                                : orderDetails.order.status === 'collected'
                                ? 'bg-gray-100 text-gray-800'
                                : orderDetails.order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-purple-800'
                            }`}
                          >
                            {orderDetails.order.status === 'paid' ? 'Payée' : 
                            orderDetails.order.status === 'pending' ? 'En Attente' : 
                            orderDetails.order.status === 'ready' ? 'Prête' : 
                            orderDetails.order.status === 'collected' ? 'Récupérée' : 
                            orderDetails.order.status.charAt(0).toUpperCase() + orderDetails.order.status.slice(1)}
                          </span>
                        </p>
                        <p className="text-sm mb-1"><span className="font-medium">Total:</span> {Number(orderDetails.order.total).toFixed(2)}&nbsp;€</p>
                      </div>
                    </div>
                    
                    {/* Produits Commandés */}
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Produits Commandés</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille/Variant</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderDetails.order.items && orderDetails.order.items.length > 0 ? (
                              orderDetails.order.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm text-gray-900">{item.product.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{item.selectedSize || 'N/A'}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{Number(item.product.price).toFixed(2)}&nbsp;€</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{item.quantity}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                                    {Number(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}&nbsp;€
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="px-4 py-3 text-sm text-center text-gray-500">
                                  Aucun produit trouvé dans cette commande
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={4} className="px-4 py-3 text-sm text-right font-medium text-gray-900">Total:</td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                                {Number(orderDetails.order.total).toFixed(2)}&nbsp;€
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-700">
                        "Aucune note pour cette commande."
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">Erreur lors du chargement des détails de la commande.</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeOrderDetails}
                >
                  Fermer
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
            onViewOrderDetails={handleViewOrderDetails}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;