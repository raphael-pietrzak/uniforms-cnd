import React from 'react';
import { Trash2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Order } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// Helper function to format order IDs safely
const formatOrderId = (id: any): string => {
  const stringId = String(id || '');
  return stringId.length > 8 ? `${stringId.substring(0, 8)}...` : stringId;
};

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onViewOrderDetails: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  onUpdateStatus,
  onDeleteOrder,
  onViewOrderDetails
}) => {
  // Définition de l'ordre des statuts pour la progression
  const statusOrder: Order['status'][] = ['pending', 'paid', 'ready', 'collected', 'cancelled'];
  
  const moveStatus = (currentStatus: Order['status'], direction: 'prev' | 'next') => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1) return currentStatus;
    
    if (direction === 'next' && currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
      return statusOrder[currentIndex - 1];
    }
    
    return currentStatus;
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'paid':
        return <Badge variant="primary">Payé</Badge>;
      case 'ready':
        return <Badge variant="success">Prêt à récupérer</Badge>;
      case 'collected':
        return <Badge variant="default">Récupéré</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (orders.length === 0) {
    return <p className="text-gray-500 py-4 ml-4">Aucune commande trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Commande
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewOrderDetails(order.id)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatOrderId(order.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Number(order.total).toFixed(2)}&nbsp;€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={statusOrder.indexOf(order.status) === 0}
                      onClick={() => onUpdateStatus(order.id, moveStatus(order.status, 'prev'))}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'collected'
                          ? 'bg-gray-100 text-gray-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-purple-800'
                      }`}
                    >
                      {order.status === 'paid' ? 'Payée' : 
                       order.status === 'pending' ? 'En Attente' : 
                       order.status === 'ready' ? 'Prête' : 
                       order.status === 'collected' ? 'Récupérée' : 
                       order.status === 'cancelled' ? 'Annulée' : 
                       order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    
                    <button 
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={statusOrder.indexOf(order.status) === statusOrder.length - 1}
                      onClick={() => onUpdateStatus(order.id, moveStatus(order.status, 'next'))}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      onClick={() => onViewOrderDetails(order.id)}
                      title="Voir les détails"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      className="p-1 rounded text-gray-400 hover:text-gray-600"
                      onClick={() => onDeleteOrder(order.id)}
                      title="Supprimer la commande"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;